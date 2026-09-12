import Hero from 'components/homepage/Hero'
import TheIdea from 'components/homepage/TheIdea'
import Mission from 'components/homepage/Mission'
import Benefits from 'components/homepage/Benefits'
import Page4 from 'components/homepage/Page4'
import Testimonials from 'components/homepage/Testimonials'
import FinalCTA from 'components/homepage/FinalCTA'

export default function Home() {
	return (
		<>
			{/* 01 — HERO */}
			<Hero />

			{/* 02 — THE IDEA */}
			<TheIdea />

			{/* 03 — BENEFITS */}
			<Benefits />

			{/* 04 — YOUR MISSION */}
			<Mission />

			{/* 05 — ELIGIBILITY */}
			<Page4 />

			{/* 06 — TESTIMONIALS */}
			<Testimonials />

			{/* 07 — FINAL CTA */}
			<FinalCTA />
		</>
	)
}
