# Database Schema - Minimal Focus Blog

Hệ thống sử dụng **SQLite** làm cơ sở dữ liệu chính, được quản lý qua **Prisma ORM**.

---

## 🏗️ Models

### 👤 AdminUser (Người quản trị)
Lưu thông tin tài khoản đăng nhập vào Dashboard.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `String` | Khóa chính (cuid) |
| `email` | `String` | Email đăng nhập (duy nhất) |
| `passwordHash` | `String` | Mật khẩu đã được mã hóa bằng bcrypt |
| `name` | `String` | Tên hiển thị của admin |
| `createdAt` | `DateTime` | Thời gian tạo tài khoản |

### 💬 Comment (Bình luận)
Lưu trữ các bình luận của người dùng trên bài viết.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `String` | Khóa chính (cuid) |
| `postSlug` | `String` | Đường dẫn (slug) của bài viết |
| `authorName` | `String` | Tên người bình luận |
| `authorEmail` | `String` | Email người bình luận |
| `content` | `String` | Nội dung bình luận |
| `status` | `String` | Trạng thái: `pending`, `approved`, `rejected` |
| `createdAt` | `DateTime` | Thời gian gửi |
| `updatedAt` | `DateTime` | Thời gian cập nhật trạng thái |

### 📊 PageView (Lượt xem)
Ghi nhận dữ liệu truy cập bài viết cho phân tích Dashboard.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `String` | Khóa chính (cuid) |
| `postSlug` | `String` | Slug của bài viết được xem |
| `path` | `String` | URL path thực tế |
| `userAgent` | `String` | Trình duyệt/Thiết bị của khách |
| `referrer` | `String` | Nguồn truy cập |
| `createdAt` | `DateTime` | Thời gian xem |

---

## 📈 Indexes (Tối ưu hóa)
- `Comment`: postSlug, status
- `PageView`: postSlug, createdAt
