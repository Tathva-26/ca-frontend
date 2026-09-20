import api from 'lib/api'

/**
 * Referral performance for the signed-in campus ambassador.
 *
 * `GET /api/referrals` answers with **aggregates**, not a list:
 *
 *   { referralCode, successfulTicketCount, successfulSalesAmount, registered }
 *
 * Our ticketing provider owns referral attribution and exposes no endpoint
 * listing the individual bookings a code produced, so a per-referral table is
 * not something this site can build today. That is a provider limitation, not
 * a missing fetch here.
 *
 * `registered: false` with zeroes is a normal state, not an error: it means
 * the CA has no referrer record with the provider yet.
 *
 * 403 for a non-CA account; 502 when the provider is unreachable.
 */
export async function fetchReferralStats() {
	const { data } = await api.get('/api/referrals')

	return {
		referralCode: data?.referralCode || '',
		ticketCount: data?.successfulTicketCount ?? 0,
		salesAmount: data?.successfulSalesAmount ?? 0,
		registered: data?.registered !== false,
	}
}

/**
 * The CA's own code, registering them with the provider on first call.
 *
 * Only worth calling when `fetchReferralStats` came back without one — the
 * codes are issued by the provider, so a locally generated one would not match
 * and there is nothing to fall back to.
 */
export async function fetchReferralCode() {
	const { data } = await api.get('/api/referrals/code')
	return data?.referralCode || ''
}
