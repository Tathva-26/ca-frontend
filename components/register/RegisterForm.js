'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { fetchCaProfile, register } from 'lib/req/register'
import { useUserContext } from 'context/UserContext'

import styles from './register-form.module.css'

export default function RegisterForm({ editProfile }) {
	const { user, jwt } = useUserContext()
	const router = useRouter()
	const [form, setForm] = useState(null)


	useEffect(() => {
		if (!user) return
		fetchCaProfile(jwt, user?.caId)
			.then(setForm)
			.catch((err) => {
				console.error(err)
				toast.error('Failed to load CA')
			})
	}, [jwt, user])

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		register(jwt, user?.userId, form)
			.then(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' })
				toast.success('Registration successful! Please Login to get your ID.')
				setTimeout(() => {
					router.push('/')
				}, 3000)
			})
			.catch((err) => {
				console.error(err)
				const errors = err.response?.data
				if (errors?.email) {
					toast.error('This email is already registered. Please log in instead.')
				} else if (errors) {
					const messages = Object.values(errors).flat().join(' | ')
					toast.error(messages)
				} else {
					toast.error('Something went wrong!')
				}
			})
	}

	return (
		<div className='container'>
			<form className={styles['register-form']} onSubmit={handleSubmit}>
				<div className={styles['register-form-avatar-wrapper']}>
					<div className={styles['register-form-email-wrapper']}>
						<span className={styles['register-form-email']}>{user?.email}</span>
					</div>
				</div>

				<fieldset>
					<label>Name</label>
					<input
						type='text'
						name='name'
						placeholder='Enter your name'
						value={form?.name || ''}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Email</label>
					<input
						type='email'
						name='email'
						placeholder='Enter your email'
						value={form?.email || ''}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Password</label>
					<input
						type='password'
						name='password'
						placeholder='Enter your password'
						value={form?.password || ''}
						onChange={handleChange}
						required
						minLength={8}
					/>
				</fieldset>

				<fieldset>
					<label>Whatsapp no.</label>
					<input
						type='text'
						name='phone'
						placeholder='Enter your whatsapp no.'
						value={form?.phone || ''}
						onChange={handleChange}
						required
					/>
				</fieldset>

				<fieldset>
					<label>Institute*</label>
					<input
						type='text'
						name='college'
						placeholder='Enter your institute'
						value={form?.college || ''}
						required
						onChange={handleChange}
					/>
				</fieldset>

				<fieldset>
					<label>Branch</label>
					<input
						type='text'
						name='branch'
						placeholder='Enter your branch'
						value={form?.branch || ''}
						onChange={handleChange}
					/>
				</fieldset>

				<fieldset>
					<label>Year of study</label>
					<select name='year' value={form?.year || ''} onChange={handleChange}>
						<option value=''>Choose year of study</option>
						<option value='Year 1'>Year 1</option>
						<option value='Year 2'>Year 2</option>
						<option value='Year 3'>Year 3</option>
						<option value='Year 4'>Year 4</option>
						<option value='Year 5'>Year 5</option>
						<option value='Other'>Other</option>
					</select>
				</fieldset>

				<fieldset>
					<label>Have you been a CA before?</label>
					<select name='experience' value={form?.experience || 'false'} onChange={handleChange}>
						<option value='false'>No</option>
						<option value='true'>Yes</option>
					</select>
				</fieldset>

				<button className={`btn-secondary ${styles['register-form-submit']}`}>
					{editProfile ? 'Save' : 'Register'}
				</button>
			</form>
			<div className='spacerv-md'></div>
			<div className='spacerv-sm'></div>
		</div>
	)
}
