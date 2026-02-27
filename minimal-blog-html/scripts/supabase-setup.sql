-- ============================================
-- SUPABASE SQL SETUP - Minimal Focus Blog
-- Chạy file này trong Supabase SQL Editor
-- Supabase Dashboard → SQL Editor → New query
-- ============================================

-- ▶️ BƯỚC 1: Tạo các bảng
-- ============================================

CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  excerpt     TEXT DEFAULT '',
  content     TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  tags        TEXT[] DEFAULT '{}',
  draft       BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug    TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content      TEXT NOT NULL,
  status       TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_views (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_slug  TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ▶️ BƯỚC 2: Tạo indexes để query nhanh
-- ============================================

CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_page_views_post_slug ON page_views(post_slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);

-- ▶️ BƯỚC 3: Bật Row Level Security (RLS) - BẮT BUỘC
-- ============================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ▶️ BƯỚC 4: Thiết lập quyền truy cập (RLS Policies)
-- ============================================

-- POSTS policies
-- Ai cũng đọc được bài đã đăng (draft = false)
CREATE POLICY "Public read published posts"
  ON posts FOR SELECT
  USING (draft = false);

-- Admin (đã đăng nhập) thấy tất cả bài, kể cả draft
CREATE POLICY "Admin read all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Chỉ admin mới tạo/sửa/xóa bài
CREATE POLICY "Admin modify posts"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- COMMENTS policies
-- Ai cũng đọc được comment đã duyệt
CREATE POLICY "Public read approved comments"
  ON comments FOR SELECT
  USING (status = 'approved');

-- Ai cũng gửi được comment mới
CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Admin quản lý toàn bộ comments
CREATE POLICY "Admin manage comments"
  ON comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- PAGE_VIEWS policies
-- Ai cũng có thể ghi lượt xem
CREATE POLICY "Anyone can track views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- Chỉ admin mới đọc được analytics
CREATE POLICY "Admin read views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);

-- ▶️ BƯỚC 5: Tạo hàm tính lượt xem theo ngày (cho biểu đồ)
-- ============================================

CREATE OR REPLACE FUNCTION get_daily_views(days INT DEFAULT 30)
RETURNS TABLE(date DATE, views BIGINT)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    DATE(created_at) AS date,
    COUNT(*) AS views
  FROM page_views
  WHERE created_at >= NOW() - (days || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date ASC;
$$;

-- ============================================
-- ✅ HOÀN TẤT!
-- Tiếp theo:
-- 1. Vào Authentication → Users → Add user
--    Email: admin@minimalfocus.com
--    Password: (mật khẩu mạnh của anh)
-- 2. Chạy scripts/migrate-mdx.mjs để import bài viết
-- ============================================
