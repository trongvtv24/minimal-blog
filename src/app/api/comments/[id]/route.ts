import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/comments/[id] — Admin: update comment status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const { status } = body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(comment);
    } catch {
        return NextResponse.json(
            { error: 'Comment not found' },
            { status: 404 }
        );
    }
}

// DELETE /api/comments/[id] — Admin: delete comment
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Comment deleted' });
    } catch {
        return NextResponse.json(
            { error: 'Comment not found' },
            { status: 404 }
        );
    }
}
