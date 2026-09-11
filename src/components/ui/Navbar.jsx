import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

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
			className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
				scrolled
					? 'py-3 ios-glass !border-none !rounded-none'
					: 'py-5 bg-transparent'
			}`}
		>
			<div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
			<motion.a
				href="#home"
				className="flex items-center gap-3 group"
			>
				<div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-[#8b5cf6] to-secondary flex items-center justify-center shadow-lg shadow-primary/25 ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-primary/40 transition-all">
					<span className="text-white font-black text-lg tracking-tight">K</span>
					<span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-dark" title="Available for work" />
				</div>
				<span className="hidden sm:flex flex-col leading-none gap-1">
					<span className="text-[15px] font-bold text-white tracking-tight">Kishor Chaudhary</span>
					<span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">Portfolio</span>
				</span>
			</motion.a>

				{/* Desktop Nav */}
				<div className="hidden lg:flex items-center gap-6">
					<div className="flex items-center gap-6">
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="text-[13px] uppercase tracking-widest font-semibold text-gray-400 hover:text-primary transition-all relative group"
								style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
							>
								{link.name}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
							</a>
						))}
					</div>

					<div className="flex items-center gap-4">
						<motion.a
							href="/assets/Kishor_Chaudhary_CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							style={{ '--hover-color': '#7c3aed' }} className="p-2.5 bg-white/5 rounded-full border border-white/10 transition-all text-primary liquid-glass flex items-center gap-2 hover-glow"
						>
							<Download size={18} />
							<span className="text-sm font-semibold">Resume</span>
						</motion.a>

						<motion.a
							href="#contact"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							style={{ '--hover-color': '#ea580c', fontFamily: 'Inter, system-ui, sans-serif' }} className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm flex items-center gap-2 group shadow-lg shadow-primary/20 liquid-glass hover-glow"
						>
							Let's Talk
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</motion.a>
					</div>
				</div>

				{/* Mobile Toggle */}
				<button
					style={{ '--hover-color': '#0d9488' }} className="lg:hidden p-2 text-gray-300 hover:text-white transition-all rounded-lg liquid-glass hover-glow"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-navigation"
				>
					{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						id="mobile-navigation"
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						className="fixed inset-0 top-0 left-0 w-full h-screen bg-dark/95 backdrop-blur-2xl z-50 lg:hidden flex flex-col items-center justify-center gap-8"
					>
						<button
							onClick={() => setMobileMenuOpen(false)}
							className="absolute top-8 right-8 p-2 text-gray-400 hover:text-white"
							aria-label="Close navigation menu"
						>
							<X size={32} />
						</button>

						{navLinks.map((link, i) => (
							<motion.a
								key={link.name}
								href={link.href}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1 }}
								className="text-4xl font-bold text-white hover:text-primary transition-colors"
								style={{
									fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
								}}
								onClick={() => setMobileMenuOpen(false)}
							>
								{link.name}
							</motion.a>
						))}

						<motion.a
							href="/assets/Kishor_Chaudhary_CV.pdf"
							target="_blank"
							rel="noopener noreferrer"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							style={{ '--hover-color': '#16a34a', fontFamily: 'Inter, system-ui, sans-serif' }} className="mt-4 px-10 py-4 bg-primary text-dark font-bold rounded-full text-xl liquid-glass flex items-center gap-3 hover-glow"
						>
							<Download size={20} />
							Download CV
						</motion.a>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.nav>
	);
};

export default Navbar;
