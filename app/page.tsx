"use client";
import { Search, ShoppingBag, UserRound, ArrowRight, Plus, PackageOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

type Product = { id:number; name:string; category:string; price:number|string; imageUrl:string|null; stock:number };
const categories = ["ทั้งหมด", "ของใช้ในบ้าน", "ของแต่งบ้าน", "แฟชั่น"];
const visualByCategory: Record<string, { icon:string; tone:string }> = { "ของใช้ในบ้าน": { icon:"☕", tone:"tone-1" }, "ของแต่งบ้าน": { icon:"🏺", tone:"tone-3" }, "แฟชั่น": { icon:"👜", tone:"tone-2" } };

export default function Home() {
  const [category, setCategory] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const setCartOwner = useCartStore(state => state.setOwner);
  useEffect(() => { fetch("/api/products").then(response => response.ok ? response.json() : []).then(setProducts); }, []);
  useEffect(() => { fetch("/api/customer/session").then(response => response.json()).then(data => { setCustomerLoggedIn(data.authenticated); setCartOwner(data.authenticated ? data.username : null); setSessionChecked(true); }); }, [setCartOwner]);
  const cartItems = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const addToCart = (product: Product) => { if (!customerLoggedIn) { window.location.href = "/login"; return; } addItem({ id: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl }); };
  const filtered = useMemo(() => products.filter(p => (category === "ทั้งหมด" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [products, category, query]);
  const money = (n:number|string) => `฿${Number(n).toLocaleString("th-TH")}`;
  return <>
    <div className="topbar">จัดส่งฟรี เมื่อช้อปครบ ฿1,500 · คืนสินค้าได้ภายใน 14 วัน</div>
    <header className="shell nav"><div className="brand">NORDIC<span style={{color:"#98b64b"}}>.</span></div><nav className="navlinks"><a href="#shop">สินค้า</a><a href="#about">เรื่องราวของเรา</a><a href="#contact">ติดต่อ</a></nav><div className="navtools"><button className="iconbtn" aria-label="ค้นหา" onClick={() => document.getElementById("search")?.focus()}><Search size={19}/></button><a href={customerLoggedIn ? "/account" : "/login"} className="iconbtn" aria-label={customerLoggedIn ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}><UserRound size={19}/></a>{customerLoggedIn ? <a href="/account" className="login-main">บัญชีของฉัน</a> : <a href="/login" className="login-main">เข้าสู่ระบบ</a>}<a href="/cart" className="iconbtn" aria-label="ตะกร้า"><ShoppingBag size={20}/>{sessionChecked && customerLoggedIn && cartItems.length > 0 && <span className="badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>}</a></div></header>
    <main className="shell">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">คอลเลกชันใหม่ · 2026</div><h1>สิ่งดีๆ<br/>สำหรับทุกวัน</h1><p>คัดสรรของใช้ที่สวย เรียบง่าย และทำให้ทุกวันของคุณมีความหมายมากขึ้น</p><button className="primary" onClick={() => document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}>เลือกชมสินค้า <ArrowRight size={16} style={{verticalAlign:"middle",marginLeft:8}}/></button></div><div className="hero-art"><div className="hero-product"/></div></section>
      <section id="shop"><div className="sectionhead"><div><div className="eyebrow">OUR SELECTION</div><h2>สินค้าคัดสรร</h2></div><span>{filtered.length} รายการ</span></div>
        <div className="categories">{categories.map(c => <button key={c} className={`chip ${category===c ? "active":""}`} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="search"><Search size={17} color="#7b8981"/><input id="search" placeholder="ค้นหาสินค้า..." value={query} onChange={e => setQuery(e.target.value)}/></div>
        {filtered.length === 0 ? <div className="empty-store"><PackageOpen size={28}/><strong>ยังไม่มีสินค้า</strong><span>แอดมินยังไม่ได้เพิ่มสินค้าเข้าร้าน</span></div> : <div className="products" style={{marginTop:24}}>{filtered.map(p => { const visual = visualByCategory[p.category] ?? { icon:"📦", tone:"tone-5" }; return <article className="product" key={p.id}><a href={`/product/${p.id}`} className="product-link"><div className={`product-img ${visual.tone}`}>{p.imageUrl ? <img src={p.imageUrl} alt={p.name}/> : <span>{visual.icon}</span>}</div><h3>{p.name}</h3></a><div className="product-meta"><span>{money(p.price)}</span><button className="add" aria-label={`เพิ่ม ${p.name} ลงตะกร้า`} onClick={() => addToCart(p)}><Plus size={17}/></button></div></article>; })}</div>}
      </section>
    </main>
    <footer className="footer" id="contact"><div className="shell footer-inner"><div><div className="brand">NORDIC<span style={{color:"#d4e774"}}>.</span></div><p>ของดีไซน์เรียบง่ายที่อยู่กับคุณได้นาน</p></div><div className="footer-right"><p>© 2026 Nordic Market · กรุงเทพฯ</p><a href="/admin/login">สำหรับผู้ดูแลระบบ</a></div></div></footer>
  </>;
}
