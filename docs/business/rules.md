# Business Rules - Minimal Focus Blog

Tài liệu này ghi lại các quy tắc nghiệp vụ và logic quan trọng của hệ thống.

---

## 🔐 Quyền truy cập (Access Control)
- **Admin**: Có toàn quyền CRUD (Tạo, Đọc, Sửa, Xóa) bài viết và bình luận. Chỉ Admin mới có quyền truy cập vào route `/admin/*` và các API `/api/admin/*`.
- **User (Khách)**: Chỉ có quyền xem bài viết đã đăng (không xem được bản nháp) và gửi bình luận.

---

## 📝 Quy tắc Bài viết (Post Rules)
- **Slug**: Phải là duy nhất, không trùng lặp và định dạng URL-friendly.
- **Draft Mode**: Các bài viết có `draft: true` sẽ không hiển thị trên trang chủ và danh sách blog công khai.
- **Reading Time**: Tự động tính toán dựa trên nội dung bài viết khi Admin xem danh sách bài viết.

---

## 💬 Quy tắc Bình luận (Comment Rules)
- **Kiểm duyệt (Moderation)**: Mọi bình luận mới gửi lên sẽ có trạng thái `pending`. Bình luận chỉ hiển thị trên bài viết sau khi Admin chuyển trạng thái sang `approved`.
- **Email**: Khách phải nhập email hợp lệ khi bình luận, nhưng email này sẽ không được hiển thị công khai để bảo vệ quyền riêng tư.
- **Avatar**: Ảnh đại diện của khách được tạo tự động dựa trên chữ cái đầu của tên và một bảng màu ngẫu nhiên (Lưu trong memory/CSS, không lưu image file).

---

## 📊 Quy tắc Analytics
- **Page Views**: Ghi nhận mỗi khi trang bài viết được tải hoàn tất. 
- **Privacy**: Không lưu trữ các thông tin định danh cá nhân nhạy cảm (PII), chỉ lưu User-Agent và Referrer cơ bản.
