import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import { FcGoogle } from 'react-icons/fc'
import styles from '../styles/login.module.css'

export default function Login() {
	const router = useRouter()
	const { loginWithGoogle, isLoggedIn, authLoading } = useUserContext()

	useEffect(() => {
		if (authLoading || !isLoggedIn) return

		router.push('/profile')
	}, [authLoading, isLoggedIn, router])

	useEffect(() => {
		const nextRoot = document.getElementById('__next')
		nextRoot?.classList.add(styles.loginPage)
		return () => {
			nextRoot?.classList.remove(styles.loginPage)
		}
	}, [])

	return (
		<div className={styles.container}>
			<div className={styles.loginBox}>
				<div className={styles.logoSection}>
					<h1 className={styles.title}>Welcome back</h1>
					<p className={styles.subtitle}>Sign in to your Campus Ambassador account</p>
				</div>

				<button type='button' className={styles.googleButton} onClick={loginWithGoogle}>
					<FcGoogle size={20} />
					Continue with Google
				</button>

				<p className={styles.disclaimer}>
					By continuing, you agree to Tathva&apos;s terms and privacy policy.
				</p>
			</div>
		</div>
	)
}
