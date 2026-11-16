import {
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
} from 'framer-motion';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { useRef } from 'react';
import { EASE_OUT, fadeUp, SPRING, VIEWPORT } from '../../lib/motion';

const TimelineItem = ({ data, index }) => {
	const fromLeft = index % 2 === 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 40, x: fromLeft ? -40 : 40 }}
			whileInView={{ opacity: 1, y: 0, x: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{
				duration: 0.7,
				ease: EASE_OUT,
				delay: index * 0.08,
			}}
			className={`relative flex items-center justify-between mb-12 w-full ${
				fromLeft ? 'flex-row-reverse' : 'flex-row'
			}`}
		>
			<div className="hidden md:block w-5/12" />

			<motion.div
				initial={{ scale: 0.6, opacity: 0 }}
				whileInView={{ scale: 1, opacity: 1 }}
				viewport={{ once: true, amount: 0.7 }}
				transition={{
					type: 'spring',
					stiffness: 320,
					damping: 22,
					delay: 0.1 + index * 0.08,
				}}
				className="z-20 flex items-center order-1 bg-primary shadow-xl shadow-primary/25 w-10 h-10 rounded-full border-4 border-dark justify-center text-dark"
			>
				{data.type === 'work' ? (
					<Briefcase size={18} aria-hidden="true" />
				) : (
					<GraduationCap size={18} aria-hidden="true" />
				)}
			</motion.div>

			<motion.div
				whileHover={{ y: -4 }}
				transition={SPRING}
				style={{ '--hover-color': data.hoverColor }}
				className="order-1 glass-card group liquid-glass border border-white/10 w-full md:w-5/12 px-6 py-6 transition-all"
			>
				<div className="flex items-center gap-2 mb-2 text-primary text-sm font-mono">
					<Calendar size={14} aria-hidden="true" />
					<span>{data.period}</span>
				</div>
				<h3 className="mb-1 font-bold text-white text-xl group-hover:text-primary transition-colors">
					{data.title}
				</h3>
				<h4 className="mb-3 font-semibold text-gray-400 text-sm">
					{data.company}
				</h4>
				<p className="text-sm leading-relaxed text-gray-400">
					{data.description}
				</p>
			</motion.div>
		</motion.div>
	);
};

const Timeline = () => {
	const lineRef = useRef(null);
	const shouldReduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: lineRef,
		offset: ['start 75%', 'end 60%'],
	});
	const scaleY = useSpring(scrollYProgress, {
		stiffness: 90,
		damping: 26,
		mass: 0.4,
	});

	const experiences = [
		{
			type: 'work',
			title: 'E-commerce Operation Executive',
			company: 'Felt and Yarn Pvt. Ltd',
			period: '2025 - Present',
			hoverColor: '#d97706',
			description:
				'Managing and developing e-commerce web solutions, implementing modern web technologies for enhanced user experience and business growth.',
		},
		{
			type: 'education',
			title: 'Bachelor of Information Technology (HONS)',
			company: 'Nilai University, Malaysia',
			period: '2022 - 2026',
			hoverColor: '#0891b2',
			description:
				'Specialized in software development, web technologies, and modern programming practices. Developed strong foundation in computer science fundamentals.',
		},
	];

	return (
		<section
			id="experience"
			className="relative scroll-mt-24 overflow-hidden px-6 py-24"
		>
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT}
					variants={fadeUp}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold mb-4 running-gradient inline-block">
						Professional Journey
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
						A timeline of my professional growth and educational background.
					</p>
				</motion.div>

				<div
					ref={lineRef}
					className="relative wrap overflow-hidden p-10 h-full"
				>
					<div
						aria-hidden="true"
						className="absolute left-1/2 top-0 h-full -translate-x-1/2 hidden md:block"
					>
						<div className="h-full w-px bg-white/10" />
						<motion.div
							className="absolute inset-x-0 top-0 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-primary"
							style={shouldReduceMotion ? undefined : { scaleY }}
						/>
					</div>
					{experiences.map((exp, index) => (
						<TimelineItem
							key={exp.title}
							data={exp}
							index={index}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Timeline;
