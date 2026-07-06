import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import { isDatabaseConfigured } from "@/lib/db/client";
import { listQuotes } from "@/lib/db/quotes";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 50);
  const offset = Number(searchParams.get("offset") || 0);

  if (!isDatabaseConfigured()) {
    return Response.json({ configured: false, quotes: [] });
  }

  const quotes = await listQuotes(limit, offset);
  return Response.json({ configured: true, quotes });
}