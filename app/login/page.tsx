"use client";

import { FormEvent, useState } from "react";
import { LogIn, UserRound } from "lucide-react";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const adminResponse = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });
    if (adminResponse.ok) {
      window.location.href = "/admin";
      return;
    }
    const customerResponse = await fetch("/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });
    if (customerResponse.ok) {
      window.location.href = "/#shop";
      return;
    }
    setLoading(false);
    setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-mark">
          <UserRound size={24} />
        </div>
        <div className="admin-brand">
          NORDIC<span>.</span>
        </div>
        <h1>เข้าสู่ระบบ</h1>
        <p>เข้าสู่บัญชีลูกค้าหรือบัญชีผู้ดูแลระบบ</p>
        <form onSubmit={submit}>
          <label>
            อีเมลหรือชื่อผู้ใช้
            <input
              required
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล หรือ chaiwat"
            />
          </label>
          <label>
            รหัสผ่าน
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button className="primary login-button" disabled={loading}>
            <LogIn size={16} />{" "}
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        <div className="login-register">
          ยังไม่มีบัญชี? <a href="/register">สมัครสมาชิก</a>
        </div>
        <a className="login-back" href="/">
          กลับหน้าร้าน
        </a>
      </div>
    </main>
  );
}
