import { useState, useEffect, useRef } from 'react'
import { submitContact } from 'lib/req/contact'
import { useUserContext } from 'context/UserContext'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { IoMdCall } from 'react-icons/io'
import { MdEmail } from 'react-icons/md'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import SubHeading from 'components/common/SubHeading'

import styles from './contact-us.module.css'

export default function ContactUs() {
	const { user } = useUserContext()
	const formElement = useRef()

	const [form, setForm] = useState({ name: '', email: '', message: '' })

	useEffect(() => {
		setForm({ name: user?.name || '', email: user?.email || '', message: '' })
	}, [user])

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	function handleSubmit(e) {
		e.preventDefault()
		toast
			.promise(submitContact(new FormData(formElement.current)), {
				pending: 'Sending message',
				success: 'Message sent',
				error: 'Failed to send message',
			})
			.then(() => setForm({ name: user?.name || '', email: user?.email || '', message: '' }))
			.catch((err) => {
				console.error(err)
				toast.error('Failed to send message')
			})
	}

	return (
		<div className='container'>
			<div className={styles['contact-us']}>
				<div className={styles['contact-us-left']}>
					<div>
						<SubHeading title='Get in touch' />
						<div className={styles['git-content']}>
							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<IoMdCall className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Subramanya Shenoy B</h5>
									<p>+91 9037176188</p>
								</div>
							</div>

							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<IoMdCall className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Sabin Binu</h5>
									<p>+91 9446978544</p>
								</div>
							</div>

							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<IoMdCall className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Anandhakrishnan P S </h5>
									<p>+91 9995933017</p>
								</div>
							</div>
							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<IoMdCall className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Mohamed Adhil</h5>
									<p>+91 6282896005</p>
								</div>
							</div>
							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<IoMdCall className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Athulya C</h5>
									<p>+91 8606774798</p>
								</div>
							</div>
							<div className={styles['contact']}>
								<div className={styles['contact-icon-wrapper']}>
									<MdEmail className={styles['contact-icon']} />
								</div>
								<div className={styles['contact-details']}>
									<h5>Email</h5>
									<p>ca@tathva.org</p>
								</div>
							</div>
						</div>
					</div>

					{/* <div className={styles['social']}>
						<SubHeading title='Social' icon='/images/earth.png' />
						<div className={styles['social-icons-wrapper']}>
							<a
								href='https://www.instagram.com/tathva_nitcalicut/'
								target='_blank'
								rel='noreferrer noopener'
							>
								<div className={`${styles['contact-icon-wrapper']} ${styles['social-icon']}`}>
									<FaInstagram className={styles['contact-icon']} />
								</div>
							</a>
							<a href='https://www.facebook.com/tathva' target='_blank' rel='noreferrer noopener'>
								<div className={`${styles['contact-icon-wrapper']} ${styles['social-icon']}`}>
									<FaFacebook className={styles['contact-icon']} />
								</div>
							</a>
							<a href='https://twitter.com/tathva' target='_blank' rel='noreferrer noopener'>
								<div className={`${styles['contact-icon-wrapper']} ${styles['social-icon']}`}>
									<FaTwitter className={styles['contact-icon']} />
								</div>
							</a>
						</div>
					</div> */}
				</div>

				{/* <form className={styles['contact-us-right']} onSubmit={handleSubmit} ref={formElement}>
					<SubHeading title='Message' icon='/images/message.png' />

					<fieldset>
						<label>Name</label>
						<input
							type='text'
							name='name'
							placeholder='Enter your name'
							autoComplete='off'
							required
							value={form.name}
							onChange={handleChange}
						/>
					</fieldset>
					<fieldset>
						<label>Email</label>
						<input
							type='email'
							name='email'
							placeholder='Enter your email'
							autoComplete='off'
							value={form.email}
							onChange={handleChange}
							required
						/>
					</fieldset>
					<fieldset>
						<label>Message</label>
						<textarea
							placeholder='Enter message'
							name='message'
							value={form.message}
							onChange={handleChange}
							required
						></textarea>
					</fieldset>
					<button type='submit' className='btn-secondary'>
						Submit
					</button>
				</form> */}
			</div>
		</div>
	)
}
