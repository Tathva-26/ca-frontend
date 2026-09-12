import { useEffect } from 'react'
import { IoMdClose } from 'react-icons/io'
import { FiDownload, FiCheckCircle } from 'react-icons/fi'
import { useUserContext } from 'context/UserContext'

export default function OfferLetterModal({ isOpen, onClose, customUser = null }) {
	const { user: contextUser } = useUserContext()
	const user = customUser || contextUser

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			window.addEventListener('keydown', handleKeyDown)
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	const handleDownload = () => {
		window.print()
	}

	const today = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	const ambassadorName = user?.name || 'Authorized Campus Ambassador'
	const collegeName = user?.college || 'Affiliated Institution'
	const ambassadorId = user?.tathvaId || user?.userId ? `TCA26-${user?.tathvaId || user?.userId}` : 'TCA26-VERIFIED'
	const points = Number(user?.points || 0)

	return (
		<div className='doc-modal-overlay' onClick={onClose}>
			<div className='doc-modal-container' onClick={(e) => e.stopPropagation()}>
				<button className='modal-close-btn' onClick={onClose} aria-label='Close Offer Letter'>
					<IoMdClose />
				</button>

				{/* Official Printable Document */}
				<div className='official-letter-paper' id='printable-offer-letter'>
					<div className='letter-header'>
						<img src='/images/tathva26-gold.png' alt="Tathva '26" className='letter-logo' />
						<div className='letter-header-meta'>
							<div>Tathva &apos;26 · NIT Calicut</div>
							<div>National Institute of Technology Calicut</div>
							<div>Campus Ambassador Program</div>
						</div>
					</div>

					<div className='letter-title-block'>
						<span className='letter-supertitle'>Letter of appointment</span>
						<h3 className='letter-main-title'>Campus Ambassador Credential</h3>
					</div>

					<p className='letter-body-text'>
						This document certifies that
						<span className='letter-highlight-name'>{ambassadorName}</span>
						representing <strong>{collegeName}</strong>, is officially recognized as a{' '}
						<strong>Campus Ambassador for Tathva &apos;26</strong>, the annual technical festival
						organized by the National Institute of Technology Calicut.
					</p>

					<p className='letter-body-text' style={{ opacity: 0.85, fontSize: '0.9rem' }}>
						As an ambassador, the bearer is expected to share official updates, encourage
						registrations, and help grow the Tathva community across their campus.
					</p>

					<div className='letter-credentials-grid'>
						<div className='cred-item'>
							<span className='cred-label'>Ambassador ID</span>
							<span className='cred-val'>{ambassadorId}</span>
						</div>
						<div className='cred-item'>
							<span className='cred-label'>Status</span>
							<span className='cred-val text-gradient-gold'>
								{points >= 299 ? 'Verified · 299+ points' : `Active · ${points} points`}
							</span>
						</div>
						<div className='cred-item'>
							<span className='cred-label'>Date issued</span>
							<span className='cred-val'>{today}</span>
						</div>
					</div>

					<div className='letter-footer'>
						<div className='letter-issuing-authority'>
							<strong>Conveners · Tathva &apos;26</strong>
							<br />
							National Institute of Technology Calicut
							<br />
							Kozhikode, Kerala — 673601
						</div>
						<div className='letter-seal-badge'>
							<span className='seal-circle'>NIT Calicut seal</span>
						</div>
					</div>
				</div>

				{/* Modal Footer Actions */}
				<div className='modal-actions-bar'>
					<button onClick={handleDownload} className='btn-primary'>
						<FiDownload />
						<span>Download / Print PDF</span>
					</button>
					<button onClick={onClose} className='btn-outline'>
						<span>Close</span>
					</button>
				</div>
			</div>
		</div>
	)
}
