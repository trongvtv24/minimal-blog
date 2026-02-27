# Phase 02: Shared Assets & CSS
**Status:** ⬜ Pending
**Phụ thuộc:** Phase 01 phải hoàn thành trước

## Mục tiêu
Chuẩn bị các file dùng chung cho toàn bộ trang web:
- CSS (copy từ Next.js, chỉnh nhỏ cho HTML thuần)
- JS Auth helper (kiểm tra đăng nhập admin)
- Header/Footer dưới dạng JS component đơn giản

---

## Bước 1: Copy & điều chỉnh CSS

Lấy toàn bộ file `src/app/globals.css` từ project Next.js cũ và lưu vào `style.css`.

**Các điều chỉnh nhỏ cần thực hiện:**
- [ ] Xóa bỏ các directive của Tailwind CSS (`@tailwind base;`, `@import "tailwindcss"`, v.v.) ở đầu file
- [ ] Giữ nguyên toàn bộ phần còn lại (CSS variables, layout, component styles...)

---

## Bước 2: Tạo Auth Helper (`js/auth.js`)

```javascript
// js/auth.js
import { supabase } from './supabase.js'

// Lấy thông tin session hiện tại
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Bảo vệ trang admin — Gọi hàm này ở đầu mỗi file admin/*.html
// Nếu chưa đăng nhập sẽ tự redirect về /admin/login.html
export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    window.location.href = '/admin/login.html'
    return null
  }
  return session
}

// Đăng xuất
export async function signOut() {
  await supabase.auth.signOut()
  window.location.href = '/admin/login.html'
}
```

---

## Bước 3: Tạo Header/Footer dùng chung (`js/layout.js`)

```javascript
// js/layout.js
// Inject Header và Footer vào trang blog public
// Admin có layout riêng (sidebar), không dùng file này
export function renderHeader() {
  return `
    <header class="site-header">
      <a href="/index.html" class="site-header__logo">Minimal Focus</a>
      <nav class="site-header__nav">
        <a href="/index.html">Bài viết</a>
        <a href="/about.html">Giới thiệu</a>
      </nav>
    </header>
  `
}

export function renderFooter() {
  return `
    <footer class="site-footer">
      <p>© 2026 Minimal Focus</p>
    </footer>
  `
}

export function mountLayout() {
  const headerEl = document.getElementById('header')
  const footerEl = document.getElementById('footer')
  if (headerEl) headerEl.innerHTML = renderHeader()
  if (footerEl) footerEl.innerHTML = renderFooter()
}
```

---

## Bước 4: Tải thư viện ngoài
Các thư viện sử dụng qua CDN (không cần cài npm):
- **Supabase JS:** `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm`
- **Marked.js** (Render Markdown): `https://cdn.jsdelivr.net/npm/marked/marked.min.js`
- **Chart.js** (Biểu đồ): `https://cdn.jsdelivr.net/npm/chart.js`
- **Inter Font:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`

---

## Test Criteria
- [ ] `style.css` load được, giao diện hiển thị đúng màu sắc, font
- [ ] `js/auth.js`: Hàm `requireAdmin()` redirect đúng khi chưa login
- [ ] `js/layout.js`: Header/Footer render đúng trên trang blog
- [ ] Không có lỗi nào trong Console tab của trình duyệt

---

Bước tiếp theo: [Phase 03 - Public Blog](./phase-03-public-blog.md)
