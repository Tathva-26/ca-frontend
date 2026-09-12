export default function Mission() {
	return (
		<section className='mission-section' id='mission'>
			<div className='container'>
				<div className='mission-header'>
					<span className='mission-overline'>Your mission</span>
					<h2 className='mission-title'>
						What you&apos;ll do as an <span className='text-gradient-gold'>Ambassador</span>.
					</h2>
					<p className='mission-subtitle'>
						Here are the four things that make up the role — simple, concrete, and driven by
						referrals that build the Tathva community at your college.
					</p>
				</div>

				<div className='mission-grid'>
					{/* Operation 01 */}
					<div className='mission-card'>
						<div className='mission-card-top'>
							<span className='mission-num'>01</span>
							<span className='mission-phase'>Share</span>
						</div>
						<h3 className='mission-card-title'>Share the news</h3>
						<p className='mission-card-desc'>
							Share official Tathva &apos;26 announcements, event releases, hackathon deadlines, and
							workshop alerts across your college&apos;s WhatsApp groups, Discord servers, and social
							channels.
						</p>
					</div>

					{/* Operation 02 */}
					<div className='mission-card'>
						<div className='mission-card-top'>
							<span className='mission-num'>02</span>
							<span className='mission-phase'>Post</span>
						</div>
						<h3 className='mission-card-title'>Post on campus</h3>
						<p className='mission-card-desc'>
							Put up official Tathva posters on your campus&apos;s notice boards, department kiosks,
							and cafeteria gathering spots so students know the festival is coming.
						</p>
					</div>

					{/* Operation 03 */}
					<div className='mission-card'>
						<div className='mission-card-top'>
							<span className='mission-num'>03</span>
							<span className='mission-phase'>Refer</span>
						</div>
						<h3 className='mission-card-title'>Refer your peers</h3>
						<p className='mission-card-desc'>
							Encourage fellow students, engineering clubs, and peers to sign up for Tathva&apos;s
							workshops, pro-shows, and tech events using your unique referral code.
						</p>
					</div>

					{/* Operation 04 */}
					<div className='mission-card'>
						<div className='mission-card-top'>
							<span className='mission-num'>04</span>
							<span className='mission-phase'>Lead</span>
						</div>
						<h3 className='mission-card-title'>Lead your contingent</h3>
						<p className='mission-card-desc'>
							Coordinate and lead the official student contingent traveling from your city to the
							NIT Calicut campus during the festival, acting as your institute&apos;s head of
							delegation.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
