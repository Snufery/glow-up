import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminSessionDeviceId } from "@/lib/adminSession";
import { revokeTrustedDevice } from "@/lib/db/adminDevices";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const currentDeviceId = await getAdminSessionDeviceId(cookieStore.get(ADMIN_COOKIE)?.value);

  if (!currentDeviceId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  if (id === currentDeviceId) {
    return Response.json(
      { error: "No puedes revocar el dispositivo desde el que estas conectado." },
      { status: 400 }
    );
  }

  const revoked = await revokeTrustedDevice(id);
  if (!revoked) {
    return Response.json({ error: "Dispositivo no encontrado" }, { status: 404 });
  }

  return Response.json({ ok: true });
}