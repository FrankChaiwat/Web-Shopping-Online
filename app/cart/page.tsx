"use client";

import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const { items, addItem, decreaseItem, removeItem } = useCartStore();
  const setOwner = useCartStore(state => state.setOwner);
  useEffect(() => { fetch("/api/customer/session").then(response => response.json()).then(data => { if (!data.authenticated) { window.location.href = "/login"; return; } setOwner(data.username); }); }, [setOwner]);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const money = (value: number) => `฿${value.toLocaleString("th-TH")}`;
  return <main className="cart-page"><header className="shell nav"><a href="/" className="brand account-brand">NORDIC<span>.</span></a><a href="/" className="back">กลับหน้าร้าน</a></header><div className="cart-wrap"><div className="eyebrow">YOUR BAG</div><h1>ตะกร้าสินค้า</h1>{items.length === 0 ? <div className="cart-empty"><ShoppingBag size={38}/><h2>ตะกร้ายังว่างอยู่</h2><p>เลือกสินค้าที่คุณชอบแล้วเพิ่มลงตะกร้าได้เลย</p><a href="/#shop" className="primary">เลือกชมสินค้า</a></div> : <div className="cart-layout"><section className="cart-items">{items.map(item => <article className="cart-item" key={item.id}><div className="cart-thumb">{item.imageUrl ? <img src={item.imageUrl} alt={item.name}/> : <ShoppingBag size={24}/>}</div><div className="cart-item-info"><h2>{item.name}</h2><span>{money(item.price)} / ชิ้น</span><div className="quantity"><button onClick={() => decreaseItem(item.id)} aria-label="ลดจำนวน"><Minus size={14}/></button><strong>{item.quantity}</strong><button onClick={() => addItem({ id:item.id, name:item.name, price:item.price, imageUrl:item.imageUrl })} aria-label="เพิ่มจำนวน"><Plus size={14}/></button></div></div><div className="cart-item-total">{money(item.price * item.quantity)}<button className="cart-remove" onClick={() => removeItem(item.id)}><Trash2 size={16}/></button></div></article>)}</section><aside className="cart-summary"><h2>สรุปคำสั่งซื้อ</h2><div><span>ยอดรวมสินค้า</span><strong>{money(total)}</strong></div><div><span>ค่าจัดส่ง</span><span>{total >= 1500 ? "ฟรี" : "คำนวณตอนชำระเงิน"}</span></div><hr/><div className="grand-total"><span>ยอดรวม</span><strong>{money(total)}</strong></div><button className="primary checkout-button">ดำเนินการสั่งซื้อ</button></aside></div>}</div></main>;
}
