import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs, getAdjacentPosts } from '@/lib/posts';
import MdxContent from '@/components/MdxContent';
import PrevNextNav from '@/components/PrevNextNav';
import ShareAndComments from '@/components/ShareAndComments';
import PageViewTracker from '@/components/PageViewTracker';
import type { Metadata } from 'next';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            tags: post.tags,
        },
    };
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const { prev, next } = getAdjacentPosts(slug);

    return (
        <article className="container-article">
            <header className="article-header">
                <div className="article-header__meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {' · '}
                    {post.readingTime}
                </div>
                <h1 className="article-header__title">{post.title}</h1>
                {post.tags.length > 0 && (
                    <div className="tag-list" style={{ marginTop: 'var(--sp-4)' }}>
                        {post.tags.map((tag) => (
                            <span key={tag} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>
            <MdxContent source={post.content} />
            <ShareAndComments slug={slug} />
            <PrevNextNav prev={prev} next={next} />
            <PageViewTracker slug={slug} />
        </article>
    );
}
