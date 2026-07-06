import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import { getQuoteById } from "@/lib/db/quotes";
import { isDatabaseConfigured } from "@/lib/db/client";
import { buildQuoteFilename } from "@/lib/quoteCustomer";
import { generateQuotePdfBuffer } from "@/lib/generateQuotePdfBuffer";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

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
      quote.pdfFilename || buildQuoteFilename(quote.quoteRef, customer);

    const buffer = await generateQuotePdfBuffer({
      items: quote.items,
      quoteRef: quote.quoteRef,
      quoteNumber: quote.quoteNumber,
      customer,
      engineer: quote.engineer,
      materials: quote.materials,
      notes: quote.notes,
      extras: {
        intelligence: quote.intelligence ?? undefined,
        includeIva: quote.includeIva,
      },
      issuedAt: new Date(quote.createdAt),
    });

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