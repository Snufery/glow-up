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
import { getSiteUrl } from "@/lib/siteUrl";

import { downloadPdfViaFetch } from "@/lib/downloadPdf";
import { persistQuoteRecord } from "@/lib/saveQuoteRecord";
import type { QuoteSource } from "@/lib/db/types";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";

export function generateQuoteRef(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `GU-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function getLogoUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/logo.png`;
  }
  return `${getSiteUrl()}/logo.png`;
}

function isAndroid(): boolean {
  return typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timeout`));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
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
  if (!isMobileDevice()) return false;
  if (typeof navigator === "undefined" || !navigator.share) return false;

  try {
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      return false;
    }
    await withTimeout(
      navigator.share({ files: [file], title: pdfTitle }),
      12_000,
      "share"
    );
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
  pdfTitle: string,
  extras?: QuoteDocumentExtras
): Promise<Blob> {
  return withTimeout(
    pdf(
      <QuotePDFDocument
        items={items}
        quoteRef={quoteRef}
        customer={customer}
        pdfTitle={pdfTitle}
        engineer={extras?.engineer}
        materials={extras?.materials}
        notes={extras?.notes}
        logoUrl={getLogoUrl()}
      />
    ).toBlob(),
    45_000,
    "pdf"
  );
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

  const downloadViaServer = async () => {
    await downloadPdfViaFetch("/api/cotizacion/pdf", pdfPayload, filename);
  };

  if (isAndroid()) {
    try {
      const blob = await createQuotePdfBlob(items, quoteRef, customer, pdfTitle, extras);
      const file = new File([blob], filename, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      const shared = await trySharePdf(file, pdfTitle);
      if (shared) {
        void recordQuote();
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

  try {
    const blob = await createQuotePdfBlob(items, quoteRef, customer, pdfTitle, extras);
    const file = new File([blob], filename, {
      type: "application/pdf",
      lastModified: Date.now(),
    });

    try {
      const shared = await trySharePdf(file, pdfTitle);
      if (shared) {
        void recordQuote();
        return { quoteRef, filename, sharedWithFile: true };
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { quoteRef, filename, sharedWithFile: false };
      }
    }

    downloadBlob(blob, filename);
  } catch (err) {
    console.warn("PDF en navegador fallo, usando servidor:", err);
    await downloadViaServer();
  }

  openWhatsApp(whatsappText);
  void recordQuote();

  return { quoteRef, filename, sharedWithFile: false };
}