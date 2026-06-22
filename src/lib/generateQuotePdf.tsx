import { pdf } from "@react-pdf/renderer";
import type { QuoteLineItem } from "@/context/QuoteContext";
import QuotePDFDocument from "@/components/cotizador/QuotePDFDocument";
import { buildWhatsAppMessage } from "@/lib/quote";
import { buildQuoteFilename, type QuoteCustomerInfo } from "@/lib/quoteCustomer";
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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function createQuotePdfBlob(
  items: QuoteLineItem[],
  quoteRef: string,
  customer: QuoteCustomerInfo
): Promise<Blob> {
  return pdf(
    <QuotePDFDocument
      items={items}
      quoteRef={quoteRef}
      logoUrl={getLogoUrl()}
      customer={customer}
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
  const blob = await createQuotePdfBlob(items, quoteRef, customer);
  const file = new File([blob], filename, { type: "application/pdf" });

  downloadBlob(blob, filename);

  const baseMessage = buildWhatsAppMessage(items, quoteRef, customer);
  let sharedWithFile = false;

  if (typeof navigator !== "undefined" && navigator.share) {
    const shareData: ShareData = {
      title: filename.replace(/\.pdf$/i, ""),
      text: baseMessage,
      files: [file],
    };

    try {
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        sharedWithFile = true;
        return { quoteRef, filename, sharedWithFile };
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { quoteRef, filename, sharedWithFile: false };
      }
    }
  }

  const whatsappText = `${baseMessage}\n\nHe descargado el PDF de la cotizacion (${quoteRef}). Adjunto el archivo si es posible.`;
  window.open(
    `${contactInfo.socialLinks.whatsapp}?text=${encodeURIComponent(whatsappText)}`,
    "_blank",
    "noopener,noreferrer"
  );

  return { quoteRef, filename, sharedWithFile };
}