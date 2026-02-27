import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/analytics/stats — Admin only: get analytics data
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total views
    const totalViews = await prisma.pageView.count();

    // Views today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const viewsToday = await prisma.pageView.count({
        where: { createdAt: { gte: startOfToday } },
    });

    // Views per day (last 30 days)
    const dailyViews = await prisma.pageView.groupBy({
        by: ['createdAt'],
        _count: true,
        where: { createdAt: { gte: thirtyDaysAgo } },
    });

    // Aggregate by date string
    const dailyMap = new Map<string, number>();
    for (let d = 0; d < 30; d++) {
        const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
        const key = date.toISOString().split('T')[0];
        dailyMap.set(key, 0);
    }
    for (const row of dailyViews) {
        const key = new Date(row.createdAt).toISOString().split('T')[0];
        dailyMap.set(key, (dailyMap.get(key) || 0) + row._count);
    }
    const viewsByDay = Array.from(dailyMap.entries())
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Top posts by views
    const topPosts = await prisma.pageView.groupBy({
        by: ['postSlug'],
        _count: true,
        orderBy: { _count: { postSlug: 'desc' } },
        take: 10,
    });

    // Pending comments count
    const pendingComments = await prisma.comment.count({
        where: { status: 'pending' },
    });

    // Total comments
    const totalComments = await prisma.comment.count();

    return NextResponse.json({
        totalViews,
        viewsToday,
        viewsByDay,
        topPosts: topPosts.map((p) => ({
            slug: p.postSlug,
            views: p._count,
        })),
        pendingComments,
        totalComments,
    });
}
