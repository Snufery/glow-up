import { createHash, randomBytes } from "crypto";

export const ADMIN_DEVICE_COOKIE = "glowup_trusted_device";
export const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function hashDeviceSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function generateDeviceSecret(): string {
  return randomBytes(32).toString("hex");
}

export function buildDeviceCookieValue(deviceId: string, secret: string): string {
  return `${deviceId}.${secret}`;
}

export function parseDeviceCookieValue(
  value: string | undefined
): { deviceId: string; secret: string } | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot <= 0) return null;

  const deviceId = value.slice(0, dot);
  const secret = value.slice(dot + 1);

  if (!/^[0-9a-f-]{36}$/i.test(deviceId) || secret.length < 32) return null;
  return { deviceId, secret };
}

export function detectDeviceLabel(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod|android|mobile/i.test(ua)) return "Celular";
  if (/windows/i.test(ua)) return "PC Windows";
  if (/macintosh|mac os/i.test(ua)) return "Mac";
  if (/linux/i.test(ua)) return "PC Linux";
  return "Dispositivo";
}

export function generateInviteCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}