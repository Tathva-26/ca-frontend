import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import CountUp from 'react-countup'

export default function Hero() {
	const router = useRouter()
	const { isLoggedIn, user } = useUserContext() || {}

	const handleJoinCTA = () => {
		if (isLoggedIn) {
			router.push('/dashboard/profile')
		} else {
			router.push('/register')
		}
	}

	return (
		<section className='hero' id='home'>
			<div className='container hero-container'>
				{/* Left Editorial Column */}
				<div className='hero-left'>
					<div className='hero-header'>
						<h1 className='hero-title'>
							Campus
							<span className='hero-title-accent'>Ambassador</span>
						</h1>

						<h2 className='hero-tagline'>Bring Tathva To Your Campus.</h2>
					</div>

					<p className='hero-description'>
						Tathva is South India&apos;s largest technical festival, run by students at NIT Calicut.
						As an ambassador you represent your college, help students get involved, and earn
						points toward your official Tathva &apos;26 offer letter.
					</p>

					<div className='hero-cta-group'>
						<button onClick={handleJoinCTA} className='hero-btn-primary'>
							<span>{isLoggedIn ? 'Go to your dashboard' : 'Become an Ambassador'}</span>
							<span className='arrow'>→</span>
						</button>
						<a href='#benefits' className='hero-btn-secondary'>
							<span>How it works</span>
							<span>↓</span>
						</a>
					</div>

					{/* Stats */}
					<div className='hero-stats-row'>
						<div className='hero-stat-card'>
							<span className='hero-stat-num'>
								<CountUp end={150} duration={1.8} suffix='+' enableScrollSpy scrollSpyOnce />
							</span>
							<p className='hero-stat-label'>Colleges</p>
						</div>
						<div className='hero-stat-card'>
							<span className='hero-stat-num'>
								<CountUp end={892} duration={2} suffix='+' enableScrollSpy scrollSpyOnce />
							</span>
							<p className='hero-stat-label'>Ambassadors</p>
						</div>
						<div className='hero-stat-card'>
							<span className='hero-stat-num'>
								<CountUp end={84} duration={1.6} suffix='K+' enableScrollSpy scrollSpyOnce />
							</span>
							<p className='hero-stat-label'>Students reached</p>
						</div>
						<div className='hero-stat-card'>
							<span className='hero-stat-num text-gradient-gold'>₹25K+</span>
							<p className='hero-stat-label'>Prize pool</p>
						</div>
					</div>
				</div>

				{/* Right Visual */}
				<div className='hero-right'>
					<div className='asteria-stage'>
						<div className='asteria-frame'>
							<img
								src='/images/hero-desktop.png'
								alt="Tathva '26 Campus Ambassador"
								className='asteria-img'
								loading='eager'
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
