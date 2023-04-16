import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';

import '@/styles/mg_base.css';
import '@/styles/globals.css';

const defaultFont = Inter({
    variable: '--font-default',
    subsets: ['latin'],
});

export const metadata = {
    title: 'next-13',
    description: 'Testing the new appDir',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 2,
    },
    icons: {
        icon: [
            {
                url: '/images/favicon.ico',
                sizes: '32x32',
            },
        ],
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body id="appWrapper" className={defaultFont.variable}>
                <Header />

                <div className="page-container">
                    {children}
                </div>

                <Footer />
            </body>
        </html>
    );
}
