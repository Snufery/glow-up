import { renderInvoicePdfBuffer } from "@/lib/renderInvoicePdf";
import { isDatabaseConfigured } from "@/lib/db/client";
import { saveInvoice } from "@/lib/db/invoices";
import { getQuoteById, markQuoteConverted } from "@/lib/db/quotes";
import { buildInvoiceFromQuote, calcInvoiceAmounts } from "@/lib/convertQuoteToInvoice";
import { buildInvoiceFilename } from "@/lib/invoice";


export const runtime = "nodejs";
export const maxDuration = 60;

function sanitizeFilename(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  return safe.endsWith(".pdf") ? safe : `${safe || "GlowUp-Factura"}.pdf`;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseConfigured()) {
      return new Response("Base de datos no configurada", { status: 503 });
    }

    const { id } = await context.params;
    const quote = await getQuoteById(id);

    if (!quote) {
      return new Response("Cotización no encontrada", { status: 404 });
    }

    const invoice = buildInvoiceFromQuote(quote);
    const amounts = calcInvoiceAmounts(invoice);
    const filename = sanitizeFilename(
      buildInvoiceFilename(invoice.invoiceNumber, invoice.customer.name)
    );

    const buffer = await renderInvoicePdfBuffer(invoice);

    const saved = await saveInvoice({
      invoice,
      ...amounts,
      pdfFilename: filename,
      sourceQuoteId: quote.id,
      engineer: invoice.engineer,
      materials: invoice.materials,
    });

    if (!saved) {
      return new Response("No se pudo guardar la factura", { status: 500 });
    }

    await markQuoteConverted(quote.id);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generando factura PDF desde cotizacion:", error);
    return new Response("Error al generar factura", { status: 500 });
  }
}