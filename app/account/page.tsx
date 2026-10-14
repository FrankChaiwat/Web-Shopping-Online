"use client";

import { useEffect, useState } from "react";
import { MapPin, Package, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function AccountPage() {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState<
    Array<{ id: number; name: string; price: string; imageUrl: string | null }>
  >([]);
  const [addresses, setAddresses] = useState<
    Array<{
      id: number;
      recipientName: string;
      phone: string;
      addressLine: string;
      district: string;
      amphoe: string;
      province: string;
      postalCode: string;
    }>
  >([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const [addressForm, setAddressForm] = useState({
    recipientName: "",
    phone: "",
    addressLine: "",
    district: "",
    amphoe: "",
    province: "",
    postalCode: "",
  });
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const setCartOwner = useCartStore((state) => state.setOwner);
  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then(setProducts);
  }, []);
  useEffect(() => {
    fetch("/api/customer/address")
      .then((response) => (response.ok ? response.json() : []))
      .then(setAddresses);
  }, []);
  useEffect(() => {
    fetch("/api/customer/session")
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) {
          window.location.href = "/login";
          return;
        }
        setUsername(data.username ?? "");
        setCartOwner(data.username);
      });
  }, [setCartOwner]);
  const logout = async () => {
    await fetch("/api/customer/logout", { method: "POST" });
    window.location.href = "/";
  };
  const saveAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddressMessage("");
    const response = await fetch("/api/customer/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    const data = await response.json();
    if (!response.ok) {
      setAddressMessage(data.error);
      return;
    }
    setAddresses((current) => [data, ...current]);
    setAddressForm({
      recipientName: "",
      phone: "",
      addressLine: "",
      district: "",
      amphoe: "",
      province: "",
      postalCode: "",
    });
    setShowAddressForm(false);
  };
  const deleteAddress = async (id: number) => {
    await fetch(`/api/customer/address?id=${id}`, { method: "DELETE" });
    setAddresses((current) => current.filter((address) => address.id !== id));
  };
  return (
    <main className="account-page">
      <header className="shell nav">
        <a href="/" className="brand account-brand">
          NORDIC<span>.</span>
        </a>
        <div className="account-header-actions">
          <a href="/cart" className="account-cart-link">
            <ShoppingBag size={16} /> ตะกร้า (
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </a>
          <a href="/" className="back">
            กลับหน้าร้าน
          </a>
          <button className="account-logout" onClick={logout}>
            ออกจากระบบ
          </button>
        </div>
      </header>
      <div className="account-wrap">
        <div className="eyebrow">MY ACCOUNT</div>
        <div className="account-user-label">
          ผู้ใช้งาน: <strong>{username || "กำลังโหลด..."}</strong>
        </div>
        <h1>บัญชีของฉัน</h1>
        <p className="account-intro">
          จัดการข้อมูลส่วนตัว ติดตามคำสั่งซื้อ และเลือกซื้อสินค้าได้จากหน้านี้
        </p>
        <div className="account-grid">
          <section className="account-card">
            <div className="account-card-title">
              <Package size={20} />
              <h2>คำสั่งซื้อของฉัน</h2>
            </div>
            <div className="account-empty">
              <Package size={30} />
              <strong>ยังไม่มีคำสั่งซื้อ</strong>
              <span>เมื่อคุณสั่งซื้อสินค้า รายการจะแสดงที่นี่</span>
              <a href="/#shop" className="primary">
                เลือกชมสินค้า
              </a>
            </div>
          </section>
          <section className="account-card address-card">
            <div className="account-card-title">
              <MapPin size={20} />
              <h2>ที่อยู่จัดส่ง</h2>
            </div>
            {addresses.length === 0 && !showAddressForm && (
              <p className="muted">ยังไม่ได้เพิ่มที่อยู่จัดส่ง</p>
            )}
            {addresses.map((address) => (
              <div className="saved-address" key={address.id}>
                <strong>{address.recipientName}</strong>
                <span>{address.phone}</span>
                <span>
                  {address.addressLine} แขวง/ตำบล {address.district} เขต/อำเภอ{" "}
                  {address.amphoe} จังหวัด {address.province}{" "}
                  {address.postalCode}
                </span>
                <button
                  className="address-delete"
                  onClick={() => deleteAddress(address.id)}
                >
                  ลบที่อยู่นี้
                </button>
              </div>
            ))}
            {showAddressForm ? (
              <form className="address-form" onSubmit={saveAddress}>
                <input
                  required
                  placeholder="ชื่อผู้รับ"
                  value={addressForm.recipientName}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      recipientName: e.target.value,
                    })
                  }
                />
                <input
                  required
                  placeholder="เบอร์โทรศัพท์"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="บ้านเลขที่ / ถนน"
                  value={addressForm.addressLine}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      addressLine: e.target.value,
                    })
                  }
                />
                <div className="address-form-grid">
                  <input
                    required
                    placeholder="แขวง/ตำบล"
                    value={addressForm.district}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        district: e.target.value,
                      })
                    }
                  />
                  <input
                    required
                    placeholder="เขต/อำเภอ"
                    value={addressForm.amphoe}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, amphoe: e.target.value })
                    }
                  />
                </div>
                <input
                  required
                  placeholder="จังหวัด"
                  value={addressForm.province}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, province: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="รหัสไปรษณีย์"
                  maxLength={5}
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      postalCode: e.target.value,
                    })
                  }
                />
                {addressMessage && (
                  <span className="error">{addressMessage}</span>
                )}
                <div className="address-actions">
                  <button
                    type="button"
                    className="outline"
                    onClick={() => setShowAddressForm(false)}
                  >
                    ยกเลิก
                  </button>
                  <button className="primary">บันทึกที่อยู่</button>
                </div>
              </form>
            ) : (
              <button
                className="outline"
                onClick={() => setShowAddressForm(true)}
              >
                + เพิ่มที่อยู่ใหม่
              </button>
            )}
          </section>
        </div>
        <section className="account-products">
          <div className="account-products-head">
            <div>
              <div className="eyebrow">SHOP NOW</div>
              <h2>สินค้าแนะนำ</h2>
            </div>
            <a href="/#shop">ดูสินค้าทั้งหมด →</a>
          </div>
          <div className="account-product-list">
            {products.map((product) => (
              <div className="account-product" key={product.id}>
                <a href={`/product/${product.id}`}>
                  <div className="account-product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <Package size={25} />
                    )}
                  </div>
                  <strong>{product.name}</strong>
                  <span>฿{Number(product.price).toLocaleString("th-TH")}</span>
                </a>
                <button
                  className="account-add-cart"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      imageUrl: product.imageUrl,
                    })
                  }
                >
                  <Plus size={14} /> เพิ่มลงตะกร้า
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
