import { useEffect } from 'react'
import PageHeader from '../components/common/PageHeader'
import ContactUs from 'components/contact/ContactUs'
import RUReady from 'components/common/RUReady'
import GhostFibers from 'components/leaderboard/GhostFibers'

export default function Contact() {
	useEffect(() => {
		// Remove the normal grid background while on the contact page
		document.body.classList.add('leaderboard-page')

		// Put the normal background back when leaving the contact page
		return () => {
			document.body.classList.remove('leaderboard-page')
		}
	}, [])

	return (
		<div className='leaderboard-page relative min-h-screen overflow-hidden'>
			{/* GhostFibers full-page background */}
			<GhostFibers className='fixed inset-0 z-0' />

			{/* Page content above GhostFibers */}
			<div className='relative z-10'>
				<PageHeader title='Contact us' />
				<ContactUs />
				<RUReady />
			</div>
		</div>
	)
}
