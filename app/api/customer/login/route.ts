import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, CUSTOMER_COOKIE, verifyPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const customer = await prisma.customer.findUnique({ where: { username } });
  const registeredMatch = customer ? verifyPassword(password, customer.passwordHash) : false;
  const testMatch = username === process.env.CUSTOMER_USERNAME && password === process.env.CUSTOMER_PASSWORD;
  if (!registeredMatch && !testMatch) {
    return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set(CUSTOMER_COOKIE, createCustomerSession(username), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
  return response;
}
