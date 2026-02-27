// js/posts.js
// Logic cho trang chủ: load danh sách bài viết + tìm kiếm

import { supabase } from './supabase.js'

let allPosts = []

/**
 * Tính thời gian đọc ước lượng (phút)
 * @param {string} content - Nội dung bài viết
 * @returns {number}
 */
function readingTime(content = '') {
    const wordCount = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
}

/**
 * Format ngày tháng theo locale Việt Nam
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/**
 * Render một blog card
 * @param {Object} post
 * @returns {string}
 */
function renderCard(post) {
    const tags = (post.tags || [])
        .map(t => `<span class="tag">${t}</span>`)
        .join('')

    return `
    <article class="blog-card">
      <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="blog-card__link">
        <span class="blog-card__meta">
          ${formatDate(post.created_at)} · ${readingTime(post.content)} min read
        </span>
        <h2 class="blog-card__title">${post.title}</h2>
        <p class="blog-card__excerpt">${post.excerpt || ''}</p>
        <div class="blog-card__tags">${tags}</div>
        <span class="blog-card__readmore">Đọc tiếp →</span>
      </a>
    </article>
  `
}

/**
 * Render danh sách bài viết vào grid
 * @param {Array} posts
 */
function renderGrid(posts) {
    const grid = document.getElementById('posts-grid')
    const noResults = document.getElementById('no-results')
    const loading = document.getElementById('posts-loading')

    if (loading) loading.remove()

    if (!posts || posts.length === 0) {
        grid.innerHTML = ''
        if (noResults) noResults.style.display = 'block'
    } else {
        if (noResults) noResults.style.display = 'none'
        grid.innerHTML = posts.map(renderCard).join('')
    }
}

/**
 * Load tất cả bài viết đã đăng từ Supabase và setup tìm kiếm
 */
export async function loadPosts() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, content, tags, created_at')
        .eq('draft', false)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('[posts.js] Lỗi load bài viết:', error)
        document.getElementById('posts-grid').innerHTML =
            '<p style="color:red">Không thể tải bài viết. Vui lòng thử lại.</p>'
        return
    }

    allPosts = posts || []
    renderGrid(allPosts)

    // Tìm kiếm realtime
    const searchInput = document.getElementById('searchInput')
    if (searchInput) {
        let debounceTimer
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                const q = e.target.value.toLowerCase().trim()
                if (!q) {
                    renderGrid(allPosts)
                    return
                }
                const filtered = allPosts.filter(p =>
                    p.title.toLowerCase().includes(q) ||
                    (p.excerpt || '').toLowerCase().includes(q) ||
                    (p.tags || []).some(t => t.toLowerCase().includes(q))
                )
                renderGrid(filtered)
            }, 300) // debounce 300ms
        })
    }
}
