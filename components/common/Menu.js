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

            <div className={styles['menu-content']}>
				<span className={styles['menu-section-label']}>Navigate</span>
				<ul className={styles['menu-links']} onClick={onClose}>
					<li>
						<Link href='/'>

                            <span>Home</span>

                        </Link>
					</li>
					<li>
						<Link href='/rewards'>

                            <span>Rewards & Prizes</span>

                        </Link>
					</li>
					<li>
						<Link href='/#benefits'>

                            <span>Benefits</span>

                        </Link>
					</li>
					<li className={styles['desktop-only-link']}>
						<Link href='/#idea'>

                            <span>The Idea</span>

                        </Link>
					</li>
					<li className={styles['desktop-only-link']}>
						<Link href='/#mission'>

                            <span>Your Mission</span>

                        </Link>
					</li>
					<li>
						<Link href='/#testimonials'>

                            <span>Ambassador Stories</span>

                        </Link>
					</li>
					<li>
						<Link href='/leaderboard'>

                            <span>Leaderboard</span>

                        </Link>
					</li>
					<li>
						<Link href='/contact'>

                            <span>Contact Us</span>

                        </Link>
					</li>
				</ul>

				<div className={styles['menu-footer']}>
					<Link
                        href={isLoggedIn ? '/dashboard/profile' : '/login'}
                        onClick={onClose}
                        className='btn-primary'
                        style={{ width: '100%', justifyContent: 'center' }}>

                        {isLoggedIn ? 'Go to Profile' : 'Sign in to Account →'}

                    </Link>
				</div>
			</div>
        </div>
    );
}
