import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import { getQuoteById, markQuoteConverted } from "@/lib/db/quotes";
import { saveInvoice } from "@/lib/db/invoices";
import { isDatabaseConfigured } from "@/lib/db/client";
import { buildInvoiceFromQuote, calcInvoiceAmounts } from "@/lib/convertQuoteToInvoice";
import { buildInvoiceFilename } from "@/lib/invoice";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

  try {
    if (!isDatabaseConfigured()) {
      return Response.json({ error: "Base de datos no configurada" }, { status: 503 });
    }

    const { id } = await context.params;
    const quote = await getQuoteById(id);

    if (!quote) {
      return Response.json({ error: "Cotización no encontrada" }, { status: 404 });
    }

    const invoice = buildInvoiceFromQuote(quote);
    const amounts = calcInvoiceAmounts(invoice);
    const filename = buildInvoiceFilename(invoice.invoiceNumber, invoice.customer.name);

    const saved = await saveInvoice({
      invoice,
      ...amounts,
      pdfFilename: filename,
      sourceQuoteId: quote.id,
      engineer: invoice.engineer,
      materials: invoice.materials,
    });

    if (!saved) {
      return Response.json({ error: "No se pudo guardar la factura" }, { status: 500 });
    }

    await markQuoteConverted(quote.id);

    return Response.json({
      ok: true,
      invoice,
      filename,
      invoiceId: saved.id,
    });
  } catch (error) {
    console.error("Error convirtiendo cotizacion a factura:", error);
    return Response.json({ error: "Error al convertir" }, { status: 500 });
  }
}