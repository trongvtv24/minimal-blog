'use client';

import { useState, useCallback } from 'react';
import { PostMeta } from '@/lib/posts';
import SearchBar from './SearchBar';
import BlogGrid from './BlogGrid';

interface HomeClientProps {
    allPosts: PostMeta[];
}

export default function HomeClient({ allPosts }: HomeClientProps) {
    const [filteredPosts, setFilteredPosts] = useState<PostMeta[]>(allPosts);

    const handleSearch = useCallback(
        (query: string) => {
            if (!query.trim()) {
                setFilteredPosts(allPosts);
                return;
            }
            const lowerQuery = query.toLowerCase();
            const results = allPosts.filter(
                (post) =>
                    post.title.toLowerCase().includes(lowerQuery) ||
                    post.excerpt.toLowerCase().includes(lowerQuery) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
            );
            setFilteredPosts(results);
        },
        [allPosts]
    );

    return (
        <>
            <SearchBar onSearch={handleSearch} />
            <BlogGrid posts={filteredPosts} />
        </>
    );
}
