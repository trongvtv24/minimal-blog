// js/layout.js
// Header và Footer chung cho các trang blog public
// (Trang admin có sidebar layout riêng, không dùng file này)

/**
 * Render HTML cho header
 * @returns {string}
 */
export function renderHeader() {
    const currentPath = window.location.pathname
    return `
    <header class="site-header">
      <a href="/index.html" class="site-header__logo">Minimal Focus</a>
      <nav class="site-header__nav">
        <a href="/index.html" ${currentPath.endsWith('index.html') || currentPath === '/' ? 'class="active"' : ''}>Bài viết</a>
        <a href="/about.html" ${currentPath.includes('about') ? 'class="active"' : ''}>Giới thiệu</a>
      </nav>
    </header>
  `
}

/**
 * Render HTML cho footer
 * @returns {string}
 */
export function renderFooter() {
    const year = new Date().getFullYear()
    return `
    <footer class="site-footer">
      <p class="site-footer__text">
        © ${year} Minimal Focus
      </p>
    </footer>
  `
}

/**
 * Gắn Header và Footer vào trang
 * Trang cần có: <div id="header"></div> và <div id="footer"></div>
 */
export function mountLayout() {
    const headerEl = document.getElementById('header')
    const footerEl = document.getElementById('footer')
    if (headerEl) headerEl.innerHTML = renderHeader()
    if (footerEl) footerEl.innerHTML = renderFooter()
}
