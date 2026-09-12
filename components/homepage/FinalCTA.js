import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'

export default function FinalCTA() {
	const router = useRouter()
	const { isLoggedIn } = useUserContext()

	const handleClick = () => {
		if (isLoggedIn) {
			router.push('/dashboard/profile')
		} else {
			router.push('/register')
		}
	}

	return (
		<section className='final-cta-section' id='join'>
			<div className='container'>
				<div className='final-cta-content'>
					<p className='final-cta-lead'>Built for students, run by ambassadors</p>

					<h2 className='final-cta-headline'>
						Become A<br />
						<span className='text-gradient-gold'>Campus Ambassador.</span>
					</h2>

					<button onClick={handleClick} className='final-cta-btn'>
						<span>{isLoggedIn ? 'Go to dashboard' : "Join Tathva '26"}</span>
						<span className='arrow'>→</span>
					</button>

					<span className='final-cta-meta'>NIT Calicut, Kozhikode · Applications open</span>
				</div>
			</div>
		</section>
	)
}
