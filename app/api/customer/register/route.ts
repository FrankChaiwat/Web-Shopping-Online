import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim().toLowerCase();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.fullName ?? "").trim();
    if (!/^[a-z0-9_]{3,30}$/.test(username)) return NextResponse.json({ error: "Username ต้องเป็นภาษาอังกฤษ ตัวเลข หรือ _ อย่างน้อย 3 ตัว" }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "กรุณากรอกอีเมลให้ถูกต้อง" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }, { status: 400 });
    const exists = await prisma.customer.findFirst({ where: { OR: [{ username }, { email }] } });
    if (exists) return NextResponse.json({ error: "Username หรืออีเมลนี้ถูกใช้แล้ว" }, { status: 409 });
    await prisma.customer.create({ data: { username, email, fullName: fullName || null, passwordHash: hashPassword(password) } });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ" }, { status: 500 }); }
}
