import { renderToBuffer } from "@react-pdf/renderer";
import QuotePDFDocument from "@/components/cotizador/QuotePDFDocument";
import { getQuoteById } from "@/lib/db/quotes";
import { isDatabaseConfigured } from "@/lib/db/client";
import { buildQuoteFilename, buildQuotePdfTitle } from "@/lib/quoteCustomer";
import { getLogoUrlFromRequest } from "@/lib/siteUrl";

export const runtime = "nodejs";

export async function GET(
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

    const customer = {
      name: quote.customerName,
      phone: quote.customerPhone,
      address: quote.customerAddress,
    };

    const filename =
      quote.pdfFilename ||
      buildQuoteFilename(quote.quoteRef, customer);
    const pdfTitle = buildQuotePdfTitle(filename);

    const buffer = await renderToBuffer(
      <QuotePDFDocument
        items={quote.items}
        quoteRef={quote.quoteRef}
        customer={customer}
        pdfTitle={pdfTitle}
        engineer={quote.engineer}
        materials={quote.materials}
        notes={quote.notes}
        issuedAt={new Date(quote.createdAt)}
        logoUrl={getLogoUrlFromRequest(request)}
      />
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generando PDF de cotizacion guardada:", error);
    return new Response("Error al generar PDF", { status: 500 });
  }
}