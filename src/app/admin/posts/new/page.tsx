'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        tags: '',
        coverImage: '',
        content: '',
        draft: false,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: formData.slug || generateSlug(title),
        });
    };

    const handleSubmit = async (isDraft: boolean) => {
        if (!formData.title || !formData.content) {
            alert('Vui lòng nhập tiêu đề và nội dung');
            return;
        }

        setSaving(true);

        try {
            const slug = formData.slug || generateSlug(formData.title);
            const tags = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            const res = await fetch('/api/admin/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    slug,
                    tags,
                    draft: isDraft,
                }),
            });

            if (res.ok) {
                router.push('/admin/posts');
            } else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi tạo bài viết');
            }
        } catch {
            alert('Lỗi khi tạo bài viết');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page__header">
                <h1 className="admin-page__title">Viết bài mới</h1>
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
                        {saving ? 'Đang lưu...' : 'Đăng bài'}
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
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="admin-editor__title-input"
                        />
                    </div>

                    <div className="admin-editor__row">
                        <div className="admin-editor__field">
                            <label>Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                                placeholder="auto-generated-from-title"
                            />
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
                    <label>Nội dung (MDX) *</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Viết nội dung bài viết bằng Markdown/MDX..."
                        className="admin-editor__textarea"
                    />
                </div>
            </div>
        </div>
    );
}
