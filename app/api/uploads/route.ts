import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequest(request))
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบแอดมิน" },
      { status: 401 },
    );
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
  if (!file.type.startsWith("image/"))
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์รูปภาพ" },
      { status: 400 },
    );
  if (file.size > 5 * 1024 * 1024)
    return NextResponse.json(
      { error: "ไฟล์ต้องมีขนาดไม่เกิน 5MB" },
      { status: 400 },
    );

  const extension =
    (file.name.split(".").pop() || "jpg")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase() || "jpg";
  const filename = `${randomUUID()}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(
    path.join(uploadDir, filename),
    Buffer.from(await file.arrayBuffer()),
  );
  return NextResponse.json({ url: `/uploads/${filename}` });
}
