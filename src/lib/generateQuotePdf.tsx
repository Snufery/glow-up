import { pdf } from "@react-pdf/renderer";
import type { QuoteLineItem } from "@/context/QuoteContext";
import QuotePDFDocument from "@/components/cotizador/QuotePDFDocument";
import { buildWhatsAppMessage } from "@/lib/quote";
import {
  buildQuoteFilename,
  buildQuotePdfTitle,
  type QuoteCustomerInfo,
} from "@/lib/quoteCustomer";
import { contactInfo } from "@/data/contact";

export function generateQuoteRef(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `GU-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function getLogoUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/logo.png`;
  }
  return "https://glow-up-seven-psi.vercel.app/logo.png";
}

function isAndroid(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function openWhatsApp(message: string) {
  window.open(
    `${contactInfo.socialLinks.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

function downloadPdfViaForm(payload: {
  items: QuoteLineItem[];
  quoteRef: string;
  customer: QuoteCustomerInfo;
  filename: string;
  pdfTitle: string;
}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/cotizacion/pdf";
  form.target = "_blank";
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "payload";
  input.value = JSON.stringify(payload);
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

function downloadBlob(blob: Blob, filename: string) {
  const blobForSave = new Blob([blob], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blobForSave);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
  );
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function trySharePdf(file: File, pdfTitle: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;

  try {
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      return false;
    }
    await navigator.share({ files: [file], title: pdfTitle });
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") throw err;
    return false;
  }
}

async function createQuotePdfBlob(
  items: QuoteLineItem[],
  quoteRef: string,
  customer: QuoteCustomerInfo,
  pdfTitle: string
): Promise<Blob> {
  return pdf(
    <QuotePDFDocument
      items={items}
      quoteRef={quoteRef}
      logoUrl={getLogoUrl()}
      customer={customer}
      pdfTitle={pdfTitle}
    />
  ).toBlob();
}

export interface GenerateQuoteResult {
  quoteRef: string;
  filename: string;
  sharedWithFile: boolean;
}

export async function generateAndSendQuote(
  items: QuoteLineItem[],
  customer: QuoteCustomerInfo
): Promise<GenerateQuoteResult> {
  const quoteRef = generateQuoteRef();
  const filename = buildQuoteFilename(quoteRef, customer);
  const pdfTitle = buildQuotePdfTitle(filename);
  const baseMessage = buildWhatsAppMessage(items, quoteRef, customer);
  const whatsappText = `${baseMessage}\n\nAdjunto el PDF: ${filename}`;

  const pdfPayload = { items, quoteRef, customer, filename, pdfTitle };

  if (isAndroid()) {
    try {
      const blob = await createQuotePdfBlob(items, quoteRef, customer, pdfTitle);
      const file = new File([blob], filename, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      const shared = await trySharePdf(file, pdfTitle);
      if (shared) {
        return { quoteRef, filename, sharedWithFile: true };
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { quoteRef, filename, sharedWithFile: false };
      }
    }

    downloadPdfViaForm(pdfPayload);
    setTimeout(() => openWhatsApp(whatsappText), 500);
    return { quoteRef, filename, sharedWithFile: false };
  }

  const blob = await createQuotePdfBlob(items, quoteRef, customer, pdfTitle);
  const file = new File([blob], filename, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  try {
    const shared = await trySharePdf(file, pdfTitle);
    if (shared) {
      return { quoteRef, filename, sharedWithFile: true };
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { quoteRef, filename, sharedWithFile: false };
    }
  }

  downloadBlob(blob, filename);
  openWhatsApp(whatsappText);

  return { quoteRef, filename, sharedWithFile: false };
}