import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'next-13 - Test page',
};

export default async function Directory() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    if (!session) {
        redirect('/login?callbackUrl=/');
    }

    return (
        <main id="main">
            <article>
                <h2 className="page-heading">
                    Test
                </h2>

                <p>This is a test page to test getServerSession().</p>
            </article>
        </main >
    );
}
