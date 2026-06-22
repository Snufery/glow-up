import { renderToBuffer } from "@react-pdf/renderer";
import InvoicePDFDocument from "@/components/admin/InvoicePDFDocument";
import type { InvoiceData } from "@/lib/invoice";
import { buildInvoiceFilename } from "@/lib/invoice";

export const runtime = "nodejs";

function getLogoUrl(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return `${origin}/logo.png`;
  const host = request.headers.get("host");
  if (host) return `https://${host}/logo.png`;
  return "https://glow-up-seven-psi.vercel.app/logo.png";
}

function sanitizeFilename(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  return safe.endsWith(".pdf") ? safe : `${safe || "GlowUp-Factura"}.pdf`;
}

export async function POST(request: Request) {
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

    const buffer = await renderToBuffer(
      <InvoicePDFDocument invoice={invoice} logoUrl={getLogoUrl(request)} />
    );

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