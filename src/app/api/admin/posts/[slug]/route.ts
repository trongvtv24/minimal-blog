import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

// PUT /api/admin/posts/[slug] — Admin: update a post
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    try {
        const body = await request.json();
        const { title, excerpt, tags, content, draft, coverImage } = body;

        // Find the existing file
        const fileNames = fs.readdirSync(postsDirectory);
        const existingFile = fileNames.find((name) => {
            const filePath = path.join(postsDirectory, name);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const matter = require('gray-matter');
            const { data } = matter(fileContents);
            return data.slug === slug;
        });

        if (!existingFile) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const filePath = path.join(postsDirectory, existingFile);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matter = require('gray-matter');
        const { data: existingData } = matter(fileContents);

        // Build updated frontmatter
        const frontmatter = [
            '---',
            `title: "${title || existingData.title}"`,
            `slug: "${slug}"`,
            `date: "${existingData.date}"`,
            `excerpt: "${excerpt !== undefined ? excerpt : existingData.excerpt || ''}"`,
            `tags: [${(tags || existingData.tags || []).map((t: string) => `"${t}"`).join(', ')}]`,
            `draft: ${draft !== undefined ? draft : existingData.draft || false}`,
        ];

        if (coverImage || existingData.coverImage) {
            frontmatter.push(
                `coverImage: "${coverImage || existingData.coverImage}"`
            );
        }

        frontmatter.push('---');

        const updatedContent =
            frontmatter.join('\n') + '\n\n' + (content || '');

        fs.writeFileSync(filePath, updatedContent, 'utf8');

        return NextResponse.json({ message: 'Post updated', slug });
    } catch {
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/posts/[slug] — Admin: delete a post
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    try {
        const fileNames = fs.readdirSync(postsDirectory);
        const matter = require('gray-matter');

        const targetFile = fileNames.find((name) => {
            const filePath = path.join(postsDirectory, name);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);
            return data.slug === slug;
        });

        if (!targetFile) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const filePath = path.join(postsDirectory, targetFile);
        fs.unlinkSync(filePath);

        return NextResponse.json({ message: 'Post deleted' });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
