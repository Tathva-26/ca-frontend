import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BiMenu } from 'react-icons/bi'
import { useUserContext } from 'context/UserContext'
import Menu from 'components/common/Menu'
import styles from './nav.module.css'

export default function Nav() {
	const { isLoggedIn, user } = useUserContext()
	const [showMenu, setShowMenu] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setScrolled(true)
			} else {
				setScrolled(false)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handleSignInOrDashboard = () => {
		if (!isLoggedIn) {
			router.push('/login')
		} else {
			router.push('/dashboard/profile')
		}
	}

	return (
        <header className={`${styles.navbarWrapper} ${scrolled ? styles.navbarScrolled : ''}`}>
            <nav className={styles.navbar}>
				<div className={styles['logo-wrapper']}>
					<button
						className={styles['menu-icon-btn']}
						onClick={() => setShowMenu(true)}
						aria-label='Open Navigation Menu'
					>
						<BiMenu className={styles['menu-icon']} />
					</button>
					<Link href='/' className={styles['logo-link']}>

                        <img src='/images/tathva26-gold.png' alt="Tathva '26" className={styles['nav-logo']} />

                    </Link>
				</div>

				<div className={styles['nav-center']}>
					<ul className={styles['nav-links']}>
						<li>
							<Link
                                href='/'
                                className={`${styles['nav-link']} ${router.pathname === '/' ? styles.active : ''}`}>
								
									Home
								
							</Link>
						</li>
						<li>
							<Link
                                href='/rewards'
                                className={`${styles['nav-link']} ${router.pathname === '/rewards' ? styles.active : ''}`}>
								
									Rewards
								
							</Link>
						</li>
						<li>
							<Link
                                href='/leaderboard'
                                className={`${styles['nav-link']} ${router.pathname === '/leaderboard' ? styles.active : ''}`}>
								
									Leaderboard
								
							</Link>
						</li>
						<li>
							<Link
                                href='/contact'
                                className={`${styles['nav-link']} ${router.pathname === '/contact' ? styles.active : ''}`}>
								
									Contact
								
							</Link>
						</li>
					</ul>
				</div>

				<div className={styles['nav-right']}>
					{!isLoggedIn ? (
						<button onClick={handleSignInOrDashboard} className={styles['sign-in-btn']}>
							<span>Sign in</span>
							<span className={styles['btn-arrow']}>→</span>
						</button>
					) : (
						<div className={styles['user-pill']} onClick={handleSignInOrDashboard} title='Open Profile'>
							<div
								className={styles.avatar}
								style={{ backgroundImage: `url(${user?.imageUrl || '/images/tathva-white.png'})` }}
							/>
							<div className={styles['user-meta']}>
								<span className={styles['user-name']}>{user?.name?.split(' ')[0] || 'Ambassador'}</span>
								<span className={styles['user-points']}>{user?.points ?? 0} PTS</span>
							</div>
						</div>
					)}
				</div>

				<Menu show={showMenu} onClose={() => setShowMenu(false)} />
			</nav>
        </header>
    );
}

