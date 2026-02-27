# 💡 BRIEF: Minimal Focus (HTML + Supabase Version)

**Ngày tạo:** 27/02/2026
**Brainstorm cùng:** Anh Trọng

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Phiên bản Next.js hiện hành chạy tốt nhưng đòi hỏi môi trường Node.js. Nếu muốn host lên những nơi 100% miễn phí và miễn bảo trì server (như GitHub Pages, Cloudflare Pages), một phiên bản website tĩnh (Static Website) là lựa chọn tối ưu.

## 2. GIẢI PHÁP ĐỀ XUẤT
Chuyển đổi dự án từ **Next.js + SQLite** sang **HTML/CSS/JS thuần + Supabase**.
- Frontend: `index.html`, `post.html`, `admin.html` (chạy tĩnh trên trình duyệt).
- CSS: Tái sử dụng `globals.css` hiện tại (Giữ nguyên 100% giao diện đẹp mắt).
- Backend (BaaS): **Supabase** (PostgreSQL) để lưu bài viết, bình luận, lượt xem. Supabase cung cấp API sẵn cho Javascript.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- **Primary:** Người dùng đọc blog (trải nghiệm web tải siêu tốc).
- **Secondary:** Admin (Quản trị viên) - Anh Trọng.

## 4. TÍNH NĂNG (Tiêu chuẩn MVP 100% như cũ)

### 🚀 Public Blog:
- Danh sách bài viết.
- Trang chi tiết bài viết (với nội dung Markdown).
- Form bình luận native (lưu vào Supabase).

### ⚙️ Admin Dashboard:
- Đăng nhập bảo mật (Supabase Auth).
- 4 Thẻ thống kê (Views, Posts, Comments).
- Biểu đồ line/bar charts.
- Danh sách quản trị bài viết (CRUD thẳng vào Supabase table).
- Quản lý duyệt bình luận.

### 📊 Hệ thống ẩn:
- Tracking Page Views mỗi khi có khách vào xem bài.

## 5. ĐIỂM KHÁC BIỆT KỸ THUẬT QUAN TRỌNG
1. **Không còn file `.mdx` local**: Bản mới toàn bộ nội dung bài viết sẽ được lưu dưới dạng chuỗi (string) trong database của Supabase.
2. **Javascript Fetch**: Frontend sẽ dùng `supabase-js` để gọi lên database lấy dữ liệu thay vì SSR (Server-Side Rendering).

## 6. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** Trung bình. (Thiết kế DB trên Supabase rất nhanh, thay đổi lớn nhất là viết lại API fetch bằng JS thuần trên HTML thay vì Server Components).

## 7. BƯỚC TIẾP THEO
→ Chạy `/plan` để lên thiết kế thư mục chi tiết và cấu trúc database trên Supabase.
