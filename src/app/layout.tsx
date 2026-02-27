import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Minimal Focus — Blog tối giản, tập trung nội dung',
    template: '%s — Minimal Focus',
  },
  description:
    'Blog tối giản với bố cục đều đặn, cân đối, giúp bạn tập trung vào nội dung. Chia sẻ kiến thức về thiết kế web, frontend, và trải nghiệm người dùng.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Minimal Focus',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
