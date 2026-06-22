import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAdminConfigError,
  getAdminPassword,
  safeEqual,
} from "@/lib/adminSession";
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

    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

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

    clearIpFailures(ipKey);
    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    clearAttemptCookie(response);
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Error interno al iniciar sesion" }, { status: 500 });
  }
}