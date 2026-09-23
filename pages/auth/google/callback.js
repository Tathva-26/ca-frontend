import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'
import Spinner from 'components/common/Spinner'

// OAuth landing page. Google returns to the backend callback, which sets the
// httpOnly session cookie and redirects here with no token in the URL.
// better-auth restores the session and this context loads the profile — this
// page just waits for that and routes: guest -> /login, else /profile.
//
// The backend rejects becoming a CA while registrations are closed itself
// (auth.js), before any session is created, and redirects here on failure
// (`errorCallbackURL`) with `?error=<code>`, clearing the cookie server-side.
// `logout()` is called anyway as defense in depth.
export default function GoogleCallbackPage() {
	const { isLoggedIn, authLoading, logout } = useUserContext()
	const router = useRouter()

	useEffect(() => {
		if (!router.isReady) return
		const { error } = router.query
		if (!error) return

		// Only a closed-registrations block gets its own page; any other OAuth
		// failure (invalid code, state mismatch, etc.) is a generic sign-in
		// failure, not "registrations are closed".
		const target = error === 'CA_REGISTRATIONS_CLOSED' ? '/regclosed' : '/login'
		logout().finally(() => window.location.replace(target))
	}, [router.isReady, router.query, logout])

	useEffect(() => {
		if (authLoading || router.query.error) return

		window.location.replace(isLoggedIn ? '/profile' : '/login')
	}, [authLoading, isLoggedIn, router.query.error])

	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				display: 'grid',
				placeContent: 'center',
			}}
		>
			<Spinner />
		</div>
	)
}
