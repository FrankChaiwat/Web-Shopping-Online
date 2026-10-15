"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, PackagePlus, Pencil, Save, Trash2, X } from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  description: string | null;
  imageUrl: string | null;
};

type ProductForm = {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
};

const emptyForm: ProductForm = {
  name: "",
  category: "ของใช้ในบ้าน",
  price: "",
  stock: "0",
  description: "",
  imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    const response = await fetch("/api/products");
    if (response.ok) setProducts(await response.json());
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) window.location.href = "/admin/login";
      });
    loadProducts();
  }, []);

  const edit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: String(product.stock),
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
    });
    setImageFile(null);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setMessage("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId, imageUrl }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }
    cancelEdit();
    setMessage("แก้ไขสินค้าเรียบร้อยแล้ว");
    await loadProducts();
  };

  const remove = async (id: number) => {
    if (!window.confirm("ต้องการลบสินค้านี้หรือไม่?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    await loadProducts();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/admin" className="back">
          <ArrowLeft size={17} /> กลับหน้าเพิ่มสินค้า
        </a>
        <div className="admin-brand">
          Chaiwat Shop<span>.</span> / ADMIN
        </div>
        <button className="logout" onClick={logout}>
          ออกจากระบบ
        </button>
      </header>
      <div className="admin-wrap">
        <div className="admin-title">
          <div>
            <div className="eyebrow">PRODUCT MANAGEMENT</div>
            <h1>สินค้าล่าสุด</h1>
            <p>ดูรูปภาพและแก้ไขข้อมูลสินค้าที่มีอยู่ในคลัง</p>
          </div>
          <PackagePlus size={43} strokeWidth={1.2} />
        </div>

        {editingId && (
          <form className="product-form admin-edit-form" onSubmit={submit}>
            <h2>แก้ไขสินค้า</h2>
            <label>
              ชื่อสินค้า
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <div className="form-grid">
              <label>
                หมวดหมู่
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
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
              />
            </label>
            <label>
              เปลี่ยนรูปจากเครื่อง
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              <small className="field-help">
                ถ้าไม่เลือกรูปใหม่ จะใช้รูปเดิม
              </small>
            </label>
            <label>
              URL รูปภาพ
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </label>
            <div className="form-actions">
              <span className="success">{message}</span>
              <button type="button" className="outline" onClick={cancelEdit}>
                <X size={16} /> ยกเลิก
              </button>
              <button className="primary" disabled={loading}>
                <Save size={16} />{" "}
                {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        )}

        <section className="inventory">
          <div className="inventory-head">
            <h2>รายการสินค้า</h2>
            <span>{products.length} รายการ</span>
          </div>
          {products.length === 0 ? (
            <p className="empty">ยังไม่มีสินค้าในฐานข้อมูล</p>
          ) : (
            <div className="inventory-list">
              {products.map((product) => (
                <div className="inventory-row" key={product.id}>
                  <div className="inventory-icon inventory-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <PackagePlus size={20} />
                    )}
                  </div>
                  <div className="inventory-info">
                    <strong>{product.name}</strong>
                    <small>{product.category}</small>
                  </div>
                  <div className="inventory-price">
                    ฿{Number(product.price).toLocaleString("th-TH")}
                  </div>
                  <div className="inventory-stock">สต็อก {product.stock}</div>
                  <button
                    className="edit"
                    aria-label="แก้ไขสินค้า"
                    onClick={() => edit(product)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="delete"
                    aria-label="ลบสินค้า"
                    onClick={() => remove(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
