import { MDXRemote } from 'next-mdx-remote/rsc';

interface MdxContentProps {
    source: string;
}

export default function MdxContent({ source }: MdxContentProps) {
    return (
        <div className="article-content">
            <MDXRemote source={source} />
        </div>
    );
}
