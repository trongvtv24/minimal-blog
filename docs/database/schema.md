# Database Schema

Ngày cập nhật: 2026-02-27

---

## 1. posts (Bảng bài viết)

Lưu trữ thông tin các bài viết trên blog.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của bài viết |
| `title` | TEXT | NOT NULL | Tiêu đề bài viết |
| `slug` | TEXT | UNIQUE, NOT NULL | URL thân thiện của bài viết |
| `excerpt` | TEXT | DEFAULT '' | Mô tả ngắn gọn |
| `content` | TEXT | NOT NULL | Nội dung bài viết (định dạng Markdown) |
| `cover_image` | TEXT | NULL | URL ảnh bìa minh họa |
| `tags` | TEXT[] | DEFAULT '{}' | Mảng các thẻ phân loại |
| `draft` | BOOLEAN | DEFAULT false | Trạng thái: nháp (true) / đã xuất bản (false) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian tạo |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian cập nhật gần nhất |

**Indexes:**
- `idx_posts_slug` trên cột `slug`
- `idx_posts_draft` trên cột `draft`

---

## 2. comments (Bảng bình luận)

Lưu trữ bình luận của độc giả.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của bình luận |
| `post_slug` | TEXT | NOT NULL | Slug của bài viết mà bình luận này thuộc về |
| `author_name` | TEXT | NOT NULL | Tên người bình luận |
| `author_email` | TEXT | NOT NULL | Email người bình luận |
| `content` | TEXT | NOT NULL | Nội dung bình luận |
| `status` | TEXT | DEFAULT 'pending', CHECK IN ('pending', 'approved', 'rejected') | Trạng thái kiểm duyệt |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Thời gian gửi bình luận |

**Indexes:**
- `idx_comments_post_slug` trên cột `post_slug`
- `idx_comments_status` trên cột `status`

---

## 3. page_views (Bảng Tracking Analytics)

Lưu trữ lịch sử truy cập của từng bài viết (1 bản ghi = 1 lượt xem).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID duy nhất của lượt truy cập |
| `post_slug` | TEXT | NOT NULL | Slug của bài viết được xem |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Thời điểm ghi nhận lượt truy cập |

**Indexes:**
- `idx_page_views_post_slug` trên cột `post_slug`
- `idx_page_views_created_at` trên cột `created_at`

---

## Supabase Row Level Security (RLS) Policies

Hệ thống sử dụng RLS thay thế cho backend API server. Quyền truy cập dữ liệu được quản lý ở tầng Database.

| Bảng | Hành động | Ai có quyền? | Policy Name |
|---|---|---|---|
| **posts** | Đọc | Người dùng khách (chỉ đọc bài `draft = false`) | `Public read published posts` |
| | Đọc, Sửa, Xóa | Admin (Đã đăng nhập) | `Admin read all posts`, `Admin modify posts` |
| **comments** | Đọc | Người dùng khách (chỉ đọc bài `status = 'approved'`) | `Public read approved comments` |
| | Thêm mới | Mọi người (thành trạng thái `pending`) | `Anyone can submit comments` |
| | Đọc, Sửa, Xóa | Admin (Đã đăng nhập) | `Admin manage comments` |
| **page_views** | Thêm mới | Mọi người (mỗi lần truy cập load post.js) | `Anyone can track views` |
| | Đọc, Sửa, Xóa | Admin (Đã đăng nhập) | `Admin read views` |

## PostgreSQL RPC Functions
- `get_daily_views(days)`: Hàm thống kê (Group By Date) lấy tổng lượt xem mỗi ngày trong N ngày gần nhất, trả về mảng { date, views } cho Chart.js.
