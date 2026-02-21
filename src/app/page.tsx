import { getAllPosts } from '@/lib/posts';
import HomeClient from '@/components/HomeClient';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="container-main">
      <section aria-label="Danh sách bài viết">
        <h1 className="page-title">Bài viết</h1>
        <p className="page-subtitle">
          Chia sẻ kiến thức về thiết kế web, frontend và trải nghiệm người dùng.
        </p>
        <HomeClient allPosts={posts} />
      </section>
    </div>
  );
}
