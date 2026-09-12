import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserContext } from 'context/UserContext'

export default function LeaderboardSection() {
	const { user } = useUserContext()
	const [leaderboard, setLeaderboard] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch('https://api.tathva.org/api/leaderboard')
			.then((res) => {
				if (!res.ok) throw new Error('Network response not ok')
				return res.json()
			})
			.then((data) => {
				if (Array.isArray(data)) {
					const sorted = data.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10)
					setLeaderboard(sorted)
				}
			})
			.catch((err) => {
				console.log('Leaderboard API fetch notice:', err?.message || err)
			})
			.finally(() => setLoading(false))
	}, [])

	// Determine max points for relative bar widths
	const maxPoints = leaderboard.length > 0 ? (leaderboard[0].count || 1) * 10 : 1000

	return (
		<section className='leaderboard-section' id='leaderboard'>
			<div className='container'>
				<div className='leaderboard-header'>
					<div className='leaderboard-header-left'>
						<span className='leaderboard-overline'>08 // SUB-CONTINENTAL RANKINGS</span>
						<h2 className='leaderboard-title'>
							The Campus <span className='text-gradient-gold'>Leaderboard</span>.
						</h2>
						<p className='leaderboard-subtitle'>
							Real-time point standings across all registered ambassador nodes. The top 20 ambassadors
							qualify for the Tathva &apos;26 Prize Pool and verified NIT Calicut Certificates.
						</p>
					</div>

					<Link href='/leaderboard'>
						<a className='btn-outline'>View Full Leaderboard →</a>
					</Link>
				</div>

				<div className='leaderboard-editorial-card'>
					<div className='leaderboard-meta-strip'>
						<span>RANK & INSTITUTION</span>
						<span>VERIFIED SCORE</span>
					</div>

					{loading ? (
						<div className='leaderboard-empty-msg'>
							<span>SYNCING TELEMETRY // LOADING RANKINGS...</span>
						</div>
					) : leaderboard.length > 0 ? (
						<div className='standings-list'>
							{leaderboard.map((item, index) => {
								const rank = index + 1
								const rankStr = rank < 10 ? `0${rank}` : `${rank}`
								const points = (item.count || 0) * 10
								const percent = Math.min(100, Math.max(15, Math.round((points / maxPoints) * 100)))
								const isUser = Boolean(
									user &&
									((item.name && user.name && item.name.toLowerCase() === user.name.toLowerCase()) ||
										(item.tathvaId && user.tathvaId && item.tathvaId === user.tathvaId))
								)

								return (
									<div
										key={index}
										className={`standing-item ${isUser ? 'standing-item-user' : ''}`}
									>
										<div className='standing-row-top'>
											<div className='standing-left'>
												<span className='standing-rank-num'>{rankStr}</span>
												<div className='standing-name-block'>
													<span className='standing-name'>
														{item.name || item.campus || `Campus Node ${rankStr}`}
														{isUser && <span className='standing-user-badge'>YOU</span>}
													</span>
													{item.college && <span className='standing-college'>{item.college}</span>}
												</div>
											</div>

											<div className='standing-right'>
												<span className='standing-points-val'>{points}</span>
												<span className='standing-points-unit'>PTS</span>
											</div>
										</div>

										{/* Subtle progress line */}
										<div className='standing-line-track'>
											<div className='standing-line-fill' style={{ width: `${percent}%` }}></div>
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<div className='leaderboard-empty-msg'>
							<span>STANDINGS INITIALIZING // LEADERBOARD ACTIVATING AS ROUND REGISTRATIONS OPEN</span>
							{user && (
								<div style={{ marginTop: '1rem', color: '#FFB347' }}>
									Your Current Telemetry: <strong>{user.points || 0} Points</strong>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
