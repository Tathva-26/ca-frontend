/**
 * Referral performance.
 *
 * This used to render a table of individual referrals. There is no such list
 * to render: our ticketing provider attributes bookings to a code and reports
 * the totals, but exposes no endpoint enumerating them. Showing an empty table
 * implied the data existed and had simply not loaded — these are the numbers
 * that actually exist.
 */
export default function YourReferrals({ stats, loading, error }) {
	if (loading) {
		return (
			<div className='your-referrals'>
				<h4>Your referrals</h4>
				<div className='empty'>Loading…</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='your-referrals'>
				<h4>Your referrals</h4>
				<div className='empty'>{error}</div>
			</div>
		)
	}

	// No referrer record with the provider yet. Not an error — it is created
	// the first time a code is issued.
	if (!stats?.registered) {
		return (
			<div className='your-referrals'>
				<h4>Your referrals</h4>
				<div className='empty'>
					Your referral account is not set up yet. Complete your profile and
					your code will be issued automatically.
				</div>
			</div>
		)
	}

	return (
		<div className='your-referrals'>
			<h4>Your referrals</h4>

			<div className='your-referrals-table-wrapper'>
				<table className='your-referrals-table'>
					<tbody>
						<tr>
							<th>Tickets sold</th>
							<td>{stats.ticketCount}</td>
						</tr>
						<tr>
							<th>Total sales</th>
							<td>₹{stats.salesAmount}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
				Counts confirmed bookings made with your code. A booking can take a
				few minutes to show up here after payment.
			</p>
		</div>
	)
}
