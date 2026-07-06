import type { QuoteLineItem } from "@/context/QuoteContext";
import type { QuoteCustomerInfo, QuoteDocumentExtras } from "@/lib/quoteCustomer";
import { generateQuotePdfBuffer } from "@/lib/generateQuotePdfBuffer";
import { checkIpRateLimit, getClientIp, isAllowedSameOrigin } from "@/lib/requestSecurity";
import { saveQuoteFromPayload } from "@/lib/db/saveQuoteFromPayload";
import type { QuoteSource } from "@/lib/db/types";
import {
  MAX_QUOTE_BODY_BYTES,
  parseQuoteCustomer,
  sanitizeQuoteItems,
} from "@/lib/validateQuoteItems";

export const runtime = "nodejs";
export const maxDuration = 60;

interface PdfPayload {
  items: QuoteLineItem[];
  quoteRef: string;
  customer: QuoteCustomerInfo;
  filename: string;
  pdfTitle: string;
  extras?: QuoteDocumentExtras;
  source?: QuoteSource;
}

function sanitizeFilename(filename: string): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "");
  return safe.endsWith(".pdf") ? safe : `${safe || "GlowUp-Cotizacion"}.pdf`;
}

function sanitizeQuoteRef(ref: string): string | null {
  if (!/^GU-\d{8}-\d{4}$/.test(ref)) return null;
  return ref;
}

async function parsePayload(request: Request): Promise<PdfPayload | null> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_QUOTE_BODY_BYTES) return null;

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as PdfPayload;
  }

  const formData = await request.formData();
  const raw = formData.get("payload");
  if (typeof raw !== "string" || raw.length > MAX_QUOTE_BODY_BYTES) return null;
  return JSON.parse(raw) as PdfPayload;
}

export async function POST(request: Request) {
  try {
    if (!isAllowedSameOrigin(request)) {
      return new Response("Solicitud no permitida", { status: 403 });
    }

    const ip = getClientIp(request);
    const rate = checkIpRateLimit(`quote-pdf:${ip}`, 8, 10 * 60 * 1000);
    if (!rate.allowed) {
      return new Response("Demasiadas solicitudes. Intenta mas tarde.", {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      });
    }

    const payload = await parsePayload(request);
    if (!payload?.items?.length || !payload.quoteRef || !payload.customer) {
      return new Response("Datos incompletos", { status: 400 });
    }

    const quoteRef = sanitizeQuoteRef(payload.quoteRef);
    const customer = parseQuoteCustomer(payload.customer);
    const items = sanitizeQuoteItems(payload.items);

    if (!quoteRef || !customer || !items) {
      return new Response("Datos invalidos", { status: 400 });
    }

    const filename = sanitizeFilename(payload.filename);

    const buffer = await generateQuotePdfBuffer({
      items,
      quoteRef,
      customer,
      engineer: payload.extras?.engineer,
      materials: payload.extras?.materials,
      notes: payload.extras?.notes,
      extras: payload.extras,
    });

    void saveQuoteFromPayload({
      quoteRef,
      customer,
      items,
      filename,
      source: "public",
      extras: payload.extras,
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generando PDF en servidor:", error);
    return new Response("Error al generar PDF", { status: 500 });
  }
}