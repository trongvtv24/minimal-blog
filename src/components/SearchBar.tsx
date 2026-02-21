'use client';

import { useState, useEffect, useMemo } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

// Extract debounce outside to avoid hook dependencies issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const debouncedSearch = useMemo(
        () => debounce((q: string) => onSearch(q), 250),
        [onSearch]
    );

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    return (
        <div style={{ marginBottom: 'var(--sp-8)' }}>
            <label htmlFor="search-input" className="sr-only" style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                borderWidth: 0,
            }}>
                Tìm kiếm bài viết
            </label>
            <input
                id="search-input"
                type="search"
                className="search-input"
                placeholder="Tìm kiếm bài viết..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Tìm kiếm bài viết"
            />
        </div>
    );
}
