import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FiAward, FiCompass, FiBriefcase, FiUsers, FiCheckCircle, FiLock, FiUnlock, FiArrowRight } from 'react-icons/fi'
import { useUserContext } from 'context/UserContext'
import OfferLetterModal from 'components/common/OfferLetterModal'
import FinalCTA from 'components/homepage/FinalCTA'
import styles from 'styles/rewards.module.css'

export default function RewardsPage() {
	const { isLoggedIn, user } = useUserContext()
	const [showOfferModal, setShowOfferModal] = useState(false)

	// Ensure the page always starts from the top on entry
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'auto' })
	}, [])

	const userPoints = user?.points ?? 0
	const hasOfferLetter = userPoints >= 299
	const pointsPercent = Math.min(Math.round((userPoints / 299) * 100), 100)

	return (
        <>
            <Head>
				<title>Rewards · Tathva &apos;26 Campus Ambassador</title>
				<meta
					name='description'
					content='Compete for the ₹25,000+ prize pool, official NIT Calicut certifications, flagship workshop access, and official offer letters in the Tathva 26 Campus Ambassador program.'
				/>
			</Head>

            <div className={styles.rewardsPageWrapper}>
				<div className='container'>
					{/* Header */}
					<div className={styles.rewardsHeader}>
						<span className={styles.rewardsOverline}>Rewards</span>
						<h1 className={styles.rewardsTitle}>
							Ambassador Rewards & <span className='text-gradient-gold'>Prize Pool</span>.
						</h1>
						<p className={styles.rewardsSubtitle}>
							Compete for a ₹25,000+ prize pool. Top ambassadors earn cash, NIT Calicut
							certificates, free access to flagship workshops, and VIP entry to pro-shows.
						</p>
					</div>

					{/* Metric Telemetry Overview */}
					<div className={styles.telemetryGrid}>
						<div className={styles.telemetryCard}>
							<span className={styles.telemetryValue}>₹25,000+</span>
							<p className={styles.telemetryLabel}>Cash prize pool</p>
						</div>
						<div className={styles.telemetryCard}>
							<span className={styles.telemetryValue}>Top 20</span>
							<p className={styles.telemetryLabel}>NIT Calicut certificates</p>
						</div>
						<div className={styles.telemetryCard}>
							<span className={styles.telemetryValue}>100% Free</span>
							<p className={styles.telemetryLabel}>Technical workshops</p>
						</div>
						<div className={styles.telemetryCard}>
							<span className={styles.telemetryValue}>VIP Access</span>
							<p className={styles.telemetryLabel}>Pro-shows & keynotes</p>
						</div>
					</div>

					{/* Live User Milestone Progress Card */}
					<div className={styles.userProgressCard}>
						<div className={styles.progressInfo}>
							<span className={styles.progressTag}>
								{isLoggedIn ? 'Your progress' : 'How it works'}
							</span>
							<h3 className={styles.progressTitle}>
								{isLoggedIn
									? hasOfferLetter
										? '299 PTS Milestone Reached — Offer Letter Unlocked'
										: `${299 - userPoints} PTS Remaining to Unlock Official Offer Letter`
									: 'Accumulate 299 Points to Unlock Official Offer Letter'}
							</h3>
							<div className={styles.progressBarContainer}>
								<div
									className={styles.progressBarFill}
									style={{ width: `${isLoggedIn ? pointsPercent : 0}%` }}
								></div>
							</div>
							<span className={styles.progressStatsText}>
								{isLoggedIn
									? `Current Score: ${userPoints} / 299 PTS (${pointsPercent}%)`
									: 'Sign in to track real-time milestone progress'}
							</span>
						</div>

						{isLoggedIn ? (
							hasOfferLetter ? (
								<button onClick={() => setShowOfferModal(true)} className={styles.progressActionBtn}>
									<FiUnlock />
									<span>View Offer Letter</span>
								</button>
							) : (
								<Link href='/dashboard/referrals' className={styles.progressActionBtn}>

                                    <span>Earn More Points</span>
                                    <FiArrowRight />

                                </Link>
							)
						) : (
							<Link href='/login' className={styles.progressActionBtn}>

                                <span>Sign In to Unlock</span>
                                <FiArrowRight />

                            </Link>
						)}
					</div>

					{/* Podium Top 3 Cash Rewards */}
					<div className={styles.sectionSubhead}>
						<h2 className={styles.sectionSubheadTitle}>Podium Cash Rewards</h2>
						<p className={styles.sectionSubheadDesc}>
							Top three ambassadors receive direct bank payouts and are recognized at Tathva &apos;26.
						</p>
					</div>

					<div className='podium-grid' style={{ marginBottom: '4rem' }}>
						{/* 1st Place */}
						<div className='podium-card podium-card-first'>
							<div className='podium-rank-badge'>
								<span className='rank-pill rank-pill-1'>1st place</span>
								<span className='podium-icon'><FiAward /></span>
							</div>
							<div className='podium-amount text-gradient-gold'>₹10,000</div>
							<ul className='podium-perks'>
								<li>Direct cash prize of ₹10,000</li>
								<li>Official certificate from NIT Calicut</li>
								<li>VIP all-access pass to pro-shows and keynotes</li>
								<li>Exclusive Tathva &apos;26 swag kit</li>
								<li>Recognized on stage at NIT Calicut</li>
							</ul>
						</div>

						{/* 2nd Place */}
						<div className='podium-card'>
							<div className='podium-rank-badge'>
								<span className='rank-pill rank-pill-2'>2nd place</span>
								<span className='podium-icon'><FiAward /></span>
							</div>
							<div className='podium-amount'>₹5,000</div>
							<ul className='podium-perks'>
								<li>Direct cash prize of ₹5,000</li>
								<li>Official certificate from NIT Calicut</li>
								<li>Free access to technical workshops</li>
								<li>Official Tathva merchandise</li>
								<li>Priority event entry</li>
							</ul>
						</div>

						{/* 3rd Place */}
						<div className='podium-card'>
							<div className='podium-rank-badge'>
								<span className='rank-pill rank-pill-3'>3rd place</span>
								<span className='podium-icon'><FiAward /></span>
							</div>
							<div className='podium-amount'>₹3,000</div>
							<ul className='podium-perks'>
								<li>Direct cash prize of ₹3,000</li>
								<li>Official certificate from NIT Calicut</li>
								<li>Priority entry to guest lectures and competitions</li>
								<li>Official Tathva merchandise</li>
								<li>Recognized delegation leadership</li>
							</ul>
						</div>
					</div>

					{/* Milestone Progression Ladder */}
					<div className={styles.sectionSubhead}>
						<h2 className={styles.sectionSubheadTitle}>Milestones</h2>
						<p className={styles.sectionSubheadDesc}>
							Unlock perks as you share, post, and refer. Each milestone is guaranteed once you reach
							the point threshold.
						</p>
					</div>

					<div className={styles.milestonesGrid}>
						<div className={styles.milestoneCard}>
							<span className={styles.milestonePointsBadge}>50 points</span>
							<h3 className={styles.milestoneTitle}>Ambassador badge</h3>
							<p className={styles.milestoneDesc}>
								An official verified badge recognizing you as your campus coordinator.
							</p>
						</div>

						<div className={styles.milestoneCard}>
							<span className={styles.milestonePointsBadge}>150 points</span>
							<h3 className={styles.milestoneTitle}>Free workshop</h3>
							<p className={styles.milestoneDesc}>
								Full waiver on any certified technical workshop at Tathva &apos;26 — AI, robotics, VLSI,
								web3.
							</p>
						</div>

						<div className={`${styles.milestoneCard} ${styles.milestoneCardHighlight}`}>
							<span className={styles.milestonePointsBadge}>299 points</span>
							<h3 className={styles.milestoneTitle}>Offer letter</h3>
							<p className={styles.milestoneDesc}>
								Official appointment letter and recommendation document signed by the Tathva &apos;26
								chairperson and NIT Calicut conveners.
							</p>
						</div>

						<div className={styles.milestoneCard}>
							<span className={styles.milestonePointsBadge}>500 points</span>
							<h3 className={styles.milestoneTitle}>VIP pro-show pass</h3>
							<p className={styles.milestoneDesc}>
								Priority entry to flagship pro-shows and celebrity performances, plus exclusive Tathva
								merchandise.
							</p>
						</div>

						<div className={styles.milestoneCard}>
							<span className={styles.milestonePointsBadge}>Top 20 rank</span>
							<h3 className={styles.milestoneTitle}>Cash pool & honors</h3>
							<p className={styles.milestoneDesc}>
								Eligibility for the ₹25,000+ reward pool and commendation certificates honoring
								the top ambassadors of South India.
							</p>
						</div>
					</div>

					{/* Secondary Perks & Benefits */}
					<div className={styles.sectionSubhead}>
						<h2 className={styles.sectionSubheadTitle}>Core ambassador privileges</h2>
						<p className={styles.sectionSubheadDesc}>
							Credentials that stay with you long after the fest.
						</p>
					</div>

					<div className='secondary-benefits-grid' style={{ marginBottom: '5rem' }}>
						<div className='benefit-feature-card'>
							<div className='benefit-feature-icon'>
								<FiAward />
							</div>
							<h3 className='benefit-feature-title'>Top 20 certificates</h3>
							<p className='benefit-feature-desc'>
								Top 20 ambassadors receive verified certificates endorsed by NIT Calicut leadership.
							</p>
						</div>

						<div className='benefit-feature-card'>
							<div className='benefit-feature-icon'>
								<FiCompass />
							</div>
							<h3 className='benefit-feature-title'>Free workshops</h3>
							<p className='benefit-feature-desc'>
								Access engineering, AI, robotics, and design masterclasses with no registration fee.
							</p>
						</div>

						<div className='benefit-feature-card'>
							<div className='benefit-feature-icon'>
								<FiBriefcase />
							</div>
							<h3 className='benefit-feature-title'>Leadership experience</h3>
							<p className='benefit-feature-desc'>
								Real-world outreach and event coordination experience for your resume and LinkedIn.
							</p>
						</div>

						<div className='benefit-feature-card'>
							<div className='benefit-feature-icon'>
								<FiUsers />
							</div>
							<h3 className='benefit-feature-title'>National network</h3>
							<p className='benefit-feature-desc'>
								Connect with student leaders from 150+ institutions across India.
							</p>
						</div>
					</div>
				</div>

				{/* Final Call to Action */}
				<FinalCTA />
			</div>

            {/* Offer Letter Popup Modal */}
            <OfferLetterModal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} />
        </>
    );
}
