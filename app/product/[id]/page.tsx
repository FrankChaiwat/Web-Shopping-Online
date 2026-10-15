"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Package, ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  description: string | null;
  imageUrl: string | null;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOwner = useCartStore((state) => state.setOwner);
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  useEffect(() => {
    fetch(`/api/products?id=${params.id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then(setProduct);
  }, [params.id]);
  useEffect(() => {
    fetch("/api/customer/session")
      .then((response) => response.json())
      .then((data) => {
        setCustomerLoggedIn(data.authenticated);
        setCartOwner(data.authenticated ? data.username : null);
      });
  }, [setCartOwner]);
  if (!product)
    return (
      <main className="detail-page">
        <div className="detail-loading">กำลังโหลดสินค้า...</div>
      </main>
    );
  const addToCart = () => {
    if (!customerLoggedIn) {
      window.location.href = "/login";
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    });
    setAdded(true);
  };
  return (
    <main className="detail-page">
      <header className="shell nav">
        <a href="/" className="brand account-brand">
          NORDIC<span>.</span>
        </a>
        <a href="/" className="back">
          <ArrowLeft size={16} /> กลับหน้าร้าน
        </a>
      </header>
      <div className="detail-wrap">
        <a className="detail-back" href="/#shop">
          <ArrowLeft size={15} /> สินค้าทั้งหมด
        </a>
        <div className="detail-layout">
          <div className="detail-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <Package size={80} />
            )}
          </div>
          <section className="detail-info">
            <div className="eyebrow">{product.category}</div>
            <h1>{product.name}</h1>
            <div className="detail-price">
              ฿{Number(product.price).toLocaleString("th-TH")}
            </div>
            <p>
              {product.description ||
                "สินค้าคุณภาพที่คัดสรรมาเพื่อคุณ ออกแบบเรียบง่าย ใช้งานได้ในทุกวัน"}
            </p>
            <div className="detail-stock">
              {product.stock > 0 ? (
                <>
                  <Check size={16} /> มีสินค้าในสต็อก {product.stock} ชิ้น
                </>
              ) : (
                "สินค้าหมด"
              )}
            </div>
            <button
              className="primary detail-add"
              disabled={product.stock === 0}
              onClick={addToCart}
            >
              <ShoppingBag size={17} />{" "}
              {added ? "เพิ่มลงตะกร้าแล้ว" : "เพิ่มลงตะกร้า"}
            </button>
            {added && (
              <a className="detail-cart-link" href="/cart">
                ไปที่ตะกร้า →
              </a>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
