import { useEffect, useState } from 'react'
import { useContext, createContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const UserContext = createContext({})

export default function UserContextWrapper({ children }) {
	const router = useRouter()

	const [user, setUser] = useState(null)
	const [accessToken, setAccessToken] = useState(null)
	const [refreshToken, setRefreshToken] = useState(null)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	// Initialize user from stored tokens on mount
	useEffect(() => {
		const storedAccessToken = localStorage.getItem('access_token')
		const storedRefreshToken = localStorage.getItem('refresh_token')

		if (storedAccessToken && storedRefreshToken) {
			setAccessToken(storedAccessToken)
			setRefreshToken(storedRefreshToken)
			fetchUserProfile(storedAccessToken)
		}
	}, [])

	// Fetch user profile
	const fetchUserProfile = async (token) => {
		try {
			const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			const currentUser = {
				userId: data?.id,
				tathvaId: data?.tathvaId || data?.tathva_id,
				is_ca: data?.is_ca || false,
				name: data?.name,
				email: data?.email,
				phone: data?.phone || '',
				college: data?.college || '',
				branch: data?.branch || '',
				year: data?.year || '',
				experience: data?.experience || false,
				refCode: data?.refCode || data?.ref_code || '',
				points: Number(data?.totalPoints ?? data?.total_points ?? data?.points ?? 0),
				imageUrl: `https://source.boringavatars.com/beam/120/${data?.email}?colors=FF6A00,FF8A00,FFB347,111111,FFFFFF`,
			}

			setUser(currentUser)
			setIsLoggedIn(true)
			return currentUser
		} catch (err) {
			console.error('Error fetching user profile:', err)

			// If token is invalid, try to refresh
			if (err.response?.status === 401) {
				const refreshed = await refreshAccessToken()
				if (!refreshed) {
					logout()
				}
			}
		}
	}

	// Refresh access token using refresh token
	const refreshAccessToken = async () => {
		try {
			const storedRefreshToken = localStorage.getItem('refresh_token')
			if (!storedRefreshToken) return false

			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/token/refresh/`,
				{ refresh: storedRefreshToken }
			)

			const newAccessToken = data.access
			localStorage.setItem('access_token', newAccessToken)
			setAccessToken(newAccessToken)

			await fetchUserProfile(newAccessToken)
			return true
		} catch (err) {
			console.error('Error refreshing token:', err)
			return false
		}
	}

	// Sign up new user
	const signUp = async (userData) => {
		try {
			const { data } = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register/`,
				userData
			)

			toast.success('Registration successful! Please check your email to verify your account.')
			return { success: true, data }
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				err.response?.data?.error ||
				'Registration failed. Please try again.'
			toast.error(errorMsg)
			console.error('Signup error:', err)
			return { success: false, error: errorMsg }
		}
	}

	// Login user
	const login = async (email, password) => {
		try {
			const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/`, {
				email,
				password,
			})

			// Store tokens
			localStorage.setItem('access_token', data.access)
			localStorage.setItem('refresh_token', data.refresh)

			setAccessToken(data.access)
			setRefreshToken(data.refresh)

			// Fetch user profile
			await fetchUserProfile(data.access)

			toast.success('Logged in successfully!')
			return { success: true }
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				err.response?.data?.error ||
				'Login failed. Please check your credentials.'
			toast.error(errorMsg)
			console.error('Login error:', err)
			return { success: false, error: errorMsg }
		}
	}

	// Logout user
	function logout() {
		setUser(null)
		setIsLoggedIn(false)
		setAccessToken(null)
		setRefreshToken(null)
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		toast.success('Signed out successfully')
		router.push('/')
	}

	// Get current user (async)
	function getUser() {
		return new Promise(async (resolve, reject) => {
			try {
				const token = localStorage.getItem('access_token')
				if (token) {
					const userData = await fetchUserProfile(token)
					resolve(userData)
				} else {
					resolve(null)
				}
			} catch (err) {
				reject(err)
			}
		})
	}

	// Create axios instance with auto token refresh
	const createAuthAxios = () => {
		const instance = axios.create({
			baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
		})

		instance.interceptors.request.use(
			(config) => {
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		instance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true

					const refreshed = await refreshAccessToken()
					if (refreshed) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`
						return instance(originalRequest)
					}
				}

				return Promise.reject(error)
			}
		)

		return instance
	}

	return (
		<UserContext.Provider
			value={{
				user,
				accessToken,
				refreshToken,
				isLoggedIn,
				signUp,
				login,
				logout,
				getUser,
				fetchUserProfile,
				refreshAccessToken,
				createAuthAxios,
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export function useUserContext() {
	return useContext(UserContext) || {}
}
