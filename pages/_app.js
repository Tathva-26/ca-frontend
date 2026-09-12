// FONTS
import 'assets/fonts/inter/inter.css'
import 'assets/fonts/clash-display/clash-display.css'

// COMMON CSS
import 'styles/text-styles.css'
import 'styles/layout.css'
import 'styles/form.css'
import 'styles/app.css'
import 'styles/global.css'
import 'styles/animation.css'

// COMPONENT CSS
import 'components/homepage/homepage.css'
import 'components/homepage/hero.css'
import 'components/homepage/the-idea.css'
import 'components/homepage/benefits.css'
import 'components/homepage/mission.css'
import 'components/homepage/point-system.css'
import 'components/homepage/offer-letter.css'
import 'components/homepage/leaderboard-section.css'
import 'components/homepage/testimonials.css'
import 'components/homepage/final-cta.css'
import 'components/homepage/page4.css'

import 'components/dashboard/dashboard.css'
import 'components/dashboard/side-nav.css'
import 'components/dashboard/referrals.css'
import 'components/dashboard/posters.css'

import 'lib/firebase'

import { useRouter } from 'next/router'

import Head from 'next/head'
import Nav from 'components/common/Nav'
import Footer from 'components/common/Footer'
import UserContextWrapper from 'context/UserContext'
import DashboardLayout from 'components/layouts/DashboardLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const TITLE = `Tathva '26 — Campus Ambassador | NIT Calicut`
const DESCRIPTION =
	"Bring Tathva '26 to your campus. Share the festival, earn points, unlock your official offer letter, and win rewards at NIT Calicut."
const SITE_URL = 'https://ca.tathva.org/'
const SITE_DOMAIN = 'ca.tathva.org'

export default function MyApp({ Component, pageProps }) {
	const router = useRouter()

	return (
		<>
			<Head>
				<title>{TITLE}</title>
				<meta name='description' content={DESCRIPTION} />

				<meta charSet='utf-8' />
				<link rel='manifest' href='/manifest.json' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='theme-color' content='#050505' />

				<link rel='icon' href='/title-icon.ico' />
				<link rel='apple-touch-icon' href='/favicon.png' />

				<meta property='og:url' content={SITE_URL} />
				<meta property='og:type' content='website' />
				<meta property='og:title' content={TITLE} />
				<meta property='og:description' content={DESCRIPTION} />

				{/* 1200 x 630px */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta property='twitter:domain' content={SITE_DOMAIN} />
				<meta property='twitter:url' content={SITE_URL} />
				<meta name='twitter:title' content={TITLE} />
				<meta name='twitter:description' content={DESCRIPTION} />
			</Head>
			<UserContextWrapper>
				<Nav />
				{router?.pathname?.includes('/dashboard') ? (
					<DashboardLayout>
						<Component {...pageProps} />
					</DashboardLayout>
				) : (
					<Component {...pageProps} />
				)}
				<Footer />
			</UserContextWrapper>
			<ToastContainer />
		</>
	)
}
