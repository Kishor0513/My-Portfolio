import { motion, useScroll, useSpring } from 'framer-motion';

// A quiet reading indicator. It communicates position without adding a
// floating widget or stealing attention from the content.
const ScrollProgress = () => {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 140,
		damping: 30,
		mass: 0.2,
	});

	return (
		<motion.div
			aria-hidden="true"
			className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-primary via-secondary to-primary"
			style={{ scaleX }}
		/>
	);
};

export default ScrollProgress;
