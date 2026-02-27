// js/auth.js
// Helper xác thực admin — dùng cho các trang trong /admin/

import { supabase } from './supabase.js'

/**
 * Lấy session hiện tại
 * @returns {Promise<Session|null>}
 */
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

/**
 * Bảo vệ trang Admin — gọi ở đầu mỗi file admin/*.html
 * Nếu chưa đăng nhập → tự redirect về login
 * @returns {Promise<Session|null>}
 */
export async function requireAdmin() {
    const session = await getSession()
    if (!session) {
        window.location.href = '/admin/login.html'
        return null
    }
    return session
}

/**
 * Đăng xuất và redirect về trang login
 */
export async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login.html'
}
