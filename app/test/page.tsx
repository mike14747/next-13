import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { Suspense } from 'react';
import Spinner from '@/components/Spinner';

export const metadata: Metadata = {
    title: 'next-13 - Test page',
};

export default async function Test() {
    const session = await getServerSession({
        callbacks: { session: ({ token }) => token },
    });

    console.log({ session });

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

                <Suspense fallback={<Spinner />}>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </Suspense>
            </article>
        </main >
    );
}
