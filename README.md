# Chaiwat Shop — Nakhonsawan

เว็บร้านค้าออนไลน์ภาษาไทยที่สร้างด้วย Next.js App Router, TypeScript, Prisma และ PostgreSQL

## ภาษาและเทคโนโลยีที่ใช้

- **TypeScript** — ภาษาหลักสำหรับเขียนโค้ดหน้าเว็บและ API
- **React** — สร้างคอมโพเนนต์และหน้าจอแบบโต้ตอบ
- **Next.js** — Framework สำหรับเว็บ Full-stack ด้วย App Router
- **HTML/JSX** — โครงสร้างหน้าเว็บและ UI Component
- **CSS** — ตกแต่งหน้าเว็บ Responsive และ Animation
- **Prisma** — ORM สำหรับเชื่อมต่อและจัดการฐานข้อมูล
- **PostgreSQL** — ฐานข้อมูลหลักของระบบ
- **SQL** — คำสั่งที่ Prisma ใช้จัดการตารางใน PostgreSQL
- **Zustand** — จัดการสถานะตะกร้าสินค้าแยกตามผู้ใช้
- **Node.js และ npm** — Runtime และ Package Manager

## โครงสร้างโฟลเดอร์

```text
shop online/
├─ app/
│  ├─ page.tsx                  # หน้าร้าน: ค้นหา กรอง และแสดงสินค้า
│  ├─ globals.css               # สไตล์และ animation กลางของเว็บ
│  ├─ account/page.tsx          # บัญชีลูกค้า ที่อยู่ และสินค้าแนะนำ
│  ├─ cart/page.tsx             # ตะกร้าสินค้า
│  ├─ login/page.tsx            # Login ลูกค้า / Admin
│  ├─ admin/
│  │  ├─ page.tsx               # หลังบ้านเพิ่ม/ลบสินค้าและอัปโหลดรูป
│  │  ├─ products/page.tsx       # หน้าจัดการและแก้ไขสินค้าล่าสุด
│  │  └─ login/page.tsx         # Login แอดมินโดยเฉพาะ
│  ├─ product/[id]/page.tsx     # รายละเอียดสินค้า
│  └─ api/
│     ├─ products/route.ts      # API สินค้า
│     ├─ uploads/route.ts       # API อัปโหลดรูปสินค้า
│     ├─ admin/                 # API Login/Logout/Session ของ Admin
│     └─ customer/              # API Login/Logout/Session/ที่อยู่ลูกค้า
├─ lib/
│  ├─ prisma.ts                 # Prisma Client
│  ├─ cart-store.ts              # Zustand Cart Store
│  ├─ admin-auth.ts              # ระบบ session Admin
│  └─ customer-auth.ts           # ระบบ session ลูกค้า
├─ prisma/schema.prisma         # โครงสร้างตาราง PostgreSQL
├─ public/uploads/               # รูปสินค้าที่อัปโหลดจากเครื่อง
├─ .env                         # ค่าจริงของเครื่อง ห้ามเผยแพร่
├─ .env.example                 # ตัวอย่างค่าตั้งต้น
└─ package.json                 # คำสั่งและ dependencies
```

## เริ่มต้นใช้งาน

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## ฟีเจอร์ในเวอร์ชันนี้

- หน้าแคตตาล็อกพร้อม hero section และ responsive layout
- ค้นหาสินค้า และกรองตามหมวดหมู่
- เพิ่มสินค้าเข้าตะกร้าและแสดงจำนวนบน navigation
- หน้ารายละเอียดสินค้าและปุ่มเพิ่มลงตะกร้า
- หน้า Cart ปรับจำนวน ลบสินค้า และคำนวณยอดรวม
- ลูกค้า Login, จัดการข้อมูล และเพิ่มที่อยู่จัดส่ง
- Admin เพิ่ม/ลบสินค้าและอัปโหลดรูปจากเครื่อง
- Animation สำหรับหน้าเว็บ การ์ดสินค้า ปุ่ม และตะกร้า

ค่าตัวแปรสำหรับฐานข้อมูล การยืนยันตัวตน และ Stripe ดูได้จาก `.env.example`

## วิธีติดตั้งและตั้งค่า

1. เปิด Terminal ในโฟลเดอร์โปรเจกต์

   ```powershell
   cd "\shop online"
   ```

2. ติดตั้ง dependencies

   ```bash
   npm install
   ```

3. สร้างไฟล์ `.env` จาก `.env.example` แล้วใส่ค่า PostgreSQL และบัญชีทดสอบ

   ```env
   DATABASE_URL="postgresql://postgres:รหัสผ่าน@localhost:5432/my_eshop?schema=public"
   ADMIN_USERNAME="chaiwat"
   ADMIN_PASSWORD="chaiwat"
   CUSTOMER_USERNAME="frank"
   CUSTOMER_PASSWORD="frank"
   ```

4. สร้าง Prisma Client และตารางฐานข้อมูล

   ```bash
   npm run db:generate
   npm run db:push
   ```

## เชื่อมต่อ PostgreSQL ผ่าน pgAdmin 4

1. สร้าง Database ชื่อ `my_eshop` ใน pgAdmin 4
2. คัดลอก `.env.example` เป็น `.env`
3. แก้ `DATABASE_URL` ให้ตรงกับค่า Host, Port, Username และ Password ของ PostgreSQL
4. รัน `npm run db:push` เพื่อสร้างตารางจาก Prisma schema
5. ใช้ `npm run db:studio` เพื่อเปิดหน้าจัดการข้อมูลของ Prisma

## วิธีใช้งาน

รันเว็บสำหรับพัฒนา:

```bash
npm run dev
```

หน้าเว็บหลัก:

| หน้า | URL | การใช้งาน |
|---|---|---|
| หน้าร้าน | `http://localhost:3000` | ดู ค้นหา และกรองสินค้า |
| Login | `http://localhost:3000/login` | Login ลูกค้าหรือ Admin |
| สมัครสมาชิก | `http://localhost:3000/register` | สร้างบัญชีลูกค้าใหม่ |
| บัญชีลูกค้า | `http://localhost:3000/account` | ข้อมูลส่วนตัว ที่อยู่ และสินค้าแนะนำ |
| ตะกร้า | `http://localhost:3000/cart` | เพิ่ม/ลด/ลบสินค้าและดูยอดรวม |
| Admin | `http://localhost:3000/admin` | จัดการสินค้าและอัปโหลดรูป |
| สินค้าล่าสุด Admin | `http://localhost:3000/admin/products` | ดูรูป แก้ไข และลบสินค้า |

บัญชีสำหรับทดสอบ:

- Admin: `username / password` ไปตั้งในไฟล์ .env
- ลูกค้า: `username / password`

## คำสั่งที่ใช้บ่อย

```bash
npm run dev          # เปิดเว็บโหมดพัฒนา
npm run build        # ตรวจและ build สำหรับ production
npm run start        # เปิดเว็บจาก production build
npm run db:generate  # สร้าง Prisma Client
npm run db:push      # อัปเดตตารางใน PostgreSQL
npm run db:studio    # เปิดหน้าจัดการข้อมูล Prisma
```

> หมายเหตุ: `public/uploads` เหมาะกับการทดสอบบนเครื่อง หากนำขึ้น production ควรใช้ object storage เช่น S3 หรือ Cloudinary และควรเปลี่ยนรหัสผ่านตัวอย่างใน `.env`
