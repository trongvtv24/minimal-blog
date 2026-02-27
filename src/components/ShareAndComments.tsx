'use client';

import { useEffect, useState } from 'react';
import CommentSection from './CommentSection';

export default function ShareAndComments({ slug }: { slug: string }) {
    const [fullUrl, setFullUrl] = useState('');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFullUrl(window.location.href);
    }, []);

    // Prevent hydration mismatch
    if (!fullUrl) return null;

    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

    return (
        <section className="mt-16 pt-8 border-t border-[var(--border)] w-full">
            {/* Share Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text)] m-0">Bạn thấy bài viết hữu ích?</h3>
                    <p className="text-[var(--muted)] text-sm mt-1 mb-0">Hãy chia sẻ để nhiều người cùng biết nhé!</p>
                </div>
                <a
                    href={fbShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-white bg-[#1877f2] hover:bg-[#166fe5] rounded-lg transition-colors font-medium shadow-sm hover:shadow"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Chia sẻ lên Facebook
                </a>
            </div>

            {/* Native Comments Section */}
            <CommentSection slug={slug} />
        </section>
    );
}
