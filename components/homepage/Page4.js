export default function Page4() {
	return (
		<div className='w-full relative overflow-hidden bg-[#08080a] border-y border-neutral-900/80 shadow-2xl py-16 sm:py-24 antialiased my-8'>
			{/* Background cyber grid */}
			<div
				aria-hidden='true'
				className='absolute inset-0 cyber-grid pointer-events-none opacity-50'
			></div>

			{/* Top-Right Dotted Matrix Accent */}
			<div
				aria-hidden='true'
				className='absolute top-6 right-12 w-64 h-36 dot-matrix opacity-30 pointer-events-none'
			></div>

			{/* Ambient Glow Aura Behind Emblem */}
			<div
				aria-hidden='true'
				className='absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pedestal-glow filter blur-3xl opacity-70 pointer-events-none'
			></div>

			{/* Inner Content Container */}
			<div className='relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-16 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24 items-center'>
				{/* BEGIN: LeftContentColumn */}
				<div
					className='lg:col-span-7 flex flex-col justify-center space-y-6 max-w-2xl'
					data-purpose='information-column'
				>
					{/* Category Pill / Overline */}
					<header className='flex items-center space-x-3'>
						<span className='text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#e5b842] uppercase font-sans'>
							Who Can Apply?
						</span>
						<span className='w-14 h-[1.5px] bg-gradient-to-r from-[#e5b842] to-transparent inline-block rounded-full'></span>
					</header>

					<h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none transition-transform duration-300 origin-left inline-block cursor-pointer'>
						<span className='bg-[linear-gradient(180deg,#ffe599_0%,#e5b842_45%,#b58318_100%)] bg-clip-text text-transparent'>
							Eligi
						</span>
						<span className='bg-[linear-gradient(180deg,#ffffff_0%,#e2e8f0_40%,#94a3b8_100%)] bg-clip-text text-transparent'>
							bility
						</span>
					</h1>

					{/* Primary Description */}
					<p className='text-neutral-200 text-lg sm:text-xl font-normal leading-relaxed tracking-wide pt-1'>
						Any student currently pursuing education in an established institute who wishes to
						participate in Tathva may apply.
					</p>

					{/* Preference Callout Box (with hover lift & gold shadow effect) */}
					<aside
						className='preference-card rounded-2xl p-5 sm:p-6 mt-2 transition-all duration-300 hover:border-gold-400/60 cursor-pointer'
						data-purpose='preference-callout'
					>
						<div className='flex items-center gap-4 sm:gap-5'>
							{/* Icon */}
							<div className='flex-shrink-0 text-gold-400 pl-1' data-purpose='icon-wrapper'>
								<svg
									aria-hidden='true'
									className='w-9 h-9 sm:w-10 sm:h-10 stroke-current'
									fill='none'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='1.4'
									viewBox='0 0 24 24'
								>
									<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'></path>
									<circle cx='9' cy='7' r='4'></circle>
									<path d='M22 21v-2a4 4 0 0 0-3-3.87'></path>
									<path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
								</svg>
							</div>
							{/* Divider */}
							<div aria-hidden='true' className='w-px h-12 bg-gold-400/25 flex-shrink-0'></div>
							{/* Text */}
							<p className='text-xs sm:text-sm text-neutral-300 font-normal leading-snug tracking-wide'>
								Applicants having good interpersonal and communication skills with previous
								experience will be given preference.
							</p>
						</div>
					</aside>
				</div>
				{/* END: LeftContentColumn */}

				{/* BEGIN: RightEmblemColumn (Cuter Smaller Emblem Badge Stage) */}
				<div
					className='lg:col-span-5 flex flex-col items-center justify-center relative min-h-[320px] py-2'
					data-purpose='3d-emblem-stage'
				>
					{/* Ambient Golden Glow behind Emblem */}
					<div
						aria-hidden='true'
						className='absolute w-64 h-64 rounded-full bg-amber-500/25 filter blur-3xl pointer-events-none'
					></div>

					{/* Floating Sparkle Stars */}
					<div className='absolute -top-1 right-10 text-amber-300/80 text-lg font-serif pointer-events-none select-none'>
						✦
					</div>
					<div className='absolute top-1/4 left-4 text-amber-400/60 text-xs font-serif pointer-events-none select-none'>
						✦
					</div>
					<div className='absolute bottom-12 right-6 text-amber-200/90 text-xs font-serif pointer-events-none select-none'>
						✦
					</div>

					{/* Cuter Smaller 3D Hexagon Emblem (Outer Metallic Frame + Dark Core + Verified User Badge) */}
					<style>{`
						@keyframes emblemAutoSpin {
							from { transform: rotateY(0deg); }
							to   { transform: rotateY(360deg); }
						}
					`}</style>
					<div className='relative z-20 hexagon-shadow flex flex-col items-center [perspective:1000px]'>
						<div
							className='relative [transform-style:preserve-3d]'
							style={{ animation: 'emblemAutoSpin 6s linear infinite' }}
						>
							{/* FRONT FACE */}
							<div className='[backface-visibility:hidden]'>
								<svg
									className='w-48 h-54 sm:w-56 sm:h-64'
									fill='none'
									viewBox='0 0 240 270'
									xmlns='http://www.w3.org/2000/svg'
								>
									<defs>
										{/* Outer Golden Rim Gradient */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='goldRimGrad'
											x1='120'
											x2='120'
											y1='6'
											y2='258'
										>
											<stop offset='0%' stopColor='#fff0b8' />
											<stop offset='18%' stopColor='#f5d376' />
											<stop offset='45%' stopColor='#cf9932' />
											<stop offset='70%' stopColor='#e8bd54' />
											<stop offset='90%' stopColor='#7a5511' />
											<stop offset='100%' stopColor='#f8dc8b' />
										</linearGradient>

										{/* Metallic Bevel Depth Gradient */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='bevelGrad'
											x1='20'
											x2='220'
											y1='30'
											y2='240'
										>
											<stop offset='0%' stopColor='#ffd56b' />
											<stop offset='30%' stopColor='#8a5c10' />
											<stop offset='50%' stopColor='#4d3205' />
											<stop offset='75%' stopColor='#e2b047' />
											<stop offset='100%' stopColor='#2d1d02' />
										</linearGradient>

										{/* Inner Hexagon Dark Face */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='innerFaceGrad'
											x1='120'
											x2='120'
											y1='44'
											y2='220'
										>
											<stop offset='0%' stopColor='#292930' />
											<stop offset='40%' stopColor='#19191d' />
											<stop offset='100%' stopColor='#0e0e11' />
										</linearGradient>

										{/* Silver / Chrome Gradient */}
										<linearGradient id='silverShine' x1='0%' x2='100%' y1='0%' y2='100%'>
											<stop offset='0%' stopColor='#ffffff' />
											<stop offset='55%' stopColor='#d4d8df' />
											<stop offset='100%' stopColor='#939ba8' />
										</linearGradient>

										{/* Golden Checkmark Gradient */}
										<linearGradient id='goldenCheck' x1='0%' x2='100%' y1='0%' y2='100%'>
											<stop offset='0%' stopColor='#ffe188' />
											<stop offset='50%' stopColor='#dfaa3f' />
											<stop offset='100%' stopColor='#9e6e18' />
										</linearGradient>

										{/* Filter for Inner Shadow */}
										<filter height='120%' id='innerDepth' width='120%' x='-10%' y='-10%'>
											<feDropShadow
												dx='0'
												dy='5'
												floodColor='#000000'
												floodOpacity='0.9'
												stdDeviation='4'
											/>
										</filter>
									</defs>

									{/* Hexagon Bevel Outer Extrusion */}
									<polygon
										fill='url(#goldRimGrad)'
										points='120,8 218,65 218,199 120,256 22,199 22,65'
										stroke='rgba(255,255,255,0.4)'
										strokeWidth='1.5'
									/>

									{/* Metallic Bevel */}
									<polygon
										fill='url(#bevelGrad)'
										points='120,18 206,68 206,188 120,238 34,188 34,68'
									/>

									{/* Hexagon Core Slate Surface */}
									<polygon
										fill='url(#innerFaceGrad)'
										filter='url(#innerDepth)'
										points='120,30 194,73 194,177 120,220 46,177 46,73'
										stroke='#674b12'
										strokeWidth='1.8'
									/>

									{/* Inner Subtle Hexagon Hairline Accent */}
									<polygon
										fill='none'
										points='120,38 186,76 186,170 120,208 54,170 54,76'
										stroke='rgba(229,184,66,0.18)'
										strokeWidth='1.2'
									/>

									{/* User Icon - Head */}
									<circle cx='120' cy='104' fill='url(#silverShine)' r='19' />

									{/* User Icon - Body */}
									<path
										d='M96 156 C96 138 106 130 120 130 C125 130 130 131.5 134.5 134 C132.8 138 132 142.5 132.5 147.5 L129 156 Z'
										fill='url(#silverShine)'
									/>

									{/* Checkmark */}
									<path
										d='M126 148 L137 159 L158 131'
										fill='none'
										filter='drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
										stroke='url(#goldenCheck)'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='6.5'
									/>
								</svg>
							</div>

							{/* BACK FACE */}
							<div className='absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]'>
								<svg
									className='w-48 h-54 sm:w-56 sm:h-64'
									fill='none'
									viewBox='0 0 240 270'
									xmlns='http://www.w3.org/2000/svg'
								>
									<defs>
										{/* Outer Golden Rim Gradient */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='goldRimGradBack'
											x1='120'
											x2='120'
											y1='6'
											y2='258'
										>
											<stop offset='0%' stopColor='#fff0b8' />
											<stop offset='18%' stopColor='#f5d376' />
											<stop offset='45%' stopColor='#cf9932' />
											<stop offset='70%' stopColor='#e8bd54' />
											<stop offset='90%' stopColor='#7a5511' />
											<stop offset='100%' stopColor='#f8dc8b' />
										</linearGradient>

										{/* Metallic Bevel Depth Gradient */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='bevelGradBack'
											x1='20'
											x2='220'
											y1='30'
											y2='240'
										>
											<stop offset='0%' stopColor='#ffd56b' />
											<stop offset='30%' stopColor='#8a5c10' />
											<stop offset='50%' stopColor='#4d3205' />
											<stop offset='75%' stopColor='#e2b047' />
											<stop offset='100%' stopColor='#2d1d02' />
										</linearGradient>

										{/* Inner Hexagon Dark Face */}
										<linearGradient
											gradientUnits='userSpaceOnUse'
											id='innerFaceGradBack'
											x1='120'
											x2='120'
											y1='44'
											y2='220'
										>
											<stop offset='0%' stopColor='#292930' />
											<stop offset='40%' stopColor='#19191d' />
											<stop offset='100%' stopColor='#0e0e11' />
										</linearGradient>

										{/* Silver / Chrome Gradient */}
										<linearGradient id='silverShineBack' x1='0%' x2='100%' y1='0%' y2='100%'>
											<stop offset='0%' stopColor='#ffffff' />
											<stop offset='55%' stopColor='#d4d8df' />
											<stop offset='100%' stopColor='#939ba8' />
										</linearGradient>

										{/* Golden Checkmark Gradient */}
										<linearGradient id='goldenCheckBack' x1='0%' x2='100%' y1='0%' y2='100%'>
											<stop offset='0%' stopColor='#ffe188' />
											<stop offset='50%' stopColor='#dfaa3f' />
											<stop offset='100%' stopColor='#9e6e18' />
										</linearGradient>

										{/* Filter for Inner Shadow */}
										<filter height='120%' id='innerDepthBack' width='120%' x='-10%' y='-10%'>
											<feDropShadow
												dx='0'
												dy='5'
												floodColor='#000000'
												floodOpacity='0.9'
												stdDeviation='4'
											/>
										</filter>
									</defs>

									{/* Hexagon Bevel Outer Extrusion */}
									<polygon
										fill='url(#goldRimGradBack)'
										points='120,8 218,65 218,199 120,256 22,199 22,65'
										stroke='rgba(255,255,255,0.4)'
										strokeWidth='1.5'
									/>

									{/* Metallic Bevel */}
									<polygon
										fill='url(#bevelGradBack)'
										points='120,18 206,68 206,188 120,238 34,188 34,68'
									/>

									{/* Hexagon Core Slate Surface */}
									<polygon
										fill='url(#innerFaceGradBack)'
										filter='url(#innerDepthBack)'
										points='120,30 194,73 194,177 120,220 46,177 46,73'
										stroke='#674b12'
										strokeWidth='1.8'
									/>

									{/* Inner Subtle Hexagon Hairline Accent */}
									<polygon
										fill='none'
										points='120,38 186,76 186,170 120,208 54,170 54,76'
										stroke='rgba(229,184,66,0.18)'
										strokeWidth='1.2'
									/>

									{/* User Icon - Head */}
									<circle cx='120' cy='104' fill='url(#silverShineBack)' r='19' />

									{/* User Icon - Body */}
									<path
										d='M96 156 C96 138 106 130 120 130 C125 130 130 131.5 134.5 134 C132.8 138 132 142.5 132.5 147.5 L129 156 Z'
										fill='url(#silverShineBack)'
									/>

									{/* Checkmark */}
									<path
										d='M126 148 L137 159 L158 131'
										fill='none'
										filter='drop-shadow(0 2px 4px rgba(0,0,0,0.6))'
										stroke='url(#goldenCheckBack)'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='6.5'
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* 3DPodiumDais Base (Cuter Scaled Stand) */}
					<div
						className='relative w-56 sm:w-64 h-14 -mt-9 z-10 flex flex-col items-center'
						data-purpose='pedestal-stand'
					>
						{/* Top Tier Ring / Bevel */}
						<div className='w-40 sm:w-48 h-6 rounded-[50%] bg-gradient-to-r from-[#946b19] via-[#fae08c] via-50% to-[#664609] p-[1.5px] shadow-lg'>
							<div className='w-full h-full rounded-[50%] bg-gradient-to-b from-[#141416] to-[#0a0a0c] border border-amber-400/40'></div>
						</div>
						{/* Mid Tier Body */}
						<div className='w-48 sm:w-54 h-6 -mt-3.5 rounded-[50%] bg-gradient-to-r from-[#b38525] via-[#fff1b0] via-45% to-[#704d0c] shadow-[0_8px_20px_rgba(0,0,0,0.9)] p-[1.8px]'>
							<div className='w-full h-full rounded-[50%] bg-gradient-to-r from-[#382607] via-[#211704] to-[#120c02]'></div>
						</div>
						{/* Bottom Tier Rim Platform */}
						<div className='w-56 sm:w-64 h-8 -mt-3.5 rounded-[50%] bg-gradient-to-r from-[#7a5511] via-[#e5b842] via-50% to-[#543806] p-[2px] shadow-[0_12px_28px_rgba(0,0,0,0.95)]'>
							<div className='w-full h-full rounded-[50%] bg-gradient-to-b from-[#1c1407] to-[#000000]'></div>
						</div>
						{/* Base Radial Light Glow Reflection */}
						<div
							aria-hidden='true'
							className='absolute -bottom-3 w-52 h-6 bg-amber-400/25 rounded-full blur-md pointer-events-none'
						></div>
					</div>
				</div>

				{/* END: RightEmblemColumn */}
			</div>
		</div>
	)
}