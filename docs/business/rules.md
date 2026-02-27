# Business Rules

Ngày cập nhật: 2026-02-27

---

## 1. Xác thực và Phân quyền (Access Control)

*   **Public Access:** Ai cũng có quyền truy cập vào trang Blog (`index.html`, `post.html`), đọc bài viết (đã đăng), xem bình luận (đã duyệt), và tự do gửi bình luận hoặc bị tính lượt xem (Page Views) mà không cần đăng nhập.
*   **Admin Access:** Chỉ quản trị viên hợp lệ (đăng nhập qua `/admin/login.html` với thông tin trên Supabase Auth) mới được quyền truy cập vào các trang `/admin/*.html`.
*   **Role-based Policy (RLS):** Bảo mật cấp Database. 
    *   Người lạ bị hệ thống DB từ chối query bài nháp hoặc đọc/sửa/xoá bài viết. 
    *   Mọi API requests cố tình vượt rào qua Supabase URL đều bị trả kết quả lỗi (Forbidden / 0 Rows) do Row Level Security Policy kiểm soát phân quyền (`auth.role() = 'authenticated'`).

## 2. Quản lý Bài viết (Post Rules)

*   **Trạng thái Bài viết:** Có hai trạng thái:
    *   **Bản nháp (Draft):** Có thể lưu trữ tạm thời, chỉ Admin thấy, chưa được hiển thị trên trang chủ và list bài API. (Biến `draft = true`).
    *   **Đã xuất bản (Published):** Công khai trên website cho toàn bộ người dùng đọc (`draft = false`).
*   **Hiển thị:** Các bài viết trên trang chủ (`index.html`) và Widget Top bài viết hiển thị theo trình tự ưu tiên (Order By time/view).
*   **Slug URL (RẤT QUAN TRỌNG):** Slug (ví dụ `bai-viet-moi-nhat`) bắt buộc phải là duy nhất (UNIQUE) trên toàn bộ cơ sở dữ liệu. Nếu slug trùng lặp, bài viết mới sẽ không được thêm vào, DB sẽ bắn lỗi `23505`.

## 3. Hệ thống Bình luận (Comment Rules)

*   **Tạo mới:** Mọi độc giả có thể gửi bình luận trực tiếp ở footer trang bài viết.
*   **Kiểm duyệt mặc định:** Tất cả các bình luận mới khi gửi sẽ tự động gắn trạng thái là **`pending`** (Chờ duyệt). Các bình luận pending sẽ **TUYỆT ĐỐI KHÔNG** hiển thị ra website công khai.
*   **Admin Action:** Admin có thể thay đổi trạng thái của bình luận thành:
    *   **`approved` (Đã duyệt):** Cho phép hiển thị bình luận đó công khai trên bài viết tương ứng.
    *   **`rejected` (Từ chối):** Ẩn vĩnh viễn không duyệt.
*   **Xoá:** Admin có thể xoá vĩnh viễn mọi Comment ra khỏi DB.

## 4. Tương tác và Analytics (Views System)

*   **Page View Tracking:** Cứ mỗi lần một trang bài viết cụ thể `post.html?slug=xyz` được load lên ở phía Client, file `post.js` sẽ tự động insert âm thầm 1 bản ghi vào bảng `page_views`.
*   **Tính tổng lượt xem (View Counts):** Lượt xem hiển thị ở UI Admin được tổng hợp (Count aggregate) Realtime từ Data dựa trên cột `post_slug`.
*   **Timeline Metrics:** Hệ thống DB lưu thời gian xem, hỗ trợ việc lọc biểu đồ `Chart.js` (ví dụ: Views 30 ngày qua). 
