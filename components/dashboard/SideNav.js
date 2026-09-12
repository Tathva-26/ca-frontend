import { IoMdClose } from 'react-icons/io'
import { useUserContext } from 'context/UserContext'

export default function SideNav({ onClose }) {
	const { user } = useUserContext()

	return (
		<div className='side-nav'>
			<div className='dashboard-menu-close-wrapper'>
				<IoMdClose className='dashboard-menu-icon' onClick={onClose} />
			</div>
			<div className='user-wrapper'>
				<div className='user-avatar' style={{ backgroundImage: `url(${user?.imageUrl})` }}></div>
				<h3 className='user-name'>{user?.name || '--'}</h3>
				<span className='user-email'>{user?.email}</span>
			</div>
			<div className='spacerv-md'></div>
		</div>
	)
}