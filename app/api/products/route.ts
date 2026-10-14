import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (Number.isInteger(id) && id > 0) {
    const product = await prisma.product.findUnique({ where: { id } });
    return product
      ? NextResponse.json(product)
      : NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  }
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!isAdminRequest(request))
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 },
    );
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);

    if (
      !name ||
      !category ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลสินค้าให้ถูกต้อง" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        stock,
        description: body.description ? String(body.description).trim() : null,
        imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกสินค้าได้" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = Number(body.id);
    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);

    if (!Number.isInteger(id) || !name || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลสินค้าให้ถูกต้อง" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price,
        stock,
        description: body.description ? String(body.description).trim() : null,
        imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "ไม่สามารถแก้ไขสินค้าได้" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id))
    return NextResponse.json(
      { error: "รหัสสินค้าไม่ถูกต้อง" },
      { status: 400 },
    );
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
