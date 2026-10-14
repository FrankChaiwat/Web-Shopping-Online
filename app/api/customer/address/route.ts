import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerUsername } from "@/lib/customer-auth";

export async function GET(request: Request) {
  const username = getCustomerUsername(request);
  if (!username) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบลูกค้า" }, { status: 401 });
  return NextResponse.json(await prisma.customerAddress.findMany({ where: { username }, orderBy: { createdAt: "desc" } }));
}

export async function POST(request: Request) {
  const username = getCustomerUsername(request);
  if (!username) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบลูกค้า" }, { status: 401 });
  const body = await request.json();
  const values = [body.recipientName, body.phone, body.addressLine, body.district, body.amphoe, body.province, body.postalCode].map(value => String(value ?? "").trim());
  if (values.some(value => !value)) return NextResponse.json({ error: "กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน" }, { status: 400 });
  const [recipientName, phone, addressLine, district, amphoe, province, postalCode] = values;
  const address = await prisma.customerAddress.create({ data: { username, recipientName, phone, addressLine, district, amphoe, province, postalCode } });
  return NextResponse.json(address, { status: 201 });
}

export async function DELETE(request: Request) {
  const username = getCustomerUsername(request);
  if (!username) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบลูกค้า" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await prisma.customerAddress.deleteMany({ where: { id, username } });
  return NextResponse.json({ success: true });
}
