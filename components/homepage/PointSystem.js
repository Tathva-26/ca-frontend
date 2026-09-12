import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import CountUp from 'react-countup'

export default function PointSystem() {
	const { isLoggedIn, user } = useUserContext()
	const router = useRouter()

	const currentPoints = Number(user?.points || 0)
	const targetPoints = 299
	const isEligible = currentPoints >= targetPoints
	const remainingPoints = Math.max(0, targetPoints - currentPoints)
	const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100))

	return (
		<section className='point-system-section' id='points'>
			<div className='container'>
				<div className='point-header'>
					<span className='point-overline'>04 // MILESTONE SCORING MATRIX</span>
					<h2 className='point-title'>
						Accumulate Points. <span className='text-gradient-gold'>Unlock The 299 Milestone.</span>
					</h2>
					<p className='point-subtitle'>
						Points are awarded for verified student engagement and registration drives. Reaching 299
						points officially qualifies you for the Tathva &apos;26 Offer Letter and the leaderboard prize pool.
					</p>
				</div>

				<div className='point-content-grid'>
					{/* Left: Dynamic Live User Progress */}
					<div className='point-progress-panel'>
						<div className='progress-panel-top'>
							<span className='progress-meta-tag'>
								{isLoggedIn ? `AMBASSADOR TELEMETRY // ${user?.name || 'VERIFIED CA'}` : 'YOUR PROGRESS TRACKER'}
							</span>

							<div className='progress-score-display'>
								<span className='score-current'>
									{isLoggedIn ? (
										<CountUp end={currentPoints} duration={1.5} />
									) : (
										'0'
									)}
								</span>
								<span className='score-target'>/ {targetPoints} PTS</span>
							</div>

							<div className='progress-bar-track'>
								<div
									className='progress-bar-fill'
									style={{ width: isLoggedIn ? `${progressPercent}%` : '0%' }}
								></div>
							</div>
						</div>

						{/* Dynamic Feedback Callout */}
						{isLoggedIn ? (
							isEligible ? (
								<div className='progress-status-callout status-callout-unlocked'>
									<span className='callout-icon'>✓</span>
									<p className='callout-text'>
										MILESTONE REACHED — YOUR TATHVA &apos;26 OFFER LETTER IS UNLOCKED!
									</p>
								</div>
							) : (
								<div className='progress-status-callout'>
									<span className='callout-icon'>⚡</span>
									<p className='callout-text'>
										{remainingPoints} POINTS TO UNLOCK YOUR OFFICIAL OFFER LETTER
									</p>
								</div>
							)
						) : (
							<div className='progress-status-callout'>
								<span className='callout-icon'>🔒</span>
								<p className='callout-text'>
									SIGN IN TO SYNC AND VIEW YOUR REAL-TIME ACCUMULATED POINTS
								</p>
							</div>
						)}

						<div>
							{isLoggedIn ? (
								<a href='#offer-letter' className='btn-outline' style={{ width: '100%', justifyContent: 'center' }}>
									{isEligible ? 'View Unlocked Offer Letter ↓' : 'Inspect Eligibility Details ↓'}
								</a>
							) : (
								<button
									onClick={() => router.push('/login')}
									className='btn-primary'
									style={{ width: '100%', justifyContent: 'center' }}
								>
									Sign in to Track Live Progress →
								</button>
							)}
						</div>
					</div>

					{/* Right: Point Matrix Allocation Rules */}
					<div className='point-rules-panel'>
						<div className='point-rule-card'>
							<div className='rule-info'>
								<h3 className='rule-title'>Workshop Enrolment</h3>
								<p className='rule-desc'>Awarded per student successfully registered for technical workshops.</p>
							</div>
							<div className='rule-badge'>
								<span className='rule-pts'>+10</span>
								<span className='rule-unit'>PTS / REG</span>
							</div>
						</div>

						<div className='point-rule-card'>
							<div className='rule-info'>
								<h3 className='rule-title'>Competitive Hackathons</h3>
								<p className='rule-desc'>Awarded per participant or team registered in national hackathons.</p>
							</div>
							<div className='rule-badge'>
								<span className='rule-pts'>+15</span>
								<span className='rule-unit'>PTS / REG</span>
							</div>
						</div>

						<div className='point-rule-card'>
							<div className='rule-info'>
								<h3 className='rule-title'>Guest Lecture Series</h3>
								<p className='rule-desc'>Awarded for each peer registered to attend keynotes & masterclasses.</p>
							</div>
							<div className='rule-badge'>
								<span className='rule-pts'>+3</span>
								<span className='rule-unit'>PTS / REG</span>
							</div>
						</div>

						<div className='point-rule-card'>
							<div className='rule-info'>
								<h3 className='rule-title'>Fest Pass & Event Referrals</h3>
								<p className='rule-desc'>Awarded for each student using your unique ambassador referral code.</p>
							</div>
							<div className='rule-badge'>
								<span className='rule-pts'>+5</span>
								<span className='rule-unit'>PTS / REG</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
