type RateEntry = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateEntry>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function isAllowedSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!host) return false;

  if (!origin) {
    const secFetchSite = request.headers.get("sec-fetch-site");
    return secFetchSite === "same-origin" || secFetchSite === "same-site";
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host || originHost === host.split(":")[0];
  } catch {
    return false;
  }
}

/**
 * Rate limiter en memoria (por instancia serverless).
 * Para alto trafico usar Vercel Firewall o Upstash Redis.
 */
export function checkIpRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return { allowed: true };
}

export function getIpLockState(
  key: string,
  maxFailures: number
): { locked: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    if (entry) rateLimitStore.delete(key);
    return { locked: false };
  }
  if (entry.count >= maxFailures) {
    return {
      locked: true,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { locked: false };
}

export function recordIpFailure(
  key: string,
  maxFailures: number,
  lockoutMs: number
): { locked: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + lockoutMs });
    return { locked: false, remaining: maxFailures - 1 };
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);

  if (entry.count >= maxFailures) {
    return {
      locked: true,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { locked: false, remaining: maxFailures - entry.count };
}

export function clearIpFailures(key: string): void {
  rateLimitStore.delete(key);
}