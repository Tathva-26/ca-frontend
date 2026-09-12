import Link from 'next/link'
import styles from '../styles/not-found.module.css'

export default function NotFound() {
	return (
        <div className={styles.container}>
            <div className={styles.stack}>
				<span className={styles.code}>404</span>
				<span className={styles.overline}>Page not found</span>
				<h1 className={styles.title}>This page isn&apos;t here.</h1>
				<p className={styles.description}>
					The page you&apos;re looking for doesn&apos;t exist, or it may have moved. Head back home
					or get in touch with us.
				</p>

				<div className={styles.actions}>
					<Link href='/' className={styles.primaryBtn}>

                        <span>Return Home</span>
                        <span>→</span>

                    </Link>
					<Link href='/contact' className={styles.secondaryBtn}>

                        <span>Contact us</span>

                    </Link>
				</div>
			</div>
        </div>
    );
}