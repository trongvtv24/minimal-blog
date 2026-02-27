import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <a href="#main-content" className="skip-link">
                Bỏ qua đến nội dung chính
            </a>
            <Header />
            <main id="main-content" style={{ minHeight: '60vh', paddingTop: 'var(--sp-12)', paddingBottom: 'var(--sp-12)' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
