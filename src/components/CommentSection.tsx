'use client';

import { useEffect, useState, useCallback } from 'react';

interface Comment {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
}

export default function CommentSection({ slug }: { slug: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        authorName: '',
        authorEmail: '',
        content: '',
    });

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?slug=${slug}`);
            const data = await res.json();
            setComments(data);
        } catch {
            console.error('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postSlug: slug,
                    ...formData,
                }),
            });

            if (res.ok) {
                setSubmitted(true);
                setFormData({ authorName: '', authorEmail: '', content: '' });
            }
        } catch {
            console.error('Failed to submit comment');
        } finally {
            setSubmitting(false);
        }
    };

    const getInitial = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            '#0F766E', '#0369A1', '#7C3AED', '#C2410C',
            '#15803D', '#B91C1C', '#A16207', '#6D28D9',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section__title">
                Bình luận {comments.length > 0 && <span className="comment-section__count">({comments.length})</span>}
            </h3>

            {/* Comment Form */}
            {submitted ? (
                <div className="comment-section__success">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="currentColor" />
                    </svg>
                    <div>
                        <p className="comment-section__success-title">Cảm ơn bạn đã bình luận!</p>
                        <p className="comment-section__success-text">Bình luận đang chờ duyệt và sẽ hiển thị sau khi được phê duyệt.</p>
                    </div>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="comment-section__another-btn"
                    >
                        Viết thêm bình luận
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="comment-section__form">
                    <div className="comment-section__form-row">
                        <div className="comment-section__field">
                            <label htmlFor="authorName">Tên của bạn *</label>
                            <input
                                id="authorName"
                                type="text"
                                required
                                value={formData.authorName}
                                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                placeholder="Nhập tên..."
                            />
                        </div>
                        <div className="comment-section__field">
                            <label htmlFor="authorEmail">Email *</label>
                            <input
                                id="authorEmail"
                                type="email"
                                required
                                value={formData.authorEmail}
                                onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>
                    <div className="comment-section__field">
                        <label htmlFor="commentContent">Nội dung *</label>
                        <textarea
                            id="commentContent"
                            required
                            rows={4}
                            maxLength={2000}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Viết bình luận của bạn..."
                        />
                        <span className="comment-section__charcount">
                            {formData.content.length}/2000
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="comment-section__submit"
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                </form>
            )}

            {/* Comments List */}
            <div className="comment-section__list">
                {loading ? (
                    <p className="comment-section__loading">Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                    <p className="comment-section__empty">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div
                                className="comment-item__avatar"
                                style={{ backgroundColor: getAvatarColor(comment.authorName) }}
                            >
                                {getInitial(comment.authorName)}
                            </div>
                            <div className="comment-item__body">
                                <div className="comment-item__header">
                                    <span className="comment-item__name">{comment.authorName}</span>
                                    <span className="comment-item__date">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="comment-item__text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
