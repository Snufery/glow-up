import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import type { QuoteLineItem } from "@/context/QuoteContext";
import { checkIpRateLimit, getClientIp } from "@/lib/requestSecurity";
import { generateQuoteIntelligence } from "@/lib/quoteIntelligenceGenerate";
import {
  normalizeQuoteIntelligence,
  quoteIntelligenceSchema,
} from "@/lib/quoteIntelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_ITEMS = 30;

function sanitizeItems(raw: unknown): QuoteLineItem[] | null {
  if (!Array.isArray(raw) || !raw.length || raw.length > MAX_ITEMS) return null;

  const items: QuoteLineItem[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const row = item as Partial<QuoteLineItem>;

    if (!row.id || !row.name || typeof row.quantity !== "number") return null;

    const quantity = Math.min(99, Math.max(1, Math.floor(row.quantity)));
    const unitPrice =
      typeof row.unitPrice === "number" && row.unitPrice >= 0
        ? Math.floor(row.unitPrice)
        : 0;

    items.push({
      id: String(row.id),
      productId: String(row.productId ?? "custom"),
      slug: String(row.slug ?? "custom"),
      name: String(row.name).slice(0, 200),
      category: String(row.category ?? "custom"),
      quantity,
      unitPrice,
      channels: row.channels,
      colorId: row.colorId,
      colorLabel: row.colorLabel,
      image: row.image,
      installationPrice:
        typeof row.installationPrice === "number" ? row.installationPrice : null,
      includeInstallation: Boolean(row.includeInstallation),
      isCustom: Boolean(row.isCustom),
      customDescription: row.customDescription?.slice(0, 1000),
    });
  }

  return items;
}

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

  const ip = getClientIp(request);
  const rate = checkIpRateLimit(`admin-intelligence:${ip}`, 10, 60 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json({ error: "Demasiadas solicitudes de IA" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      items?: unknown;
      projectContext?: string;
      compareWith?: string;
      customerAddress?: string;
    };

    const items = sanitizeItems(body.items);
    if (!items?.length) {
      return Response.json({ error: "Ítems inválidos" }, { status: 400 });
    }

    const result = await generateQuoteIntelligence({
      items,
      projectContext: body.projectContext?.slice(0, 2000),
      compareWith: body.compareWith?.slice(0, 1000),
      customerAddress: body.customerAddress?.slice(0, 300),
    });

    const parsed = quoteIntelligenceSchema.safeParse(
      normalizeQuoteIntelligence(result.intelligence)
    );
    if (!parsed.success) {
      console.error("Intelligence validation failed:", parsed.error.flatten());
      return Response.json({ error: "Respuesta inválida del generador" }, { status: 500 });
    }

    return Response.json({
      intelligence: parsed.data,
      usedAi: result.usedAi,
      usedWebSearch: result.usedWebSearch,
      webSearchProvider: result.webSearchProvider,
    });
  } catch (error) {
    console.error("Error en cotización inteligente:", error);
    return Response.json({ error: "No se pudo generar el contenido" }, { status: 500 });
  }
}