import Link from 'next/link';

export default function Home() {
    return (
        <main id="main">
            <h2 className="page-heading">Homepage</h2>

            <p>This is the homepage!</p>

            <Link href="/test">
                Protected page
            </Link>
        </main>
    );
}
