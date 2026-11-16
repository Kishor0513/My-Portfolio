import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EASE_OUT } from '../../lib/motion';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SECTION_IDS = ['home', 'experience', 'skills', 'projects'];

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState('home');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const menuButtonRef = useRef(null);
	const menuPanelRef = useRef(null);
	const closeButtonRef = useRef(null);

	useEffect(() => {
		let frame = 0;

		const readScroll = () => {
			setScrolled(window.scrollY > 20);

			const probe = window.innerHeight * 0.35;
			let current = 'home';
			SECTION_IDS.forEach((id) => {
				const section = document.getElementById(id);
				if (section && section.getBoundingClientRect().top <= probe) {
					current = id;
				}
			});
			setActiveSection(current);
			frame = 0;
		};

		const handleScroll = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(readScroll);
		};

		readScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		if (!mobileMenuOpen) return undefined;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				setMobileMenuOpen(false);
				return;
			}

			if (event.key !== 'Tab' || !menuPanelRef.current) return;

			const focusable = Array.from(
				menuPanelRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
			).filter((element) => element.getClientRects().length > 0);

			if (focusable.length === 0) {
				event.preventDefault();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const focusIsInside = menuPanelRef.current.contains(document.activeElement);

			if (event.shiftKey) {
				if (!focusIsInside || document.activeElement === first) {
					event.preventDefault();
					last.focus();
				}
			} else if (!focusIsInside || document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			window.clearTimeout(focusTimer);
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = previousOverflow;
			menuButtonRef.current?.focus();
		};
	}, [mobileMenuOpen]);

	const navLinks = [
		{ name: 'Home', href: '#home' },
		{ name: 'Experience', href: '#experience' },
		{ name: 'Skills', href: '#skills' },
		{ name: 'Projects', href: '#projects' },
		{ name: 'Blog', href: '/blog/' },
	];

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.6, ease: EASE_OUT }}
			className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
				scrolled
					? 'py-3 ios-glass !border-none !rounded-none'
					: 'py-5 bg-transparent'
			}`}
		>
			<div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
				<motion.a href="#home" className="flex items-center gap-3 group">
					<div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-[#8b5cf6] to-secondary flex items-center justify-center shadow-lg shadow-primary/25 ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-primary/40 transition-all">
						<span className="text-white font-black text-lg tracking-tight">K</span>
						<span
							className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark animate-pulse"
							role="img"
							aria-label="Available for work"
						/>
					</div>
					<span className="hidden sm:flex flex-col leading-none gap-1">
						<span className="text-[15px] font-bold text-white tracking-tight">
							Kishor Chaudhary
						</span>
						<span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
							Portfolio
						</span>
					</span>
				</motion.a>

				{/* Desktop Nav */}
				<div className="hidden lg:flex items-center gap-6">
					<div className="flex items-center gap-6">
						{navLinks.map((link) => {
							const isActive = link.href === `#${activeSection}`;

							return (
								<a
									key={link.name}
									href={link.href}
									aria-current={isActive ? 'location' : undefined}
									className={`text-[13px] uppercase tracking-widest font-semibold transition-colors relative group ${
										isActive
											? 'text-white'
											: 'text-gray-400 hover:text-primary'
									}`}
									style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
								>
									{link.name}
									{isActive ? (
										<motion.span
											layoutId="nav-active"
											className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"
											transition={{
												type: 'spring',
												stiffness: 380,
												damping: 32,
											}}
										/>
									) : (
										<span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
									)}
								</a>
							);
						})}
					</div>

					<div className="flex items-center gap-4">
						<motion.a
							href="/assets/Kishor_Chaudhary_CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							style={{ '--hover-color': '#7c3aed' }}
							className="p-2.5 bg-white/5 rounded-full border border-white/10 transition-all text-primary liquid-glass flex items-center gap-2 hover-glow"
						>
							<Download size={18} aria-hidden="true" />
							<span className="text-sm font-semibold">Resume</span>
						</motion.a>

						<motion.a
							href="#contact"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							style={{
								'--hover-color': '#ea580c',
								fontFamily: 'Inter, system-ui, sans-serif',
							}}
							className="px-6 py-2.5 bg-primary text-dark font-bold rounded-full text-sm flex items-center gap-2 group shadow-lg shadow-primary/20 liquid-glass hover-glow"
						>
							Let's Talk
							<ArrowRight
								size={16}
								aria-hidden="true"
								className="group-hover:translate-x-1 transition-transform"
							/>
						</motion.a>
					</div>
				</div>

				{/* Mobile Toggle */}
				<button
					ref={menuButtonRef}
					type="button"
					style={{ '--hover-color': '#0d9488' }}
					className="lg:hidden p-2 text-gray-300 hover:text-white transition-all rounded-lg liquid-glass hover-glow"
					onClick={() => setMobileMenuOpen((open) => !open)}
					aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-navigation"
				>
					{mobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						id="mobile-navigation"
						ref={menuPanelRef}
						role="dialog"
						aria-modal="true"
						aria-label="Site navigation"
						initial={{ opacity: 0, x: 48 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 48 }}
						transition={{ duration: 0.35, ease: EASE_OUT }}
						className="fixed inset-0 top-0 left-0 w-full h-[100svh] bg-dark/95 backdrop-blur-2xl z-50 lg:hidden flex flex-col items-center justify-center gap-8 overflow-y-auto py-20"
					>
						<button
							ref={closeButtonRef}
							type="button"
							onClick={() => setMobileMenuOpen(false)}
							className="absolute top-8 right-8 p-2 text-gray-300 hover:text-white"
							aria-label="Close navigation menu"
						>
							<X size={32} aria-hidden="true" />
						</button>

						{navLinks.map((link, i) => {
							const isActive = link.href === `#${activeSection}`;

							return (
								<motion.a
									key={link.name}
									href={link.href}
									aria-current={isActive ? 'location' : undefined}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.12 + i * 0.06,
										duration: 0.45,
										ease: EASE_OUT,
									}}
									className={`text-4xl font-bold transition-colors ${
										isActive
											? 'text-primary'
											: 'text-white hover:text-primary'
									}`}
									style={{
										fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
									}}
									onClick={() => setMobileMenuOpen(false)}
								>
									{link.name}
								</motion.a>
							);
						})}

						<motion.a
							href="/assets/Kishor_Chaudhary_CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							style={{
								'--hover-color': '#16a34a',
								fontFamily: 'Inter, system-ui, sans-serif',
							}}
							className="mt-4 px-10 py-4 bg-primary text-dark font-bold rounded-full text-xl liquid-glass flex items-center gap-3 hover-glow"
						>
							<Download size={20} aria-hidden="true" />
							Download CV
						</motion.a>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
};

export default Navbar;
