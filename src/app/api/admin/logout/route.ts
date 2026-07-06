import { NextResponse } from "next/server";
import { ADMIN_DEVICE_COOKIE } from "@/lib/adminDevice";
import { ADMIN_COOKIE } from "@/lib/adminSession";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", cookieOptions);
  response.cookies.set(ADMIN_DEVICE_COOKIE, "", cookieOptions);
  return response;
}