'use client';

import { useEffect, useState } from 'react';

interface Comment {
    id: string;
    postSlug: string;
    authorName: string;
    authorEmail: string;
    content: string;
    status: string;
    createdAt: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/admin/comments?status=${filter}`);
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error('Failed to fetch comments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action }),
            });
            if (res.ok) {
                setComments(
                    comments.map((c) => (c.id === id ? { ...c, status: action } : c))
                );
            }
        } catch (err) {
            console.error('Failed to update comment', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setComments(comments.filter((c) => c.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete comment', err);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; className: string }> = {
            pending: { label: 'Chờ duyệt', className: 'admin-badge--pending' },
            approved: { label: 'Đã duyệt', className: 'admin-badge--published' },
            rejected: { label: 'Từ chối', className: 'admin-badge--draft' },
        };
        const info = map[status] || { label: status, className: '' };
        return <span className={`admin-badge ${info.className}`}>{info.label}</span>;
    };

    const pendingCount = comments.filter((c) => c.status === 'pending').length;

    const filters: { key: FilterStatus; label: string }[] = [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: `Chờ duyệt${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
        { key: 'approved', label: 'Đã duyệt' },
        { key: 'rejected', label: 'Từ chối' },
    ];

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">Quản lý bình luận</h1>

            {/* Filter Tabs */}
            <div className="admin-tabs">
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`admin-tab ${filter === f.key ? 'admin-tab--active' : ''}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Comments List */}
            {loading ? (
                <p className="admin-page__loading">Đang tải...</p>
            ) : comments.length === 0 ? (
                <div className="admin-empty">
                    <p>Không có bình luận nào.</p>
                </div>
            ) : (
                <div className="admin-comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="admin-comment-card">
                            <div className="admin-comment-card__header">
                                <div className="admin-comment-card__author">
                                    <strong>{comment.authorName}</strong>
                                    <span className="admin-comment-card__email">{comment.authorEmail}</span>
                                </div>
                                <div className="admin-comment-card__meta">
                                    {getStatusBadge(comment.status)}
                                    <span className="admin-comment-card__date">{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>

                            <p className="admin-comment-card__content">{comment.content}</p>

                            <div className="admin-comment-card__footer">
                                <span className="admin-comment-card__post">
                                    Bài viết: <strong>{comment.postSlug}</strong>
                                </span>
                                <div className="admin-comment-card__actions">
                                    {comment.status !== 'approved' && (
                                        <button
                                            onClick={() => handleAction(comment.id, 'approved')}
                                            disabled={actionLoading === comment.id}
                                            className="admin-btn admin-btn--sm admin-btn--success"
                                        >
                                            ✅ Duyệt
                                        </button>
                                    )}
                                    {comment.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleAction(comment.id, 'rejected')}
                                            disabled={actionLoading === comment.id}
                                            className="admin-btn admin-btn--sm admin-btn--warning"
                                        >
                                            ❌ Từ chối
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        disabled={actionLoading === comment.id}
                                        className="admin-btn admin-btn--sm admin-btn--danger"
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
