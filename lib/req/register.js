import api from 'lib/api'

/**
 * Completes (or edits) the signed-in user's CA profile.
 *
 * `PUT /api/user/` accepts exactly these seven fields and ignores anything
 * else — `name` included, since it comes from Google at sign-in and is not
 * editable. `role` is not merely ignored but rejected with a 403; promotion is
 * an admin endpoint.
 *
 * Validation worth knowing, because it comes back as a 400 otherwise: an empty
 * string is rejected for every field, phone must be 10–15 digits (a leading 91
 * or 0 is stripped server-side), semester is 1–10 and year is 1–5.
 */
export async function completeProfile(form) {
	const { phone, college, district, state, semester, branch, year } = form
	const payload = { phone, college, district, state, semester, branch, year }

	// Profile completion after sign-up and profile editing are the same
	// operation on this backend. Cookie-only auth via the shared credentialed
	// instance; no tokens anywhere.
	await api.put('/api/user/', payload)
}
