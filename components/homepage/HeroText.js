import { useUserContext } from 'context/UserContext'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
import { useEffect, useState } from 'react'
import { REGISTRATION_END } from 'lib/registration'

const HeroText = () => {
	const router = useRouter()
	const { isLoggedIn } = useUserContext()
	// null until the first client-side tick, so the server render and the
	// first client render match and we don't flash "closed" on load
	const [timeLeft, setTimeLeft] = useState(null)
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

	useEffect(() => {
		const update = () => setTimeLeft(Math.max(0, REGISTRATION_END.getTime() - Date.now()))

		update()
		const interval = setInterval(update, 1000)

		// Cleanup interval on component unmount
		return () => clearInterval(interval)
	}, [])

	const formatTime = (ms) => {
		const totalSeconds = Math.floor(ms / 1000)
		const days = Math.floor(totalSeconds / 86400)
		const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0')
		const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
		const seconds = String(totalSeconds % 60).padStart(2, '0')
		return days > 0 ? `${days}d ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`
	}

	const handleSignUp = () => {
		if (isLoggedIn) {
			router.push('/profile')
		} else {
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
