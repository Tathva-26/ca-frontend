import { useEffect, useRef, useState } from 'react'
import { useUserContext } from 'context/UserContext'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import styles from './r-u-ready.module.css'

export default function RUReady() {
	const { user, isLoggedIn } = useUserContext()
	const router = useRouter()
	const iconRef = useRef(null)
	const [scrollSpinning, setScrollSpinning] = useState(false)
	const [hoverSpinning, setHoverSpinning] = useState(false)
	const [hasAnimated, setHasAnimated] = useState(false)

	const handleSignUp = () => {
		if (isLoggedIn) router.push('/profile')
		else router.push('/register')
	}

	useEffect(() => {
		const el = iconRef.current
		if (typeof window === 'undefined' || !el) return

		const onScroll = () => {
			if (hasAnimated) return
			const rect = el.getBoundingClientRect()
			if (rect.top <= window.innerHeight && rect.bottom >= 0) {
				setHasAnimated(true)
				setScrollSpinning(true)
				setTimeout(() => setScrollSpinning(false), 1000)
			}
		}

		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [hasAnimated])

	const handleHoverEnter = () => {
		if (!hoverSpinning) {
			setHoverSpinning(true)
		}
	}
	const handleAnimationEnd = () => {
		setHoverSpinning(false)
	}

	const handleClick = () => {
		if (isLoggedIn && user) {
			toast.info('You are already logged in!')
		} else {
			handleSignUp()
		}
	}

	return (
		<div className='container'>
			<div className='spacerv-md'></div>
			<div className='spacerv-sm'></div>
			<div className={styles['r-u-ready']}>
				<div className={styles['left']}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						id='vic-icon'
						ref={iconRef}
						src='/images/simon.png'
						alt='Tathva mascot'
						className={`${styles['vic-icon']} ${
							scrollSpinning || hoverSpinning ? styles['spin-once'] : ''
						}`}
						onMouseEnter={handleHoverEnter}
						onAnimationEnd={handleAnimationEnd}
					/>
					<div className={styles['r-u-ready-text']}>
						<h3>Are you ready?</h3>
						<p>
							To be a part of the biggest tech
							<br /> fest in South India
						</p>
					</div>
				</div>
				<button className={styles['sign-up-btn']} onClick={handleClick}>
					<span>Sign up</span>
				</button>
			</div>
			<div className='spacerv-md'></div>
			<div className='spacerv-sm'></div>
		</div>
	)
}
