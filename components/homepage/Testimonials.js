const testimonialsData = [
	{
		name: 'Adithya Raj',
		initials: 'AR',
		role: 'Campus Ambassador',
		college: 'TKM College of Engineering, Kollam',
		year: '3rd Year, CSE',
		quote:
			'Being part of the ambassador program helped me build genuine connections with students from colleges across Kerala. I organized campus meetups, coordinated our delegation, and discovered a side of event management I never knew I had.',
	},
	{
		name: 'Sneha Menon',
		initials: 'SM',
		role: 'Campus Ambassador',
		college: 'College of Engineering Trivandrum',
		year: '2nd Year, ECE',
		quote:
			'The experience was incredibly enriching. I got to promote technical events on my campus, interact with like-minded peers, and develop communication skills that go well beyond the classroom.',
	},
	{
		name: 'Arjun Krishnan',
		initials: 'AK',
		role: 'Campus Ambassador',
		college: 'NIT Calicut',
		year: '4th Year, ME',
		quote:
			'Coordinating between different student groups and helping build a network of campuses was a challenge I genuinely enjoyed. The workshops and technical sessions we organized were highlights of the semester.',
	},
	{
		name: 'Kavya Nair',
		initials: 'KN',
		role: 'Campus Ambassador',
		college: 'Model Engineering College, Kochi',
		year: '3rd Year, CSE',
		quote:
			'I learned how to work with diverse teams and manage outreach for a major tech fest. The ambassador program gave me real-world exposure to student leadership and community building.',
	},
	{
		name: 'Rahul Dev',
		initials: 'RD',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Thrissur',
		year: '2nd Year, IT',
		quote:
			'From creating awareness campaigns to leading campus drives, every week brought something new. The program pushed me out of my comfort zone and helped me grow as a communicator and organizer.',
	},
	{
		name: 'Fathima Zahra',
		initials: 'FZ',
		role: 'Campus Ambassador',
		college: 'Cochin University of Science and Technology',
		year: '3rd Year, Computer Science',
		quote:
			'What I loved most was the sense of community. Meeting ambassadors from other colleges and sharing ideas about campus engagement was inspiring. It felt like being part of something larger than my own campus.',
	},
	{
		name: 'Vivek Suresh',
		initials: 'VS',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Kozhikode',
		year: '4th Year, EEE',
		quote:
			'The program taught me practical skills in outreach and event coordination. Leading a team of volunteers and watching our campus contingent come together was one of the best experiences of my college life.',
	},
	{
		name: 'Anjali Thomas',
		initials: 'AT',
		role: 'Campus Ambassador',
		college: 'Rajagiri School of Engineering & Technology',
		year: '2nd Year, CSE',
		quote:
			'As an ambassador, I got the chance to bridge the gap between students and a premier tech fest. The leadership workshops and mentorship sessions were genuinely valuable — not just motivational talks, but actionable guidance.',
	},
	{
		name: 'Mohammed Ashiq',
		initials: 'MA',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Barton Hill',
		year: '3rd Year, Civil',
		quote:
			'I started with zero experience in event management, and the ambassador program gave me a structured way to learn. By the end, I had organized three campus events and connected with over a hundred students from other institutions.',
	},
	{
		name: 'Priya Lakshmi',
		initials: 'PL',
		role: 'Campus Ambassador',
		college: 'College of Engineering, Chengannur',
		year: '2nd Year, ECE',
		quote:
			'The connections I made through this program are invaluable. I worked with students from different engineering backgrounds and learned to coordinate large groups — skills I use every day now.',
	},
	{
		name: 'Nirmal Joy',
		initials: 'NJ',
		role: 'Campus Ambassador',
		college: 'SCMS School of Engineering and Technology',
		year: '3rd Year, ME',
		quote:
			'Being an ambassador gave me access to workshops and networking opportunities I wouldn\'t have found otherwise. The tech fest itself was incredible, but the journey of getting there — rallying your campus — was even better.',
	},
	{
		name: 'Devika Pillai',
		initials: 'DP',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Palakkad',
		year: '4th Year, CSE',
		quote:
			'I gained confidence in public speaking and team management. Presenting the ambassador program to my college\'s student council and getting their support was a milestone moment for me.',
	},
	{
		name: 'Sreehari K.',
		initials: 'SK',
		role: 'Campus Ambassador',
		college: 'Indian Institute of Information Technology Kottayam',
		year: '2nd Year, CSE',
		quote:
			'The program connected me to a network of motivated students across Kerala. We shared resources, collaborated on tech events, and built friendships that outlasted the fest season.',
	},
	{
		name: 'Meera Rajan',
		initials: 'MR',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Kannur',
		year: '3rd Year, ECE',
		quote:
			'Organizing our college delegation was a logistical challenge that taught me more about project management than any textbook could. The support from the core team made the whole process smoother.',
	},
	{
		name: 'Abin Varghese',
		initials: 'AV',
		role: 'Campus Ambassador',
		college: 'College of Engineering, Thalassery',
		year: '3rd Year, CSE',
		quote:
			'The ambassador role helped me step up as a student leader. From promoting workshops to managing social media campaigns for the fest, every task was a learning opportunity that shaped my approach to teamwork.',
	},
	{
		name: 'Lakshmi Priya',
		initials: 'LP',
		role: 'Campus Ambassador',
		college: 'Government Engineering College, Idukki',
		year: '2nd Year, IT',
		quote:
			'Even from a smaller campus, the program made me feel included and valued. The mentorship structure ensured that every ambassador had guidance, and the final delegation trip was an unforgettable experience.',
	},
]

