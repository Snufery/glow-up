import { ensureSchema, getSql } from "@/lib/db/client";
import {
  generateDeviceSecret,
  generateInviteCode,
  hashDeviceSecret,
} from "@/lib/adminDevice";

export interface TrustedDevice {
  id: string;
  label: string;
  userAgent: string;
  createdAt: string;
  lastSeenAt: string;
}

const INVITE_TTL_MS = 10 * 60 * 1000;
const MAX_DEVICES = 10;

export async function countTrustedDevices(): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;
  await ensureSchema();

  const rows = await sql`SELECT COUNT(*)::int AS count FROM admin_trusted_devices`;
  return (rows[0] as { count: number }).count ?? 0;
}

export async function verifyTrustedDevice(
  deviceId: string,
  secret: string
): Promise<TrustedDevice | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema();

  const rows = await sql`
    SELECT id, label, user_agent, created_at, last_seen_at
    FROM admin_trusted_devices
    WHERE id = ${deviceId} AND token_hash = ${hashDeviceSecret(secret)}
    LIMIT 1
  `;

  const row = rows[0] as
    | {
        id: string;
        label: string;
        user_agent: string;
        created_at: string;
        last_seen_at: string;
      }
    | undefined;

  if (!row) return null;

  await sql`
    UPDATE admin_trusted_devices
    SET last_seen_at = NOW()
    WHERE id = ${row.id}
  `;

  return {
    id: row.id,
    label: row.label,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  };
}

export async function isTrustedDeviceActive(deviceId: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  await ensureSchema();

  const rows = await sql`
    SELECT id FROM admin_trusted_devices WHERE id = ${deviceId} LIMIT 1
  `;
  return rows.length > 0;
}

export async function registerTrustedDevice(input: {
  label: string;
  userAgent: string;
}): Promise<{ deviceId: string; secret: string } | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema();

  const count = await countTrustedDevices();
  if (count >= MAX_DEVICES) return null;

  const secret = generateDeviceSecret();

  const rows = await sql`
    INSERT INTO admin_trusted_devices (label, token_hash, user_agent)
    VALUES (${input.label}, ${hashDeviceSecret(secret)}, ${input.userAgent})
    RETURNING id
  `;

  const id = (rows[0] as { id: string }).id;
  return { deviceId: id, secret };
}

export async function listTrustedDevices(): Promise<TrustedDevice[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema();

  const rows = await sql`
    SELECT id, label, user_agent, created_at, last_seen_at
    FROM admin_trusted_devices
    ORDER BY last_seen_at DESC
  `;

  return (rows as {
    id: string;
    label: string;
    user_agent: string;
    created_at: string;
    last_seen_at: string;
  }[]).map((row) => ({
    id: row.id,
    label: row.label,
    userAgent: row.user_agent,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
  }));
}

export async function revokeTrustedDevice(deviceId: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  await ensureSchema();

  const rows = await sql`
    DELETE FROM admin_trusted_devices WHERE id = ${deviceId} RETURNING id
  `;
  return rows.length > 0;
}

export async function createDeviceInvite(): Promise<{ code: string; expiresAt: string } | null> {
  const sql = getSql();
  if (!sql) return null;
  await ensureSchema();

  await sql`DELETE FROM admin_device_invites WHERE expires_at < NOW()`;

  const code = generateInviteCode();
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  await sql`
    INSERT INTO admin_device_invites (code_hash, expires_at)
    VALUES (${hashDeviceSecret(code)}, ${expiresAt.toISOString()})
  `;

  return { code, expiresAt: expiresAt.toISOString() };
}

export async function consumeDeviceInvite(code: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) return false;
  await ensureSchema();

  if (!/^\d{6}$/.test(code)) return false;

  const rows = await sql`
    DELETE FROM admin_device_invites
    WHERE code_hash = ${hashDeviceSecret(code)}
      AND expires_at > NOW()
    RETURNING id
  `;

  return rows.length > 0;
}