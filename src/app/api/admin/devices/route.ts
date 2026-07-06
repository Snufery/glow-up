import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import { getAdminSessionDeviceId } from "@/lib/adminSession";
import { ADMIN_COOKIE } from "@/lib/adminSession";
import { cookies } from "next/headers";
import { listTrustedDevices } from "@/lib/db/adminDevices";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

  const cookieStore = await cookies();
  const deviceId = await getAdminSessionDeviceId(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!deviceId) return unauthorizedAdminResponse();

  const devices = await listTrustedDevices();
  return Response.json({
    devices: devices.map((d) => ({
      id: d.id,
      label: d.label,
      userAgent: d.userAgent,
      createdAt: d.createdAt,
      lastSeenAt: d.lastSeenAt,
      isCurrent: d.id === deviceId,
    })),
  });
}