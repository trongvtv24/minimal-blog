'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
    title: string;
    slug: string;
    date: string;
    draft: boolean;
    views: number;
    readingTime: string;
    tags: string[];
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch posts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (slug: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;

        try {
            const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
            if (res.ok) {
                setPosts(posts.filter((p) => p.slug !== slug));
            }
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1 className="admin-page__title">Bài viết</h1>
                <Link href="/admin/posts/new" className="admin-btn admin-btn--primary">
                    + Viết bài mới
                </Link>
            </div>

            {loading ? (
                <p className="admin-page__loading">Đang tải...</p>
            ) : posts.length === 0 ? (
                <div className="admin-empty">
                    <p>Chưa có bài viết nào.</p>
                    <Link href="/admin/posts/new" className="admin-btn admin-btn--primary">
                        Viết bài đầu tiên
                    </Link>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>Ngày</th>
                                <th>Trạng thái</th>
                                <th>Lượt xem</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.slug}>
                                    <td>
                                        <div className="admin-table__title">{post.title}</div>
                                        <div className="admin-table__meta">
                                            {post.tags.map((t) => (
                                                <span key={t} className="admin-tag">{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="admin-table__date">{formatDate(post.date)}</td>
                                    <td>
                                        <span className={`admin-badge ${post.draft ? 'admin-badge--draft' : 'admin-badge--published'}`}>
                                            {post.draft ? 'Bản nháp' : 'Đã đăng'}
                                        </span>
                                    </td>
                                    <td className="admin-table__views">{post.views}</td>
                                    <td>
                                        <div className="admin-table__actions">
                                            <Link
                                                href={`/admin/posts/${post.slug}/edit`}
                                                className="admin-btn admin-btn--sm admin-btn--ghost"
                                            >
                                                Sửa
                                            </Link>
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="admin-btn admin-btn--sm admin-btn--ghost"
                                            >
                                                Xem
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.slug, post.title)}
                                                className="admin-btn admin-btn--sm admin-btn--danger"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
