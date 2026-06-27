import fs from "fs";
import path from "path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const WINDOWS_CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function resolveExecutablePath(): Promise<string> {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  if (isServerlessRuntime()) {
    if (!process.env.AWS_LAMBDA_JS_RUNTIME) {
      process.env.AWS_LAMBDA_JS_RUNTIME = process.versions.node.startsWith("22")
        ? "nodejs22.x"
        : "nodejs20.x";
    }

    const chromiumWithGraphics = chromium as typeof chromium & {
      setGraphicsMode?: (enabled: boolean) => void;
    };
    chromiumWithGraphics.setGraphicsMode?.(false);

    const executablePath = await chromium.executablePath();
    const execDir = path.dirname(executablePath);
    process.env.LD_LIBRARY_PATH = [execDir, process.env.LD_LIBRARY_PATH]
      .filter(Boolean)
      .join(path.delimiter);

    return executablePath;
  }

  for (const chromePath of WINDOWS_CHROME_PATHS) {
    try {
      await fs.promises.access(chromePath);
      return chromePath;
    } catch {
      // try next
    }
  }

  return chromium.executablePath();
}

export function readTemplateAssetDataUrl(filename: string, mime: string): string {
  const candidates = [
    path.join(/* turbopackIgnore: true */ process.cwd(), "public", "pdf-templates", filename),
    path.join(
      /* turbopackIgnore: true */ process.cwd(),
      ".next",
      "server",
      "public",
      "pdf-templates",
      filename
    ),
  ];

  for (const filePath of candidates) {
    try {
      const buffer = fs.readFileSync(filePath);
      return `data:${mime};base64,${buffer.toString("base64")}`;
    } catch {
      // try next path
    }
  }

  throw new Error(`No se encontró el asset PDF: ${filename}`);
}

export async function renderHtmlPdfBuffer(
  html: string,
  pageFormat: "A4" | "letter" = "A4"
): Promise<Buffer> {
  const executablePath = await resolveExecutablePath();
  const launchArgs = isServerlessRuntime()
    ? chromium.args
    : [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"];

  const browser = await puppeteer.launch({
    args: launchArgs,
    defaultViewport: isServerlessRuntime() ? chromium.defaultViewport : null,
    executablePath,
    headless: isServerlessRuntime() ? chromium.headless : true,
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: pageFormat,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}