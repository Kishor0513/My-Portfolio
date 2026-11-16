import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT } from '../../lib/motion';

const AnimatedNumber = ({
	value,
	duration = 1.1,
	className = '',
	suffix = '',
}) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.6 });
	const shouldReduceMotion = useReducedMotion();
	const [display, setDisplay] = useState(shouldReduceMotion ? value : 0);

	useEffect(() => {
		if (!isInView) return undefined;

		if (shouldReduceMotion) {
			setDisplay(value);
			return undefined;
		}

		const controls = animate(0, value, {
			duration,
			ease: EASE_OUT,
			onUpdate: (latest) => setDisplay(Math.round(latest)),
		});

		return () => controls.stop();
	}, [duration, isInView, shouldReduceMotion, value]);

	return (
		<span
			ref={ref}
			className={className}
			aria-label={`${value}${suffix}`}
		>
			<span aria-hidden="true">
				{display}
				{suffix}
			</span>
		</span>
	);
};

export default AnimatedNumber;
