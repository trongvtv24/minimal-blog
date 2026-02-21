import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giới thiệu',
    description: 'Tìm hiểu thêm về Minimal Focus — blog tối giản tập trung vào nội dung chất lượng.',
};

export default function AboutPage() {
    return (
        <div className="container-article">
            <h1 className="page-title">Giới thiệu</h1>

            <div className="article-content">
                <p>
                    <strong>Minimal Focus</strong> là một blog tối giản được xây dựng với triết lý: mọi phần tử trên trang
                    đều phải có mục đích rõ ràng. Không popup, không banner nhấp nháy, không carousel — chỉ có nội dung
                    thuần túy.
                </p>

                <h2>Triết lý thiết kế</h2>
                <p>
                    Blog này được xây dựng dựa trên ba nguyên tắc cốt lõi:
                </p>
                <ul>
                    <li>
                        <strong>Tính đều:</strong> Mỗi card bài viết tuân thủ layout chuẩn, chiều cao đồng nhất,
                        không &quot;nháy&quot; bất thường.
                    </li>
                    <li>
                        <strong>Tính cân đối:</strong> Nhịp spacing dọc/ngang nhất quán theo scale cố định
                        (4, 8, 12, 16, 24, 32, 48, 64px).
                    </li>
                    <li>
                        <strong>Tính dễ đọc:</strong> Typography và chiều rộng dòng tối ưu cho việc đọc lâu,
                        tối đa 720px với font 18px và line-height 1.75.
                    </li>
                </ul>

                <h2>Công nghệ</h2>
                <p>
                    Minimal Focus được xây dựng với:
                </p>
                <ul>
                    <li>Next.js (App Router) và TypeScript</li>
                    <li>Tailwind CSS kết hợp CSS Variables cho design tokens</li>
                    <li>MDX cho nội dung bài viết</li>
                    <li>Font Inter từ Google Fonts</li>
                </ul>

                <h2>Liên hệ</h2>
                <p>
                    Nếu bạn có câu hỏi hoặc muốn trao đổi, hãy liên hệ qua email:{' '}
                    <a href="mailto:hello@minimalfocus.blog">hello@minimalfocus.blog</a>
                </p>

                <blockquote>
                    &ldquo;Less, but better.&rdquo; — Dieter Rams
                </blockquote>
            </div>
        </div>
    );
}
