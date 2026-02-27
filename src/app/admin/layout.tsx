'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [status, pathname, router]);

    if (status === 'loading') {
        return (
            <div className="admin-loading">
                <div className="admin-loading__spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__header">
                    <Link href="/admin" className="admin-sidebar__logo">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect width="20" height="20" rx="4" fill="currentColor" />
                            <path d="M5 10L9 14L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Minimal Focus
                    </Link>
                </div>

                <nav className="admin-sidebar__nav">
                    <Link
                        href="/admin"
                        className={`admin-sidebar__link ${pathname === '/admin' ? 'active' : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M1 10h8V1H1v9zm0 7h8v-5H1v5zm10 0h8V8h-8v9zm0-16v5h8V1h-8z" fill="currentColor" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/posts"
                        className={`admin-sidebar__link ${pathname.startsWith('/admin/posts') ? 'active' : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 2h14v2H2V2zm0 4h14v2H2V6zm0 4h10v2H2v-2zm0 4h14v2H2v-2z" fill="currentColor" />
                        </svg>
                        Bài viết
                    </Link>
                    <Link
                        href="/admin/comments"
                        className={`admin-sidebar__link ${pathname.startsWith('/admin/comments') ? 'active' : ''}`}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M16 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 14h-4.83L9 16.17 6.83 14H2V2h14v12z" fill="currentColor" />
                        </svg>
                        Bình luận
                    </Link>
                </nav>

                <div className="admin-sidebar__footer">
                    <Link href="/" className="admin-sidebar__link" target="_blank">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M14 14H4V4h5V2H4C2.9 2 2 2.9 2 4v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V9h-2v5zM11 2v2h2.59l-7.3 7.29 1.41 1.41L15 5.41V8h2V2h-6z" fill="currentColor" />
                        </svg>
                        Xem Blog
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="admin-sidebar__logout">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M13 3H11v2h2v8h-2v2h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 10l-1.41-1.41L10.17 9H2V7h8.17L7.59 4.41 9 3l5 5-5 5z" fill="currentColor" />
                        </svg>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="admin-header__user">
                        <span className="admin-header__avatar">
                            {session.user?.name?.charAt(0) || 'A'}
                        </span>
                        <span className="admin-header__name">{session.user?.name || 'Admin'}</span>
                    </div>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AdminGuard>{children}</AdminGuard>
        </SessionProvider>
    );
}
