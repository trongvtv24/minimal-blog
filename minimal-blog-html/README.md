# minimal-blog-html

Phiên bản HTML thuần + Supabase của **Minimal Focus Blog**.
(100% giao diện giống bản Next.js, không cần server)

## 📦 Cấu trúc thư mục

```
minimal-blog-html/
├── index.html          ← Trang chủ danh sách bài viết
├── post.html           ← Trang đọc bài viết
├── about.html          ← Trang giới thiệu (tạo thêm nếu cần)
├── style.css           ← CSS (copy từ globals.css của Next.js)
├── js/
│   ├── supabase.js     ← Supabase client (cần điền URL + key)
│   ├── auth.js         ← Auth helper (requireAdmin, signOut)
│   ├── layout.js       ← Header/Footer chung
│   ├── posts.js        ← Logic trang chủ
│   └── post.js         ← Logic trang bài viết
├── admin/
│   ├── login.html      ← Đăng nhập admin
│   ├── index.html      ← Dashboard (stat cards + Charts.js)
│   ├── posts.html      ← Quản lý bài viết
│   ├── edit-post.html  ← Tạo/sửa bài viết
│   └── comments.html   ← Quản lý bình luận
└── scripts/
    ├── supabase-setup.sql  ← SQL tạo bảng + RLS policies
    └── migrate-mdx.mjs     ← Script migrate bài từ MDX → Supabase
```

## 🚀 Bắt đầu

### Bước 1: Cài đặt Supabase
1. Vào [supabase.com](https://supabase.com) → Tạo project mới
2. Vào **SQL Editor** → Chạy toàn bộ file `scripts/supabase-setup.sql`
3. Vào **Authentication → Users** → Tạo tài khoản admin

### Bước 2: Cấu hình
Mở file `js/supabase.js` và điền thông tin:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'
```
Lấy từ: Supabase Dashboard → Project Settings → API

### Bước 3: Migrate bài viết (1 lần duy nhất)
```bash
# Điền SUPABASE_URL và SERVICE_ROLE_KEY vào scripts/migrate-mdx.mjs trước
node scripts/migrate-mdx.mjs
```

### Bước 4: Chạy local để test
```bash
# Cài Live Server extension trong VS Code
# Hoặc dùng Python:
python -m http.server 8080
# Mở trình duyệt: http://localhost:8080
```

## 🌐 Deploy
Upload toàn bộ thư mục này lên:
- **Cloudflare Pages** (Khuyến nghị — miễn phí, CDN toàn cầu)
- **GitHub Pages**
- **Netlify**

Không cần server, không cần Node.js!

## 🔐 Đăng nhập Admin
- URL: `/admin/login.html`
- Dùng email/password đã tạo trên Supabase Authentication
