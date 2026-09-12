export default function Benefits() {
	return (
		<div className='benefits' id='benefits'>
			<div className='benefits-image-container'>
				<div className='benefits-image-wrapper'>
					<img src='/images/benefits.svg' alt='Benefits pentagon' className='benefits-image' />
					<h2 className='benefits-heading'>Benefits</h2>
				</div>
			</div>
			<div className='benefits-content'>
				<div className='prizes-worth-wrapper'>
					<img src='/images/prizes-worth.svg' alt='Prizes worth ₹25k' />
				</div>
				<div className='prizes-wrapper'>
					<img src='/images/first-prize.svg' alt='🥇 ₹10,000' />
					<img src='/images/second-prize.svg' alt='🥈 ₹5,000' />
					<img src='/images/third-prize.svg' alt='🥉 ₹3,000' />
				</div>
				<div className='benefits-content-bottom'>
					<div className='other-prizes-wrapper'>
						<div className='other-prize-wrapper'>
							<p className='other-prize-position'>4th to 10th</p>
							<p className='other-prize'>₹1000</p>
							<span className='goodies-1000'>+ Goodies</span>
						</div>
						<div className='other-prize-wrapper'>
							<p className='other-prize-position'>11th to 15th</p>
							<p className='other-prize'>Goodies & Gifts</p>
						</div>
						<div className='text-final'>
							{' '}
							*Minimum of 299 points to be included in the leaderboard.
						</div>
					</div>
					<div className='benefits-desc-wrapper'>
						<p>Workshops will be Awarded 10 points & Lectures 3 points.</p>
						<p>Top 20 Ambassadors will be awarded Certificates.</p>
					</div>
				</div>
			</div>
		</div>
	)
}