import api from 'lib/api'

/**
 * Referral performance for the signed-in CA, from `GET /api/referrals/`.
 *
 * TIQR issues and tracks referral codes, and it reports AGGREGATES only — a
 * confirmed-booking count and a sales total attributed via `referred_by`.
 * There is no endpoint, here or on TIQR, that lists the referred bookings
 * individually, so a per-referral table cannot be built from this.
 *
 * Requires the CA role: the endpoint answers 403 for anyone else. That, and a
 * CA who has never been registered with TIQR, both come back as zeroes rather
 * than an error — neither is worth interrupting the dashboard over.
 *
 * @returns {Promise<{referralCode: string|null, ticketCount: number,
 *   salesPaise: number, registered: boolean}>}
 */
export async function fetchReferralStats() {
	try {
		const { data } = await api.get('/api/referrals/')

		return {
			referralCode: data?.referralCode || null,
			ticketCount: Number(data?.successfulTicketCount || 0),
			// TIQR reports sales in paise, inclusive of its fee and GST: a ₹1
			// ticket comes back as 105, not 1.
			salesPaise: Number(data?.successfulSalesAmount || 0),
			registered: Boolean(data?.registered),
		}
	} catch (err) {
		console.error('Failed to fetch referral stats:', err)
		return { referralCode: null, ticketCount: 0, salesPaise: 0, registered: false }
	}
}

export default fetchReferralStats
