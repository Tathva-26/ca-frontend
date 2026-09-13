import Link from 'next/link'
import { IoMdClose } from 'react-icons/io'
import { useUserContext } from 'context/UserContext'
import styles from './menu.module.css'

export default function Menu({ show, onClose }) {
	const { isLoggedIn } = useUserContext()

	return (
        <div className={`${styles.menu} ${show ? styles['menu-visible'] : styles['menu-hidden']}`}>
            <div className={styles.navbar}>
				<div className={styles['logo-wrapper']}>
					<button className={styles['close-btn']} onClick={onClose} aria-label='Close Menu'>
						<IoMdClose className={styles['menu-icon']} />
					</button>
					<Link href='/' onClick={onClose} className={styles['logo-link']}>

                        <img src='/images/tathva26-gold.png' alt="Tathva '26" className={styles['nav-logo']} />

                    </Link>
				</div>
			</div>

			<ul className={styles['menu-links']} onClick={onClose}>
				<li>
					<Link href='/'>Home</Link>
				</li>
				<li>
					<Link href='/leaderboard'>Leaderboard</Link>
				</li>
				<li>
					<Link href='/contact'>Contact</Link>
				</li>
			</ul>
		</div>
	)
}
