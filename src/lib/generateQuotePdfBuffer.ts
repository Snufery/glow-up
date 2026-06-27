import type { QuoteLineItem } from "@/context/QuoteContext";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import { buildQuoteCotizacionHtml } from "@/lib/quoteCotizacionHtml";
import { renderHtmlPdfBuffer } from "@/lib/renderHtmlPdf";

export interface GenerateQuotePdfInput {
  items: QuoteLineItem[];
  quoteRef: string;
  quoteNumber?: number | null;
  customer: QuoteCustomerInfo;
  engineer?: string;
  materials?: string;
  notes?: string;
  extras?: QuoteDocumentExtras;
  issuedAt?: Date;
}

export async function generateQuotePdfBuffer(input: GenerateQuotePdfInput): Promise<Buffer> {
  const html = buildQuoteCotizacionHtml(input);
  return renderHtmlPdfBuffer(html, "A4");
}