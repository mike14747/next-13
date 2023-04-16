import styles from '@/styles/Footer.module.css';

export default function Footer() {
    return (
        <footer className={'container ' + styles.footer}>
            <p className={styles.copyright}>
                &copy; 2023 next-13
            </p>
        </footer>
    );
}
