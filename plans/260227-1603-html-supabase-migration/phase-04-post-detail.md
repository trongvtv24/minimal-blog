# Phase 04: Blog Post Detail (post.html)
**Status:** ⬜ Pending
**Phụ thuộc:** Phase 01, 02, 03

## Mục tiêu
Xây dựng trang `post.html` hiển thị nội dung chi tiết một bài viết, bao gồm:
- Nội dung Markdown → render thành HTML đẹp
- Form bình luận Native Comments
- Tự động ghi lượt xem lên Supabase

---

## URL Pattern
Trang này nhận `slug` từ URL query string:
`post.html?slug=nghe-thuat-toi-gian-thiet-ke-web`

---

## JavaScript: `js/post.js`

```javascript
// js/post.js
import { supabase } from './supabase.js'
import { mountLayout } from './layout.js'

const slug = new URLSearchParams(window.location.search).get('slug')

export async function loadPost() {
  mountLayout()

  if (!slug) { document.title = 'Không tìm thấy bài viết'; return }

  // Load bài viết
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('draft', false)
    .single()

  if (!post) {
    document.getElementById('post-content').innerHTML = '<p>Không tìm thấy bài viết.</p>'
    return
  }

  // Cập nhật nội dung trang
  document.title = `${post.title} — Minimal Focus`
  document.getElementById('post-title').textContent = post.title
  document.getElementById('post-date').textContent = new Date(post.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })

  // Render Markdown → HTML
  // Cần load marked.js TRƯỚC khi gọi hàm này
  document.getElementById('post-body').innerHTML = marked.parse(post.content || '')

  // Track lượt xem (chạy ngầm)
  trackPageView(slug)

  // Load bình luận
  loadComments(slug)
}

async function trackPageView(slug) {
  await supabase.from('page_views').insert({ post_slug: slug })
}

async function loadComments(slug) {
  const { data: comments } = await supabase
    .from('comments')
    .select('author_name, content, created_at')
    .eq('post_slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true })

  const list = document.getElementById('comments-list')
  if (!comments || comments.length === 0) {
    list.innerHTML = '<p class="comment-section__empty">Chưa có bình luận nào.</p>'
    return
  }

  const avatarColors = ['#0f766e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']
  list.innerHTML = comments.map(c => {
    const initial = c.author_name.charAt(0).toUpperCase()
    const color = avatarColors[initial.charCodeAt(0) % avatarColors.length]
    return `
      <div class="comment-item">
        <div class="comment-item__avatar" style="background:${color}">${initial}</div>
        <div class="comment-item__body">
          <div class="comment-item__header">
            <span class="comment-item__name">${c.author_name}</span>
            <span class="comment-item__date">${new Date(c.created_at).toLocaleDateString('vi-VN')}</span>
          </div>
          <p class="comment-item__text">${c.content}</p>
        </div>
      </div>
    `
  }).join('')
}

// Gửi bình luận
export async function submitComment(e) {
  e.preventDefault()
  const form = e.target
  const btn = form.querySelector('button[type="submit"]')
  btn.disabled = true
  btn.textContent = 'Đang gửi...'

  const { error } = await supabase.from('comments').insert({
    post_slug: slug,
    author_name: form.authorName.value.trim(),
    author_email: form.authorEmail.value.trim(),
    content: form.content.value.trim(),
    status: 'pending'
  })

  if (!error) {
    document.getElementById('comment-form-wrapper').innerHTML = `
      <div class="comment-section__success">
        <p class="comment-section__success-title">✅ Bình luận của bạn đã được gửi!</p>
        <p class="comment-section__success-text">Vui lòng chờ quản trị viên duyệt.</p>
      </div>
    `
  } else {
    btn.disabled = false
    btn.textContent = 'Gửi bình luận'
    alert('Lỗi khi gửi bình luận, vui lòng thử lại.')
  }
}
```

---

## Cấu trúc HTML `post.html`

```html
<main id="main-content" class="post-container">
  <article class="post-article">
    <header class="post-header">
      <h1 id="post-title"></h1>
      <span id="post-date" class="post-meta"></span>
    </header>
    <div id="post-body" class="prose"></div>
  </article>

  <!-- Share Button -->
  <div class="share-section">
    <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href))" class="share-btn">
      Chia sẻ lên Facebook
    </button>
  </div>

  <!-- Comments -->
  <section class="comment-section">
    <h2>Bình luận</h2>
    
    <div id="comment-form-wrapper">
      <form id="commentForm" class="comment-section__form">
        <input name="authorName" placeholder="Tên của bạn *" required />
        <input name="authorEmail" type="email" placeholder="Email *" required />
        <textarea name="content" rows="4" placeholder="Nội dung bình luận..." required></textarea>
        <button type="submit" class="comment-section__submit">Gửi bình luận</button>
      </form>
    </div>

    <div id="comments-list" class="comment-section__list"></div>
  </section>
</main>
```

---

## Test Criteria
- [ ] Truy cập `post.html?slug=...` → Bài viết hiển thị đúng
- [ ] Markdown render thành HTML đẹp (heading, code, list, v.v.)
- [ ] Lượt xem được ghi vào Supabase sau khi tải trang
- [ ] Form bình luận gửi thành công → Hiện thông báo chờ duyệt
- [ ] Bình luận đã duyệt hiển thị đúng thứ tự

---

Bước tiếp theo: [Phase 05 - Admin Dashboard](./phase-05-admin.md)
