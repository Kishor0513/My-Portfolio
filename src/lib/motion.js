// Shared motion language for the whole site.
// One easing curve, one reveal distance, one stagger rhythm — so the
// page feels authored rather than assembled section by section.

export const EASE_OUT = [0.22, 1, 0.36, 1];

export const SPRING = {
	type: 'spring',
	stiffness: 260,
	damping: 28,
	mass: 0.9,
};

export const VIEWPORT = { once: true, amount: 0.2 };

export const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: EASE_OUT },
	},
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
	hidden: {},
	visible: {
		transition: { staggerChildren, delayChildren },
	},
});

export const staggerItem = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: EASE_OUT },
	},
};

export const hoverLift = {
	y: -6,
	transition: SPRING,
};
