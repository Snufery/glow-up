import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAdminConfigError,
  getAdminPassword,
  safeEqual,
} from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const configError = getAdminConfigError();
  if (configError) {
    console.error("Admin config:", configError);
    return NextResponse.json(
      { error: "El panel de administracion no esta configurado. Contacta al desarrollador." },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    if (!safeEqual(password, getAdminPassword())) {
      return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Error interno al iniciar sesion" }, { status: 500 });
  }
}