import dynamic from 'next/dynamic'
import Hero from 'components/homepage/Hero'
import Page2 from 'components/homepage/Page2'
import Benefits from 'components/homepage/Benefits'
import Page4 from 'components/homepage/Page4'
import RUReady from 'components/common/RUReady'

const loadSpaceBackground = () => import('components/common/SpaceBackground')

if (typeof window !== 'undefined') {
	// Eagerly initiate the network request for the Three.js chunk BEFORE React begins hydrating.
	// This removes the ~1s hydration/render delay before the browser even starts fetching the background.
	loadSpaceBackground()
}

const SpaceBackground = dynamic(loadSpaceBackground, {
	ssr: false,
	loading: () => (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				zIndex: -1,
				background: '#050505',
			}}
		/>
	),
})

export default function Home() {
	return (
		<>
			<SpaceBackground />
			<div style={{ position: 'relative', zIndex: 1 }}>
				<Hero />
				<div className='animate-section'>
					<Page2 />
				</div>
				<div className='animate-section'>
					<Benefits />
				</div>
				<div className='animate-section'>
					<Page4 />
				</div>
				<div className='animate-section'><RUReady /></div>
			</div>
		</>
	)
}
