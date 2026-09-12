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
					<Link href='/'>
						<a onClick={onClose} className={styles['logo-link']}>
							<img src='/images/tathva26-gold.png' alt="Tathva '26" className={styles['nav-logo']} />
						</a>
					</Link>
				</div>
			</div>

			<div className={styles['menu-content']}>
				<span className={styles['menu-section-label']}>Navigate</span>
				<ul className={styles['menu-links']} onClick={onClose}>
					<li>
						<Link href='/'>
							<a>
								<span>Home</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/rewards'>
							<a>
								<span>Rewards & Prizes</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/#benefits'>
							<a>
								<span>Benefits</span>
							</a>
						</Link>
					</li>
					<li className={styles['desktop-only-link']}>
						<Link href='/#idea'>
							<a>
								<span>The Idea</span>
							</a>
						</Link>
					</li>
					<li className={styles['desktop-only-link']}>
						<Link href='/#mission'>
							<a>
								<span>Your Mission</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/#testimonials'>
							<a>
								<span>Ambassador Stories</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/leaderboard'>
							<a>
								<span>Leaderboard</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href='/contact'>
							<a>
								<span>Contact Us</span>
							</a>
						</Link>
					</li>
				</ul>

				<div className={styles['menu-footer']}>
					<Link href={isLoggedIn ? '/dashboard/profile' : '/login'}>
						<a onClick={onClose} className='btn-primary' style={{ width: '100%', justifyContent: 'center' }}>
							{isLoggedIn ? 'Go to Profile' : 'Sign in to Account →'}
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}
