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

export async function createAdminSessionToken(): Promise<string> {
  const payload = JSON.stringify({
    role: "admin",
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

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const [payloadPart, signaturePart] = token.split(".");
    if (!payloadPart || !signaturePart) return false;

    const payloadBytes = fromBase64(payloadPart);
    const payload = new TextDecoder().decode(payloadBytes);
    const data = JSON.parse(payload) as { role?: string; exp?: number };

    if (data.role !== "admin" || !data.exp || Date.now() > data.exp) return false;

    const key = await importKey();
    const signature = fromBase64(signaturePart);
    return crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(signature),
      new Uint8Array(payloadBytes)
    );
  } catch {
    return false;
  }
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