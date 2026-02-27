'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session) {
            router.push('/admin');
        }
    }, [session, router]);

    if (status === 'loading') {
        return (
            <div className="admin-login">
                <div className="admin-login__card">
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Email hoặc mật khẩu không đúng');
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="admin-login">
            <div className="admin-login__card">
                <div className="admin-login__header">
                    <h1 className="admin-login__title">Minimal Focus</h1>
                    <p className="admin-login__subtitle">Đăng nhập quản trị</p>
                </div>

                {error && (
                    <div className="admin-login__error">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 12H7v-2h2v2zm0-3H7V4h2v5z" fill="currentColor" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login__form">
                    <div className="admin-login__field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@minimalfocus.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="admin-login__field">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="admin-login__btn">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
