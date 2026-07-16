# QRify

Ứng dụng web tạo mã QR tùy chỉnh, đăng nhập bằng Google (NextAuth).

## Tính năng

- **Đăng nhập Google** — Auth.js / NextAuth v5, trang `/login`
- **Dashboard bảo vệ** — middleware proxy chặn truy cập khi chưa đăng nhập
- **Tạo mã QR từ URL** — chuẩn hóa `http`/`https`, báo lỗi URL không hợp lệ
- **Tùy chỉnh** — 6 kiểu chấm (vuông, chấm tròn, bo góc, classy, …) và màu sắc
- **Tải xuống PNG** — kích thước 250×250 hoặc 500×500 px
- **Menu tài khoản** — avatar Google, thông tin user, đăng xuất

## Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| UI | Tailwind CSS 4 |
| Auth | NextAuth v5 (Google OAuth) |
| QR | `qr-code-styling` |
| Database (chuẩn bị) | MongoDB / Mongoose |

## Cấu trúc chính

```
app/
  page.tsx                 # Redirect theo session → /dashboard hoặc /login
  login/page.tsx           # Đăng nhập Google
  dashboard/               # Trình tạo QR (yêu cầu đăng nhập)
  api/auth/[...nextauth]/ # Auth API route
  actions/auth.ts          # Server action đăng xuất
auth.ts                    # Cấu hình NextAuth
proxy.ts                   # Bảo vệ route /dashboard
components/
  qr-generator.tsx         # Form tạo & tải QR
  options-dropdown.tsx     # Menu tài khoản
  sign-out-button.tsx
lib/db.ts                  # Kết nối MongoDB (chuẩn bị dùng)
```

## Bắt đầu

### 1. Cài đặt

```bash
npm install
```

### 2. Biến môi trường

Sao chép `.env.example` thành `.env.local` và điền giá trị:

```env
AUTH_SECRET=          # openssl rand -base64 32
AUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=       # Google Cloud OAuth Client ID
AUTH_GOOGLE_SECRET=   # Google Cloud OAuth Client Secret
# MONGODB_URI=        # (tuỳ chọn) khi dùng lưu trữ MongoDB
```

Tạo OAuth Client tại [Google Cloud Console](https://console.cloud.google.com/apis/credentials).  
Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 3. Chạy dev

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Scripts khác

```bash
npm run build   # build production
npm start       # chạy bản build
npm run lint    # ESLint
```

## Luồng người dùng

1. Vào trang chủ → chuyển tới `/login` nếu chưa đăng nhập
2. Đăng nhập bằng Google → vào `/dashboard`
3. Nhập URL, chọn kiểu & màu → tạo mã QR
4. Xem preview và tải PNG theo kích thước mong muốn
5. Đăng xuất từ menu avatar

## Ghi chú phát triển

- Ảnh avatar Google được phép qua `images.domains` trong `next.config.ts`
- `lib/db.ts` đã có sẵn helper kết nối MongoDB; auth hiện chỉ dùng Google provider (chưa gắn adapter)
- File `.env*` bị ignore; chỉ commit `.env.example`
