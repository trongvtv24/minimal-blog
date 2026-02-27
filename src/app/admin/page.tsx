'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface Stats {
    totalViews: number;
    viewsToday: number;
    viewsByDay: { date: string; views: number }[];
    topPosts: { slug: string; views: number }[];
    pendingComments: number;
    totalComments: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, postsRes] = await Promise.all([
                    fetch('/api/analytics/stats'),
                    fetch('/api/admin/posts'),
                ]);
                const statsData = await statsRes.json();
                const postsData = await postsRes.json();
                setStats(statsData);
                setTotalPosts(postsData.length || 0);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="admin-page">
                <h1 className="admin-page__title">Dashboard</h1>
                <p className="admin-page__loading">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="admin-page">
                <h1 className="admin-page__title">Dashboard</h1>
                <p>Không thể tải dữ liệu.</p>
            </div>
        );
    }

    const formatDateLabel = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title">Dashboard</h1>

            {/* Stat Cards */}
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--views">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="admin-stat-card__value">{stats.viewsToday}</p>
                        <p className="admin-stat-card__label">Lượt xem hôm nay</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--total">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="admin-stat-card__value">{totalPosts}</p>
                        <p className="admin-stat-card__label">Tổng bài viết</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--comments">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14h-6.83L12 17.17 10.83 16H4V4h16v12z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="admin-stat-card__value">{stats.pendingComments}</p>
                        <p className="admin-stat-card__label">Chờ duyệt</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-card__icon admin-stat-card__icon--allviews">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <p className="admin-stat-card__value">{stats.totalViews}</p>
                        <p className="admin-stat-card__label">Tổng lượt xem</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="admin-charts">
                <div className="admin-chart-card">
                    <h2 className="admin-chart-card__title">Lượt xem 30 ngày qua</h2>
                    <div className="admin-chart-card__body">
                        {stats.viewsByDay.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stats.viewsByDay}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={formatDateLabel}
                                        fontSize={12}
                                        stroke="var(--muted)"
                                    />
                                    <YAxis fontSize={12} stroke="var(--muted)" allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                        labelFormatter={(label) => `Ngày: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="views"
                                        stroke="var(--accent)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                        name="Lượt xem"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="admin-chart-card__empty">Chưa có dữ liệu</p>
                        )}
                    </div>
                </div>

                <div className="admin-chart-card">
                    <h2 className="admin-chart-card__title">Top bài viết</h2>
                    <div className="admin-chart-card__body">
                        {stats.topPosts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.topPosts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis type="number" fontSize={12} stroke="var(--muted)" allowDecimals={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="slug"
                                        width={150}
                                        fontSize={12}
                                        stroke="var(--muted)"
                                        tickFormatter={(v) => v.length > 20 ? v.slice(0, 20) + '...' : v}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                    <Bar dataKey="views" fill="var(--accent)" radius={[0, 4, 4, 0]} name="Lượt xem" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="admin-chart-card__empty">Chưa có dữ liệu</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="admin-quicklinks">
                <Link href="/admin/posts/new" className="admin-quicklink">
                    ✍️ Viết bài mới
                </Link>
                <Link href="/admin/comments" className="admin-quicklink">
                    💬 Duyệt bình luận ({stats.pendingComments})
                </Link>
            </div>
        </div>
    );
}
