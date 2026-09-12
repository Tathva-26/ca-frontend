import { useUserContext } from 'context/UserContext'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

import styles from './r-u-ready.module.css'

export default function RUReady() {
	const { user, isLoggedIn } = useUserContext()
	const router = useRouter()

	const handleClick2 = () => {
		if (isLoggedIn && user) {
			toast.info('You are already logged in!')
		} else {
			router.push('/register')
		}
	}

	const handleClick = () => {
		if (isLoggedIn && user) {
			router.push('/dashboard/profile')
		} else {
			router.push('/register')
		}
	}

	return (
		<div className='container'>
			<div className='spacerv-md'></div>
			<div className='spacerv-sm'></div>
			<div className={styles['r-u-ready']}>
				<div className={styles['left']}>
					<img src='/images/victory.png' alt='✌️' className={styles['vic-icon']} />
					<div className='spacerh-xs'></div>
					<div className='r-u-ready-text'>
						<h3>Are you ready?</h3>
						<p>
							To be a part of the biggest tech
							<br /> fest in South India
						</p>
					</div>
				</div>
				<button className={`btn-primary ${styles['r-u-ready-btn']}`} onClick={handleClick}>
					Sign up
				</button>
			</div>
			<div className='spacerv-md'></div>
			<div className='spacerv-sm'></div>
		</div>
	)
}
