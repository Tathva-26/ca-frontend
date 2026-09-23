import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { FcGoogle } from 'react-icons/fc'
import { completeProfile } from 'lib/req/register'
import { useUserContext } from 'context/UserContext'
import authStyles from 'styles/login.module.css'
import styles from './register-form.module.css'

export default function RegisterForm({ editProfile }) {
	const { user, isLoggedIn, authLoading, loginWithGoogle, refreshProfile } = useUserContext()

	const router = useRouter()

	const [form, setForm] = useState(null)
	const [submitting, setSubmitting] = useState(false)
	const [showReferralModal, setShowReferralModal] = useState(false)

	useEffect(() => {
		if (!user) return

		setForm({
			name: user.name || '',
			phone: user.phone || '',
			college: user.college || '',
			district: user.district || '',
			state: user.state || '',
			semester: user.semester ? String(user.semester) : '',
			branch: user.branch || '',
			year: user.year ? String(user.year) : '',
		})
	}, [user])

	const handleChange = (e) => {
		const { name, value } = e.target

		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setSubmitting(true)

		try {
			await completeProfile(form)
			await refreshProfile()

			const profileCompleted = localStorage.getItem('tathva_ca_profile_completed')
			if (profileCompleted) {
				router.push('/profile?editprofile=true')
			} else {
				setShowReferralModal(true)
			}
		} catch (err) {
			console.error(err)

			const errors = err.response?.data

			if (errors && typeof errors === 'object') {
				const messages = Object.values(errors).flat().join(' | ')
				toast.error(messages || 'Something went wrong!')
			} else {
				toast.error('Something went wrong!')
			}
		} finally {
			setSubmitting(false)
		}
	}

	function handleModalClick() {
		setShowReferralModal(false)
		const profileCompleted = localStorage.getItem('tathva_ca_profile_completed')
		if (!profileCompleted) {
			localStorage.setItem('tathva_ca_profile_completed', 'true')
		}
		router.push('/profile?editprofile=true')
	}

	if (authLoading) {
		return <div className={authStyles.container} />
	}

	if (!isLoggedIn) {
		return (
			<div className={authStyles.container}>
				<div className={authStyles.loginBox}>
					<div className={authStyles.logoSection}>
						<h1 className={authStyles.title}>Create your account</h1>

						<p className={authStyles.subtitle}>
							Sign up with Google to get started as a Campus Ambassador
						</p>
					</div>

					<button type='button' className={authStyles.googleButton} onClick={loginWithGoogle}>
						<FcGoogle size={20} />
						Sign up with Google
					</button>

					<p className={authStyles.disclaimer}>
						By continuing, you agree to Tathva&apos;s terms and privacy policy.
					</p>
				</div>
			</div>
		)
	}

	if (!form) {
		return <div className={authStyles.container} />
	}

	if (showReferralModal) {
		return (
			<div className={authStyles.container}>
				<div className='modal-overlay' onClick={handleModalClick}>
					<div className='modal-content' onClick={(e) => e.stopPropagation()}>
						<h3>Referral Code</h3>
						<p>You will only get your referral code after completing your profile details.</p>
						<button className={authStyles.googleButton} onClick={handleModalClick}>
							Got it
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={authStyles.container}>
			<form className={`${authStyles.loginBox} ${styles['register-form']}`} onSubmit={handleSubmit}>
				<div className={authStyles.logoSection}>
					<h1 className={authStyles.title}>
						{editProfile ? 'Edit profile' : 'Complete your profile'}
					</h1>

					<p className={`${authStyles.subtitle} ${styles['register-form-email']}`}>{user?.email}</p>
				</div>

				<fieldset>
					<label>Name</label>
					<input
						type='text'
						name='name'
						placeholder='Enter your name'
						value={form.name}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Whatsapp no.</label>
					<input
						type='text'
						name='phone'
						placeholder='Enter your whatsapp no.'
						value={form.phone}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Institute</label>
					<input
						type='text'
						name='college'
						placeholder='Enter your institute'
						value={form.college}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>District</label>
					<input
						type='text'
						name='district'
						placeholder='Enter your district'
						value={form.district}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>State</label>
					<input
						type='text'
						name='state'
						placeholder='Enter your state'
						value={form.state}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Branch</label>
					<input
						type='text'
						name='branch'
						placeholder='Enter your branch'
						value={form.branch}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Semester</label>
					<input
						type='number'
						name='semester'
						placeholder='Enter your semester'
						value={form.semester}
						onChange={handleChange}
						min='1'
						max='8'
						required
					/>
				</fieldset>

				<fieldset>
					<label>Year of study</label>
					<select name='year' value={form.year} onChange={handleChange} required>
						<option value=''>Choose year of study</option>
						<option value='1'>Year 1</option>
						<option value='2'>Year 2</option>
						<option value='3'>Year 3</option>
						<option value='4'>Year 4</option>
						<option value='5'>Year 5</option>
					</select>
				</fieldset>

				<button
					type='submit'
					className={`${authStyles.googleButton} ${styles['register-form-submit']}`}
					disabled={submitting}
				>
					{submitting ? 'Saving...' : editProfile ? 'Save' : 'Complete Sign Up'}
				</button>
			</form>
		</div>
	)
}
