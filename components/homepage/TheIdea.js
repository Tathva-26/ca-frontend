export default function TheIdea() {
	return (
		<section className='idea-section' id='idea'>
			<div className='container'>
				<div className='idea-header'>
					<span className='idea-overline'>The idea</span>
					<h2 className='idea-headline'>
						The Vision Behind <span className='text-gradient-gold'>Tathva &apos;26</span>.
					</h2>
					<p className='idea-subheading'>
						Tathva has been run by students at NIT Calicut for over two decades. This program
						brings that festival to your campus through a nationwide network of ambassadors.
					</p>
				</div>

				<div className='idea-grid'>
					{/* Pillar 01 */}
					<div className='idea-card'>
						<div className='idea-card-header'>
							<span className='idea-card-num'>[01]</span>
							<span className='idea-card-tag'>The festival</span>
						</div>
						<h3 className='idea-card-title'>NIT Calicut&apos;s Flagship Techno-Management Fest</h3>
						<p className='idea-card-text'>
							Hosted at the National Institute of Technology Calicut, Tathva is known across
							India for high-stakes robotics, international hackathons, lectures by leading
							speakers, and electric cultural nights.
						</p>
						<div className='idea-card-footer'>
							<span>A two-decade legacy</span>
						</div>
					</div>

					{/* Pillar 02 */}
					<div className='idea-card'>
						<div className='idea-card-header'>
							<span className='idea-card-num'>[02]</span>
							<span className='idea-card-tag'>The network</span>
						</div>
						<h3 className='idea-card-title'>Represent your campus, officially</h3>
						<p className='idea-card-text'>
							As a Campus Ambassador you&apos;re the official link between your college and Tathva.
							You share updates, help students get involved, and build your college&apos;s delegation
							to the festival.
						</p>
						<div className='idea-card-footer'>
							<span>Backed by NIT Calicut</span>
						</div>
					</div>

					{/* Pillar 03 */}
					<div className='idea-card'>
						<div className='idea-card-header'>
							<span className='idea-card-num'>[03]</span>
							<span className='idea-card-tag'>The milestones</span>
						</div>
						<h3 className='idea-card-title'>Measurable impact, official recognition</h3>
						<p className='idea-card-text'>
							Every workshop drive, lecture registration, and on-campus campaign earns you
							verifiable points. Crossing the 299-point threshold unlocks your official Tathva
							&apos;26 offer letter and entry to the prize pool.
						</p>
						<div className='idea-card-footer'>
							<span>The 299-point milestone</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
