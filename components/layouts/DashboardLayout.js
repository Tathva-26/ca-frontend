import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/UserContext'

import SideNav from 'components/dashboard/SideNav'

export default function DashboardLayout({ children }) {
	const router = useRouter()
	const { getUser, sectionsConfig } = useUserContext()

	const [showSideNav, setShowSideNav] = useState(false)

	useEffect(() => {
		getUser().then((user) => {
			if (!user) router.push('/')
			else if (!user?.name) {
				if (sectionsConfig?.regOpen) router.push('/register')
				else router.push('/regclosed')
			}
		})
	}, [])

	return (
		<>
			<div className='dashboard-top-spacer'></div>

			<div className='container dashboard-container'>
				<div className='dashboard'>
					{showSideNav && (
						<div className='dashboard-nav-wrapper'>
							<SideNav onClose={() => setShowSideNav(false)} />
						</div>
					)}
					<div className='dashboard-nav-wrapper side-nav-desktop'>
						<SideNav onClose={() => setShowSideNav(false)} />
					</div>

					<div className='dashboard-main'>{children}</div>
				</div>
				<div className='dashboard-bottom-spacer'></div>
			</div>
		</>
	)
}