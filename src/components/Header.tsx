import Link from 'next/link';

export default function Header() {
    return (
        <header className="site-header">
            <div className="container-main site-header__inner">
                <Link href="/" className="site-header__logo" aria-label="Trang chủ">
                    Minimal Focus
                </Link>
                <nav className="site-header__nav" aria-label="Điều hướng chính">
                    <Link href="/">Bài viết</Link>
                    <Link href="/about">Giới thiệu</Link>
                </nav>
            </div>
        </header>
    );
}
