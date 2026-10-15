"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, PackagePlus, Save } from "lucide-react";
const emptyForm = {
  name: "",
  category: "ของใช้ในบ้าน",
  price: "",
  stock: "0",
  description: "",
  imageUrl: "",
};

export default function AdminPage() {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) window.location.href = "/admin/login";
      });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    let imageUrl = form.imageUrl;
    if (imageFile) {
      const upload = new FormData();
      upload.append("file", imageFile);
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: upload,
      });
      if (!uploadResponse.ok) {
        setMessage(
          (await uploadResponse.json()).error ?? "อัปโหลดรูปไม่สำเร็จ",
        );
        setLoading(false);
        return;
      }
      imageUrl = (await uploadResponse.json()).url;
    }
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }
    setForm(emptyForm);
    setImageFile(null);
    setMessage("เพิ่มสินค้าเรียบร้อยแล้ว");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/" className="back">
          <ArrowLeft size={17} /> กลับหน้าร้าน
        </a>
        <div className="admin-brand">
          NORDIC<span>.</span> / ADMIN
        </div>
        <div className="admin-actions">
          <div className="admin-status">● เชื่อมต่อฐานข้อมูลแล้ว</div>
          <button className="logout" onClick={logout}>
            ออกจากระบบ
          </button>
        </div>
      </header>
      <div className="admin-wrap">
        <div className="admin-title">
          <div>
            <div className="eyebrow">PRODUCT MANAGEMENT</div>
            <h1>เพิ่มสินค้า</h1>
            <p>เพิ่มสินค้าใหม่เข้าสู่คลังของ Chaiwat Shop</p>
          </div>
          <PackagePlus size={43} strokeWidth={1.2} />
        </div>
        <form className="product-form" onSubmit={submit}>
          <label>
            ชื่อสินค้า
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น แก้วเซรามิก Aura"
            />
          </label>
          <div className="form-grid">
            <label>
              หมวดหมู่
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>ของใช้ในบ้าน</option>
                <option>ของแต่งบ้าน</option>
                <option>แฟชั่น</option>
              </select>
            </label>
            <label>
              ราคา (บาท)
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="590"
              />
            </label>
            <label>
              จำนวนในสต็อก
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </label>
          </div>
          <label>
            รายละเอียดสินค้า
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="รายละเอียดสินค้าโดยย่อ"
            />
          </label>
          <label>
            อัปโหลดรูปจากเครื่อง
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <small className="field-help">
              รองรับ JPG, PNG, WEBP, GIF ขนาดไม่เกิน 5MB
            </small>
          </label>
          <label>
            หรือใส่ URL รูปภาพ
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </label>
          <div className="form-actions">
            <span
              className={message.includes("เรียบร้อย") ? "success" : "error"}
            >
              {message}
            </span>
            <button className="primary" disabled={loading}>
              <Save size={16} /> {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
            </button>
          </div>
        </form>
        <a href="/admin/products" className="admin-manage-link">
          จัดการสินค้าล่าสุด →
        </a>
      </div>
    </main>
  );
}
