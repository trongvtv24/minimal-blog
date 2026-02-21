import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface BlogCardProps {
    post: PostMeta;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="blog-card" aria-label={`Đọc bài: ${post.title}`}>
            <div className="blog-card__meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {' · '}
                {post.readingTime}
            </div>
            <h2 className="blog-card__title">{post.title}</h2>
            <p className="blog-card__excerpt">{post.excerpt}</p>
            {post.tags.length > 0 && (
                <div className="tag-list" style={{ marginBottom: 'var(--sp-4)' }}>
                    {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <span className="blog-card__cta" aria-hidden="true">
                Đọc tiếp
            </span>
        </Link>
    );
}
