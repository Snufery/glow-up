import type { QuoteLineItem } from "@/context/QuoteContext";
import { saveQuoteDraft, type QuoteDraftPayload } from "@/lib/db/quoteDrafts";
import { checkIpRateLimit, getClientIp } from "@/lib/requestSecurity";
import { sanitizeQuoteItems } from "@/lib/validateQuoteItems";

export const runtime = "nodejs";

const MAX_DRAFT_BODY_BYTES = 256_000;

function sanitizeDraftPayload(body: unknown): QuoteDraftPayload | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as Record<string, unknown>;
  if (!Array.isArray(raw.items) || raw.items.length === 0) return null;

  const items = sanitizeQuoteItems(raw.items as QuoteLineItem[]);
  if (!items) return null;

  const house =
    raw.house && typeof raw.house === "object"
      ? (raw.house as QuoteDraftPayload["house"])
      : null;

  const flow =
    raw.flow && typeof raw.flow === "object"
      ? (raw.flow as QuoteDraftPayload["flow"])
      : null;

  return { items, house, flow };
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_DRAFT_BODY_BYTES) {
      return Response.json({ error: "Payload demasiado grande" }, { status: 400 });
    }

    const ip = getClientIp(request);
    const rate = checkIpRateLimit(`quote-draft:${ip}`, 30, 10 * 60 * 1000);
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

    const body = await request.json();
    const payload = sanitizeDraftPayload(body);
    if (!payload) {
      return Response.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const saved = await saveQuoteDraft(payload);
    if (!saved) {
      return Response.json({ saved: false, message: "Almacenamiento no configurado" });
    }

    const origin = new URL(request.url).origin;
    const shareUrl = `${origin}/cotizador?p=${saved.shareToken}`;

    return Response.json({
      saved: true,
      shareToken: saved.shareToken,
      shareUrl,
      expiresAt: saved.expiresAt,
    });
  } catch (error) {
    console.error("Error guardando borrador:", error);
    return Response.json({ error: "Error al guardar" }, { status: 500 });
  }
}