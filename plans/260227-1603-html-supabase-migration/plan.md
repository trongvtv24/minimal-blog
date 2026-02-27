# Plan: HTML + Supabase Migration
**Created:** 27/02/2026 16:03
**Status:** 🟡 In Progress
**Based on:** BRIEF.md (Brainstorm session)

## Overview
Chuyển đổi toàn bộ dự án **Minimal Focus Blog** từ Next.js + SQLite sang **HTML/CSS/JS thuần + Supabase**.
Giữ nguyên 100% giao diện và chức năng. Đây là một dự án **mới, riêng biệt** (không chỉnh sửa repo Next.js cũ).

## Tech Stack
- **Frontend:** HTML5, Vanilla CSS (copy từ globals.css cũ), Vanilla JS (ES6 Modules)
- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + Real-time)
- **Markdown Rendering:** `marked.js` (thư viện nhẹ, chạy được từ CDN)
- **Charts:** `Chart.js` (thay thế Recharts, chạy được trên HTML thuần)
- **Hosting:** Có thể deploy lên Cloudflare Pages, GitHub Pages, hoặc Vercel (Tĩnh)

## Phases

| Phase | Tên | Trạng thái | Mô tả |
|-------|-----|------------|-------|
| 01 | Supabase Setup & Structure | ✅ Complete | Chuẩn bị project folder, tạo DB trên Supabase |
| 02 | Shared Assets & CSS | ✅ Complete | CSS, JS Auth helper, Supabase client singleton |
| 03 | Public Blog (index.html) | ⬜ Pending | Trang chủ danh sách bài viết |
| 04 | Blog Post Detail (post.html) | ⬜ Pending | Trang đọc bài + Bình luận + View Tracker |
| 05 | Admin Dashboard (admin/) | ⬜ Pending | Login, Dashboard charts, Quản lý bài & comment |
| 06 | Data Seeding & Polish | ⬜ Pending | Migrate data từ MDX, kiểm tra toàn bộ |

## Quick Commands
- Bắt đầu: `/code phase-01`
- Kiểm tra tiến độ: `/next`
- Lưu bộ nhớ: `/save-brain`
