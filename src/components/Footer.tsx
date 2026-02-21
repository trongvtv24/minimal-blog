export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="site-footer">
            <div className="container-main">
                <p>© {year} Minimal Focus. Thiết kế tối giản, tập trung nội dung.</p>
            </div>
        </footer>
    );
}
