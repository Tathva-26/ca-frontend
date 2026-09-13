import { useState, useEffect } from 'react'

import PageHeader from 'components/common/PageHeader'
import RUReady from 'components/common/RUReady'
import styles from 'components/leaderboard/leaderboard.module.css'
import GhostFibers from 'components/leaderboard/GhostFibers'

export default function Leaderboard() {
	const { user } = useUserContext()
	const [leaderboard, setLeaderboard] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		/*
		// Leaderboard API temporarily disabled

		fetch('https://api.tathva.org/api/leaderboard')
		.then((res) => res.json())
		.then((data) => {
			const sorted = data
			.sort((a, b) => b.count - a.count)
			.slice(0, 50)

			setLeaderboard(sorted)
		})
		.catch((err) => console.error('Error fetching leaderboard:', err))
		.finally(() => setLoading(false))
		*/

		// Remove the normal grid background while on the leaderboard
		document.body.classList.add('leaderboard-page')

		// Stop the page from staying on "Loading..."
		setLoading(false)

		// Put the normal background back when leaving the leaderboard
		return () => {
			document.body.classList.remove('leaderboard-page')
		}
	}, [])

	const maxPoints = leaderboard.length > 0 ? (leaderboard[0].count || 1) * 10 : 1000

	return (
		<div className='relative min-h-screen overflow-hidden'>
			{/* GhostFibers full-page background */}
			<GhostFibers className='fixed inset-0 z-0' />

			{/* Page content above GhostFibers */}
			<div className='relative z-10'>
				<PageHeader title='Leaderboard' />

				<div className='container'>
					<div className={styles['leaderboard']}>
						{loading ? (
							<div className={styles['empty']}>Loading...</div>
						) : leaderboard.length ? (
							<div className={styles['participants-wrapper']}>
								<div className={styles['participants-header']}>
									<span className={styles['p-rank']}>Rank</span>
									<span className={styles['p-name']}>Name</span>
									<span className={styles['p-points']}>Points</span>
								</div>

								{leaderboard.map((item, index) => (
									<Participant key={index} rank={index + 1} name={item.name} points={item.count} />
								))}
							</div>
						) : (
							<div className={`${styles['empty']} ${styles['empty-leaderboard']}`}>
								No data available
							</div>
						)}
					</div>
				</div>

				<RUReady />
			</div>
		</div>
	)
}

