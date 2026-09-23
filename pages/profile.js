import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { toast } from 'react-toastify'
import { useUserContext } from 'context/UserContext'
import { fetchReferralStats, fetchReferralCode } from 'lib/req/referrals'
import {
	FiCopy,
	FiCheck,
	FiLogOut,
	FiMail,
	FiPhone,
	FiUser,
	FiEdit2,
	FiX,
	FiBookOpen,
	FiAward,
	FiMapPin,
	FiCalendar,
	FiAlertCircle,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import api from 'lib/api'

import s from '../styles/hub-profile.module.css'

/* ═════════════════════════════════════════════════════════════
   REFERRAL REWARDS & MILESTONES CONFIG
   - 1–4 referrals: No reward
   - 5 referrals: ₹100 milestone
   - 6–9: ₹50 per referral
   - 10 referrals: ₹200 milestone (total ₹500)
   - 11–14: ₹50 per referral
   - 15 referrals: ₹300 milestone (total ₹1,000)
   - 16–19: ₹50 per referral
   - 20 referrals: ₹500 milestone (total ₹1,700)
   - 21–49: ₹50 per referral
   - 50 referrals: ₹1,000 major milestone (total ₹4,150)
   - 51+: ₹50 per referral
   ═════════════════════════════════════════════════════════════ */
export const REFERRAL_MILESTONES = [
	{ count: 0, bonus: 0, label: 'Start', title: '0 Referrals', total: 0 },
	{
		count: 5,
		bonus: 100,
		label: 'Milestone 1',
		title: '5 Referrals',
		bonusText: '₹100 Milestone',
		total: 100,
	},
	{
		count: 10,
		bonus: 200,
		label: 'Milestone 2',
		title: '10 Referrals',
		bonusText: '₹200 Milestone',
		total: 500,
	},
	{
		count: 15,
		bonus: 300,
		label: 'Milestone 3',
		title: '15 Referrals',
		bonusText: '₹300 Milestone',
		total: 1000,
	},
	{
		count: 20,
		bonus: 500,
		label: 'Milestone 4',
		title: '20 Referrals',
		bonusText: '₹500 Milestone',
		total: 1700,
	},
	{
		count: 50,
		bonus: 1000,
		label: 'Major Milestone',
		title: '50 Referrals',
		bonusText: '₹1,000 Major Milestone',
		total: 4150,
	},
]

export const MAX_MILESTONE_COUNT = 50

export function calculateReferralRewards(count) {
	const r = Math.max(0, count)
	if (r < 5) return 0
	if (r < 10) return 100 + (r - 5) * 50
	if (r < 15) return 500 + (r - 10) * 50
	if (r < 20) return 1000 + (r - 15) * 50
	if (r < 50) return 1700 + (r - 20) * 50
	return 4150 + (r - 50) * 50
}

export function calculateMilestoneProgress(count, milestones = REFERRAL_MILESTONES) {
	if (!count || count <= 0) return 0
	const numSegments = milestones.length - 1
	if (numSegments <= 0) return 0
	const maxCount = milestones[milestones.length - 1].count
	if (count >= maxCount) return 100

	const segmentWidth = 100 / numSegments

	for (let i = 0; i < numSegments; i++) {
		const startCount = milestones[i].count
		const endCount = milestones[i + 1].count

		if (count >= startCount && count <= endCount) {
			const segmentProgress = (count - startCount) / (endCount - startCount)
			return i * segmentWidth + segmentProgress * segmentWidth
		}
	}

	return 100
}

/* Invite link for the campus ambassador WhatsApp group, shown at the top of
   every profile. There's no backend config endpoint for it, so it lives here —
   swap in a new invite URL when the group is rotated. Left empty, the button
   simply isn't rendered. */
const CA_WHATSAPP_GROUP_URL =
	'https://chat.whatsapp.com/D3bhWv9kAv5KYNwd2OrODI?s=sw&p=i&mlu=4&ilr=4' /* One-time nudge towards the WhatsApp group. It pops up shortly after the
   profile loads and closes itself again after a few seconds; "Don't show
   again" persists the opt-out per browser so it never reappears. */
const WHATSAPP_POPUP_STORAGE_KEY = 'tathva_ca_whatsapp_popup_dismissed'
const WHATSAPP_POPUP_DELAY_MS = 1200
const WHATSAPP_POPUP_DURATION_MS = 12000

/* The backend only issues a referral code once the CA profile is complete.
   This mirrors the exact gate in userController.getUser — phone, college,
   district, state, branch, semester, year. Name is deliberately absent: it is
   set at sign-up and can no longer be changed, so it can't be "missing" here. */
const REQUIRED_PROFILE_FIELDS = [
	{ key: 'phone', label: 'Phone' },
	{ key: 'college', label: 'College' },
	{ key: 'district', label: 'District' },
	{ key: 'state', label: 'State' },
	{ key: 'branch', label: 'Branch' },
	{ key: 'year', label: 'Year' },
	{ key: 'semester', label: 'Semester' },
]

/* ── edit form validation ── */
// Letters (incl. accented), spaces and common name punctuation only
const PLACE_NAME_RE = /^[\p{L}][\p{L}\s.'-]*$/u
const HAS_LETTER_RE = /\p{L}/u

// Accepts a 10-digit Indian mobile number, optionally prefixed with +91 / 91 / 0
// and separated by spaces or dashes. Returns the bare 10 digits, or null.
export function normalizePhone(raw) {
	const digits = String(raw || '').replace(/[\s-]/g, '')
	const match = digits.match(/^(?:\+?91|0)?([6-9]\d{9})$/)
	return match ? match[1] : null
}

function validateTextField(value, label, { min = 2, max = 100, placesOnly = false } = {}) {
	if (!value) return `${label} is required`
	if (value.length < min) return `${label} must be at least ${min} characters`
	if (value.length > max) return `${label} must be at most ${max} characters`
	if (placesOnly && !PLACE_NAME_RE.test(value))
		return `${label} can only contain letters and spaces`
	if (!HAS_LETTER_RE.test(value)) return `Enter a valid ${label.toLowerCase()}`
	return null
}

// Trims every field, validates it, and returns { values, errors }.
// `values` is only safe to submit when `errors` is empty.
export function validateProfileForm(form) {
	const values = {
		phone: String(form.phone || '').trim(),
		college: String(form.college || '')
			.trim()
			.replace(/\s+/g, ' '),
		branch: String(form.branch || '')
			.trim()
			.replace(/\s+/g, ' '),
		district: String(form.district || '')
			.trim()
			.replace(/\s+/g, ' '),
		state: String(form.state || '')
			.trim()
			.replace(/\s+/g, ' '),
		semester: String(form.semester || '').trim(),
		year: String(form.year || '').trim(),
	}
	const errors = {}

	if (!values.phone) errors.phone = 'Phone number is required'
	else {
		const phone = normalizePhone(values.phone)
		if (!phone) errors.phone = 'Enter a valid 10-digit mobile number'
		else values.phone = phone
	}

	if (!/^[1-5]$/.test(values.year)) errors.year = 'Select your year of study'

	if (!values.semester) errors.semester = 'Semester is required'
	else if (!/^[1-8]$/.test(values.semester))
		errors.semester = 'Semester must be a whole number from 1 to 8'

	const textErrors = {
		college: validateTextField(values.college, 'College', { max: 150 }),
		branch: validateTextField(values.branch, 'Branch'),
		district: validateTextField(values.district, 'District', { placesOnly: true }),
		state: validateTextField(values.state, 'State', { placesOnly: true }),
	}
	for (const [key, msg] of Object.entries(textErrors)) if (msg) errors[key] = msg

	return { values, errors }
}

export default function ProfilePage() {
	const { user: profile, authLoading, logout, refreshProfile } = useUserContext()
	const router = useRouter()

	// null until loaded; `error` means the ticketing provider could not be reached
	const [referralStats, setReferralStats] = useState(null)
	const [referralError, setReferralError] = useState(false)
	const loading = authLoading || !profile

	// edit state
	const [isEditing, setIsEditing] = useState(false)
	const [saving, setSaving] = useState(false)
	const [formErrors, setFormErrors] = useState({})
	const [editFormData, setEditFormData] = useState({
		name: '',
		phone: '',
		college: '',
		district: '',
		state: '',
		semester: '',
		branch: '',
		year: '',
	})

	// whatsapp group popup
	const [showWhatsappPopup, setShowWhatsappPopup] = useState(false)

	// copy states
	const [copied, setCopied] = useState(null) // 'code' | null

	// mobile tooltip toggle state
	const [activeBadgeTooltip, setActiveBadgeTooltip] = useState(null)

	useEffect(() => {
		function handleGlobalClick() {
			setActiveBadgeTooltip(null)
		}
		window.addEventListener('click', handleGlobalClick)
		return () => window.removeEventListener('click', handleGlobalClick)
	}, [])

	const openedEditRef = useRef(false)
	useEffect(() => {
		if (!profile || !router.isReady || openedEditRef.current) return
		openedEditRef.current = true
		if (router.query.editprofile === 'true' || !profile.isComplete) startEditing()
	}, [profile, router.isReady])

	useEffect(() => {
		if (authLoading) return // wait for context to finish restoring the session
		if (!profile) {
			router.push('/login')
			return
		}
		let cancelled = false

		fetchReferralStats()
			.then(async (stats) => {
				// The backend issues the code when the profile is completed. This
				// is the fallback for a CA it could not issue one for, and it stays
				// behind the same completeness gate the code is shown under.
				if (!stats.referralCode && profile.isComplete) {
					try {
						stats.referralCode = await fetchReferralCode()
						stats.registered = true
					} catch (err) {
						console.error('Failed to issue a referral code:', err)
					}
				}
				if (!cancelled) {
					setReferralStats(stats)
					setReferralError(false)
				}
			})
			.catch((err) => {
				console.error('Failed to load referrals:', err)
				if (!cancelled) setReferralError(true)
			})

		return () => {
			cancelled = true
		}
	}, [authLoading, profile])

	/* derived */
	// `profile.refCode` is already blank until the profile is complete; the
	// provider's copy is only trusted under the same gate.
	const refCode = profile?.refCode || (profile?.isComplete && referralStats?.referralCode) || ''
	const totalPoints = profile?.totalPoints || 0
	// Tickets the provider counts as sold through this CA's code, not people.
	const totalReferrals = referralStats?.ticketCount ?? 0
	const earnedRewards = useMemo(() => calculateReferralRewards(totalReferrals), [totalReferrals])
	const firstName = (profile?.name || 'Ambassador').split(' ')[0]

	/* Which CA details are still blank — drives the "complete your profile"
	   notice, which disappears once none of them are left. */
	const missingFields = useMemo(() => {
		if (!profile) return []
		return REQUIRED_PROFILE_FIELDS.filter(({ key }) => {
			const value = profile[key]
			return value === null || value === undefined || String(value).trim() === ''
		}).map(({ label }) => label)
	}, [profile])

	const isProfileIncomplete = missingFields.length > 0

	/* Badges criteria:
	   - Leaderboard badge: unlocked at 25% of 50 referrals (≥ 13 refs)
	   - Top 20 badge: unlocked at 75% of 50 referrals (≥ 38 refs) */
	const LEADERBOARD_REF_THRESHOLD = Math.ceil(MAX_MILESTONE_COUNT * 0.25) // 13 referrals (25%)
	const TOP20_REF_THRESHOLD = Math.ceil(MAX_MILESTONE_COUNT * 0.75) // 38 referrals (75%)

	const isInLeaderboard = totalReferrals >= LEADERBOARD_REF_THRESHOLD
	const isInTop20 = totalReferrals >= TOP20_REF_THRESHOLD && isInLeaderboard

	/* milestone progress - piecewise segment interpolation to match marker positions */
	const fillPercent = useMemo(() => {
		return calculateMilestoneProgress(totalReferrals, REFERRAL_MILESTONES)
	}, [totalReferrals])

	/* Animated fill state to trigger fill-up animation on load / update */
	const [animatedFill, setAnimatedFill] = useState(0)

	useEffect(() => {
		setAnimatedFill(0)
		const timer = setTimeout(() => {
			setAnimatedFill(fillPercent)
		}, 150)
		return () => clearTimeout(timer)
	}, [fillPercent, loading])

	/* ── whatsapp group popup ── */
	// Opens once the profile is on screen, unless this browser opted out before.
	useEffect(() => {
		if (loading || !CA_WHATSAPP_GROUP_URL) return

		let optedOut = false
		try {
			optedOut = localStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY) === 'true'
		} catch (err) {
			// private mode / blocked storage — fall through and show it
		}
		if (optedOut) return

		const timer = setTimeout(() => setShowWhatsappPopup(true), WHATSAPP_POPUP_DELAY_MS)
		return () => clearTimeout(timer)
	}, [loading])

	// Self-dismisses after a few seconds so it never sits in the way
	useEffect(() => {
		if (!showWhatsappPopup) return
		const timer = setTimeout(() => setShowWhatsappPopup(false), WHATSAPP_POPUP_DURATION_MS)
		return () => clearTimeout(timer)
	}, [showWhatsappPopup])

	useEffect(() => {
		if (!showWhatsappPopup) return
		function handleEscape(e) {
			if (e.key === 'Escape') setShowWhatsappPopup(false)
		}
		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [showWhatsappPopup])

	function dismissWhatsappPopupForever() {
		try {
			localStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, 'true')
		} catch (err) {
			console.error('Could not save WhatsApp popup preference:', err)
		}
		setShowWhatsappPopup(false)
	}

	/* copy handler using native clipboard API */
	function handleCopy(text, kind) {
		if (!text) return
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					setCopied(kind)
					toast.success('Referral code copied!')
					setTimeout(() => setCopied(null), 1600)
				})
				.catch(() => fallbackCopy(text, kind))
		} else {
			fallbackCopy(text, kind)
		}
	}

	function fallbackCopy(text, kind) {
		try {
			const textArea = document.createElement('textarea')
			textArea.value = text
			textArea.style.position = 'fixed'
			textArea.style.opacity = '0'
			document.body.appendChild(textArea)
			textArea.select()
			document.execCommand('copy')
			document.body.removeChild(textArea)
			setCopied(kind)
			toast.success('Referral code copied!')
			setTimeout(() => setCopied(null), 1600)
		} catch (err) {
			console.error(err)
			toast.error('Failed to copy')
		}
	}

	/* ── edit form handlers ── */
	function startEditing() {
		setEditFormData({
			name: profile?.name || '',
			phone: profile?.phone || '',
			college: profile?.college || '',
			district: profile?.district || '',
			state: profile?.state || '',
			semester: profile?.semester ? String(profile.semester) : '',
			branch: profile?.branch || '',
			year: profile?.year ? String(profile.year) : '',
		})
		setFormErrors({})
		setIsEditing(true)
	}

	function cancelEditing() {
		setFormErrors({})
		setIsEditing(false)
	}

	function updateEditField(key, value) {
		setEditFormData((prev) => ({ ...prev, [key]: value }))
		if (formErrors[key]) setFormErrors((prev) => ({ ...prev, [key]: undefined }))
	}

	async function handleSaveProfile(e) {
		e?.preventDefault()

		const { values, errors } = validateProfileForm(editFormData)
		if (Object.keys(errors).length > 0) {
			setFormErrors(errors)
			toast.error(Object.values(errors)[0])
			return
		}
		setFormErrors({})
		setEditFormData((prev) => ({ ...prev, ...values }))

		setSaving(true)

		try {
			// `values` holds exactly the fields PUT /api/user accepts (name is not
			// editable, so it is not sent).
			await api.put('/api/user/', values)
			await refreshProfile()

			setIsEditing(false)
			localStorage.setItem('tathva_ca_profile_completed', 'true')
			toast.success('CA details updated successfully!')
		} catch (err) {
			console.error(
				'Failed to update profile:',
				err.response?.status,
				err.response?.data || err.message
			)
			toast.error(
				err.response?.data?.message || err.response?.data?.error || 'Failed to update CA details'
			)
		} finally {
			setSaving(false)
		}
	}

	/* ── loading ── */
	if (loading) {
		return (
			<div className={`${s.hubPage} ${s.hubRoot}`}>
				<Head>
					<title>Ambassador Profile — Tathva 2026</title>
				</Head>
				<div className={s.loadingState}>
					<div className={s.loadingSpinner} />
					Loading your dashboard…
				</div>
			</div>
		)
	}

	/* ── render ── */
	return (
		<div className={`${s.hubPage} ${s.hubRoot}`}>
			<Head>
				<title>Ambassador Profile — Tathva 2026</title>
				<meta
					name='description'
					content='View your Tathva 2026 campus ambassador profile, referral activity, and points.'
				/>
			</Head>

			<div className={s.hubContainer}>
				{/* ── WELCOME ── */}
				<section className={s.welcomeSection}>
					<div className={s.welcomeMain}>
						<h1 className={s.welcomeHeading}>
							Welcome back, <span className={s.welcomeGold}>{firstName}.</span>
						</h1>
						<p className={s.welcomeDesc}>
							Share your referral code and move closer to the next milestone.
						</p>
					</div>
					<div className={s.welcomeActions}>
						{/* CA WhatsApp group — kept up here so it's the first thing on every profile */}
						{CA_WHATSAPP_GROUP_URL && (
							<a
								href={CA_WHATSAPP_GROUP_URL}
								target='_blank'
								rel='noopener noreferrer'
								className={s.whatsappBtn}
								title='CA WhatsApp group link'
								aria-label='Join the CA WhatsApp group'
							>
								<FaWhatsapp size={17} />
								<span>Join CA WhatsApp Group</span>
							</a>
						)}
						<button
							className={s.signOutBtn}
							onClick={logout}
							title='Sign out'
							aria-label='Sign out'
						>
							<FiLogOut size={16} />
							<span>Sign out</span>
						</button>
					</div>
				</section>

				{/* ── CA WHATSAPP GROUP POPUP ──
				    Shows once per browser a moment after load, closes itself after a
				    few seconds, and stays gone for good once dismissed. */}
				{showWhatsappPopup && (
					<div
						className={s.waPopupOverlay}
						onClick={() => setShowWhatsappPopup(false)}
						role='presentation'
					>
						<div
							className={s.waPopupCard}
							role='dialog'
							aria-modal='true'
							aria-labelledby='wa-popup-title'
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type='button'
								className={s.waPopupClose}
								onClick={() => setShowWhatsappPopup(false)}
								aria-label='Close'
								title='Close'
							>
								<FiX size={16} />
							</button>

							<div className={s.waPopupIcon}>
								<FaWhatsapp size={30} />
							</div>

							<h2 id='wa-popup-title' className={s.waPopupTitle}>
								Join the CA WhatsApp Group
							</h2>
							<p className={s.waPopupText}>
								This is the official campus ambassador WhatsApp group — announcements, tasks and
								everything you need for Tathva &apos;26 goes out here first.
							</p>

							<a
								href={CA_WHATSAPP_GROUP_URL}
								target='_blank'
								rel='noopener noreferrer'
								className={s.waPopupJoinBtn}
								onClick={() => setShowWhatsappPopup(false)}
							>
								<FaWhatsapp size={18} />
								<span>Join the group</span>
							</a>

							<button
								type='button'
								className={s.waPopupDismissBtn}
								onClick={dismissWhatsappPopupForever}
							>
								Don&apos;t show this again
							</button>

							{/* drains over WHATSAPP_POPUP_DURATION_MS so the auto-close isn't a surprise */}
							<div className={s.waPopupTimer}>
								<span
									className={s.waPopupTimerFill}
									style={{ animationDuration: `${WHATSAPP_POPUP_DURATION_MS}ms` }}
								/>
							</div>
						</div>
					</div>
				)}

				{/* ── INCOMPLETE PROFILE NOTICE ──
				    The referral code is only issued once every CA detail is filled in,
				    so this stays up until nothing is missing. */}
				{isProfileIncomplete && !isEditing && (
					<section className={s.profileAlert} role='status'>
						<div className={s.profileAlertIcon}>
							<FiAlertCircle size={18} />
						</div>
						<div className={s.profileAlertBody}>
							<h2 className={s.profileAlertTitle}>
								Complete your profile to get your referral code
							</h2>
							<p className={s.profileAlertText}>
								Your referral code stays locked until every detail is filled in. Still
								missing: <span className={s.profileAlertMissing}>{missingFields.join(', ')}</span>.
							</p>
						</div>
						<button type='button' className={s.profileAlertBtn} onClick={startEditing}>
							<FiEdit2 size={13} />
							<span>Complete profile</span>
						</button>
					</section>
				)}

				{/* ── TOP GRID (Details + Referral) ── */}
				<div className={s.topGrid}>
					{/* Details card */}
					<section className={`${s.detailsCard} ${s.panelGlow}`}>
						{!isEditing ? (
							/* ── VIEW MODE ── */
							<>
								<div className={s.detailsTop}>
									<div className={s.detailsAvatarGroup}>
										<div className={s.detailsAvatarWrapperStatic}>
											<div className={s.detailsAvatar}>
												<FiUser size={34} strokeWidth={1.5} />
											</div>
										</div>

										<div className={s.detailsInfo}>
											<h2 className={s.detailsName}>{profile?.name || 'Campus Ambassador'}</h2>
											{/* Icon Badges — Leaderboard & Top 20 */}
											{(isInLeaderboard || isInTop20) && (
												<div className={s.iconBadgesWrapper}>
													{/* Leaderboard Badge */}
													{isInLeaderboard && (
														<div
															className={`${s.customBadgeWrap} ${
																activeBadgeTooltip === 'leaderboard' ? s.customBadgeWrapActive : ''
															}`}
															tabIndex={0}
															role='button'
															aria-label='In Leaderboard badge'
															onClick={(e) => {
																e.stopPropagation()
																setActiveBadgeTooltip((prev) =>
																	prev === 'leaderboard' ? null : 'leaderboard'
																)
															}}
														>
															<div className={s.iconBadge} title='In Leaderboard'>
																<svg
																	viewBox='0 0 100 100'
																	className={s.badgeSvgIcon}
																	aria-hidden='true'
																>
																	<path d='M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z' />
																</svg>
															</div>
															<div className={s.customTooltipCard}>
																<div className={s.tooltipArrow} />
																<div className={s.tooltipCardContent}>
																	<div className={s.tooltipArtContainer}>
																		<svg
																			className={s.animSvgIcon}
																			viewBox='0 0 100 100'
																			xmlns='http://www.w3.org/2000/svg'
																		>
																			<path d='M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z' />
																		</svg>
																		<div className={s.tooltipStarContainer}>
																			<div className={`${s.starEight} ${s.starEightGreen}`} />
																		</div>
																	</div>
																	<div className={s.tooltipTextWrap}>
																		<div className={s.tooltipHeaderRow}>
																			<span className={s.tooltipTitle}>In Leaderboard</span>
																			<span className={s.tooltipTag}>ACTIVE</span>
																		</div>
																		<p className={s.tooltipBody}>
																			You've made it to the leaderboard. Keep referring to climb
																			higher!
																		</p>
																	</div>
																</div>
															</div>
														</div>
													)}

													{/* Top 20 Badge */}
													{isInTop20 && (
														<div
															className={`${s.customBadgeWrap} ${
																activeBadgeTooltip === 'top20' ? s.customBadgeWrapActive : ''
															}`}
															tabIndex={0}
															role='button'
															aria-label='In Top 20 badge'
															onClick={(e) => {
																e.stopPropagation()
																setActiveBadgeTooltip((prev) => (prev === 'top20' ? null : 'top20'))
															}}
														>
															<div
																className={`${s.iconBadge} ${s.iconBadgeTop20}`}
																title='In Top 20'
															>
																<svg
																	viewBox='0 0 24 24'
																	className={`${s.badgeSvgIcon} ${s.badgeSvgIconGold}`}
																	aria-hidden='true'
																>
																	<path d='M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z' />
																</svg>
															</div>
															<div className={`${s.customTooltipCard} ${s.customTooltipCardGold}`}>
																<div className={`${s.tooltipArrow} ${s.tooltipArrowGold}`} />
																<div className={s.tooltipCardContent}>
																	<div className={s.tooltipArtContainer}>
																		<svg
																			className={`${s.animSvgIcon} ${s.animSvgIconGold}`}
																			viewBox='0 0 100 100'
																			xmlns='http://www.w3.org/2000/svg'
																		>
																			<path d='M62.11,53.93c22.582-3.125,22.304-23.471,18.152-29.929-4.166-6.444-10.36-2.153-10.36-2.153v-4.166H30.099v4.166s-6.194-4.291-10.36,2.153c-4.152,6.458-4.43,26.804,18.152,29.929l5.236,7.777v8.249s-.944,4.597-4.833,4.986c-3.903,.389-7.791,4.028-7.791,7.374h38.997c0-3.347-3.889-6.986-7.791-7.374-3.889-.389-4.833-4.986-4.833-4.986v-8.249l5.236-7.777Zm7.388-24.818s2.833-3.097,5.111-1.347c2.292,1.75,2.292,15.86-8.999,18.138l3.889-16.791Zm-44.108-1.347c2.278-1.75,5.111,1.347,5.111,1.347l3.889,16.791c-11.291-2.278-11.291-16.388-8.999-18.138Z' />
																		</svg>
																		<div className={s.tooltipStarContainer}>
																			<div className={`${s.starEight} ${s.starEightGold}`} />
																		</div>
																	</div>
																	<div className={s.tooltipTextWrap}>
																		<div className={s.tooltipHeaderRow}>
																			<span className={`${s.tooltipTitle} ${s.tooltipTitleGold}`}>
																				In Top 20
																			</span>
																			<span className={`${s.tooltipTag} ${s.tooltipTagGold}`}>
																				ELITE
																			</span>
																		</div>
																		<p className={s.tooltipBody}>
																			You're in the Top 20 campus ambassadors. An elite achiever of
																			Tathva 2026!
																		</p>
																	</div>
																</div>
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									</div>

									<button
										type='button'
										className={s.editBtn}
										onClick={startEditing}
										title='Edit CA Details'
									>
										<FiEdit2 size={13} />
										<span>Edit</span>
									</button>
								</div>

								<hr className={s.detailsDivider} />

								<div className={s.detailsGrid}>
									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiMail size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>Email Address</span>
											<span className={s.detailText}>{profile?.email || 'Not provided'}</span>
										</div>
									</div>

									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiPhone size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>WhatsApp / Phone</span>
											<span className={s.detailText}>{profile?.phone || 'Not provided'}</span>
										</div>
									</div>

									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiBookOpen size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>College / Institute</span>
											<span className={s.detailText}>{profile?.college || 'Not provided'}</span>
										</div>
									</div>

									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiMapPin size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>District & State</span>
											<span className={s.detailText}>
												{[profile?.district, profile?.state].filter(Boolean).join(', ') ||
													'Not provided'}
											</span>
										</div>
									</div>

									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiAward size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>Branch</span>
											<span className={s.detailText}>{profile?.branch || 'Not provided'}</span>
										</div>
									</div>

									<div className={s.detailRow}>
										<div className={s.detailIcon}>
											<FiCalendar size={16} />
										</div>
										<div className={s.detailContent}>
											<span className={s.detailLabel}>Year & Semester</span>
											<span className={s.detailText}>
												{profile?.year ? `Year ${profile.year}` : 'Year N/A'} ·{' '}
												{profile?.semester ? `Semester ${profile.semester}` : 'Semester N/A'}
											</span>
										</div>
									</div>
								</div>
							</>
						) : (
							/* ── EDIT MODE ── */
							<div>
								<div className={s.editCardHeader}>
									<h3 className={s.editCardTitle}>Edit CA Profile</h3>
									<button
										type='button'
										className={s.iconBtn}
										onClick={cancelEditing}
										title='Cancel editing'
									>
										<FiX size={16} />
									</button>
								</div>

								{/* Form Fields */}
								<form className={s.editForm} onSubmit={handleSaveProfile} noValidate>
									<div className={s.formGrid}>
										<div className={`${s.formGroup} ${s.formGroupFull}`}>
											<label className={s.formLabel}>Full Name</label>
											{/* Locked: the backend no longer accepts `name` on PUT /api/user,
											    so this is display-only to avoid showing an edit that won't save. */}
											<input
												type='text'
												className={`${s.formInput} ${s.formInputLocked}`}
												value={profile?.name || ''}
												readOnly
												disabled
												aria-readonly='true'
											/>
											<span className={s.formLockedHint}>Your name can&apos;t be changed.</span>
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												WhatsApp / Phone <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='tel'
												className={`${s.formInput} ${formErrors.phone ? s.formInputError : ''}`}
												value={editFormData.phone}
												onChange={(e) => updateEditField('phone', e.target.value)}
												aria-invalid={Boolean(formErrors.phone)}
												placeholder='10-digit number'
												inputMode='tel'
												maxLength={16}
												required
											/>
											{formErrors.phone && <span className={s.formError}>{formErrors.phone}</span>}
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												Year of Study <span className={s.formAsterisk}>*</span>
											</label>
											<select
												className={`${s.formSelect} ${formErrors.year ? s.formInputError : ''}`}
												value={editFormData.year}
												onChange={(e) => updateEditField('year', e.target.value)}
												aria-invalid={Boolean(formErrors.year)}
												required
											>
												<option value=''>Choose year</option>
												<option value='1'>Year 1</option>
												<option value='2'>Year 2</option>
												<option value='3'>Year 3</option>
												<option value='4'>Year 4</option>
												<option value='5'>Year 5</option>
											</select>
											{formErrors.year && <span className={s.formError}>{formErrors.year}</span>}
										</div>

										<div className={`${s.formGroup} ${s.formGroupFull}`}>
											<label className={s.formLabel}>
												Institute / College <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='text'
												className={`${s.formInput} ${formErrors.college ? s.formInputError : ''}`}
												value={editFormData.college}
												onChange={(e) => updateEditField('college', e.target.value)}
												aria-invalid={Boolean(formErrors.college)}
												placeholder='e.g. NIT Calicut'
												required
											/>
											{formErrors.college && (
												<span className={s.formError}>{formErrors.college}</span>
											)}
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												Branch / Department <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='text'
												className={`${s.formInput} ${formErrors.branch ? s.formInputError : ''}`}
												value={editFormData.branch}
												onChange={(e) => updateEditField('branch', e.target.value)}
												aria-invalid={Boolean(formErrors.branch)}
												placeholder='e.g. Computer Science'
												required
											/>
											{formErrors.branch && (
												<span className={s.formError}>{formErrors.branch}</span>
											)}
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												Semester <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='number'
												className={`${s.formInput} ${formErrors.semester ? s.formInputError : ''}`}
												value={editFormData.semester}
												onChange={(e) => updateEditField('semester', e.target.value)}
												aria-invalid={Boolean(formErrors.semester)}
												placeholder='1–8'
												min='1'
												max='8'
												required
											/>
											{formErrors.semester && (
												<span className={s.formError}>{formErrors.semester}</span>
											)}
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												District <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='text'
												className={`${s.formInput} ${formErrors.district ? s.formInputError : ''}`}
												value={editFormData.district}
												onChange={(e) => updateEditField('district', e.target.value)}
												aria-invalid={Boolean(formErrors.district)}
												placeholder='e.g. Kozhikode'
												required
											/>
											{formErrors.district && (
												<span className={s.formError}>{formErrors.district}</span>
											)}
										</div>

										<div className={s.formGroup}>
											<label className={s.formLabel}>
												State <span className={s.formAsterisk}>*</span>
											</label>
											<input
												type='text'
												className={`${s.formInput} ${formErrors.state ? s.formInputError : ''}`}
												value={editFormData.state}
												onChange={(e) => updateEditField('state', e.target.value)}
												aria-invalid={Boolean(formErrors.state)}
												placeholder='e.g. Kerala'
												required
											/>
											{formErrors.state && <span className={s.formError}>{formErrors.state}</span>}
										</div>
									</div>

									<div className={s.formActions}>
										<button type='submit' className={s.saveBtn} disabled={saving}>
											<FiCheck size={16} />
											<span>{saving ? 'Saving…' : 'Save Changes'}</span>
										</button>
										<button type='button' className={s.cancelBtn} onClick={cancelEditing}>
											<FiX size={15} />
											<span>Cancel</span>
										</button>
									</div>
								</form>
							</div>
						)}
					</section>

					{/* Referral card */}
					<section className={`${s.referralCard} ${s.panelGlow}`}>
						<div className={s.referralGlow} />
						<p className={s.referralLabel}>Your invite</p>
						<h2 className={s.referralTitle}>Referral code</h2>
						<div className={s.referralBody}>
							<div className={s.referralFields}>
								{/* Code */}
								<div>
									<p className={s.fieldLabel}>Unique code</p>
									<div className={s.fieldRow}>
										<div className={s.codeBox}>{refCode || '——'}</div>
										<button
											type='button'
											className={s.iconBtn}
											aria-label='Copy referral code'
											title='Copy referral code'
											disabled={!refCode}
											onClick={() => handleCopy(refCode, 'code')}
										>
											{copied === 'code' ? <FiCheck size={17} /> : <FiCopy size={17} />}
										</button>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* ── REWARDS & MILESTONE PROGRESS ── */}
				<section className={`${s.progressSection} ${s.panelGlow}`}>
					<div className={s.progressHeader}>
						<div>
							<div className={s.rewardTag}>Referral Rewards Wallet</div>
							<h2 className={s.progressTitle}>
								₹{earnedRewards.toLocaleString('en-IN')}{' '}
								<span className={s.earnedSub}>Total Earned</span>
							</h2>
							<p className={s.progressSubtext}>
								{totalReferrals} successful referrals &bull; ₹50 per referral between milestones
							</p>
						</div>
					</div>

					{/* Visual Milestone Track */}
					<div className={s.progressTrackWrapper}>
						<div className={s.progressTrack}>
							<div className={s.trackBg}>
								<div className={s.trackFill} style={{ width: `${animatedFill}%` }} />
								<div className={s.trackMarkers}>
									{REFERRAL_MILESTONES.map((item, i) => {
										const percent = (i / (REFERRAL_MILESTONES.length - 1)) * 100
										const isPassed = totalReferrals >= item.count
										const delaySec = isPassed ? (percent / 100) * 1.3 : 0
										return (
											<div
												key={item.count}
												style={{
													left: `${percent}%`,
													animationDelay: isPassed ? `${delaySec.toFixed(2)}s` : '0s',
												}}
												className={`${s.trackDiamond} ${isPassed ? s.trackDiamondActive : ''}`}
												title={`${item.title} - ${item.bonusText || 'Start'}`}
											/>
										)
									})}
								</div>
							</div>
							<div className={s.trackLabels}>
								{REFERRAL_MILESTONES.map((item, i) => {
									const isActive = totalReferrals >= item.count
									const percent = (i / (REFERRAL_MILESTONES.length - 1)) * 100
									const delaySec = isActive ? (percent / 100) * 1.3 : 0
									return (
										<div
											key={item.count}
											style={{ left: `${percent}%` }}
											className={s.trackLabelWrapper}
										>
											<span
												className={`${s.trackMilestoneCount} ${
													isActive ? s.trackLabelMidActive : s.trackLabelMidInactive
												}`}
												style={{
													transitionDelay: isActive ? `${delaySec.toFixed(2)}s` : '0s',
												}}
											>
												{item.count} {item.count === 1 ? 'ref' : 'refs'}
											</span>
											{item.bonus > 0 && (
												<span
													className={`${s.trackMilestoneBonus} ${isActive ? s.bonusActive : ''}`}
													style={{
														transitionDelay: isActive ? `${delaySec.toFixed(2)}s` : '0s',
													}}
												>
													+₹{item.bonus}
												</span>
											)}
										</div>
									)
								})}
							</div>
						</div>
					</div>

					{/* Milestone Rewards Strategy Grid */}
					<div className={s.rewardsGrid}>
						<div className={`${s.rewardCard} ${totalReferrals >= 5 ? s.rewardCardActive : ''}`}>
							<div className={s.rewardCardHead}>
								<span className={s.tierPill}>Tier 1</span>
								<span className={s.tierBonus}>₹100</span>
							</div>
							<p className={s.tierTarget}>5 Referrals</p>
							<p className={s.tierDesc}>Unlock initial milestone reward</p>
							<span className={s.tierStatus}>
								{totalReferrals >= 5 ? '✓ Unlocked' : `${Math.max(0, 5 - totalReferrals)} to go`}
							</span>
						</div>

						<div className={`${s.rewardCard} ${totalReferrals >= 10 ? s.rewardCardActive : ''}`}>
							<div className={s.rewardCardHead}>
								<span className={s.tierPill}>Tier 2</span>
								<span className={s.tierBonus}>₹200</span>
							</div>
							<p className={s.tierTarget}>10 Referrals</p>
							<p className={s.tierDesc}>₹50/ref (6–9) + ₹200 bonus (₹500 total)</p>
							<span className={s.tierStatus}>
								{totalReferrals >= 10 ? '✓ Unlocked' : `${Math.max(0, 10 - totalReferrals)} to go`}
							</span>
						</div>

						<div className={`${s.rewardCard} ${totalReferrals >= 15 ? s.rewardCardActive : ''}`}>
							<div className={s.rewardCardHead}>
								<span className={s.tierPill}>Tier 3</span>
								<span className={s.tierBonus}>₹300</span>
							</div>
							<p className={s.tierTarget}>15 Referrals</p>
							<p className={s.tierDesc}>₹50/ref (11–14) + ₹300 bonus (₹1,000 total)</p>
							<span className={s.tierStatus}>
								{totalReferrals >= 15 ? '✓ Unlocked' : `${Math.max(0, 15 - totalReferrals)} to go`}
							</span>
						</div>

						<div className={`${s.rewardCard} ${totalReferrals >= 20 ? s.rewardCardActive : ''}`}>
							<div className={s.rewardCardHead}>
								<span className={s.tierPill}>Tier 4</span>
								<span className={s.tierBonus}>₹500</span>
							</div>
							<p className={s.tierTarget}>20 Referrals</p>
							<p className={s.tierDesc}>₹50/ref (16–19) + ₹500 bonus (₹1,700 total)</p>
							<span className={s.tierStatus}>
								{totalReferrals >= 20 ? '✓ Unlocked' : `${Math.max(0, 20 - totalReferrals)} to go`}
							</span>
						</div>

						<div
							className={`${s.rewardCard} ${s.majorTierCard} ${
								totalReferrals >= 50 ? s.rewardCardActive : ''
							}`}
						>
							<div className={s.rewardCardHead}>
								<span className={s.majorTierPill}>Major Tier</span>
								<span className={s.majorTierBonus}>₹1,000</span>
							</div>
							<p className={s.tierTarget}>50 Referrals</p>
							<p className={s.tierDesc}>₹50/ref (21–49) + ₹1,000 bonus (₹4,150 total)</p>
							<span className={s.tierStatus}>
								{totalReferrals >= 50 ? '✓ Unlocked' : `${Math.max(0, 50 - totalReferrals)} to go`}
							</span>
						</div>
					</div>
				</section>

				{/* ── REFERRALS TABLE ── */}
				<section className={s.tableSection}>
					<div className={s.tableHeader}>
						<div className={s.tableHeaderLeft}>
							<p className={s.tableLabel}>Activity</p>
							<h2 className={s.tableTitle}>Your referrals</h2>
						</div>
						<div className={s.tableCount}>
							<p className={s.tableCountNum}>{totalReferrals}</p>
							<p className={s.tableCountLabel}>Tickets booked</p>
						</div>
					</div>

					{/* The ticketing provider reports totals only, not who booked, so
					    there is no per-referral table to show. */}
					<div className={s.emptyState}>
						<span className={s.emptyIcon}>{referralError ? '⚠️' : totalReferrals > 0 ? '🎟️' : '📭'}</span>
						<span className={s.emptyText}>
							{referralError
								? 'Could not load your referral count. Please try again later.'
								: totalReferrals > 0
									? 'Bookings made with your code are counted after payment is confirmed. Individual bookings are not listed.'
									: 'No referrals yet! Share your referral code to get started!'}
						</span>
					</div>
				</section>
			</div>
		</div>
	)
}
