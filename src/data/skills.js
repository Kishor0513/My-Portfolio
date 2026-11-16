// Self-assessed working proficiency (0–100). Edit a level here and the
// category average recalculates automatically.
export const SKILL_GROUPS = [
	{
		id: 'frontend',
		title: 'Frontend',
		tagline: 'React, interfaces, and motion',
		accent: '#bfa8ff',
		skills: [
			{ name: 'React', level: 92 },
			{ name: 'Next.js', level: 86 },
			{ name: 'JavaScript', level: 90 },
			{ name: 'Tailwind CSS', level: 92 },
			{ name: 'Framer Motion', level: 80 },
			{ name: 'Three.js', level: 62 },
		],
	},
	{
		id: 'backend',
		title: 'Backend',
		tagline: 'APIs, servers, and databases',
		accent: '#ff9ce6',
		skills: [
			{ name: 'Node.js', level: 88 },
			{ name: 'Express', level: 85 },
			{ name: 'PHP', level: 86 },
			{ name: 'REST APIs', level: 90 },
			{ name: 'PostgreSQL', level: 80 },
			{ name: 'MySQL', level: 82 },
		],
	},
	{
		id: 'tooling',
		title: 'Tooling',
		tagline: 'Deployment, versioning, and testing',
		accent: '#8b5cf6',
		skills: [
			{ name: 'Git & GitHub', level: 90 },
			{ name: 'Docker', level: 76 },
			{ name: 'CI/CD', level: 74 },
			{ name: 'AWS', level: 68 },
			{ name: 'Supabase', level: 80 },
			{ name: 'Jest', level: 72 },
		],
	},
];
