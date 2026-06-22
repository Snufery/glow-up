import { renderToBuffer } from "@react-pdf/renderer";
import QuotePDFDocument from "@/components/cotizador/QuotePDFDocument";
import type { QuoteLineItem } from "@/context/QuoteContext";
import type { QuoteCustomerInfo } from "@/lib/quoteCustomer";

export const runtime = "nodejs";

interface PdfPayload {
  items: QuoteLineItem[];
  quoteRef: string;
  customer: QuoteCustomerInfo;
  filename: string;
  pdfTitle: string;
}

function getLogoUrl(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return `${origin}/logo.png`;
  const host = request.headers.get("host");
  if (host) return `https://${host}/logo.png`;
  return "https://glow-up-seven-psi.vercel.app/logo.png";
}

function sanitizeFilename(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  return safe.endsWith(".pdf") ? safe : `${safe || "GlowUp-Cotizacion"}.pdf`;
}

async function parsePayload(request: Request): Promise<PdfPayload | null> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as PdfPayload;
  }

  const formData = await request.formData();
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;
  return JSON.parse(raw) as PdfPayload;
}

export async function POST(request: Request) {
  try {
    const payload = await parsePayload(request);
    if (!payload?.items?.length || !payload.quoteRef || !payload.customer?.name) {
      return new Response("Datos incompletos", { status: 400 });
    }

    const filename = sanitizeFilename(payload.filename);
    const pdfTitle = payload.pdfTitle || filename.replace(/\.pdf$/i, "");

    const buffer = await renderToBuffer(
      <QuotePDFDocument
        items={payload.items}
        quoteRef={payload.quoteRef}
        logoUrl={getLogoUrl(request)}
        customer={payload.customer}
        pdfTitle={pdfTitle}
      />
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generando PDF en servidor:", error);
    return new Response("Error al generar PDF", { status: 500 });
  }
}