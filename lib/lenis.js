import Lenis from 'lenis'

export function initLenis() {
	const lenis = new Lenis({
		autoRaf: true,
		autoToggle: true,
		anchors: true,
		allowNestedScroll: true,
		naiveDimensions: true,
		stopInertiaOnNavigate: true,
	})

	return lenis
}
