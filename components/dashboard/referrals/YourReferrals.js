/**
 * What the CA has actually earned, as reported by TIQR.
 *
 * This used to render a per-referral table (name, event, type, points). TIQR
 * does not expose the referred bookings individually — only the totals below —
 * so that table could never be filled and always read "Nothing here yet" even
 * for a CA with real referrals.
 */
export default function YourReferrals({ stats, loading }) {
	const ticketCount = stats?.ticketCount || 0
	const salesRupees = Math.round((stats?.salesPaise || 0) / 100)

	return (
		<div className='your-referrals'>
			<h4>Your referrals</h4>

			{loading ? (
				<div className='empty'>Loading…</div>
			) : ticketCount > 0 ? (
				<div className='your-referrals-table-wrapper'>
					<table className='your-referrals-table'>
						<tbody>
							<tr>
								<th>Tickets booked with your code</th>
								<td>{ticketCount}</td>
							</tr>
							<tr>
								<th>Total sales referred</th>
								<td>₹{salesRupees.toLocaleString('en-IN')}</td>
							</tr>
						</tbody>
					</table>
				</div>
			) : (
				<div className='empty'>
					{stats?.registered
						? 'No bookings with your code yet. Share your link to get started.'
						: 'Nothing here yet'}
				</div>
			)}
		</div>
	)
}
