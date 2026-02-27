# Changelog - Minimal Focus Blog

Tất cả các thay đổi quan trọng của dự án sẽ được ghi nhận tại đây.

---

## [2026-02-27] - Admin Dashboard & Native Comments
Hôm nay chúng ta đã thực hiện một bước tiến lớn trong việc quản lý blog.

### 🚀 Added
- **Admin Dashboard**: Giao diện quản trị hoàn chỉnh tại `/admin`.
- **Authentication**: Setup NextAuth.js bảo vệ các route quản trị.
- **Database**: Tích hợp Prisma & SQLite (`dev.db`).
- **Post Management**: Tính năng Tạo, Sửa, Xóa bài viết trực tiếp từ giao diện Admin.
- **Native Comment System**: Hệ thống bình luận nội bộ thay thế Facebook SDK. 
- **Analytics**: Tự động đếm lượt xem bài viết và hiển thị biểu đồ trên Dashboard.
- **Charts**: Sử dụng Recharts để hiển thị xu hướng lượt xem.

### 🔧 Changed
- **Router Structure**: Chuyển các trang public vào route group `(blog)` để tách biệt layout với Admin.
- **Styling**: Cập nhật `globals.css` với hơn 600 dòng CSS cho Admin và hệ thống bình luận.
- **Header/Footer**: Chỉ hiển thị trên các trang blog công khai, ẩn ở trang Admin.

### 📁 Technical Details
- Prisma schema với các bảng: `AdminUser`, `Comment`, `PageView`.
- API routes mới trong `src/app/api/admin/*` và `src/app/api/comments/*`.
- Tích hợp `bcrypt` để bảo mật mật khẩu admin.
