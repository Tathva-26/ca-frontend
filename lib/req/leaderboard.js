import axios from 'axios'

/**
 * The leaderboard has no backend endpoint yet.
 *
 * `/api/leaderboard/get` is not served — the backend tracks referrals as
 * per-CA aggregates from our ticketing provider and has nothing that ranks
 * them. Rather than throw, this resolves empty so the page renders its own
 * "no rankings" state; it starts working unchanged once the endpoint exists.
 */
export async function fetchLeaderboard() {
	try {
		const { data } = await axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leaderboard/get`
		)
		return data?.leaderBoard ?? []
	} catch (err) {
		if (err?.response?.status !== 404) {
			console.error('Failed to fetch leaderboard:', err)
		}
		return []
	}
}
