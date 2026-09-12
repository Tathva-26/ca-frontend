import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import { FiAward, FiFileText, FiX, FiArrowRight } from 'react-icons/fi'
import OfferLetterModal from './OfferLetterModal'

export default function OfferLetterTopBanner() {
	const { isLoggedIn, user } = useUserContext()
	const [showModal, setShowModal] = useState(false)
	const [dismissed, setDismissed] = useState(false)
	const router = useRouter()

	useEffect(() => {
		// Listen for custom trigger from any button across the app
		const handleOpenOffer = () => setShowModal(true)
		window.addEventListener('open-offer-letter', handleOpenOffer)

		// Check session storage for dismissal
		const isDismissed = sessionStorage.getItem('tca26_offer_banner_dismissed')
		if (isDismissed) setDismissed(true)

		return () => {
			window.removeEventListener('open-offer-letter', handleOpenOffer)
		}
	}, [])

	const handleDismiss = () => {
		setDismissed(true)
		sessionStorage.setItem('tca26_offer_banner_dismissed', 'true')
	}

	const isQualified = Boolean(isLoggedIn && Number(user?.points || 0) >= 299)
	const points = Number(user?.points || 0)

	// Show top banner if user is qualified and not dismissed, and not currently on the profile page
	const showBanner = isQualified && !dismissed && router.pathname !== '/dashboard/profile'

	return (
		<>
			{showBanner && (
				<div className='offer-top-banner' role='alert'>
					<div className='offer-top-banner-inner'>
						<div className='offer-top-banner-left'>
							<div className='offer-top-badge-icon'>
								<FiAward />
							</div>
							<div className='offer-top-banner-text'>
								<span className='offer-top-bold'>MILESTONE UNLOCKED:</span> Your official Tathva
								&apos;26 Offer Letter ({points} PTS) has been issued by NIT Calicut!
							</div>
						</div>

						<div className='offer-top-banner-actions'>
							<button onClick={() => setShowModal(true)} className='banner-btn-view'>
								<FiFileText />
								<span>View Offer Letter</span>
							</button>

							<Link href='/dashboard/profile'>
								<a className='banner-btn-profile'>
									<span>Download in Profile</span>
									<FiArrowRight />
								</a>
							</Link>

							<button
								onClick={handleDismiss}
								className='banner-btn-close'
								aria-label='Dismiss notification'
								title='Dismiss'
							>
								<FiX />
							</button>
						</div>
					</div>
				</div>
			)}

			<OfferLetterModal isOpen={showModal} onClose={() => setShowModal(false)} user={user} />
		</>
	)
}
