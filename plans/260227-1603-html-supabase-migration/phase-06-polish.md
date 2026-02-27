# Phase 06: Data Seeding & Polish
**Status:** ⬜ Pending
**Phụ thuộc:** Phase 01 → 05 phải hoàn thành trước

## Mục tiêu
- Migrate toàn bộ 6 bài viết từ file `.mdx` sang Supabase
- Kiểm tra toàn bộ chức năng
- Đảm bảo giao diện responsive trên điện thoại

---

## Bước 1: Migrate bài viết từ MDX sang Supabase

Các file MDX hiện có trong `content/posts/`:
1. `nghe-thuat-toi-gian-thiet-ke-web.mdx`
2. `he-thong-spacing-nhat-quan.mdx`
3. `typography-tren-web.mdx`
4. `nextjs-app-router-guide.mdx`
5. + (2 bài khác)

**Cách làm:**
Dùng script Node.js đọc file MDX và insert vào Supabase:

```javascript
// scripts/migrate-mdx.mjs  (chạy 1 lần duy nhất)
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_URL', 'YOUR_SERVICE_ROLE_KEY') // Dùng service_role key!!!
const postsDir = path.resolve('./content/posts')

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
  const { data, content } = matter(raw)
  
  await supabase.from('posts').upsert({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: content.trim(),
    tags: data.tags || [],
    draft: data.draft || false,
    cover_image: data.coverImage || null,
    created_at: new Date(data.date).toISOString(),
  }, { onConflict: 'slug' })
  
  console.log(`✅ Migrated: ${data.title}`)
}
```

Chạy: `node scripts/migrate-mdx.mjs`

---

## Bước 2: Final Checklist toàn bộ chức năng

### Public Blog
- [ ] `index.html`: Load bài viết, tìm kiếm hoạt động
- [ ] `post.html`: Render Markdown, hiện author, ngày tháng
- [ ] Gửi bình luận: Thành công & thất bại
- [ ] Lượt xem: Ghi vào Supabase mỗi lần tải bài

### Admin Dashboard
- [ ] Login/Logout hoạt động
- [ ] 4 stat cards hiển thị số đúng
- [ ] Biểu đồ lượt xem 30 ngày
- [ ] Biểu đồ top bài viết
- [ ] Tạo bài mới → Xuất hiện ở blog
- [ ] Sửa bài viết → Thay đổi có hiệu lực
- [ ] Xóa bài viết → Biến mất
- [ ] Duyệt comment → Hiển thị trên post
- [ ] Từ chối comment → Ẩn đi
- [ ] Xóa comment → Biến mất

### Responsive (Mobile check)
- [ ] Trang chủ: Hiển thị tốt trên điện thoại
- [ ] Trang bài viết: Đọc được, không bị tràn chữ
- [ ] Admin sidebar: Ẩn ở mobile (theo CSS hiện có)

---

## Bước 3: Deploy lên Cloudflare Pages (Gợi ý)

1. Push thư mục `minimal-blog-html/` lên GitHub repo mới
2. Vào [pages.cloudflare.com](https://pages.cloudflare.com)
3. Kết nối repo → Framework preset: **None (Static HTML)**
4. Deploy! Mỗi lần push code → Tự động deploy lại

> ✨ **Cloudflare Pages miễn phí**: Không giới hạn bandwidth, CDN toàn cầu, domain `.pages.dev` miễn phí.

---

## Test Criteria
- [ ] Tất cả bài viết từ MDX đã migrate thành công vào Supabase
- [ ] Không có lỗi Console trong browser
- [ ] Giao diện giống 100% so với Next.js bản cũ
- [ ] Deploy thành công lên Cloudflare Pages (tiện kiểm tra)
