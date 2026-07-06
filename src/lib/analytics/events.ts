import { ensureSchema, getSql } from "@/lib/db/client";
import type { SiteEventMetadata, SiteEventType } from "./types";

export interface InsertSiteEventInput {
  eventType: SiteEventType;
  sessionId: string;
  path: string;
  metadata?: SiteEventMetadata;
  device?: string;
  referrer?: string | null;
}

export async function insertSiteEvent(input: InsertSiteEventInput): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;

  await ensureSchema();

  await sql`
    INSERT INTO site_events (event_type, session_id, path, metadata, device, referrer)
    VALUES (
      ${input.eventType},
      ${input.sessionId},
      ${input.path},
      ${JSON.stringify(input.metadata ?? {})}::jsonb,
      ${input.device ?? "unknown"},
      ${input.referrer ?? null}
    )
  `;

  return true;
}