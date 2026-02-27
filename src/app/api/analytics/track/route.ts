import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/analytics/track — Record a page view
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { postSlug, path } = body;

        if (!postSlug || !path) {
            return NextResponse.json(
                { error: 'postSlug and path are required' },
                { status: 400 }
            );
        }

        const userAgent = request.headers.get('user-agent') || '';
        const referrer = request.headers.get('referer') || '';

        await prisma.pageView.create({
            data: {
                postSlug,
                path,
                userAgent,
                referrer,
            },
        });

        return NextResponse.json({ message: 'tracked' }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: 'Failed to track' },
            { status: 500 }
        );
    }
}
