import axios from 'axios'

// Shared API instance. Auth is cookie-only: the browser attaches the
// better-auth session cookie itself, so no Authorization header and no token
// in JS/localStorage — ever. Every caller must use this instance (or another
// `withCredentials: true` call) or the session won't be sent.
// Falls back to the backend's own default port so a local run without a
// .env.local still reaches something, instead of issuing relative requests to
// this app's origin and parsing Next's HTML 404 as an API error.
const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
})

/**
 * The one place that knows how this backend reports failures.
 *
 * Error bodies are not uniform: older routes use `message`, newer ones `error`,
 * and a validation failure puts an **array** of issues in `error` rather than a
 * string.
 */
export function apiErrorMessage(err, fallback = 'Something went wrong.') {
	const body = err?.response?.data
	if (!body) return err?.message || fallback

	if (Array.isArray(body.error)) return body.error[0]?.message || fallback

	return body.error || body.message || fallback
}

export default api
