# System Architecture - Minimal Focus Blog

Dự án được xây dựng trên mô hình **Next.js App Router** hiện đại, kết hợp giữa Static Site Generation (SSG) cho blog và Server-side rendering cho Admin.

---

## 🏛️ Tổng quan kiến trúc

```mermaid
graph TD
    Client[Browser] --> NextJS[Next.js App Router]
    
    subgraph Blog_Layer [Public Blog Layer]
        NextJS --> SSG_Pages[Static Pages /blog/slug]
        SSG_Pages --> MDX_Files[Content MDX Folder]
    end
    
    subgraph Service_Layer [Service & Logic Layer]
        NextJS --> Auth[NextAuth.js]
        NextJS --> API[Next.js API Routes]
        API --> Prisma[Prisma ORM]
        Prisma --> SQLite[(SQLite DB)]
    end
    
    subgraph Admin_Layer [Admin Dashboard Layer]
        NextJS --> Protected_Routes[/admin]
        Protected_Routes --> Multi_Layout[Route Groups]
        Multi_Layout --> Dash_UI[Admin UI Components]
    end
```

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend Core**: Next.js 16 (Turbopack), React 19.
- **Styling**: Vanilla CSS (Modern CSS 4) + Tailwind CSS 4 (PostCSS).
- **Authentication**: NextAuth.js (Session-based, Credentials Provider).
- **Database**: SQLite (File-based, đơn giản cho blog cá nhân).
- **ORM**: Prisma 5 (Typed queries, migrations).
- **Content**: MDX (File-based storage trong `content/posts`).
- **Charts**: Recharts (Hiển thị dữ liệu analytics).

---

## 📂 File Structure

- `src/app/(blog)`: Route group cho các trang blog công khai (có Header/Footer).
- `src/app/admin`: Route group cho các trang quản trị (Protected, sidebar layout).
- `src/app/api`: Chứa toàn bộ API endpoints cho comment, analytics, admin.
- `src/components`: Chứa UI components dùng chung và components chuyên biệt (Dashboard, Comments).
- `content/posts`: Nơi lưu trữ các tệp bài viết định dạng `.mdx`.
- `prisma/schema.prisma`: Định nghĩa cấu trúc dữ liệu.
