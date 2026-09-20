import { useEffect, useState } from 'react'
import { useUserContext } from 'context/UserContext'
import { fetchReferralStats } from 'lib/req/referrals'
import { toast } from 'react-toastify'

import NotActive from 'components/dashboard/NotActive'
import YourReferrals from 'components/dashboard/referrals/YourReferrals'
import DashboardLoading from 'components/dashboard/DashboardLoading'

export default function Referals() {
	const { user } = useUserContext()

	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState(null)

	/*
	 * This page used to gate on `sectionsConfig?.referrals` from the user
	 * context. The context has never provided `sectionsConfig`, so the value
	 * was always undefined and the page rendered <NotActive /> for everyone —
	 * the fetch below never even ran. The only supplier was
	 * lib/req/sections-config.js, which calls GET /api/config (a 404 on this
	 * backend) and is imported nowhere.
	 */
	useEffect(() => {
		fetchReferralStats()
			.then((data) => setStats(data))
			.catch((err) => {
				console.error(err)
				toast.error('Failed to load referrals')
			})
			.finally(() => setLoading(false))
	}, [])

	if (loading) return <DashboardLoading />
	else
		return (
			<div className='dashboard-main-content'>
				<div className='referral-code'>
					<div className='code'>REF</div>
					<div>{user?.refCode || stats?.referralCode || '--'}</div>
				</div>

				<div className='spacerv-sm'></div>

				<div className='referrals-points'>
					<h4>Points per Person</h4>
					<p>
						Refer friends to Tathva events, workshops and lectures using your unique referral code
						to receive points.
					</p>
					<div style={{
						marginBottom: '1rem',
						padding: '0.6rem 1rem',
						background: 'rgba(212, 175, 55, 0.1)',
						border: '1px solid rgba(212, 175, 55, 0.25)',
						borderRadius: '8px',
						color: '#d4af37',
						fontSize: '0.85rem',
						display: 'flex',
						alignItems: 'center',
						gap: '8px'
					}}>
						<span>🏆</span>
						<span><strong>Leaderboard Rule:</strong> Minimum of <strong>299 points</strong> to be included in the leaderboard.</span>
					</div>
					<table>
						<tbody>
							<tr>
								<td>Workshop</td>
								<td>10</td>
							</tr>
							<tr>
								<td>Lectures</td>
								<td>3</td>
							</tr>
							<tr>
								<td>Hackathons</td>
								<td>15</td>
							</tr>
							<tr>
								<td>Events</td>
								<td>10</td>
							</tr>
							<tr>
								<td>Registration</td>
								<td>5</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='spacerv-sm'></div>
				<YourReferrals stats={stats} loading={loading} />
			</div>
		)
}
