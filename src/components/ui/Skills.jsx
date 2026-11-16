import { motion } from 'framer-motion';
import { Code2, Database, Wrench } from 'lucide-react';
import { SKILL_GROUPS } from '../../data/skills';
import {
	EASE_OUT,
	fadeUp,
	hoverLift,
	staggerContainer,
	staggerItem,
	VIEWPORT,
} from '../../lib/motion';
import useSpotlight from '../../lib/useSpotlight';
import AnimatedNumber from './AnimatedNumber';

const GROUP_ICONS = {
	frontend: Code2,
	backend: Database,
	tooling: Wrench,
};

const average = (skills) =>
	Math.round(
		skills.reduce((total, skill) => total + skill.level, 0) / skills.length,
	);

const SkillRow = ({ skill, accent, index }) => (
	<li className="group/skill">
		<div className="mb-2 flex items-baseline justify-between gap-4">
			<span className="text-sm font-medium tracking-tight text-gray-300 transition-colors duration-300 group-hover/skill:text-white">
				{skill.name}
			</span>
			<span className="text-xs font-medium tabular-nums tracking-wide text-gray-500 transition-colors duration-300 group-hover/skill:text-gray-300">
				{skill.level}%
			</span>
		</div>
		<div
			role="progressbar"
			aria-label={`${skill.name} proficiency`}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={skill.level}
			aria-valuetext={`${skill.level} percent`}
			className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10"
		>
			<motion.div
				initial={{ scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={VIEWPORT}
				transition={{
					duration: 0.9,
					delay: 0.15 + index * 0.05,
					ease: EASE_OUT,
				}}
				className="h-full origin-left rounded-full transition-[filter] duration-300 group-hover/skill:brightness-125"
				style={{
					width: `${skill.level}%`,
					backgroundImage: `linear-gradient(90deg, ${accent} 0%, ${accent}cc 65%, ${accent}66 100%)`,
					boxShadow: `0 0 12px ${accent}55`,
				}}
			/>
		</div>
	</li>
);

const SkillGroup = ({ group, index }) => {
	const Icon = GROUP_ICONS[group.id] || Code2;
	const score = average(group.skills);
	const { onPointerMove } = useSpotlight();

	return (
		<motion.article
			variants={staggerItem}
			whileHover={hoverLift}
			onPointerMove={onPointerMove}
			style={{ '--hover-color': group.accent }}
			className="spotlight glass-card skill-card group relative flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover-glow"
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					backgroundImage: `linear-gradient(90deg, transparent, ${group.accent}, transparent)`,
				}}
			/>

			<div
				className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.25em]"
				style={{ color: group.accent }}
			>
				<span className="inline-flex items-center gap-2">
					<Icon
						size={14}
						aria-hidden="true"
					/>
					Stack
				</span>
				<span className="text-gray-300">
					{String(index + 1).padStart(2, '0')}
				</span>
			</div>

			<h3 className="mt-4 text-2xl font-bold tracking-tight text-white transition-colors">
				{group.title}
			</h3>
			<p className="mt-3 text-sm leading-relaxed text-gray-400">
				{group.tagline}
			</p>

			<ul className="mt-6 space-y-4">
				{group.skills.map((skill, skillIndex) => (
					<SkillRow
						key={skill.name}
						skill={skill}
						accent={group.accent}
						index={skillIndex}
					/>
				))}
			</ul>

			<div className="mt-auto pt-6">
				<div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-gray-400">
					<span className="inline-flex items-center gap-2">
						<span
							aria-hidden="true"
							className="h-1.5 w-1.5 rounded-full"
							style={{
								background: group.accent,
								boxShadow: `0 0 10px ${group.accent}`,
							}}
						/>
						{group.skills.length} skills
					</span>
					<span className="inline-flex items-baseline gap-1.5">
						Avg
						<AnimatedNumber
							value={score}
							suffix="%"
							className="font-semibold tabular-nums text-white"
						/>
					</span>
				</div>
			</div>
		</motion.article>
	);
};

const Skills = () => (
	<section
		id="skills"
		aria-labelledby="skills-heading"
		className="relative scroll-mt-24 px-6 py-24"
	>
		<div className="mx-auto max-w-7xl">
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={VIEWPORT}
				variants={fadeUp}
				className="mb-16 text-center"
			>
				<h2
					id="skills-heading"
					className="running-gradient mb-4 inline-block text-4xl font-bold md:text-5xl"
				>
					Skills
				</h2>
				<p className="mx-auto max-w-2xl text-lg text-gray-400">
					The tools I reach for most, grouped by how I use them.
				</p>
			</motion.div>

			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={VIEWPORT}
				variants={staggerContainer(0.09)}
				className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				{SKILL_GROUPS.map((group, index) => (
					<SkillGroup
						key={group.id}
						group={group}
						index={index}
					/>
				))}
			</motion.div>
		</div>
	</section>
);

export default Skills;
