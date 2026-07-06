import { cookies } from "next/headers";
import {
  ADMIN_DEVICE_COOKIE,
  DEVICE_COOKIE_MAX_AGE,
  buildDeviceCookieValue,
  detectDeviceLabel,
  parseDeviceCookieValue,
} from "@/lib/adminDevice";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAdminSessionDeviceId,
} from "@/lib/adminSession";
import {
  consumeDeviceInvite,
  countTrustedDevices,
  isTrustedDeviceActive,
  registerTrustedDevice,
  verifyTrustedDevice,
} from "@/lib/db/adminDevices";

function attachDeviceCookie(
  response: Response,
  deviceId: string,
  secret: string
): void {
  const secure = process.env.NODE_ENV === "production";
  const value = buildDeviceCookieValue(deviceId, secret);

  response.headers.append(
    "Set-Cookie",
    `${ADMIN_DEVICE_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${DEVICE_COOKIE_MAX_AGE}${secure ? "; Secure" : ""}`
  );
}

export async function attachAdminAuthCookies(
  response: Response,
  deviceId: string,
  secret: string
): Promise<void> {
  const token = await createAdminSessionToken(deviceId);
  const secure = process.env.NODE_ENV === "production";

  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}${secure ? "; Secure" : ""}`
  );

  attachDeviceCookie(response, deviceId, secret);
}

export async function resolveTrustedDeviceLogin(input: {
  deviceCookie?: string;
  inviteCode?: string;
  userAgent: string;
}): Promise<
  | { ok: true; deviceId: string; secret: string; bootstrapped: boolean }
  | { ok: false; code: "DEVICE_NOT_TRUSTED" | "INVALID_INVITE" | "DB_UNAVAILABLE" | "DEVICE_LIMIT" }
> {
  const parsed = parseDeviceCookieValue(input.deviceCookie);
  if (parsed) {
    const device = await verifyTrustedDevice(parsed.deviceId, parsed.secret);
    if (device) {
      return { ok: true, deviceId: device.id, secret: parsed.secret, bootstrapped: false };
    }
  }

  const totalDevices = await countTrustedDevices();
  if (totalDevices === 0) {
    const registered = await registerTrustedDevice({
      label: detectDeviceLabel(input.userAgent),
      userAgent: input.userAgent,
    });
    if (!registered) return { ok: false, code: "DB_UNAVAILABLE" };
    return {
      ok: true,
      deviceId: registered.deviceId,
      secret: registered.secret,
      bootstrapped: true,
    };
  }

  if (!input.inviteCode?.trim()) {
    return { ok: false, code: "DEVICE_NOT_TRUSTED" };
  }

  const inviteOk = await consumeDeviceInvite(input.inviteCode.trim());
  if (!inviteOk) return { ok: false, code: "INVALID_INVITE" };

  const registered = await registerTrustedDevice({
    label: detectDeviceLabel(input.userAgent),
    userAgent: input.userAgent,
  });
  if (!registered) return { ok: false, code: "DEVICE_LIMIT" };

  return {
    ok: true,
    deviceId: registered.deviceId,
    secret: registered.secret,
    bootstrapped: false,
  };
}

export async function verifyCurrentAdminDevice(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const deviceId = await getAdminSessionDeviceId(sessionToken);
  if (!deviceId) return false;

  const deviceCookie = cookieStore.get(ADMIN_DEVICE_COOKIE)?.value;
  const parsed = parseDeviceCookieValue(deviceCookie);
  if (!parsed || parsed.deviceId !== deviceId) return false;

  const device = await verifyTrustedDevice(parsed.deviceId, parsed.secret);
  return Boolean(device);
}