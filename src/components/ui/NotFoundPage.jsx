import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useEffect } from 'react';
import { EASE_OUT } from '../../lib/motion';

const NOT_FOUND_TITLE = 'Page not found | Kishor Chaudhary';

const NotFoundPage = () => {
	useEffect(() => {
		const previousTitle = document.title;
		const existingRobots = document.head.querySelector('meta[name="robots"]');
		const previousRobots = existingRobots
			? existingRobots.getAttribute('content')
			: null;

		document.title = NOT_FOUND_TITLE;

		let managedRobots = existingRobots;
		if (managedRobots) {
			managedRobots.setAttribute('content', 'noindex,follow');
		} else {
			managedRobots = document.createElement('meta');
			managedRobots.setAttribute('name', 'robots');
			managedRobots.setAttribute('content', 'noindex,follow');
			managedRobots.setAttribute('data-not-found-robots', 'true');
			document.head.appendChild(managedRobots);
		}

		return () => {
			document.title = previousTitle;
			if (existingRobots) {
				if (previousRobots === null) {
					existingRobots.removeAttribute('content');
				} else {
					existingRobots.setAttribute('content', previousRobots);
				}
			} else {
				managedRobots?.remove();
			}
		};
	}, []);

	return (
		<div className="min-h-svh bg-dark text-white selection:bg-primary/30">
			<div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_24%),linear-gradient(180deg,#14081f_0%,#0f0518_48%,#09030f_100%)]" />
			<motion.main
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: EASE_OUT }}
				className="relative z-10 mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-6 text-center"
			>
				<p className="mb-4 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
					404
				</p>
				<h1 className="text-4xl font-bold tracking-tight md:text-6xl">
					This page went <span className="running-gradient">offline</span>.
				</h1>
				<p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-300">
					The link may be broken, or the article only exists in the browser that
					created it. Try the homepage or the blog index instead.
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<a
						href="/"
						className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-dark transition-transform hover:scale-[1.03]"
					>
						<Home size={16} aria-hidden="true" />
						Back home
					</a>
					<a
						href="/blog/"
						className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
					>
						<ArrowLeft size={16} aria-hidden="true" />
						Browse articles
					</a>
				</div>
			</motion.main>
		</div>
	);
};

export default NotFoundPage;
