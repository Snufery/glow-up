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

function canSharePdfFile(file: File): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return false;
  }
  return navigator.canShare({ files: [file] });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  const blob = await createQuotePdfBlob(items, quoteRef, customer, pdfTitle);
  const file = new File([blob], filename, {
    type: "application/pdf",
    lastModified: Date.now(),
  });

  const baseMessage = buildWhatsAppMessage(items, quoteRef, customer);
  let sharedWithFile = false;

  if (canSharePdfFile(file)) {
    try {
      await navigator.share({
        files: [file],
        title: pdfTitle,
      });
      sharedWithFile = true;
      return { quoteRef, filename, sharedWithFile };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { quoteRef, filename, sharedWithFile: false };
      }
    }
  }

  downloadBlob(blob, filename);

  const whatsappText = `${baseMessage}\n\nAdjunto el PDF: ${filename}`;
  window.open(
    `${contactInfo.socialLinks.whatsapp}?text=${encodeURIComponent(whatsappText)}`,
    "_blank",
    "noopener,noreferrer"
  );

  return { quoteRef, filename, sharedWithFile };
}