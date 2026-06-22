export function safeAdminRedirect(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/admin";
  if (next.includes("://") || next.includes("\\")) return "/admin";
  if (!next.startsWith("/admin")) return "/admin";
  return next;
}