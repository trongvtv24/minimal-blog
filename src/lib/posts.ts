import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  coverImage?: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx') || name.endsWith('.md'))
    .map((fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      return {
        title: data.title,
        slug: data.slug,
        date: data.date,
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        draft: data.draft || false,
        coverImage: data.coverImage,
        readingTime: stats.text,
      } as PostMeta;
    })
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) return null;

  const fileNames = fs.readdirSync(postsDirectory);

  for (const fileName of fileNames) {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.slug === slug) {
      const stats = readingTime(content);
      return {
        title: data.title,
        slug: data.slug,
        date: data.date,
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        draft: data.draft || false,
        coverImage: data.coverImage,
        readingTime: stats.text,
        content,
      };
    }
  }

  return null;
}

export function searchPosts(query: string): PostMeta[] {
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAdjacentPosts(
  slug: string
): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
