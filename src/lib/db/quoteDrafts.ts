import { randomBytes } from "crypto";
import type { QuoteLineItem } from "@/context/QuoteContext";
import type { CotizadorFlowState } from "@/context/CotizadorFlowContext";
import type { HouseCounts } from "@/lib/houseLayout";
import { ensureSchema, getSql, isDatabaseConfigured } from "./client";

export interface DraftHousePayload {
  counts: HouseCounts;
  selectedRoomId: string | null;
  isConfigured: boolean;
}

export interface DraftFlowPayload {
  goal: CotizadorFlowState["goal"];
  goalWizardDone: boolean;
  selectedPackageId: string | null;
  houseSkipped: boolean;
}

export interface QuoteDraftPayload {
  items: QuoteLineItem[];
  house: DraftHousePayload | null;
  flow: DraftFlowPayload | null;
}

function generateShareToken(): string {
  return randomBytes(12).toString("base64url");
}

export async function saveQuoteDraft(
  payload: QuoteDraftPayload
): Promise<{ shareToken: string; expiresAt: string } | null> {
  if (!isDatabaseConfigured()) return null;

  const sql = getSql();
  if (!sql) return null;

  await ensureSchema();

  const shareToken = generateShareToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await sql`
    INSERT INTO quote_drafts (share_token, payload, expires_at)
    VALUES (${shareToken}, ${JSON.stringify(payload)}::jsonb, ${expiresAt.toISOString()})
  `;

  return {
    shareToken,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function loadQuoteDraft(
  token: string
): Promise<QuoteDraftPayload | null> {
  if (!isDatabaseConfigured()) return null;

  const sql = getSql();
  if (!sql) return null;

  await ensureSchema();

  const rows = await sql`
    SELECT payload
    FROM quote_drafts
    WHERE share_token = ${token}
      AND expires_at > NOW()
    LIMIT 1
  `;

  const row = rows[0] as { payload: QuoteDraftPayload } | undefined;
  if (!row?.payload?.items?.length) return null;

  return row.payload;
}