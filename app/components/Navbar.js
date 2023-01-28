import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/page1">Page 1</Link>
                </li>

                <li>
                    <Link href="/page2">Page 2</Link>
                </li>

                <li>
                    <Link href="/page3">Page 3</Link>
                </li>
            </ul>
        </nav>
    );
}
