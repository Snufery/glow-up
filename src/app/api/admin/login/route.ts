import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createAdminSessionToken,
  getAdminPassword,
  safeEqual,
} from "@/lib/adminSession";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";

    if (!safeEqual(password, getAdminPassword())) {
      return NextResponse.json({ error: "Contrasena incorrecta" }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Configuracion de admin incompleta en el servidor" },
      { status: 500 }
    );
  }
}