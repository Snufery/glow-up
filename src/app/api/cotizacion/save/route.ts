import type { QuoteLineItem } from "@/context/QuoteContext";
import { saveQuoteFromPayload } from "@/lib/db/saveQuoteFromPayload";
import type { QuoteSource } from "@/lib/db/types";
import type { QuoteDocumentExtras } from "@/lib/quoteCustomer";
import { calcQuoteTotals } from "@/lib/quote";
import { readJsonBody } from "@/lib/readJsonBody";
import { checkIpRateLimit, getClientIp, isAllowedSameOrigin } from "@/lib/requestSecurity";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  MAX_QUOTE_BODY_BYTES,
  parseQuoteCustomer,
  sanitizeQuoteItems,
} from "@/lib/validateQuoteItems";

export const runtime = "nodejs";

interface SavePayload {
  quoteRef: string;
  customer: { name: string; phone: string; address?: string };
  items: QuoteLineItem[];
  filename?: string;
  source?: QuoteSource;
  extras?: QuoteDocumentExtras;
  totals?: ReturnType<typeof calcQuoteTotals>;
}

function sanitizeQuoteRef(ref: string): string | null {
  if (!/^GU-\d{8}-\d{4}$/.test(ref)) return null;
  return ref;
}

function sanitizeSource(): QuoteSource {
  return "public";
}

export async function POST(request: Request) {
  try {
    if (!isAllowedSameOrigin(request)) {
      return Response.json({ error: "Solicitud no permitida" }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_QUOTE_BODY_BYTES) {
      return Response.json({ error: "Payload demasiado grande" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rate = checkIpRateLimit(`quote-save:${ip}`, 12, 10 * 60 * 1000);
    if (!rate.allowed) {
      return Response.json(
        { error: "Demasiadas solicitudes" },
        {
          status: 429,
          headers: rate.retryAfterSec
            ? { "Retry-After": String(rate.retryAfterSec) }
            : undefined,
        }
      );
    }

    const body = await readJsonBody<SavePayload & { turnstileToken?: string }>(
      request,
      MAX_QUOTE_BODY_BYTES
    );
    if (!body) {
      return Response.json({ error: "Payload invalido o demasiado grande" }, { status: 400 });
    }

    const turnstileOk = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!turnstileOk) {
      return Response.json({ error: "Verificacion anti-bot requerida" }, { status: 403 });
    }
    if (!body?.quoteRef || !body?.customer || !body?.items?.length) {
      return Response.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const quoteRef = sanitizeQuoteRef(body.quoteRef);
    const customer = parseQuoteCustomer(body.customer);
    const items = sanitizeQuoteItems(body.items);

    if (!quoteRef || !customer || !items) {
      return Response.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const saved = await saveQuoteFromPayload({
      quoteRef,
      customer: {
        ...customer,
        address: body.customer.address?.trim(),
      },
      items,
      filename: body.filename,
      source: sanitizeSource(),
      extras: body.extras,
    });

    if (!saved) {
      return Response.json({ saved: false, message: "Almacenamiento no configurado" });
    }

    return Response.json({ saved: true, id: saved.id, quoteRef: saved.quoteRef });
  } catch (error) {
    console.error("Error en guardado de cotizacion:", error);
    return Response.json({ error: "Error al guardar" }, { status: 500 });
  }
}