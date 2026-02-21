import { PostMeta } from '@/lib/posts';
import BlogCard from './BlogCard';

interface BlogGridProps {
    posts: PostMeta[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
    if (posts.length === 0) {
        return (
            <div className="no-results">
                <p>Không tìm thấy bài viết nào.</p>
            </div>
        );
    }

    return (
        <div className="blog-grid">
            {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
            ))}
        </div>
    );
}
