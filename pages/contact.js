import PageHeader from '../components/common/PageHeader'
import ContactUs from 'components/contact/ContactUs'
import FinalCTA from 'components/homepage/FinalCTA'

export default function Contact() {
	return (
		<>
			<PageHeader title='Contact Us' icon='/images/contact.png' />
			<ContactUs />
			<FinalCTA />
		</>
	)
}
