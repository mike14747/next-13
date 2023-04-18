import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const metadata: Metadata = {
    title: 'next-13 - Test page',
};

export default async function Directory() {
    // const session = await getServerSession({
    //     callbacks: { session: ({ token }) => token },
    // });

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/test');
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
