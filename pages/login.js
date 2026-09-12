import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import Link from 'next/link'
import styles from '../styles/login.module.css'

export default function Login() {
	const router = useRouter()
	const { login, isLoggedIn } = useUserContext()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	// Redirect if already logged in
	useEffect(() => {
		if (isLoggedIn) {
			const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard/profile'
			sessionStorage.removeItem('redirectTo')
			router.push(redirectTo)
		}
	}, [isLoggedIn])

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		const result = await login(formData.email, formData.password)

		setIsLoading(false)

		if (result.success) {
			const redirectTo = sessionStorage.getItem('redirectTo') || '/dashboard/profile'
			sessionStorage.removeItem('redirectTo')
			router.push(redirectTo)
		} else {
			setError(result.error || 'Sign in failed. Please check your credentials and try again.')
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.loginBox}>
				<span className={styles.overline}>Ambassador Program · Tathva &apos;26</span>

				<div className={styles.logoSection}>
					<h1 className={styles.title}>Sign In</h1>
					<p className={styles.subtitle}>Return to your ambassador dashboard</p>
				</div>

				{error && (
					<p className={styles.errorMessage} role='alert'>
						{error}
					</p>
				)}

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.inputGroup}>
						<label htmlFor='email' className={styles.label}>
							Email Address
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className={styles.input}
							placeholder='your.email@example.com'
							required
						/>
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor='password' className={styles.label}>
							Password
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className={styles.input}
							placeholder='Enter your password'
							required
						/>
					</div>

					<button type='submit' className={styles.submitButton} disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				<div className={styles.footer}>
					<p className={styles.footerText}>
						New to the network?{' '}
						<Link href='/register' className={styles.link}>
							Create your account
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}