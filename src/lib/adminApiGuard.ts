import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/adminSession";
import { verifyCurrentAdminDevice } from "@/lib/adminDeviceAuth";

export async function isAdminApiAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!session) return false;
  return verifyCurrentAdminDevice();
}

export function unauthorizedAdminResponse(): Response {
  return Response.json({ error: "No autorizado" }, { status: 401 });
}