/**
 * Distribute testimonials across columns for the masonry layout.
 * Uses a round-robin approach to balance card count across columns.
 */
function distributeToColumns(data, columnCount) {
	const columns = Array.from({ length: columnCount }, () => [])
	data.forEach((item, i) => {
		columns[i % columnCount].push(item)
	})
	return columns
}

export default function Testimonials() {
	const columnCount = 5
	const columns = distributeToColumns(testimonialsData, columnCount)

	// Alternate scroll directions and assign different durations per column
	const columnConfigs = [
		{ direction: 'up', duration: '32s' },
		{ direction: 'down', duration: '38s' },
		{ direction: 'up', duration: '44s' },
		{ direction: 'down', duration: '36s' },
		{ direction: 'up', duration: '42s' },
	]

	return (
		<section className='testimonials-section' id='testimonials'>
			<div className='container testimonials-header'>
				<span className='testimonials-overline'>AMBASSADOR STORIES</span>
				<h2 className='testimonials-title'>
					What ambassadors <span className='text-gold-solid'>say.</span>
				</h2>
				<p className='testimonials-subtitle'>
					Real stories from students building connections across Kerala&rsquo;s campuses.
				</p>
			</div>

			<div className='testimonials-masonry-wrapper'>
				<div className='testimonials-masonry-wall'>
					{columns.map((colCards, colIndex) => {
						const config = columnConfigs[colIndex]
						const animClass =
							config.direction === 'up'
								? 'masonry-col-scroll-up'
								: 'masonry-col-scroll-down'

						return (
							<div
								key={colIndex}
								className={`masonry-column ${animClass}`}
								style={{ '--scroll-duration': config.duration }}
							>
								{/* Original set */}
								<div className='masonry-col-inner'>
									{colCards.map((item, cardIndex) => (
										<TestimonialCard key={`a-${cardIndex}`} item={item} />
									))}
								</div>
								{/* Duplicate set for seamless looping */}
								<div className='masonry-col-inner' aria-hidden='true'>
									{colCards.map((item, cardIndex) => (
										<TestimonialCard key={`b-${cardIndex}`} item={item} />
									))}
								</div>
							</div>
						)
					})}
				</div>

				{/* Top and bottom edge fade masks */}
				<div className='masonry-fade-top' aria-hidden='true' />
				<div className='masonry-fade-bottom' aria-hidden='true' />
			</div>
		</section>
	)
}

function TestimonialCard({ item }) {
	return (
		<div className='masonry-card'>
			<p className='masonry-card-quote'>&ldquo;{item.quote}&rdquo;</p>
			<div className='masonry-card-footer'>
				<div className='masonry-card-avatar'>{item.initials}</div>
				<div className='masonry-card-info'>
					<span className='masonry-card-name'>{item.name}</span>
					<span className='masonry-card-college'>{item.college}</span>
					{item.year && <span className='masonry-card-year'>{item.year}</span>}
				</div>
			</div>
		</div>
	)
}
