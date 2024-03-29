// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//     title: 'next-13 - Not Found',
// };

export default function NotFound() {
    return (
        <main id="main">
            <article className="mw-90ch error-container">
                <h2>
                    Error 404!
                </h2>

                <p className="error">An error has occurred.</p>
                <p className="error">The page you are looking for does not exist!</p>
            </article>
        </main>
    );
}
