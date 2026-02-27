# System Architecture Overview

Ngày cập nhật: 2026-02-27

---

## Tổng quan dự án

**Minimal Focus (HTML/Supabase Version)** là một Blog hoàn toàn tĩnh (Static Site) sử dụng kiến trúc Backend-as-a-Service (BaaS) với Supabase. Dự án đã được chuyển đổi từ Next.js + SQLite sang HTML thuần để tối ưu hóa khả năng hosting (miễn phí qua Cloudflare Pages/GitHub Pages) mà vẫn giữ nguyên giao diện và tính năng.

---

## Sơ đồ kiến trúc (Mermaid)

```mermaid
graph TD
    %% Khai báo màu
    classDef frontend fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff;
    classDef external fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;
    classDef client fill:#f3f4f6,stroke:#9ca3af,stroke-width:2px,stroke-dasharray: 5 5;

    subgraph Client [Trình duyệt người dùng (#client)]
        A1[Người dùng xem trang]
        A2[Admin đăng nhập]
    end

    subgraph HTML_Frontend [Trang Tĩnh HTML / JS (#frontend)]
        B1(index.html / post.html)
        B2(admin/*.html)
        B3[marked.js] -- "Render" --> B1
        B4[Chart.js] -- "Render biểu đồ" --> B2
        B5[Supabase JS Client]
        
        B1 --> B5
        B2 --> B5
    end

    subgraph CDN [Mạng phân phối (#external)]
        C1[Cloudflare Pages / GitHub Pages]
        C2[jsDelivr CDN]
    end

    subgraph Supabase_Backend [Supabase (BaaS) (#external)]
        D1[(PostgreSQL + RLS)]
        D2[Supabase Auth]
        D3[REST API / RPC]
    end

    %% Các luồng kết nối
    A1 --> |Truy cập| C1
    A2 --> |Truy cập| C1
    C1 --> |Trả về HTML/CSS/JS| Client
    Client -- "Tải thư viện" --> C2
    C2 -- "Trả marked.js, Chart.js" --> Client

    B5 --> |Gọi Data (REST/RPC)| D3
    B5 --> |Login| D2
    D3 <--> |Query data| D1
```

---

## Tech Stack & Vai trò

### 1. Frontend (Client-side)
Dự án **KHÔNG** sử dụng Framework (như React, Next.js) hay Build Tools (như Webpack, Vite). Code chạy thẳng trên trình duyệt.

- **Ngôn ngữ:** HTML5, CSS thuần (Variables, Grid/Flex), JavaScript (ES6 Modules).
- **Phân tách Layout:** JS components nhỏ như `js/layout.js` gọi hàm `renderHeader()` và gắn vào DOM thông qua `innerHTML`.
- **Thư viện ngoài (load qua CDN):**
  - **`@supabase/supabase-js`:** Kết nối, lấy dữ liệu, gửi comments, authentication.
  - **`marked.js`:** Parser nhẹ để biên dịch nội dung Markdown thô thành HTML ngay phía client (trên `post.html`).
  - **`Chart.js`:** Thay thế Recharts, dùng để vẽ biểu đồ Line/Bar trên `admin/index.html`.

### 2. Backend (Supabase)
Toàn bộ logic server-side được thay thế bằng Supabase.

- **Storage:** PostgreSQL chia thành 3 bảng chính: `posts`, `comments`, `page_views`.
- **API:** Không có API routes tuỳ chỉnh. Trình duyệt gọi trực tiếp vào database qua Supabase REST API (được gói gọn qua Supabase JS Client).
- **Bảo mật (Security):** Thay thế logic verify middleware thông thường bằng **Row Level Security (RLS)** trên PostgreSQL. Supabase Auth sẽ gắn token định danh; nếu là Role "anon", Postgres chỉ cho READ bài viết `draft=false`. Nếu là Role "authenticated", Postgres cho phép CRUD toàn bộ.

### 3. Server / Hosting
- **Hosting files:** Hoàn toàn là file tĩnh, phù hợp tuyệt đối cho CDN (Cloudflare Pages, GitHub Pages, Vercel). Server chỉ nhận thư mục chứa file và trả về (`index.html`, `style.css`), không cần runtime server như Node.js.
