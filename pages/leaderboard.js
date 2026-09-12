import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useUserContext } from 'context/UserContext'
import FinalCTA from 'components/homepage/FinalCTA'

export default function Leaderboard() {
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
					const sorted = data.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 50)
					setLeaderboard(sorted)
				}
			})
			.catch((err) => console.log('Leaderboard API fetch notice:', err?.message || err))
			.finally(() => setLoading(false))
	}, [])

	const maxPoints = leaderboard.length > 0 ? (leaderboard[0].count || 1) * 10 : 1000

	return (
		<>
			<Head>
				<title>Leaderboard · Tathva &apos;26</title>
			</Head>

			<div style={{ paddingTop: '7rem', minHeight: '80vh', backgroundColor: '#050505' }}>
				<div className='container'>
					<div style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
						<span className='section-label'>Live standings</span>
						<h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
							Campus Ambassador <span className='text-gradient-gold'>Leaderboard</span>
						</h1>
						<p style={{ maxWidth: '700px', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
							Colleges ranked by verified points. The top 20 ambassadors qualify for the ₹25,000+
							prize pool and NIT Calicut certificates.
						</p>
					</div>

					<div className='leaderboard-editorial-card' style={{ marginBottom: '5rem' }}>
						<div className='leaderboard-meta-strip'>
							<span>Rank & campus</span>
							<span>Points</span>
						</div>

						{loading ? (
							<div className='leaderboard-empty-msg'>
								<span>Loading…</span>
							</div>
						) : leaderboard.length > 0 ? (
							<div className='standings-list'>
								{leaderboard.map((item, index) => {
									const rank = index + 1
									const rankStr = rank < 10 ? `0${rank}` : `${rank}`
									const points = (item.count || 0) * 10
									const percent = Math.min(100, Math.max(12, Math.round((points / maxPoints) * 100)))
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
														{item.name || `Ambassador ${rankStr}`}
														{isUser && <span className='standing-user-badge'>You</span>}
													</span>
														{item.college && <span className='standing-college'>{item.college}</span>}
													</div>
												</div>

												<div className='standing-right'>
													<span className='standing-points-val'>{points}</span>
													<span className='standing-points-unit'>points</span>
												</div>
											</div>

											<div className='standing-line-track'>
												<div className='standing-line-fill' style={{ width: `${percent}%` }}></div>
											</div>
										</div>
									)
								})}
							</div>
						) : (
							<div className='leaderboard-empty-msg'>
								<span>Standings will appear here once registrations open.</span>
								{user && (
									<div style={{ marginTop: '1rem', color: '#FFB347' }}>
										Your points: <strong>{user.points || 0}</strong>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<FinalCTA />
			</div>
		</>
	)
}

