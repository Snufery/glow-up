import type { InvoiceData } from "@/lib/invoice";
import { buildInvoiceFacturaHtml } from "@/lib/invoiceFacturaHtml";
import { renderHtmlPdfBuffer } from "@/lib/renderHtmlPdf";

export async function renderInvoicePdfBuffer(invoice: InvoiceData): Promise<Buffer> {
  const html = buildInvoiceFacturaHtml(invoice);
  return renderHtmlPdfBuffer(html, "letter");
}