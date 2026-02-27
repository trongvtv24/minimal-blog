# Phase 05: Admin Dashboard (admin/)
**Status:** ⬜ Pending
**Phụ thuộc:** Phase 01, 02

## Mục tiêu
Xây dựng toàn bộ phần Admin với 4 trang, giữ nguyên 100% giao diện sidebar + header + content như hiện tại.

---

## 5 trang admin cần xây dựng

| Trang | File | Mô tả |
|-------|------|-------|
| Login | `admin/login.html` | Form đăng nhập bằng Supabase Auth |
| Dashboard | `admin/index.html` | Stat cards + Line/Bar charts (Chart.js) |
| Bài viết | `admin/posts.html` | Bảng liệt kê, xóa, link sang tạo/sửa |
| Tạo/Sửa | `admin/edit-post.html` | Form nhập liệu, Textarea MDX editor |
| Bình luận | `admin/comments.html` | Tabs lọc, Duyệt/Từ chối/Xóa |

---

## Admin Layout Shared JS (`js/admin-layout.js`)

Thay thế React components bằng một hàm JS render sidebar và header:

```javascript
// js/admin-layout.js
import { supabase } from './supabase.js'
import { signOut } from './auth.js'

export function mountAdminLayout(activePage) {
  const links = [
    { href: '/admin/index.html', label: 'Dashboard', id: 'dashboard', icon: '▣' },
    { href: '/admin/posts.html', label: 'Bài viết', id: 'posts', icon: '≡' },
    { href: '/admin/comments.html', label: 'Bình luận', id: 'comments', icon: '◻' },
  ]
  
  document.getElementById('admin-layout').innerHTML = `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-sidebar__header">
          <a href="/admin/index.html" class="admin-sidebar__logo">✔ Minimal Focus</a>
        </div>
        <nav class="admin-sidebar__nav">
          ${links.map(l => `
            <a href="${l.href}" class="admin-sidebar__link ${activePage === l.id ? 'active' : ''}">
              ${l.icon} ${l.label}
            </a>
          `).join('')}
        </nav>
        <div class="admin-sidebar__footer">
          <a href="/" target="_blank" class="admin-sidebar__link">↗ Xem Blog</a>
          <button onclick="handleSignOut()" class="admin-sidebar__logout">⇥ Đăng xuất</button>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
          <div class="admin-header__user">
            <span class="admin-header__avatar">A</span>
            <span class="admin-header__name">Admin</span>
          </div>
        </header>
        <div class="admin-content" id="admin-page-content"></div>
      </main>
    </div>
  `
}

window.handleSignOut = async () => { await signOut() }
```

---

## Admin Dashboard (`admin/index.html`) — Charts với Chart.js

```javascript
// Stat cards API calls
const [views, posts, pendingComments, totalComments] = await Promise.all([
  supabase.from('page_views').select('*', { count: 'exact', head: true }),
  supabase.from('posts').select('*', { count: 'exact', head: true }),
  supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  supabase.from('comments').select('*', { count: 'exact', head: true }),
])

// Lượt xem 30 ngày — dùng Chart.js
const { data: viewsByDay } = await supabase
  .rpc('get_daily_views', { days: 30 }) // Cần tạo Supabase RPC function
```

**Supabase RPC function cần tạo (SQL Editor):**
```sql
CREATE OR REPLACE FUNCTION get_daily_views(days INT DEFAULT 30)
RETURNS TABLE(date DATE, views BIGINT) AS $$
  SELECT DATE(created_at), COUNT(*) as views
  FROM page_views
  WHERE created_at >= NOW() - (days || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
$$ LANGUAGE SQL SECURITY DEFINER;
```

---

## Admin Posts (`admin/posts.html`)
- Load bài từ `posts` table (kể cả draft=true)
- JOIN với `page_views` để tính views
- Nút **Xóa**: `supabase.from('posts').delete().eq('id', post.id)`
- Nút **Sửa**: Redirect sang `edit-post.html?id=...`

## Admin Edit Post (`admin/edit-post.html`)
- Nếu có `?id=...` trên URL → Load dữ liệu lên form (Edit mode)
- Nếu không có → Form trống (Create mode)
- Nút **Đăng bài**: `supabase.from('posts').upsert({...})`

## Admin Comments (`admin/comments.html`)
- Filter tabs: `status = pending | approved | rejected`
- Duyệt: `supabase.from('comments').update({ status: 'approved' }).eq('id', id)`
- Xóa: `supabase.from('comments').delete().eq('id', id)`

---

## Test Criteria
- [ ] Vào `/admin/login.html` → Đăng nhập thành công bằng Supabase Auth
- [ ] Chưa đăng nhập vào `/admin/index.html` → Bị redirect về login
- [ ] Dashboard hiển thị 4 stat cards + biểu đồ Chart.js
- [ ] Tạo mới một bài viết → Hiển thị trên `index.html`
- [ ] Duyệt một bình luận → Hiển thị trên `post.html`
- [ ] Xóa bài viết → Biến mất khỏi danh sách

---

Bước tiếp theo: [Phase 06 - Data Seeding & Polish](./phase-06-polish.md)
