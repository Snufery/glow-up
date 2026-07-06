export const ADMIN_COOKIE = "glowup_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 chars)");
  }
  return secret;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createAdminSessionToken(deviceId: string): Promise<string> {
  const payload = JSON.stringify({
    role: "admin",
    deviceId,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const key = await importKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return `${toBase64(new TextEncoder().encode(payload))}.${toBase64(new Uint8Array(signature))}`;
}

export interface AdminSessionPayload {
  role: "admin";
  deviceId: string;
  exp: number;
}

export async function parseAdminSessionToken(
  token: string | undefined
): Promise<AdminSessionPayload | null> {
  if (!token) return null;

  try {
    const [payloadPart, signaturePart] = token.split(".");
    if (!payloadPart || !signaturePart) return null;

    const payloadBytes = fromBase64(payloadPart);
    const payload = new TextDecoder().decode(payloadBytes);
    const data = JSON.parse(payload) as { role?: string; deviceId?: string; exp?: number };

    if (data.role !== "admin" || !data.deviceId || !data.exp || Date.now() > data.exp) {
      return null;
    }

    const key = await importKey();
    const signature = fromBase64(signaturePart);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(signature),
      new Uint8Array(payloadBytes)
    );

    if (!valid) return null;

    return {
      role: "admin",
      deviceId: data.deviceId,
      exp: data.exp,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  const session = await parseAdminSessionToken(token);
  return Boolean(session);
}

export async function getAdminSessionDeviceId(
  token: string | undefined
): Promise<string | null> {
  const session = await parseAdminSessionToken(token);
  return session?.deviceId ?? null;
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be set (min 8 chars)");
  }
  return password;
}

export function getAdminConfigError(): string | null {
  const missing: string[] = [];
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!password || password.length < 8) missing.push("ADMIN_PASSWORD");
  if (!secret || secret.length < 16) missing.push("ADMIN_SESSION_SECRET");

  if (!missing.length) return null;

  return `Faltan variables en Vercel: ${missing.join(", ")}. Agregalas en Settings → Environment Variables y redeploya.`;
}