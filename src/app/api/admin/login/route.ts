import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  getAdminConfigError,
  getAdminPassword,
  safeEqual,
} from "@/lib/adminSession";
import { attachAdminAuthCookies, resolveTrustedDeviceLogin } from "@/lib/adminDeviceAuth";
import { ADMIN_DEVICE_COOKIE } from "@/lib/adminDevice";
import {
  ATTEMPT_COOKIE,
  MAX_LOGIN_ATTEMPTS,
  attachAttemptCookie,
  buildFailedAttempt,
  clearAttemptCookie,
  getLockRetryAfterSec,
  isLoginLocked,
  readAttemptCookie,
} from "@/lib/adminLoginAttempts";
import {
  clearIpFailures,
  getClientIp,
  getIpLockState,
  isAllowedSameOrigin,
  recordIpFailure,
} from "@/lib/requestSecurity";

export const runtime = "nodejs";

function lockoutResponse(retryAfterSec: number) {
  return NextResponse.json(
    {
      error: `Demasiados intentos fallidos. Espera ${Math.ceil(retryAfterSec / 60)} minutos e intenta de nuevo.`,
      locked: true,
      retryAfterSec,
    },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

const DEVICE_ERRORS: Record<string, string> = {
  DEVICE_NOT_TRUSTED:
    "Este dispositivo no esta autorizado. Registra tu celular o PC desde un dispositivo ya confiado.",
  INVALID_INVITE:
    "Codigo invalido o expirado. Usa un codigo de 6 digitos del panel admin o la clave de recuperacion.",
  DEVICE_LIMIT: "Ya alcanzaste el maximo de dispositivos autorizados.",
  DB_UNAVAILABLE: "No se pudo validar el dispositivo. Revisa DATABASE_URL en Vercel.",
};

export async function POST(request: Request) {
  if (!isAllowedSameOrigin(request)) {
    return NextResponse.json({ error: "Solicitud no permitida" }, { status: 403 });
  }

  const configError = getAdminConfigError();
  if (configError) {
    console.error("Admin config:", configError);
    return NextResponse.json(
      { error: "El panel de administracion no esta configurado. Contacta al desarrollador." },
      { status: 500 }
    );
  }

  try {
    const ip = getClientIp(request);
    const ipKey = `admin-login:${ip}`;
    const cookieStore = await cookies();
    const attemptCookie = cookieStore.get(ATTEMPT_COOKIE)?.value;
    const attemptState = await readAttemptCookie(attemptCookie, ip);

    if (isLoginLocked(attemptState)) {
      return lockoutResponse(getLockRetryAfterSec(attemptState));
    }

    const ipLock = getIpLockState(ipKey, MAX_LOGIN_ATTEMPTS);
    if (ipLock.locked) {
      return lockoutResponse(ipLock.retryAfterSec ?? 1800);
    }

    const body = (await request.json()) as { password?: string; inviteCode?: string };
    const password = body.password ?? "";
    const inviteCode = body.inviteCode?.trim();

    if (!safeEqual(password, getAdminPassword())) {
      recordIpFailure(ipKey, MAX_LOGIN_ATTEMPTS, 30 * 60 * 1000);
      const failedState = buildFailedAttempt(ip, attemptState);
      const response = NextResponse.json(
        {
          error:
            failedState.count >= MAX_LOGIN_ATTEMPTS
              ? "Credenciales invalidas. Cuenta bloqueada temporalmente."
              : `Credenciales invalidas. Te queda ${MAX_LOGIN_ATTEMPTS - failedState.count} intento.`,
          attemptsUsed: failedState.count,
          attemptsMax: MAX_LOGIN_ATTEMPTS,
        },
        { status: failedState.count >= MAX_LOGIN_ATTEMPTS ? 429 : 401 }
      );

      await attachAttemptCookie(response, failedState);

      if (failedState.count >= MAX_LOGIN_ATTEMPTS) {
        response.headers.set("Retry-After", String(getLockRetryAfterSec(failedState)));
      }

      return response;
    }

    const deviceCookie = cookieStore.get(ADMIN_DEVICE_COOKIE)?.value;
    const userAgent = request.headers.get("user-agent") ?? "";
    const deviceResult = await resolveTrustedDeviceLogin({
      deviceCookie,
      inviteCode,
      userAgent,
    });

    if (!deviceResult.ok) {
      return NextResponse.json(
        {
          error: DEVICE_ERRORS[deviceResult.code] ?? "Dispositivo no autorizado",
          code: deviceResult.code,
        },
        { status: 403 }
      );
    }

    clearIpFailures(ipKey);
    const response = NextResponse.json({
      ok: true,
      bootstrapped: deviceResult.bootstrapped,
    });

    await attachAdminAuthCookies(response, deviceResult.deviceId, deviceResult.secret);
    clearAttemptCookie(response);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Error interno al iniciar sesion" }, { status: 500 });
  }
}