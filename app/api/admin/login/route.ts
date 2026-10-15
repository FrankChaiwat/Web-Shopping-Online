import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
