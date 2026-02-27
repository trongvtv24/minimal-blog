// js/post.js
// Logic cho trang chi tiết bài viết: render Markdown, comments, page views

import { supabase } from './supabase.js'
import { mountLayout } from './layout.js'

const slug = new URLSearchParams(window.location.search).get('slug')

const AVATAR_COLORS = ['#0f766e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981']

function getAvatarColor(name) {
    const code = name.charCodeAt(0) || 0
    return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
}

function readingTime(content = '') {
    return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))
}

/**
 * Ghi nhận lượt xem bài viết (chạy ngầm)
 */
async function trackPageView(slug) {
    try {
        await supabase.from('page_views').insert({ post_slug: slug })
    } catch (e) {
        // Lỗi tracking không ảnh hưởng UX
    }
}

/**
 * Load và hiển thị các bình luận đã được duyệt
 */
async function loadComments(slug) {
    const { data: comments, error } = await supabase
        .from('comments')
        .select('author_name, content, created_at')
        .eq('post_slug', slug)
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

    const list = document.getElementById('comments-list')
    const countEl = document.getElementById('comments-count')

    if (!comments || comments.length === 0) {
        list.innerHTML = '<p class="comment-section__empty">Chưa có bình luận nào. Hãy là người đầu tiên!</p>'
        if (countEl) countEl.textContent = '0'
        return
    }

    if (countEl) countEl.textContent = comments.length

    list.innerHTML = comments.map(c => {
        const initial = c.author_name.charAt(0).toUpperCase()
        const color = getAvatarColor(c.author_name)
        return `
      <div class="comment-item">
        <div class="comment-item__avatar" style="background:${color}">${initial}</div>
        <div class="comment-item__body">
          <div class="comment-item__header">
            <span class="comment-item__name">${escapeHtml(c.author_name)}</span>
            <span class="comment-item__date">${formatDate(c.created_at)}</span>
          </div>
          <p class="comment-item__text">${escapeHtml(c.content)}</p>
        </div>
      </div>
    `
    }).join('')
}

/**
 * Escape HTML để chống XSS
 */
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

/**
 * Gửi bình luận mới
 */
export async function submitComment(e) {
    e.preventDefault()
    const form = e.target
    const btn = form.querySelector('button[type="submit"]')
    const originalText = btn.textContent

    // Validation
    const name = form.authorName.value.trim()
    const email = form.authorEmail.value.trim()
    const content = form.content.value.trim()

    if (!name || !email || !content) {
        alert('Vui lòng điền đầy đủ thông tin.')
        return
    }
    if (content.length < 5) {
        alert('Bình luận quá ngắn, vui lòng viết ít nhất 5 ký tự.')
        return
    }

    btn.disabled = true
    btn.textContent = 'Đang gửi...'

    try {
        const { error } = await supabase.from('comments').insert({
            post_slug: slug,
            author_name: name,
            author_email: email,
            content: content,
            status: 'pending'
        })

        if (error) throw error

        document.getElementById('comment-form-wrapper').innerHTML = `
      <div class="comment-section__success">
        <div style="font-size: 2rem">✅</div>
        <p class="comment-section__success-title">Bình luận đã được gửi!</p>
        <p class="comment-section__success-text">Vui lòng chờ quản trị viên duyệt. Cảm ơn bạn!</p>
        <button class="comment-section__another-btn" onclick="location.reload()">Gửi bình luận khác</button>
      </div>
    `
    } catch (err) {
        console.error('[post.js] Lỗi gửi bình luận:', err)
        btn.disabled = false
        btn.textContent = originalText
        alert('Lỗi khi gửi bình luận. Vui lòng thử lại sau.')
    }
}

/**
 * Entry point — Load tất cả nội dung trang bài viết
 */
export async function loadPost() {
    mountLayout()

    if (!slug) {
        document.title = 'Không tìm thấy bài viết'
        document.getElementById('post-content').innerHTML =
            '<p>Đường dẫn không hợp lệ. <a href="/index.html">Về trang chủ</a></p>'
        return
    }

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('draft', false)
        .single()

    if (error || !post) {
        document.title = 'Không tìm thấy bài viết'
        document.getElementById('post-body').innerHTML =
            '<p>Bài viết không tồn tại hoặc chưa được đăng. <a href="/index.html">Về trang chủ</a></p>'
        return
    }

    // Cập nhật metadata trang
    document.title = `${post.title} — Minimal Focus`
    document.getElementById('post-title').textContent = post.title

    const metaEl = document.getElementById('post-meta')
    if (metaEl) {
        const readTime = readingTime(post.content)
        metaEl.innerHTML = `
      <span>${formatDate(post.created_at)}</span>
      <span>·</span>
      <span>${readTime} min read</span>
    `
    }

    // Render tags
    const tagsEl = document.getElementById('post-tags')
    if (tagsEl && post.tags?.length) {
        tagsEl.innerHTML = post.tags.map(t => `<span class="tag">${t}</span>`).join('')
    }

    // Render nội dung Markdown → HTML bằng marked.js
    // marked phải được load trước qua <script> tag trong HTML
    if (typeof marked !== 'undefined') {
        marked.setOptions({ breaks: true, gfm: true })
        document.getElementById('post-body').innerHTML = marked.parse(post.content || '')
    } else {
        document.getElementById('post-body').textContent = post.content || ''
    }

    // Cover image
    if (post.cover_image) {
        const coverEl = document.getElementById('post-cover')
        if (coverEl) {
            coverEl.src = post.cover_image
            coverEl.alt = post.title
            coverEl.style.display = 'block'
        }
    }

    // Tracking lượt xem (async, không block UI)
    trackPageView(slug)

    // Load bình luận
    loadComments(slug)
}
