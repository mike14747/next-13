import Link from 'next/link';

import styles from '@/styles/Header.module.css';

export default function Header() {
    return (
        <header className={'container ' + styles.header}>
            <h1 className={styles.heading}>
                <Link href="/">
                    next-13
                </Link>

            </h1>
        </header >
    );
}
