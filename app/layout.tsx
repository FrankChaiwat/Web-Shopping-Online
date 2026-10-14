import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chaiwat Shop — Nakhonsawan",
  description: "ร้านค้าออนไลน์คัดสรรของใช้ดีไซน์เรียบง่าย",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
