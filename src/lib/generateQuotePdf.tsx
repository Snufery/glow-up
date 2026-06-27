import type { QuoteLineItem } from "@/context/QuoteContext";
import { buildWhatsAppMessage } from "@/lib/quote";
import {
  buildQuoteFilename,
  buildQuotePdfTitle,
  type QuoteCustomerInfo,
} from "@/lib/quoteCustomer";
import { contactInfo } from "@/data/contact";
import { downloadPdfViaFetch } from "@/lib/downloadPdf";
import { persistQuoteRecord } from "@/lib/saveQuoteRecord";
import type { QuoteSource } from "@/lib/db/types";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";

export function generateQuoteRef(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `GU-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
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
  extras?: QuoteDocumentExtras;
  source?: QuoteSource;
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

export interface GenerateQuoteResult {
  quoteRef: string;
  filename: string;
  sharedWithFile: boolean;
}

export async function generateAndSendQuote(
  items: QuoteLineItem[],
  customer: QuoteCustomerInfo,
  options?: { source?: QuoteSource; extras?: QuoteDocumentExtras }
): Promise<GenerateQuoteResult> {
  const quoteRef = generateQuoteRef();
  const filename = buildQuoteFilename(quoteRef, customer);
  const pdfTitle = buildQuotePdfTitle(filename);
  const baseMessage = buildWhatsAppMessage(items, quoteRef, customer);
  const whatsappText = `${baseMessage}\n\nAdjunto el PDF: ${filename}`;

  const extras = options?.extras;
  const source = options?.source ?? "public";
  const pdfPayload = { items, quoteRef, customer, filename, pdfTitle, extras, source };

  const recordQuote = () =>
    persistQuoteRecord({ quoteRef, customer, items, filename, source, extras });

  if (isAndroid()) {
    downloadPdfViaForm(pdfPayload);
    setTimeout(() => openWhatsApp(whatsappText), 500);
    void recordQuote();
    return { quoteRef, filename, sharedWithFile: false };
  }

  try {
    await downloadPdfViaFetch("/api/cotizacion/pdf", pdfPayload, filename);
  } catch (err) {
    console.warn("PDF via fetch fallo, usando formulario:", err);
    downloadPdfViaForm(pdfPayload);
  }

  openWhatsApp(whatsappText);
  void recordQuote();

  return { quoteRef, filename, sharedWithFile: false };
}