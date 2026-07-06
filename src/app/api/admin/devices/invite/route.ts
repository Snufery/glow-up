import { isAdminApiAuthorized, unauthorizedAdminResponse } from "@/lib/adminApiGuard";
import { createDeviceInvite } from "@/lib/db/adminDevices";
import { checkIpRateLimit, getClientIp } from "@/lib/requestSecurity";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminApiAuthorized())) return unauthorizedAdminResponse();

  const ip = getClientIp(request);
  const rate = checkIpRateLimit(`admin-device-invite:${ip}`, 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  const invite = await createDeviceInvite();
  if (!invite) {
    return Response.json({ error: "No se pudo generar el codigo" }, { status: 500 });
  }

  return Response.json({
    code: invite.code,
    expiresAt: invite.expiresAt,
    expiresInMinutes: 10,
  });
}