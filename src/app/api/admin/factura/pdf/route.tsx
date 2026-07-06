import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import type { InvoiceData } from "@/lib/invoice";
import { renderInvoicePdfBuffer } from "@/lib/renderInvoicePdf";
import { saveInvoice } from "@/lib/db/invoices";
import { markQuoteConverted } from "@/lib/db/quotes";
import {
  buildInvoiceFilename,
  calcInvoiceSubtotal,
  calcInvoiceTax,
  calcInvoiceTotal,
} from "@/lib/invoice";


export const runtime = "nodejs";
export const maxDuration = 60;

function sanitizeFilename(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  return safe.endsWith(".pdf") ? safe : `${safe || "GlowUp-Factura"}.pdf`;
}

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

  try {
    const contentType = request.headers.get("content-type") || "";
    let invoice: InvoiceData;
    let filename: string | undefined;

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { invoice: InvoiceData; filename?: string };
      invoice = body.invoice;
      filename = body.filename;
    } else {
      const formData = await request.formData();
      const raw = formData.get("payload");
      if (typeof raw !== "string") {
        return new Response("Payload invalido", { status: 400 });
      }
      const parsed = JSON.parse(raw) as { invoice: InvoiceData; filename?: string };
      invoice = parsed.invoice;
      filename = parsed.filename;
    }

    if (!invoice?.items?.length || !invoice.customer?.name) {
      return new Response("Datos incompletos", { status: 400 });
    }

    const safeFilename = sanitizeFilename(
      filename || buildInvoiceFilename(invoice.invoiceNumber, invoice.customer.name)
    );

    const buffer = await renderInvoicePdfBuffer(invoice);

    const subtotal = calcInvoiceSubtotal(invoice.items);
    const tax = calcInvoiceTax(subtotal, invoice.includeTax);
    const total = calcInvoiceTotal(invoice.items, invoice.includeTax);

    void saveInvoice({
      invoice,
      subtotal,
      tax,
      total,
      pdfFilename: safeFilename,
      sourceQuoteId: invoice.sourceQuoteId,
      engineer: invoice.engineer,
      materials: invoice.materials,
    });

    if (invoice.sourceQuoteId) {
      void markQuoteConverted(invoice.sourceQuoteId);
    }

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generando factura PDF:", error);
    return new Response("Error al generar factura", { status: 500 });
  }
}