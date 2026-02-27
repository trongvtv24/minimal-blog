'use client';

import { useEffect } from 'react';

export default function PageViewTracker({ slug }: { slug: string }) {
    useEffect(() => {
        const trackView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postSlug: slug,
                        path: window.location.pathname,
                    }),
                });
            } catch {
                // Silent fail for tracking
            }
        };

        trackView();
    }, [slug]);

    return null;
}
