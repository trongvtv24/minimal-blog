import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

interface PrevNextNavProps {
    prev: PostMeta | null;
    next: PostMeta | null;
}

export default function PrevNextNav({ prev, next }: PrevNextNavProps) {
    if (!prev && !next) return null;

    return (
        <nav className="prev-next-nav" aria-label="Điều hướng bài viết">
            {prev ? (
                <Link href={`/blog/${prev.slug}`} className="prev-next-nav__link">
                    <span className="prev-next-nav__label">← Bài trước</span>
                    <span className="prev-next-nav__title">{prev.title}</span>
                </Link>
            ) : (
                <div />
            )}
            {next ? (
                <Link href={`/blog/${next.slug}`} className="prev-next-nav__link prev-next-nav__link--next">
                    <span className="prev-next-nav__label">Bài sau →</span>
                    <span className="prev-next-nav__title">{next.title}</span>
                </Link>
            ) : (
                <div />
            )}
        </nav>
    );
}
