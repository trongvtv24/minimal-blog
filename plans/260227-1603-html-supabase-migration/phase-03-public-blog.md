# Phase 03: Public Blog (index.html)
**Status:** ⬜ Pending
**Phụ thuộc:** Phase 01, 02

## Mục tiêu
Xây dựng trang chủ `index.html` hiển thị danh sách bài viết, có tìm kiếm, giống y hệt giao diện Next.js cũ.

---

## Cấu trúc HTML cơ bản `index.html`

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Minimal Focus — Blog tối giản, tập trung nội dung</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="header"></div>

  <main class="home-container" id="main-content">
    <section class="home-hero">
      <h1>Bài viết</h1>
      <p>Chia sẻ kiến thức về thiết kế web, frontend và trải nghiệm người dùng.</p>
    </section>
    
    <div class="search-bar-wrapper">
      <input id="searchInput" type="search" placeholder="Tìm kiếm bài viết..." class="search-input" />
    </div>

    <div id="posts-grid" class="posts-grid">
      <p>Đang tải bài viết...</p>
    </div>
    
    <p id="no-results" class="no-results" style="display:none">Không tìm thấy bài viết nào.</p>
  </main>

  <div id="footer"></div>

  <script type="module">
    import { mountLayout } from './js/layout.js'
    import { supabase } from './js/supabase.js'
    import { loadPosts } from './js/posts.js'

    mountLayout()
    loadPosts()
  </script>
</body>
</html>
```

---

## JavaScript: `js/posts.js`

```javascript
// js/posts.js
import { supabase } from './supabase.js'

// Render một blog card
function renderCard(post) {
  const tags = (post.tags || []).map(t => `<span class="tag">${t}</span>`).join('')
  return `
    <article class="blog-card">
      <a href="/post.html?slug=${post.slug}" class="blog-card__link">
        <span class="blog-card__meta">${formatDate(post.created_at)} · ${readingTime(post.content)} min read</span>
        <h2 class="blog-card__title">${post.title}</h2>
        <p class="blog-card__excerpt">${post.excerpt || ''}</p>
        <div class="blog-card__tags">${tags}</div>
        <span class="blog-card__readmore">Đọc tiếp →</span>
      </a>
    </article>
  `
}

let allPosts = []

// Load bài viết từ Supabase
export async function loadPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, content, tags, created_at')
    .eq('draft', false)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return }
  
  allPosts = posts
  renderGrid(posts)

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase()
    const filtered = allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.excerpt || '').toLowerCase().includes(q)
    )
    renderGrid(filtered)
  })
}

function renderGrid(posts) {
  const grid = document.getElementById('posts-grid')
  const noResults = document.getElementById('no-results')
  if (posts.length === 0) {
    grid.innerHTML = ''
    noResults.style.display = 'block'
  } else {
    noResults.style.display = 'none'
    grid.innerHTML = posts.map(renderCard).join('')
  }
}

// Helpers
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function readingTime(content = '') {
  return Math.max(1, Math.ceil(content.split(' ').length / 200))
}
```

---

## Test Criteria
- [ ] Mở `index.html` → Danh sách bài viết load từ Supabase
- [ ] Giao diện giống y hệt Next.js (Header, Footer, Blog Cards, Tags)
- [ ] Tìm kiếm hoạt động, lọc bài viết theo tên/mô tả
- [ ] Bấm "Đọc tiếp" chuyển sang `post.html?slug=...` đúng

---

Bước tiếp theo: [Phase 04 - Blog Post Detail](./phase-04-post-detail.md)
