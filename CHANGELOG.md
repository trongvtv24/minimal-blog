# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-27] - Phase 01 & 02: HTML + Supabase Migration

### Added
- **New Project Structure**: Created `minimal-blog-html` directory for the static site version.
- **Supabase Integration**: Set up Supabase as the BaaS backend, replacing SQLite and Prisma.
- **SQL Schema**: Added `scripts/supabase-setup.sql` to define `posts`, `comments`, and `page_views` tables with RLS policies.
- **CDN Libraries**: Integrated `marked.js` for Markdown rendering and `Chart.js` for admin analytics via CDN.
- **Static Pages**: Created core static HTML files (`index.html`, `post.html`, `admin/login.html`, `admin/index.html`, `admin/posts.html`, `admin/edit-post.html`, `admin/comments.html`).
- **Core JS Modules**: Implemented `js/supabase.js`, `js/auth.js`, `js/layout.js`, `js/posts.js`, and `js/post.js`.
- **Migration Script**: Added `scripts/migrate-mdx.mjs` to seamlessly port existing `.mdx` content to Supabase.

### Changed
- **CSS**: Reused `globals.css` as `style.css`, stripping Tailwind directives for pure Vanilla CSS compatibility.
- **Layout Architecture**: Abstracted Header and Footer logic into a JavaScript injection component (`mountLayout()`) instead of server-side layout wrapping.

### Deprecated
- **Next.js Backend**: Server-rendered routing (`app/`), NextAuth (`SessionProvider`), and Prisma Client are no longer used in the new HTML structure.

---

## [2026-02-27] - Native Content Migration

### Added
- **Admin Layout Restructuring**: Successfully isolated public blog views from the admin dashboard logic using Next.js route groups `(blog)`.
- **Native Comments System**: Added `ShareAndComments.tsx` component to handle form submissions directly into the SQLite DB.
- **Analytics Tracking**: Added `PageViewTracker.tsx` to automatically track post views on load.
- **Admin Dashboard**: Created dashboard with Recharts, post listing, MDX post editor, and comment moderation views.
