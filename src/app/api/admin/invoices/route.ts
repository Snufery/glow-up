import { isDatabaseConfigured } from "@/lib/db/client";
import { listInvoices } from "@/lib/db/invoices";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 50);
  const offset = Number(searchParams.get("offset") || 0);

  if (!isDatabaseConfigured()) {
    return Response.json({ configured: false, invoices: [] });
  }

  const invoices = await listInvoices(limit, offset);
  return Response.json({ configured: true, invoices });
}