import { IoMdShare } from 'react-icons/io'
import { RiArtboardFill } from 'react-icons/ri'
import { FaHandsHelping } from 'react-icons/fa'
import Card from './Card'

const cardData = [
	{
		icon: <IoMdShare />,
		title: 'Share',
		info: 'Share all posters and links on your social media and groups',
	},
	{
		icon: <RiArtboardFill />,
		title: 'Notices',
		info: 'Put up posters we send you on your notice boards',
	},
	{
		icon: <FaHandsHelping />,
		title: 'Encourage',
		info: 'Encourage students of your college to participate in Tathva',
	},
]

export default function Page2() {
	return (
		<div className='page-2 container' id='explore'>
			<div className='spacerv-md'></div>
			<h2 className='page-2-heading'>What you should do</h2>
			<div className='page-2-cards-wrapper'>
				{cardData.map((item, index) => (
					<div className='page-2-card-wrapper' key={index}>
						<Card icon={item.icon} title={item.title} info={item.info} />
					</div>
				))}
			</div>
			<div className='spacerv-md'></div>
		</div>
	)
}
