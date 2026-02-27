'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        tags: '',
        coverImage: '',
        content: '',
        draft: false,
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Fetch the MDX content via a simple API
                const res = await fetch(`/api/admin/posts`);
                const posts = await res.json();
                const post = posts.find((p: { slug: string }) => p.slug === slug);

                if (post) {
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt || '',
                        tags: (post.tags || []).join(', '),
                        coverImage: post.coverImage || '',
                        content: '', // Content will need to be loaded separately
                        draft: post.draft,
                    });
                }
            } catch (err) {
                console.error('Failed to fetch post', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const handleSubmit = async (isDraft: boolean) => {
        if (!formData.title) {
            alert('Vui lòng nhập tiêu đề');
            return;
        }

        setSaving(true);

        try {
            const tags = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            const res = await fetch(`/api/admin/posts/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags,
                    draft: isDraft,
                }),
            });

            if (res.ok) {
                router.push('/admin/posts');
            } else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi cập nhật bài viết');
            }
        } catch {
            alert('Lỗi khi cập nhật bài viết');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <h1 className="admin-page__title">Chỉnh sửa bài viết</h1>
                <p className="admin-page__loading">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1 className="admin-page__title">Chỉnh sửa: {formData.title}</h1>
                <div className="admin-page__actions">
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={saving}
                        className="admin-btn admin-btn--ghost"
                    >
                        Lưu nháp
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={saving}
                        className="admin-btn admin-btn--primary"
                    >
                        {saving ? 'Đang lưu...' : 'Cập nhật'}
                    </button>
                </div>
            </div>

            <div className="admin-editor">
                <div className="admin-editor__fields">
                    <div className="admin-editor__field">
                        <label>Tiêu đề *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            placeholder="Nhập tiêu đề bài viết..."
                            className="admin-editor__title-input"
                        />
                    </div>

                    <div className="admin-editor__row">
                        <div className="admin-editor__field">
                            <label>Slug</label>
                            <input type="text" value={formData.slug} disabled className="admin-editor__disabled" />
                        </div>
                        <div className="admin-editor__field">
                            <label>Tags (phân cách bằng dấu phẩy)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                placeholder="nextjs, react, css"
                            />
                        </div>
                    </div>

                    <div className="admin-editor__field">
                        <label>Mô tả ngắn</label>
                        <textarea
                            rows={2}
                            value={formData.excerpt}
                            onChange={(e) =>
                                setFormData({ ...formData, excerpt: e.target.value })
                            }
                            placeholder="Mô tả ngắn gọn về bài viết..."
                        />
                    </div>

                    <div className="admin-editor__field">
                        <label>Cover Image URL</label>
                        <input
                            type="text"
                            value={formData.coverImage}
                            onChange={(e) =>
                                setFormData({ ...formData, coverImage: e.target.value })
                            }
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

                <div className="admin-editor__content">
                    <label>Nội dung (MDX) — Để trống nếu không thay đổi nội dung</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Để trống nếu giữ nguyên nội dung cũ, hoặc viết lại nội dung mới..."
                        className="admin-editor__textarea"
                    />
                </div>
            </div>
        </div>
    );
}
