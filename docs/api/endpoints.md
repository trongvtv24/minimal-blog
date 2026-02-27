# API Documentation - Minimal Focus Blog

Cập nhật lần cuối: 27/02/2026
Base URL: `http://localhost:3000/api`

---

## 🔐 Authentication (NextAuth.js)

Hệ thống sử dụng NextAuth.js với Credentials Provider cho Admin. Các route bảo mật yêu cầu session từ cookie.

---

## 📝 Blog Posts (Admin)

### GET `/api/admin/posts`
Lấy danh sách tất cả bài viết (bao gồm bản nháp) kèm theo lượt xem.
- **Yêu cầu**: Login Admin
- **Response (200)**: `Array<{ title, slug, date, excerpt, tags, draft, views, readingTime }>`

### POST `/api/admin/posts`
Tạo bải viết mới (ghi file MDX).
- **Yêu cầu**: Login Admin
- **Request Body**: `{ title, slug, excerpt, tags: string[], content, draft: boolean, coverImage? }`
- **Response (201)**: `{ message: "Post created", slug }`

### PUT `/api/admin/posts/[slug]`
Cập nhật bài viết hiện có.
- **Yêu cầu**: Login Admin
- **Request Body**: `{ title, excerpt, tags: string[], content, draft: boolean, coverImage? }`

### DELETE `/api/admin/posts/[slug]`
Xóa bài viết (xóa file MDX).
- **Yêu cầu**: Login Admin

---

## 💬 Comments

### GET `/api/comments?slug=[post-slug]`
Lấy danh sách bình luận đã được duyệt cho một bài viết.
- **Response (200)**: `Array<{ id, authorName, content, createdAt }>`

### POST `/api/comments`
Gửi bình luận mới (trạng thái mặc định là `pending`).
- **Request Body**: `{ postSlug, authorName, authorEmail, content }`
- **Response (201)**: `{ message: "Comment submitted", id }`

### GET `/api/admin/comments?status=[pending|approved|rejected]`
Lấy tất cả bình luận theo trạng thái (cho Dashboard).
- **Yêu cầu**: Login Admin

### PATCH `/api/comments/[id]`
Cập nhật trạng thái bình luận (Duyệt/Từ chối).
- **Yêu cầu**: Login Admin
- **Request Body**: `{ status: "approved" | "rejected" }`

### DELETE `/api/comments/[id]`
Xóa bình luận vĩnh viễn.
- **Yêu cầu**: Login Admin

---

## 📊 Analytics

### POST `/api/analytics/track`
Ghi nhận một lượt xem bài viết.
- **Request Body**: `{ slug }`

### GET `/api/analytics/stats`
Lấy dữ liệu thống kê cho Dashboard (views, trends, top posts).
- **Yêu cầu**: Login Admin
- **Response (200)**: `{ totalViews, viewsToday, viewsByDay: [], topPosts: [], pendingComments, totalComments }`
