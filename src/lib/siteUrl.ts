const FALLBACK_SITE_URL = "https://glow-up-seven-psi.vercel.app";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return url || FALLBACK_SITE_URL;
}

export function getLogoUrlFromRequest(request?: Request): string {
  if (!request) return `${getSiteUrl()}/logo.png`;

  const allowedHosts = new Set(
    [getSiteUrl(), process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""]
      .map((base) => {
        try {
          return new URL(base).host;
        } catch {
          return "";
        }
      })
      .filter(Boolean)
  );

  const host = request.headers.get("host")?.split(":")[0];
  if (host && allowedHosts.has(host)) {
    return `https://${host}/logo.png`;
  }

  return `${getSiteUrl()}/logo.png`;
}