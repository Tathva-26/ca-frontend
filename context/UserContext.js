import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { createAuthClient } from 'better-auth/react'
import api from 'lib/api'

const UserContext = createContext()

// The backend (better-auth) owns the session in an httpOnly cookie.
// This client only talks to it: `useSession` probes the session,
// `signIn.social` starts Google OAuth, `signOut` clears it. No token is ever
// visible here — not in state, storage, or URLs.
const { signIn, signOut, useSession } = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

// GET /api/user/ returns { id, email, name, phone, referralCode, college,
// district, state, role, branch, semester, year }.
function normalizeProfile(data) {
	if (!data || (!data.id && !data.email)) return null
	return {
		// Same gate the backend uses before issuing a referral code
		isComplete: !!(
			data.phone &&
			data.college &&
			data.district &&
			data.state &&
			data.branch &&
			data.semester &&
			data.year
		),
		name: data.name,
		email: data.email,
		role: data.role,
		phone: data.phone || '',
		college: data.college || '',
		branch: data.branch || '',
		year: data.year || '',
		semester: data.semester || '',
		district: data.district || '',
		state: data.state || '',
		refCode: data.referralCode || '',
		totalPoints: data.totalPoints || 0,
	}
}

export default function UserContextWrapper({ children }) {
	const { data: sessionData, isPending: sessionPending } = useSession()
	const [profile, setProfile] = useState(null)
	const [profileLoading, setProfileLoading] = useState(true)

	const sessionUser = sessionData?.user || null

	const refreshProfile = useCallback(async () => {
		try {
			const { data } = await api.get('/api/user/')
			const normalized = normalizeProfile(data)
			setProfile(normalized)
			return normalized
		} catch {
			setProfile(null)
			return null
		}
	}, [])

	// (Re)load the profile whenever the session identity appears, changes, or
	// disappears. The session cookie itself is managed by better-auth.
	useEffect(() => {
		if (sessionPending) return
		let cancelled = false
		setProfileLoading(true)
		if (!sessionUser) {
			setProfile(null)
			setProfileLoading(false)
			return
		}
		refreshProfile().finally(() => {
			if (!cancelled) setProfileLoading(false)
		})
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionPending, sessionUser?.id])

	const user = profile
	const isLoggedIn = !!sessionUser && !!profile
	const authLoading = sessionPending || profileLoading

	// Google sign-in via better-auth: POSTs /api/auth/sign-in/social, which
	// answers { url, redirect: true } and the client navigates to Google.
	// New users on this site become CAs (role rides in the OAuth state).
	const loginWithGoogle = useCallback(async () => {
		try {
			// better-auth resolves with { error } on HTTP failures instead of throwing
			const { error } = await signIn.social({
				provider: 'google',
				callbackURL: `${window.location.origin}/auth/google/callback`,
				errorCallbackURL: `${window.location.origin}/auth/google/callback`,
				additionalData: { role: 'CA' },
			})
			if (error) throw new Error(error.message || error.statusText)
		} catch (err) {
			console.error('Failed to start Google sign-in:', err)
			toast.error('Could not start Google sign-in. Please try again.')
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			await signOut()
		} catch (err) {
			console.error('Sign-out failed:', err)
		} finally {
			setProfile(null)
			toast.success('Signed out successfully')
		}
	}, [])

	const value = useMemo(
		() => ({
			user,
			isLoggedIn,
			authLoading,
			loginWithGoogle,
			logout,
			refreshProfile,
		}),
		[user, isLoggedIn, authLoading, loginWithGoogle, logout, refreshProfile]
	)

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserContext() {
	return useContext(UserContext)
}
