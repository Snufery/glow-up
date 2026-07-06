export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function isTurnstileEnabledClient(): boolean {
  return TURNSTILE_SITE_KEY.length > 0;
}