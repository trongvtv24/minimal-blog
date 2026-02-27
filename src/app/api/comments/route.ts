import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/comments?slug=xxx — Get approved comments for a post
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
        where: {
            postSlug: slug,
            status: 'approved',
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
        },
    });

    return NextResponse.json(comments);
}

// POST /api/comments — Submit a new comment (status = pending)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { postSlug, authorName, authorEmail, content } = body;

        if (!postSlug || !authorName || !authorEmail || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Basic validation
        if (content.length > 2000) {
            return NextResponse.json(
                { error: 'Comment too long (max 2000 characters)' },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                postSlug,
                authorName: authorName.trim(),
                authorEmail: authorEmail.trim().toLowerCase(),
                content: content.trim(),
                status: 'pending',
            },
        });

        return NextResponse.json(
            { message: 'Comment submitted successfully', id: comment.id },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: 'Failed to submit comment' },
            { status: 500 }
        );
    }
}
