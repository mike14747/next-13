import type { Metadata } from 'next';
import LoginForm from '@/components/Login/LoginForm';
// import { Suspense } from 'react';
// import Spinner from '@/components/Spinner';

export const metadata: Metadata = {
    title: 'next-13 - Login',
};

export default function Login() {
    return (
        <main id="main">
            {/* <Suspense fallback={<Spinner />}> */}
            <article className="mw-90ch">
                <h2 className="page-heading">
                    Login
                </h2>

                <LoginForm />
            </article>
            {/* </Suspense> */}
        </main>

    );
}
