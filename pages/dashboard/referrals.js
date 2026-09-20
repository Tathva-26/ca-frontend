import { useEffect, useState } from 'react'
import { useUserContext } from 'context/UserContext'
import { fetchReferralCode, fetchReferralStats } from 'lib/req/referrals'

import NotActive from 'components/dashboard/NotActive'
import YourReferrals from 'components/dashboard/referrals/YourReferrals'
import DashboardLoading from 'components/dashboard/DashboardLoading'

export default function Referals() {
	const { user, sectionsConfig, authLoading, isLoggedIn } = useUserContext()

	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!sectionsConfig?.referrals || authLoading || !isLoggedIn) return

		let cancelled = false

		async function load() {
			try {
				const next = await fetchReferralStats()

				/*
				 * The stats call reports a code only once the provider has a
				 * referrer record. `/api/referrals/code` is what creates one,
				 * so it is the fallback rather than a duplicate request.
				 */
				if (!next.referralCode) {
					try {
						next.referralCode = await fetchReferralCode()
						next.registered = true
					} catch (codeErr) {
						console.error('Failed to issue a referral code:', codeErr)
					}
				}

				if (!cancelled) setStats(next)
			} catch (err) {
				console.error('Failed to load referrals:', err)
				if (cancelled) return

				// 403 means this account is not a CA, which is a different thing
				// from the call failing.
				setError(
					err?.response?.status === 403
						? 'This account is not registered as a campus ambassador.'
						: 'Could not load your referral stats. Please try again.'
				)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [sectionsConfig, authLoading, isLoggedIn])

	if (!sectionsConfig?.referrals) return <NotActive />
	else if (loading) return <DashboardLoading />
	else
		return (
			<div className='dashboard-main-content'>
				<div className='referral-code'>
					<div className='code'>REF</div>
					<div>{stats?.referralCode || user?.refCode || '--'}</div>
				</div>

				<div className='spacerv-sm'></div>

				{/*
				  The points table that used to live here described a scheme this
				  backend does not implement: referrals are attributed by our
				  ticketing provider and reported as confirmed tickets and sales
				  totals, with no per-event point values and no points leaderboard.
				  Keeping it would have promised ambassadors a score nothing computes.
				*/}
				<div className='referrals-points'>
					<h4>How it works</h4>
					<p>
						Share your code — or a link carrying{' '}
						<code>?referral_code={stats?.referralCode || 'YOURCODE'}</code> — with
						friends registering for Tathva events, workshops and lectures. Every
						booking they pay for is counted against your code.
					</p>
					<p>
						Only confirmed bookings count, so a registration shows up once
						payment has gone through rather than the moment it is started.
					</p>
				</div>
				<div className='spacerv-sm'></div>
				<YourReferrals stats={stats} loading={loading} error={error} />
			</div>
		)
}
