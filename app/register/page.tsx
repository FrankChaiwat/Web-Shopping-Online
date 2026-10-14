"use client";

import { FormEvent, useState } from "react";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    if (form.password !== form.confirm) { setError("รหัสผ่านไม่ตรงกัน"); return; }
    setLoading(true);
    const response = await fetch("/api/customer/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) { setError(data.error); return; }
    window.location.href = "/login";
  };
  return <main className="login-page"><div className="login-card register-card"><div className="login-mark"><UserPlus size={24}/></div><div className="admin-brand">NORDIC<span>.</span></div><h1>สมัครสมาชิก</h1><p>สร้างบัญชีเพื่อเริ่มช้อปกับ Chaiwat Shop</p><form onSubmit={submit}><label>ชื่อ-นามสกุล<input required value={form.fullName} onChange={e => setForm({...form, fullName:e.target.value})} placeholder="ชื่อของคุณ"/></label><label>Username<input required value={form.username} onChange={e => setForm({...form, username:e.target.value})} placeholder="เช่น frank_shop"/></label><label>อีเมล<input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="your@email.com"/></label><label>รหัสผ่าน<input required type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="อย่างน้อย 6 ตัวอักษร"/></label><label>ยืนยันรหัสผ่าน<input required type="password" value={form.confirm} onChange={e => setForm({...form, confirm:e.target.value})} placeholder="กรอกรหัสผ่านอีกครั้ง"/></label>{error && <div className="login-error">{error}</div>}<button className="primary login-button" disabled={loading}>{loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}</button></form><div className="login-register">มีบัญชีแล้ว? <a href="/login">เข้าสู่ระบบ</a></div><a className="login-back" href="/">กลับหน้าร้าน</a></div></main>;
}
