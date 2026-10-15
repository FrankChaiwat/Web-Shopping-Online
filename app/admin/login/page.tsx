"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!response.ok) {
      setError((await response.json()).error);
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-mark">
          <LockKeyhole size={24} />
        </div>
        <div className="admin-brand">
          NORDIC<span>.</span> / ADMIN
        </div>
        <h1>เข้าสู่ระบบ</h1>
        <p>เข้าสู่ระบบเพื่อจัดการสินค้าและออเดอร์</p>
        <form onSubmit={submit}>
          <label>
            ชื่อผู้ใช้
            <input
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
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
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่หน้า Admin"}
          </button>
        </form>
        <a className="login-back" href="/">
          กลับหน้าร้าน
        </a>
      </div>
    </main>
  );
}
