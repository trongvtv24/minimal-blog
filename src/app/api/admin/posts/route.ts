import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllPosts } from '@/lib/posts';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// GET /api/admin/posts — Admin: get all posts (including drafts) with view counts
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all posts including drafts
    const fileNames = fs.readdirSync(postsDirectory);
    const matter = (await import('gray-matter')).default;
    const readingTime = (await import('reading-time')).default;

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
                readingTime: stats.text,
                fileName,
            };
        })
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    // Get view counts per post
    const viewCounts = await prisma.pageView.groupBy({
        by: ['postSlug'],
        _count: true,
    });
    const viewMap = new Map(viewCounts.map((v) => [v.postSlug, v._count]));

    const postsWithViews = posts.map((p) => ({
        ...p,
        views: viewMap.get(p.slug) || 0,
    }));

    return NextResponse.json(postsWithViews);
}

// POST /api/admin/posts — Admin: create a new post (writes MDX file)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, excerpt, tags, content, draft, coverImage } = body;

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: 'title, slug, and content are required' },
                { status: 400 }
            );
        }

        // Build frontmatter
        const date = new Date().toISOString().split('T')[0];
        const frontmatter = [
            '---',
            `title: "${title}"`,
            `slug: "${slug}"`,
            `date: "${date}"`,
            `excerpt: "${excerpt || ''}"`,
            `tags: [${(tags || []).map((t: string) => `"${t}"`).join(', ')}]`,
            `draft: ${draft ? 'true' : 'false'}`,
        ];

        if (coverImage) {
            frontmatter.push(`coverImage: "${coverImage}"`);
        }

        frontmatter.push('---');

        const fileContent = frontmatter.join('\n') + '\n\n' + content;
        const fileName = `${slug}.mdx`;
        const filePath = path.join(postsDirectory, fileName);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'A post with this slug already exists' },
                { status: 409 }
            );
        }

        fs.writeFileSync(filePath, fileContent, 'utf8');

        return NextResponse.json(
            { message: 'Post created', slug },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
