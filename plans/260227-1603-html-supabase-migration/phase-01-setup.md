# Phase 01: Supabase Setup & Project Structure
**Status:** ⬜ Pending
**Ước tính:** 1 session

## Mục tiêu
Chuẩn bị toàn bộ "nền móng" trước khi code:
1. Tạo project folder mới (hoàn toàn tách biệt với Next.js cũ).
2. Tạo database và bảng trên Supabase.
3. Cấu hình xác thực Admin.

---

## Bước 1: Tạo cấu trúc thư mục

```
minimal-blog-html/
├── index.html          ← Trang chủ (Danh sách bài viết)
├── post.html           ← Trang đọc bài viết
├── style.css           ← CSS (copy từ globals.css, xóa tiền tố var(--) nếu cần)
├── js/
│   ├── supabase.js     ← Khởi tạo Supabase client (singleton)
│   ├── auth.js         ← Helper: kiểm tra đăng nhập admin
│   └── marked.min.js   ← Thư viện render Markdown
├── admin/
│   ├── index.html      ← Dashboard (Thống kê + Biểu đồ)
│   ├── login.html      ← Trang đăng nhập Admin
│   ├── posts.html      ← Quản lý bài viết
│   └── comments.html   ← Quản lý bình luận
└── assets/
    └── favicon.ico
```

**Tasks:**
- [ ] Tạo thư mục `minimal-blog-html/` ở ngoài thư mục Next.js cũ
- [ ] Tạo toàn bộ cấu trúc file trống như trên

---

## Bước 2: Cài đặt Supabase

### 2.1. Tạo tài khoản và Project trên Supabase
1. Anh vào **[supabase.com](https://supabase.com)** → Đăng nhập bằng GitHub.
2. Tạo một Project mới:
   - **Name:** `minimal-focus-blog`
   - **Region:** Southeast Asia (Singapore) — gần Việt Nam nhất
   - **Database Password:** Đặt mật khẩu mạnh (lưu lại!)
3. Sau khi tạo xong (~2 phút), vào **Project Settings → API** để lấy:
   - `Project URL` (dạng `https://xxxx.supabase.co`)
   - `anon key` (public key, an toàn để dùng trên frontend)

### 2.2. Tạo bảng Database (SQL)
Vào **SQL Editor** trong Supabase và chạy script tạo bảng sau:

```sql
-- Bảng bài viết
CREATE TABLE posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT,
  content     TEXT NOT NULL,         -- Nội dung Markdown
  cover_image TEXT,
  tags        TEXT[] DEFAULT '{}',
  draft       BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Bảng bình luận
CREATE TABLE comments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug    TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content      TEXT NOT NULL,
  status       TEXT DEFAULT 'pending', -- pending | approved | rejected
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Bảng lượt xem
CREATE TABLE page_views (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index để query nhanh hơn
CREATE INDEX ON comments(post_slug);
CREATE INDEX ON comments(status);
CREATE INDEX ON page_views(post_slug);
CREATE INDEX ON page_views(created_at);
```

### 2.3. Cấu hình Row Level Security (RLS) — BẢO MẬT
Chạy tiếp các lệnh này để ai cũng đọc được bài nhưng chỉ admin mới sửa được:

```sql
-- Bật RLS cho tất cả bảng
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- posts: Ai cũng đọc được bài đã đăng, chỉ admin mới tạo/sửa/xóa
CREATE POLICY "Public read posts" ON posts FOR SELECT USING (draft = false);
CREATE POLICY "Admin all posts" ON posts USING (auth.role() = 'authenticated');

-- comments: Ai cũng đọc được comment đã duyệt, ai cũng gửi được
CREATE POLICY "Public read approved comments" ON comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage comments" ON comments USING (auth.role() = 'authenticated');

-- page_views: Ai cũng ghi được (tracking), chỉ admin đọc được
CREATE POLICY "Anyone can track views" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read views" ON page_views FOR SELECT USING (auth.role() = 'authenticated');
```

### 2.4. Tạo tài khoản Admin
Vào **Authentication → Users → Invite user** trong Supabase:
- Email: `admin@minimalfocus.com`
- Sau khi tạo, vào email nhận link xác nhận và đặt mật khẩu mạnh.

---

## Bước 3: Cấu hình Supabase Client (`js/supabase.js`)

```javascript
// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

> ⚠️ **Lưu ý bảo mật:** `anon key` an toàn để để ở code frontend vì Supabase đã cấu hình RLS ở Bước 2 để giới hạn quyền truy cập.

---

## Test Criteria
- [ ] Project folder đã tạo xong với đầy đủ file trống
- [ ] Đăng nhập được vào Supabase dashboard
- [ ] 3 bảng đã tạo thành công (posts, comments, page_views)
- [ ] RLS policies đã được bật
- [ ] Tài khoản admin đã tạo và đăng nhập được

---

Bước tiếp theo: [Phase 02 - Shared Assets & CSS](./phase-02-assets-css.md)
