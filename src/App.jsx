import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowRight,
	ArrowUp,
	ChevronDown,
	Cpu,
	Download,
	ExternalLink,
	Github,
	Globe,
	Instagram,
	Link,
	Linkedin,
	Mail,
	MapPin,
	Server,
} from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BlogIndexPage, BlogPostPage } from './components/blog/BlogPages';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Navbar from './components/ui/Navbar';
import DemoWindow from './components/projects/DemoWindow';
import { PROJECTS } from './data/projects';
import Admin from './components/admin/Admin';
import { getBlogPosts } from './data/blogStorage';
const FloatingTechIcons = lazy(() => import('./components/ui/FloatingTechIcons'));
const SpaceBackground = lazy(() => import('./components/ui/SpaceBackground'));
const Timeline = lazy(() => import('./components/ui/Timeline'));



const HERO_ROLES = [
	'Full Stack Developer',
	'React Specialist',
	'UI/UX Enthusiast',
	'Backend Engineer',
];

const HeroTypewriter = () => {
	const [roleIdx, setRoleIdx] = useState(0);
	const [displayed, setDisplayed] = useState('');
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		const currentRole = HERO_ROLES[roleIdx];
		let timeout;
		if (!deleting && displayed.length < currentRole.length) {
			timeout = setTimeout(
				() => setDisplayed(currentRole.slice(0, displayed.length + 1)),
				80,
			);
		} else if (!deleting && displayed.length === currentRole.length) {
			timeout = setTimeout(() => setDeleting(true), 2200);
		} else if (deleting && displayed.length > 0) {
			timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
		} else {
			setDeleting(false);
			setRoleIdx((prev) => (prev + 1) % HERO_ROLES.length);
		}
		return () => clearTimeout(timeout);
	}, [displayed, deleting, roleIdx]);

	return (
		<span>
			<span className="text-primary font-medium">{displayed}</span>
			<span className="text-primary/60 animate-pulse">|</span>
		</span>
	);
};

