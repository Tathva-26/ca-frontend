import { useState, useEffect, useMemo } from 'react'
import { useUserContext } from 'context/UserContext'
import { fetchLeaderboard } from 'lib/req/leaderboard'
import SpaceBackground from 'components/common/SpaceBackground'
import styles from 'components/leaderboard/leaderboard.module.css'
import { FaCrown, FaMedal } from 'react-icons/fa'

const ITEMS_PER_PAGE = 10

/* Shape this page expects once a leaderboard endpoint exists: rows already
   ranked, as { rank, name, college, referrals }. Nothing serves that today —
   see lib/req/leaderboard — so `raw` is an empty array and the page renders
   its "sign in to view rank" state. */
function normalizeLeaderboard(raw) {
	if (!Array.isArray(raw)) return []
	return raw.map((entry) => ({
		rank: entry.rank,
		name: entry.name || 'Ambassador',
		college: entry.college || '',
		points: entry.referrals || 0,
	}))
}

export default function Leaderboard() {
	const { user, isLoggedIn } = useUserContext()
	const [currentPage, setCurrentPage] = useState(1)
	const [participants, setParticipants] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false

		fetchLeaderboard()
			.then((data) => {
				if (!cancelled) setParticipants(normalizeLeaderboard(data))
			})
			.catch((err) => console.error('Error fetching leaderboard:', err))
			.finally(() => {
				if (!cancelled) setLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		document.body.classList.add('leaderboard-page')
		return () => {
			document.body.classList.remove('leaderboard-page')
		}
	}, [])

	const totalPages = Math.max(1, Math.ceil(participants.length / ITEMS_PER_PAGE))

	// Keep the current page in range when the fetched list arrives / shrinks
	useEffect(() => {
		setCurrentPage((prev) => Math.min(prev, totalPages))
	}, [totalPages])

	// Determine current user's profile info
	const currentUserName = useMemo(() => {
		if (isLoggedIn && user?.name) return user.name
		if (isLoggedIn) return 'You'
		return 'You (Sign in to view rank)'
	}, [isLoggedIn, user])

	/* The signed-in user's own row: the leaderboard exposes no ids, so match on
	   name + college. Absent from the list means no confirmed referrals yet. */
	const currentUserEntry = useMemo(() => {
		if (!isLoggedIn || !user) return null

		const match = participants.find((p) => p.name === user.name && p.college === user.college)
		if (match) return { rank: match.rank, points: match.points }

		return { rank: participants.length + 1, points: 0 }
	}, [isLoggedIn, user, participants])

	// Current page items (strictly 10 items)
	const displayedParticipants = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
		return participants.slice(startIndex, startIndex + ITEMS_PER_PAGE)
	}, [currentPage, participants])

	const handleFirstPage = () => setCurrentPage(1)
	const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
	const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
	const handleLastPage = () => setCurrentPage(totalPages)
	const handlePageClick = (page) => setCurrentPage(page)

	return (
		<div className={styles['leaderboard-page-wrapper']}>
			<SpaceBackground />

			<div className={styles['leaderboard-content-wrapper']}>
				<div className={styles['leaderboard-container']}>
					{/* Compact Page Title */}
					<div className={styles['title-wrapper']}>
						<h1 className={styles['page-title']}>Leaderboard</h1>
					</div>

					{/* Leaderboard Card */}
					<div className={styles['leaderboard-card']}>
						{/* Table Header Row */}
						<div className={`${styles['grid-row']} ${styles['header-row']}`}>
							<span className={styles['col-rank']}>Rank</span>
							<span className={styles['col-name']}>Name</span>
							<span className={styles['col-points']}>Points</span>
						</div>

						{/* 10 Paginated Participant Rows */}
						<ul className={styles['participant-list']}>
							{displayedParticipants.map((item) => (
								<li
									key={item.rank}
									className={`${styles['grid-row']} ${styles['participant-row']}`}
								>
									<span className={styles['col-rank']}>
										{item.rank === 1 ? (
											<span className={styles['rank-badge-1']}>
												<FaCrown className={styles['top-icon']} /> 1
											</span>
										) : item.rank === 2 ? (
											<span className={styles['rank-badge-2']}>
												<FaMedal className={styles['top-icon']} /> 2
											</span>
										) : item.rank === 3 ? (
											<span className={styles['rank-badge-3']}>
												<FaMedal className={styles['top-icon']} /> 3
											</span>
										) : (
											item.rank
										)}
									</span>
									<span className={styles['col-name']} title={item.name}>
										{item.name}
									</span>
									<span className={styles['col-points']}>
										{item.points.toLocaleString()}
										<span className={styles['points-unit']}>pts</span>
									</span>
								</li>
							))}
						</ul>

						{/* Current User's Rank ("Our Rank") Pinned Section */}
						<div className={styles['user-rank-section']}>
							<div className={`${styles['grid-row']} ${styles['user-rank-row']}`}>
								<span className={styles['col-rank']}>
									{loading ? '…' : currentUserEntry ? currentUserEntry.rank : '—'}
								</span>
								<span className={styles['col-name']}>
									<span>{currentUserName}</span>
									<span className={styles['you-badge']}>YOU</span>
								</span>
								<span className={styles['col-points']}>
									{loading ? '…' : currentUserEntry ? currentUserEntry.points.toLocaleString() : '—'}
									<span className={styles['points-unit']}>pts</span>
								</span>
							</div>
						</div>

						{/* Pagination Controls */}
						<nav className={styles['pagination-wrapper']} aria-label='Leaderboard pagination'>
							{/* First Page */}
							<button
								type='button'
								className={`${styles['page-btn']} ${styles['page-nav-btn']}`}
								onClick={handleFirstPage}
								disabled={currentPage === 1}
								aria-label='First page'
								title='First page'
							>
								«
							</button>

							{/* Previous Page */}
							<button
								type='button'
								className={`${styles['page-btn']} ${styles['page-nav-btn']}`}
								onClick={handlePrevPage}
								disabled={currentPage === 1}
								aria-label='Previous page'
								title='Previous page'
							>
								‹
							</button>

							{/* Numbered Page Buttons */}
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
								<button
									key={pageNum}
									type='button'
									className={`${styles['page-btn']} ${
										currentPage === pageNum ? styles['active'] : ''
									}`}
									onClick={() => handlePageClick(pageNum)}
									aria-current={currentPage === pageNum ? 'page' : undefined}
								>
									{pageNum}
								</button>
							))}

							{/* Next Page */}
							<button
								type='button'
								className={`${styles['page-btn']} ${styles['page-nav-btn']}`}
								onClick={handleNextPage}
								disabled={currentPage === totalPages}
								aria-label='Next page'
								title='Next page'
							>
								›
							</button>

							{/* Last Page */}
							<button
								type='button'
								className={`${styles['page-btn']} ${styles['page-nav-btn']}`}
								onClick={handleLastPage}
								disabled={currentPage === totalPages}
								aria-label='Last page'
								title='Last page'
							>
								»
							</button>
						</nav>
					</div>
				</div>
			</div>
		</div>
	)
}
