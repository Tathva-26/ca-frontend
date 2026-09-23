import { useState, useEffect } from 'react'
import { useUserContext } from 'context/UserContext'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const HeroText = () => {
	const router = useRouter()
	const { isLoggedIn } = useUserContext()
	const [displayedTagline, setDisplayedTagline] = useState('')
	const fullTagline = 'Be the emissary of Tathva 2026'

	useEffect(() => {
		let index = 0
		let isDeleting = false
		let timeoutId = null

		const type = () => {
			if (!isDeleting) {
				if (index <= fullTagline.length) {
					setDisplayedTagline(fullTagline.substring(0, index))
					index++
					timeoutId = setTimeout(type, 70)
				} else {
					isDeleting = true
					timeoutId = setTimeout(type, 2000) // Pause after full text typed
				}
			} else {
				if (index >= 0) {
					setDisplayedTagline(fullTagline.substring(0, index))
					index--
					timeoutId = setTimeout(type, 35) // Fast backspace
				} else {
					isDeleting = false
					index = 0
					timeoutId = setTimeout(type, 500) // Pause before typing again
				}
			}
		}

		type()

		return () => clearTimeout(timeoutId)
	}, [])

	const handleSignUp = () => {
		if (isLoggedIn) {
			// If already logged in, go to dashboard
			router.push('/dashboard/posters')
		} else {
			// If not logged in, go to signup page
			router.push('/register')
		}
	}

	return (
		<div className='hero-text container'>
			<h1 className='hero-heading'>
				Campus <br />
				Ambassador
			</h1>
			<p className='hero-tagline'>
				{displayedTagline}
				<span className='typewriter-cursor'>|</span>
			</p>
			<div className='hero-cta-wrapper'>
				<button onClick={handleSignUp} className='btn-primary'>
					{isLoggedIn ? 'Go to Dashboard' : 'Sign up'}
				</button>
				<a href='#explore'>
					<button className='btn-outline'>Explore</button>
				</a>
			</div>
			<div className='hero-stats'>
				<div className='stat-wrapper'>
					<CountUp
						className='stat-num'
						end={30}
						duration={1.5}
						delay={0.5}
						suffix='+'
						useEasing={true}
					/>
					<p>Workshops</p>
				</div>
				<div className='stat-wrapper'>
					<CountUp
						className='stat-num'
						end={12}
						duration={1.3}
						delay={0.5}
						suffix='+'
						useEasing={true}
					/>
					<p>Lectures</p>
				</div>
				<div className='stat-wrapper'>
					<CountUp
						className='stat-num'
						end={150}
						duration={1.8}
						delay={0.5}
						suffix='+'
						useEasing={true}
					/>
					<p>Sponsors</p>
				</div>
			</div>
		</div>
	)
}

export default HeroText