function App() {
	const [isSending, setIsSending] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null);
	const [activeDemo, setActiveDemo] = useState(null);
	const formRef = useRef();

	const pathname =
		typeof window !== 'undefined'
			? window.location.pathname.replace(/\/+$/, '') || '/'
			: '/';

	if (pathname === '/blog' || pathname === '/blog/') {
		return <BlogIndexPage />;
	}

	if (pathname.startsWith('/blog/')) {
		const slug = pathname.split('/').filter(Boolean)[1];
		return <BlogPostPage post={{ slug }} />;
	}

	if (pathname === '/admin') {
		return <Admin />;
	}

	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
	};

	return (
		<ErrorBoundary>
			<div className="bg-dark min-h-screen text-white selection:bg-primary/30 font-sans">
				<Navbar />

				<div className="fixed inset-0 z-0 pointer-events-none">
					<Suspense fallback={null}>
						<SpaceBackground />
					</Suspense>
				</div>

				<main className="relative z-10" style={{ transform: 'translateZ(0)' }}>
					{/* Hero Section */}
					<section
						id="home"
						className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden pt-20"
					>
						{/* Full Background Image */}
						<div className="absolute inset-0 pointer-events-none overflow-hidden">
							<picture>
								<source srcSet="/assets/myphoto.webp" type="image/webp" />
								<img
									src="/assets/myphoto.png"
									alt=""
									className="w-full h-full object-cover opacity-40"
									aria-hidden="true"
									decoding="async"
								/>
							</picture>
						</div>

						{/* Gradient Overlays */}
						<div className="absolute inset-0 bg-gradient-to-b from-dark/10 via-dark/30 to-dark pointer-events-none" />
						<div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
						<div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

						{/* Floating Tech Icons */}
						<Suspense fallback={null}>
							<FloatingTechIcons />
						</Suspense>

						<div className="relative z-10 w-full">
							<div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(100vh-5rem)] px-4 pt-16 md:pt-24" style={{ transform: 'translateZ(0)' }}>
								<div className="max-w-2xl mx-auto">
									{/* Name */}
									<motion.h1
										initial={{ opacity: 0, y: 40, scale: 0.96 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
										className="font-black tracking-wide mb-4 leading-[1.1] drop-shadow-lg"
									>
										<span className="block text-2xl md:text-3xl text-gray-300 font-light mb-3 tracking-normal">I'm</span>
										<span className="flex flex-col sm:flex-row justify-center items-center sm:items-baseline gap-y-2 sm:gap-x-4 text-4xl sm:text-5xl md:text-7xl lg:text-8xl">
											<span className="text-white">Kishor</span>
											<span className="running-gradient pb-1">Chaudhary</span>
										</span>
									</motion.h1>

									{/* Typewriter Role */}
									<motion.div
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
										className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light min-h-[2.5rem] drop-shadow"
									>
										<HeroTypewriter />
									</motion.div>

									{/* Description */}
									<motion.p
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
										className="text-sm md:text-base text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed drop-shadow"
									>
										Full-stack developer specializing in building modern,
										performant web applications with React, Node.js, and cloud
										infrastructure.
									</motion.p>

									{/* CTAs */}
									<motion.div
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
										className="flex flex-wrap gap-3 justify-center"
									>
										<motion.a
											href="#projects"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											style={{ '--hover-color': '#f59e0b' }} className="group px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg shadow-primary/30 inline-flex items-center gap-2 hover-glow transition-all text-sm"
										>
											View Projects
											<ArrowRight
												size={16}
												className="group-hover:translate-x-1 transition-transform"
											/>
										</motion.a>
										<motion.a
											href="/assets/Kishor_Chaudhary_CV.pdf"
											target="_blank"
											rel="noopener noreferrer"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											style={{ '--hover-color': '#06b6d4' }} className="group px-6 py-3 liquid-glass text-white font-semibold rounded-full inline-flex items-center gap-2 hover-glow transition-all text-sm"
										>
											<Download size={16} />
											Download CV
										</motion.a>
									</motion.div>
								</div>
							</div>
						</div>

						{/* Scroll Indicator */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.5, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
							style={{ '--hover-color': '#8b5cf6' }} className="absolute bottom-8 inset-x-0 mx-auto w-max flex flex-col items-center gap-2 text-gray-500 cursor-pointer hover-glow transition-all"
							onClick={() =>
								document
									.getElementById('experience')
									?.scrollIntoView({ behavior: 'smooth' })
							}
						>
							<span className="text-xs uppercase tracking-[0.2em] font-medium">
								Scroll
							</span>
							<motion.div
								animate={{ y: [0, 8, 0] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							>
								<ChevronDown size={20} />
							</motion.div>
						</motion.div>
					</section>

					<Timeline />

					{/* 2. SKILLS SECTION */}
					<section
						id="skills"
						className="py-32 px-6 relative bg-transparent overflow-hidden"
					>
						<div className="max-w-7xl mx-auto">
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, margin: '-50px' }}
								variants={fadeIn}
								className="text-center mb-16"
							>
								<h2 className="text-4xl md:text-5xl font-bold mb-4 running-gradient inline-block">
									Technical Expertise
								</h2>
								<p className="text-gray-400 text-lg max-w-2xl mx-auto">
									Check out my social media and GitHub for more technical
									projects and insights.
								</p>
							</motion.div>

							<div className="grid md:grid-cols-3 gap-8">
								{/* Frontend */}
								<motion.div
									whileHover={{ y: -5 }}
									style={{ '--hover-color': '#3b82f6' }}
									className="glass-panel p-8 rounded-2xl liquid-glass"
								>
									<div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
										<Globe size={24} />
									</div>
									<h3 className="text-2xl font-bold mb-6">Frontend</h3>
									<div className="space-y-4">
										{[
											{ name: 'React', level: 92 },
											{ name: 'Next.js', level: 85 },
											{ name: 'Three.js', level: 60 },
											{ name: 'Tailwind CSS', level: 90 },
											{ name: 'Framer Motion', level: 78 },
											{ name: 'Redux', level: 75 },
										].map((skill) => (
											<motion.div
												key={skill.name}
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: false, margin: '-50px' }}
												transition={{ duration: 0.4 }}
												className="space-y-1"
											>
												<div className="flex justify-between text-sm">
													<span className="text-gray-300">{skill.name}</span>
													<span className="text-primary">{skill.level}%</span>
												</div>
												<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														whileInView={{ width: `${skill.level}%` }}
														viewport={{ once: false, margin: '-50px' }}
														transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
														className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
													/>
												</div>
											</motion.div>
										))}
									</div>
								</motion.div>

								{/* Backend */}
								<motion.div
									whileHover={{ y: -5 }}
									style={{ '--hover-color': '#22c55e' }}
									className="glass-panel p-8 rounded-2xl liquid-glass"
								>
									<div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 text-green-400">
										<Server size={24} />
									</div>
									<h3 className="text-2xl font-bold mb-6">Backend</h3>
									<div className="space-y-4">
										{[
											{ name: 'Node.js', level: 88 },
											{ name: 'Express', level: 85 },
											{ name: 'MongoDB', level: 80 },
											{ name: 'PostgreSQL', level: 75 },
											{ name: 'GraphQL', level: 65 },
											{ name: 'REST APIs', level: 90 },
										].map((skill) => (
											<motion.div
												key={skill.name}
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: false, margin: '-50px' }}
												transition={{ duration: 0.4 }}
												className="space-y-1"
											>
												<div className="flex justify-between text-sm">
													<span className="text-gray-300">{skill.name}</span>
													<span className="text-green-400">{skill.level}%</span>
												</div>
												<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														whileInView={{ width: `${skill.level}%` }}
														viewport={{ once: false, margin: '-50px' }}
														transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
														className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
													/>
												</div>
											</motion.div>
										))}
									</div>
								</motion.div>

								{/* Tools & Arch */}
								<motion.div
									whileHover={{ y: -5 }}
									style={{ '--hover-color': '#a78bfa' }}
									className="glass-panel p-8 rounded-2xl liquid-glass"
								>
									<div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400">
										<Cpu size={24} />
									</div>
									<h3 className="text-2xl font-bold mb-6">Architecture</h3>
									<div className="space-y-4">
										{[
											{ name: 'Docker', level: 82 },
											{ name: 'AWS', level: 70 },
											{ name: 'Git', level: 90 },
											{ name: 'CI/CD', level: 75 },
											{ name: 'Microservices', level: 68 },
											{ name: 'Jest', level: 72 },
										].map((skill) => (
											<motion.div
												key={skill.name}
												initial={{ opacity: 0, x: -10 }}
												whileInView={{ opacity: 1, x: 0 }}
												viewport={{ once: false, margin: '-50px' }}
												transition={{ duration: 0.4 }}
												className="space-y-1"
											>
												<div className="flex justify-between text-sm">
													<span className="text-gray-300">{skill.name}</span>
													<span className="text-purple-400">{skill.level}%</span>
												</div>
												<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														whileInView={{ width: `${skill.level}%` }}
														viewport={{ once: false, margin: '-50px' }}
														transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
														className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
													/>
												</div>
											</motion.div>
										))}
									</div>
								</motion.div>
							</div>
						</div>
					</section>

					{/* 3. PROJECTS SECTION */}
					<section
						id="projects"
						className="py-32 px-6"
					>
						<div className="max-w-7xl mx-auto">
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, margin: '-50px' }}
								variants={fadeIn}
								className="text-center mb-16"
							>
								<h2 className="text-4xl md:text-5xl font-bold mb-4 running-gradient inline-block">
									Selected Work
								</h2>
							<p className="text-gray-400 text-lg max-w-2xl mx-auto">
								Highlights of engineering and design.
							</p>
						</motion.div>

							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, margin: '-50px' }}
								variants={{
									hidden: {},
									visible: { transition: { staggerChildren: 0.1 } },
								}}
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
							>
								{PROJECTS.map((project, i) => (
									<motion.div
										key={i}
										whileHover={{ y: -5, scale: 1.01 }}
										variants={{
											hidden: { opacity: 0, y: 30 },
											visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
										}}
										viewport={{ once: false, margin: '-50px' }}
										style={{ '--hover-color': project.hoverColor }}
										className={`glass-card overflow-hidden group transition-all duration-500 transform flex flex-col bg-white/5 backdrop-blur-2xl ${project.className || ''}`}
									>
										<div
											className={`relative overflow-hidden w-full ${project.className?.includes('md:col-span-2') ? 'h-[320px]' : 'h-[220px]'}`}
										>
											<img
												src={project.image}
												alt={project.title}
												loading="lazy"
												decoding="async"
												onError={(e) => {
													e.currentTarget.onerror = null;
													e.currentTarget.src =
														'/assets/portfolio.svg';
												}}
												className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-[#0f0518] via-transparent to-transparent opacity-90" />
											<div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<ExternalLink
													size={16}
													className="text-white"
												/>
											</div>
										</div>
										<div className="p-5 flex flex-col">
											<div>
												<div className="flex flex-wrap gap-2 mb-3">
													{project.tags.map((tag) => (
														<span
															key={tag}
															className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-gray-200 border border-white/5 backdrop-blur-md"
														>
															{tag}
														</span>
													))}
												</div>
												<h3 className="text-xl font-bold text-white mb-2 tracking-tight">
													{project.title}
												</h3>
												<p className="text-gray-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
													{project.desc}
												</p>
											</div>
											<div className="flex items-center gap-2 mt-4 flex-wrap">
												{project.demoUrl && (
													<button
														onClick={() => setActiveDemo(project)}
														className="flex items-center justify-center gap-2 text-sm font-semibold text-dark bg-primary px-5 py-2.5 rounded-xl hover:scale-[1.03] transition-all"
													>
														Open Demo
													</button>
												)}
												<a
													href={project.link}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-center gap-2 text-sm font-semibold text-white hover:text-white transition-all bg-white/10 px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/5 hover-glow"
												>
													View Code
												</a>
												{project.live !== '#' && !project.demoUrl && (
													<a
														href={project.live}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-center gap-2 text-sm font-semibold text-primary/90 hover:text-primary transition-all px-5 py-2.5 rounded-xl hover-glow"
													>
														Live View <ExternalLink size={14} />
													</a>
												)}
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
					</div>
				</section>
				<DemoWindow project={activeDemo} onClose={() => setActiveDemo(null)} />

					{/* Blog Preview Section */}
					<section
						id="blog"
						className="py-24 px-6 relative overflow-hidden"
					>
						<div className="max-w-7xl mx-auto">
							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, margin: '-50px' }}
								variants={fadeIn}
								className="text-center mb-16"
							>
								<h2 className="text-4xl md:text-5xl font-bold mb-4 running-gradient inline-block">
									Latest Blog Posts
								</h2>
								<p className="text-gray-400 text-lg max-w-2xl mx-auto">
									Practical notes about SEO, indexing, and fast portfolio
									builds.
								</p>
							</motion.div>

							<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, margin: '-50px' }}
								variants={{
									hidden: {},
									visible: { transition: { staggerChildren: 0.1 } },
								}}
								className="grid md:grid-cols-3 gap-6"
							>
								{getBlogPosts().map((post) => (
									<motion.a
										key={post.slug}
										href={post.path}
										whileHover={{ y: -6 }}
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
										}}
										style={{ '--hover-color': post.hoverColor }} className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover-glow"
									>
										<div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-primary">
											<span>{post.category}</span>
											<span className="text-gray-300">{post.readingTime}</span>
										</div>
										<h3 className="mt-4 text-2xl font-bold text-white transition-colors group-hover:text-primary">
											{post.title}
										</h3>
										<p className="mt-3 text-sm leading-relaxed text-gray-400">
											{post.excerpt}
										</p>
										<div className="mt-5 flex flex-wrap gap-2">
											{post.tags.map((tag) => (
												<span
													key={tag}
													className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-300"
												>
													{tag}
												</span>
											))}
										</div>
										<div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-primary">
											Read article <ArrowRight size={16} />
										</div>
									</motion.a>
								))}
							</motion.div>
						</div>
					</section>

					{/* Footer / Contact Section */}
					<footer
						id="contact"
						className="relative isolate pt-20 pb-8 overflow-hidden bg-gradient-to-b from-dark/60 via-dark/80 to-dark"
					>
						<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

						<div className="max-w-6xl mx-auto px-6 relative z-10">
							<div className="grid md:grid-cols-2 gap-12 mb-16">
								{/* Left Side: Contact Info */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: false, margin: '-50px' }}
									className="space-y-8"
								>
									<div>
										<h2 className="text-3xl md:text-4xl font-bold mb-4 running-gradient">
											Let's Connect
										</h2>
										<p className="text-gray-400 text-lg">
											Have a project in mind or just want to chat? Feel free to
											reach out. I'm always open to discussing new
											opportunities.
										</p>
									</div>

									<div className="space-y-4">
										<a
											href="mailto:kishoc2000@gmail.com"
											className="flex items-center gap-4 text-gray-300 hover:text-primary transition-all group rounded-xl"
										>
											<div style={{ '--hover-color': '#f43f5e' }} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-colors hover-glow">
												<Mail size={20} />
											</div>
											<span>kishorc2000@gmail.com</span>
										</a>
										<div className="flex items-center gap-4 text-gray-300">
											<div style={{ '--hover-color': '#14b8a6' }} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover-glow">
												<MapPin size={20} />
											</div>
											<span>Kathmandu, Nepal</span>
										</div>
									</div>

									{/* Social Icons */}
									<div className="flex gap-3">
										{[
											{
												href: 'https://github.com/Kishor0513',
												icon: Github,
												label: 'GitHub',
												hoverColor: '#6e40c9',
											},
											{
												href: 'https://www.linkedin.com/in/kishor-chaudhary-772b05314/',
												icon: Linkedin,
												label: 'LinkedIn',
												hoverColor: '#0077b5',
											},
											{
												href: 'https://www.instagram.com/kishor0513/',
												icon: Instagram,
												label: 'Instagram',
												hoverColor: '#db2777',
											},
											{
												href: 'https://linktr.ee/kishor0513',
												icon: Link,
												label: 'Linktree',
												hoverColor: '#b45309',
											},
										].map((social) => (
											<motion.a
												key={social.label}
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												whileHover={{ scale: 1.1, y: -2 }}
												style={{ '--hover-color': social.hoverColor }}
												className="w-12 h-12 flex items-center justify-center glass-panel rounded-xl border border-white/10 text-gray-400 hover:text-primary transition-all"
												title={social.label}
											>
												<social.icon size={20} />
											</motion.a>
										))}
									</div>
								</motion.div>

								{/* Right Side: Contact Form */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: false, margin: '-50px' }}
									transition={{ delay: 0.1 }}
									className="relative group"
								>
									<div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
									<div style={{ '--hover-color': '#c084fc' }} className="relative p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover-glow">
										<h3 className="text-xl font-bold text-white mb-6">
											Send a Message
										</h3>
										<form
											ref={formRef}
											onSubmit={(e) => {
												e.preventDefault();
												setIsSending(true);
												setSubmitStatus(null);

												emailjs
													.sendForm(
														import.meta.env.VITE_EMAILJS_SERVICE_ID,
														import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
														formRef.current,
														import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
													)
													.then(
														() => {
															setSubmitStatus('success');
															setIsSending(false);
															formRef.current.reset();
														},
														() => {
															setSubmitStatus('error');
															setIsSending(false);
														},
													);
											}}
											className="space-y-4"
										>
											<div className="grid md:grid-cols-2 gap-4">
												<label className="flex-1">
													<span className="sr-only">Your Name</span>
													<input
														type="text"
														name="user_name"
														required
														className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
														placeholder="Your Name"
													/>
												</label>
												<label className="flex-1">
													<span className="sr-only">Your Email</span>
													<input
														type="email"
														name="user_email"
														required
														className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
														placeholder="Your Email"
													/>
												</label>
											</div>
											<label className="block">
												<span className="sr-only">Your Message</span>
												<textarea
													name="message"
													required
													rows="3"
													className="w-full px-4 py-3 text-white text-sm rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500 resize-none"
													placeholder="Your Message"
												/>
											</label>

											<AnimatePresence>
												{submitStatus === 'success' && (
													<motion.p
														initial={{ opacity: 0, y: -10 }}
														animate={{ opacity: 1, y: 0 }}
														className="text-green-400 text-sm font-medium text-center"
													>
														Message sent successfully!
													</motion.p>
												)}
												{submitStatus === 'error' && (
													<motion.p
														initial={{ opacity: 0, y: -10 }}
														animate={{ opacity: 1, y: 0 }}
														className="text-red-400 text-sm font-medium text-center"
													>
														Failed to send. Please try again.
													</motion.p>
												)}
											</AnimatePresence>

											<button
												type="submit"
												disabled={isSending}
												style={{ '--hover-color': '#14b8a6' }} className="w-full py-3.5 font-bold text-sm text-white bg-primary rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all hover-glow flex items-center justify-center gap-2 disabled:opacity-50"
											>
												{isSending ? (
													<>
														<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
														SENDING
													</>
												) : (
													<>SEND MESSAGE</>
												)}
											</button>
										</form>
									</div>
								</motion.div>
							</div>

							{/* Bottom Bar */}
							<div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
								<p className="text-gray-500 text-sm">
									© {new Date().getFullYear()} Kishor Chaudhary. All rights
									reserved.
								</p>

								<button
									type="button"
									onClick={() =>
										window.scrollTo({ top: 0, behavior: 'smooth' })
									}
									style={{ '--hover-color': '#f472b6' }} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-gray-400 hover:text-primary transition-all hover-glow"
								>
									BACK TO TOP
									<ArrowUp size={12} />
								</button>
							</div>
						</div>
					</footer>
				</main>
			</div>
		</ErrorBoundary>
	);
}

export default App;
