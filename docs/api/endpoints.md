# API & Data Access Documentation

Ngày cập nhật: 2026-02-27

Trong kiến trúc mới (HTML + Supabase), hệ thống **KHÔNG CÓ custom API Routes** kiểu truyền thống (`/api/...`).
Thay vào đó, JavaScript trên client giao tiếp trực tiếp với database Supabase thông qua **Supabase JS Client**. Dưới đây là tài liệu hóa các truy vấn được sử dụng thay cho API.

---

## 🔐 Xác thực (Authentication)

### 👉 Đăng nhập Admin
**Hàm sử dụng:** `supabase.auth.signInWithPassword()`
**Thông số truyền vào:** `email`, `password`
**Logic:** Xác thực tài khoản với hệ thống Supabase Auth. Trả về token và gán cookie tự động. Sau khi có token, hệ thống mới cấp quyền truy cập Bypass RLS.

### 👉 Kiểm tra phiên đăng nhập (Session)
**Hàm sử dụng:** `supabase.auth.getSession()`
**Chức năng:** Lấy thông tin user hiện hành. Được đóng gói trong hàm `requireAdmin()` ở file `js/auth.js` để bảo vệ các trang `/admin/*.html`. Chặn người lạ tiếp cận Admin Dashboard.

### 👉 Đăng xuất
**Hàm sử dụng:** `supabase.auth.signOut()`
**Kết quả:** Xóa phiên đăng nhập, redirect về trang `/admin/login.html`.

---

## 📝 Quản lý bài viết (Posts)

### 👉 Lấy bài xuất bản (Cho trang chủ)
```javascript
supabase
  .from('posts')
  .select('id, title, slug, excerpt, content, tags, created_at')
  .eq('draft', false)
  .order('created_at', { ascending: false })
```
- **Chức năng:** Chỉ trả lại những bài đã public. Có tích hợp thanh tìm kiếm JS lọc thẳng trên mảng kết quả bên client-side để tránh server requests bị trùng lặp.

### 👉 Lấy tất cả bài viết kèm lượt xem (Cho trang Admin)
```javascript
// Data
supabase.from('posts').select('id, title, slug, tags, draft, created_at')
// Lấy Views rồi Map tương ứng bằng JS
supabase.from('page_views').select('post_slug')
```

### 👉 Tạo bài đăng mới
```javascript
supabase.from('posts').insert({
  title, slug, content, tags, excerpt, cover_image, draft, created_at
})
```
- **Lưu ý:** `slug` do admin đặt phải là duy nhất (UNIQUE). Nếu trùng, Supabase sẽ bắn lỗi mã `'23505'`, frontend sẽ báo `Slug đã tồn tại`.

### 👉 Cập nhật và Xóa bài viết
- **Cập nhật:** `supabase.from('posts').update({...}).eq('id', postId)`
- **Xóa:** `supabase.from('posts').delete().eq('id', postId)`

---

## 💬 Quản lý bình luận (Comments)

### 👉 Lấy bình luận hiển thị trên bài viết
```javascript
supabase.from('comments')
  .select('author_name, content, created_at')
  .eq('post_slug', slug)
  .eq('status', 'approved')
```
- **Lưu ý:** Supabase RLS Policy chặn đọc file `pending`/`rejected`. Kể cả có cố tình query, RLS cũng trả kết quả rỗng (0 items) bảo mật.

### 👉 Gửi bình luận mới
```javascript
supabase.from('comments').insert({
  post_slug, author_name, author_email, content, status: 'pending'
})
```
- Mọi người dùng vô danh đều có quyền tạo bản ghi (Insert-only Policy).

### 👉 Admin duyệt / xóa bình luận
- **Cập nhật status (Duyệt/Từ chối):** `supabase.from('comments').update({ status }).eq('id', id)`
- **Xóa vĩnh viễn:** `supabase.from('comments').delete().eq('id', id)`

---

## 📈 Tương tác (Analytics - Views)

### 👉 Ghi lại một lượt xem
```javascript
supabase.from('page_views').insert({ post_slug: slug })
```
- **Chức năng:** Chạy ẩn ở `<script>` đáy file `post.html`. Trigger âm thầm mỗi khi bài viết được mở, tăng nhẹ bộ đếm tổng cho bài đó.

### 👉 Lấy thống kê tổng quát (Admin Dashboard)
- Dùng `head: true` với `count: 'exact'` trên Supabase JS Client thay vì gửi query tải data nặng về. Phục vụ đếm tổng trên Stat Cards một cách tiết kiệm nhất.
- Ví dụ lấy đếm view trong ngày hiện đại:
```javascript
supabase.from('page_views')
  .select('*', { count: 'exact', head: true })
  .gte('created_at', new Date().toISOString().split('T')[0])
```

### 👉 Lấy dữ liệu cho Chart.js
```javascript
supabase.rpc('get_daily_views', { days: 30 })
```
- Gọi Postgres Function `get_daily_views()` để gom nhóm Views theo ngày từ Database, giảm tải việc lấy nghìn bản ghi về Frontend để for loop ra mảng dữ liệu.
