import { NextResponse } from "next/server";

export const ATTEMPT_COOKIE = "glowup_admin_login_attempts";
export const MAX_LOGIN_ATTEMPTS = 2;
export const LOCKOUT_MS = 30 * 60 * 1000;

interface AttemptPayload {
  count: number;
  lockedUntil: number;
  ip: string;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set");
  }
  return secret;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
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

async function signPayload(payload: AttemptPayload): Promise<string> {
  const json = JSON.stringify(payload);
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(json));
  return `${toBase64(new TextEncoder().encode(json))}.${toBase64(new Uint8Array(signature))}`;
}

async function verifyPayload(token: string): Promise<AttemptPayload | null> {
  try {
    const [payloadPart, signaturePart] = token.split(".");
    if (!payloadPart || !signaturePart) return null;

    const payloadBytes = fromBase64(payloadPart);
    const json = new TextDecoder().decode(payloadBytes);
    const key = await importKey();
    const signature = fromBase64(signaturePart);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(signature),
      new Uint8Array(payloadBytes)
    );
    if (!valid) return null;
    return JSON.parse(json) as AttemptPayload;
  } catch {
    return null;
  }
}

export async function readAttemptCookie(
  cookieValue: string | undefined,
  ip: string
): Promise<AttemptPayload | null> {
  if (!cookieValue) return null;
  const payload = await verifyPayload(cookieValue);
  if (!payload || payload.ip !== ip) return null;
  return payload;
}

export function isLoginLocked(state: AttemptPayload | null): boolean {
  if (!state) return false;
  if (state.count < MAX_LOGIN_ATTEMPTS) return false;
  return Date.now() < state.lockedUntil;
}

export function getLockRetryAfterSec(state: AttemptPayload | null): number {
  if (!state?.lockedUntil) return 0;
  return Math.max(0, Math.ceil((state.lockedUntil - Date.now()) / 1000));
}

export function buildFailedAttempt(ip: string, previous: AttemptPayload | null): AttemptPayload {
  const now = Date.now();
  const count = (previous?.count ?? 0) + 1;
  const lockedUntil = count >= MAX_LOGIN_ATTEMPTS ? now + LOCKOUT_MS : (previous?.lockedUntil ?? 0);
  return { count, lockedUntil, ip };
}

export async function attachAttemptCookie(
  response: NextResponse,
  state: AttemptPayload
): Promise<void> {
  const token = await signPayload(state);
  response.cookies.set(ATTEMPT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/login",
    maxAge: Math.ceil(LOCKOUT_MS / 1000),
  });
}

export function clearAttemptCookie(response: NextResponse): void {
  response.cookies.set(ATTEMPT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/login",
    maxAge: 0,
  });
}