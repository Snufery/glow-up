import { z } from "zod";
import { insertSiteEvent } from "@/lib/analytics/events";
import { SITE_EVENT_TYPES } from "@/lib/analytics/types";
import {
  checkIpRateLimit,
  getClientIp,
  isAllowedSameOrigin,
} from "@/lib/requestSecurity";

export const runtime = "nodejs";

const metadataSchema = z
  .record(z.string(), z.union([z.string().max(200), z.number(), z.boolean()]))
  .refine((obj) => Object.keys(obj).length <= 20, "Demasiados campos en metadata");

const bodySchema = z.object({
  eventType: z.enum(SITE_EVENT_TYPES),
  sessionId: z.string().uuid(),
  path: z.string().max(500).optional(),
  metadata: metadataSchema.optional(),
  device: z.enum(["mobile", "tablet", "desktop", "unknown"]).optional(),
  referrer: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  if (!isAllowedSameOrigin(request)) {
    return Response.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rate = checkIpRateLimit(`analytics:${ip}`, 120, 60 * 1000);
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON invalido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Datos invalidos" }, { status: 400 });
  }

  const { eventType, sessionId, path, metadata, device, referrer } = parsed.data;

  const saved = await insertSiteEvent({
    eventType,
    sessionId,
    path: path ?? "/",
    metadata,
    device,
    referrer: referrer ?? null,
  });

  if (!saved) {
    return Response.json({ ok: false, stored: false });
  }

  return Response.json({ ok: true, stored: true });
}