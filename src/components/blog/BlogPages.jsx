import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import {
	blogIndexPath,
	buildBlogArticleJsonLd,
} from '../../data/blogPosts';
import { getBlogPosts, getPostBySlug } from '../../data/blogStorage';
import { buildAbsoluteUrl, SITE_NAME } from '../../data/site';
import {
	EASE_OUT,
	hoverLift,
	staggerContainer,
	staggerItem,
	VIEWPORT,
} from '../../lib/motion';
import useSpotlight from '../../lib/useSpotlight';
import NotFoundPage from '../ui/NotFoundPage';
import SeoHead from '../ui/SeoHead';

const pageFade = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: EASE_OUT },
	},
};

const formatDate = (value) => {
	const date = value ? new Date(value) : null;
	if (!date || Number.isNaN(date.getTime())) return 'Draft';

	return new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
};

const renderText = (text) => {
	if (!text) return text;
	const html = text
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/`(.+?)`/g, '<code class="text-primary bg-primary/10 px-1 rounded text-xs">$1</code>');
	return html;
};

const BlogHeader = () => (
	<header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f0518]/85 backdrop-blur-xl">
		<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a
				href={blogIndexPath}
				className="text-xl font-bold tracking-tight text-white"
			>
				Kishor's<span className="text-primary"> Blog</span>
			</a>
			<nav className="flex items-center gap-4 text-sm text-gray-300">
				<a
					href="/"
					className="transition-colors hover:text-white"
				>
					Home
				</a>
				<a
					href={blogIndexPath}
					className="rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/15"
				>
					Blog
				</a>
			</nav>
		</div>
	</header>
);

const BlogShell = ({ children }) => (
	<div className="min-h-svh bg-dark text-white selection:bg-primary/30">
		<a
			href="#main-content"
			className="absolute left-4 top-4 z-[100] -translate-y-24 rounded-full bg-primary px-4 py-2 text-sm font-bold text-dark transition-transform focus:translate-y-0"
		>
			Skip to content
		</a>
		<div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_24%),linear-gradient(180deg,#14081f_0%,#0f0518_48%,#09030f_100%)]" />
		<div className="relative z-10">
			<BlogHeader />
			{children}
		</div>
	</div>
);

export const BlogIndexPage = ({ posts = getBlogPosts() }) => {
	const postsToRender = posts;
	const { onPointerMove } = useSpotlight();
	const title = `${SITE_NAME} Blog | SEO, React, and Portfolio Notes`;
	const description =
		'A lightweight blog covering SEO, sitemap strategy, React portfolio planning, and performance notes from the Kishor Chaudhary site.';
	const canonicalUrl = buildAbsoluteUrl(blogIndexPath);

	return (
		<BlogShell>
			<SeoHead
				title={title}
				description={description}
				canonicalUrl={canonicalUrl}
				type="website"
				jsonLd={{
					'@context': 'https://schema.org',
					'@type': 'Blog',
					name: `${SITE_NAME} Blog`,
					url: canonicalUrl,
					description,
				}}
			/>
			<main id="main-content" className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
				<motion.section
					initial="hidden"
					animate="visible"
					variants={pageFade}
					className="mb-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end"
				>
					<div>
						<p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
							Blog
						</p>
						<h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
							SEO, performance, and portfolio notes that are meant to be
							indexed.
						</h1>
						<p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
							These articles are written to support the site structure as much
							as the reader. The same URLs listed here appear in the sitemap and
							on the homepage, so crawlers and users see the same content map.
						</p>
					</div>
					<div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
						<p className="text-sm uppercase tracking-[0.35em] text-gray-400">
							What this blog covers
						</p>
						<div className="mt-4 space-y-4 text-gray-300">
							<p>Practical SEO structure for React and static sites.</p>
							<p>Clean sitemap and robots workflows for small projects.</p>
							<p>Performance guidance that keeps visual portfolios fast.</p>
						</div>
					</div>
				</motion.section>

				<div className="flex items-center justify-between mb-8">
					<p className="text-sm text-gray-400">
						<span className="text-primary font-semibold">{postsToRender.length}</span>{' '}
						{postsToRender.length === 1 ? 'article' : 'articles'}
					</p>
				</div>

				<motion.section
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT}
					variants={staggerContainer(0.07)}
					className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
				>
					{postsToRender.map((post) => (
						<motion.article
							key={post.slug}
							variants={staggerItem}
							whileHover={hoverLift}
							onPointerMove={onPointerMove}
							style={{ '--hover-color': post.hoverColor }}
							className="spotlight glass-card group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover-glow"
						>
							<div className="flex-1 p-6">
								<div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-primary">
									<Tag size={14} />
									<span>{post.category}</span>
								</div>
								<h2 className="mt-4 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-primary">
									{post.title}
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-gray-300">
									{post.excerpt}
								</p>
								<div className="mt-5 flex flex-wrap gap-2">
									{(post.tags || []).map((tag) => (
										<span
											key={tag}
											className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-300"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<div className="border-t border-white/10 p-6 text-sm text-gray-400">
								<div className="flex items-center justify-between gap-4">
									<span className="inline-flex items-center gap-2">
										<Calendar size={14} />
										{formatDate(post.publishedAt)}
									</span>
									<span className="inline-flex items-center gap-2">
										<Clock size={14} />
										{post.readingTime}
									</span>
								</div>
								<a
									href={post.path || `/blog/${post.slug}/`}
									className="mt-5 inline-flex items-center gap-2 font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1"
								>
									Read article{' '}
									<ArrowLeft
										className="rotate-180"
										size={14}
									/>
								</a>
							</div>
						</motion.article>
					))}
				</motion.section>
			</main>
		</BlogShell>
	);
};

export const BlogPostPage = ({ post, posts = getBlogPosts() }) => {
	const currentPost = post?.slug ? getPostBySlug(post.slug) : post;
	const allPosts = posts;

	if (!currentPost) {
		return <NotFoundPage />;
	}

	const postPath = currentPost.path || `/blog/${currentPost.slug}/`;
	const canonicalUrl = buildAbsoluteUrl(postPath);
	const title = `${currentPost.title} | ${SITE_NAME}`;
	const description = currentPost.description;
	const relatedPosts = allPosts
		.filter((item) => item.slug !== currentPost.slug)
		.slice(0, 3);

	return (
		<BlogShell>
			<SeoHead
				title={title}
				description={description}
				canonicalUrl={canonicalUrl}
				type="article"
				jsonLd={[
					{
						'@context': 'https://schema.org',
						'@type': 'BreadcrumbList',
						itemListElement: [
							{
								'@type': 'ListItem',
								position: 1,
								name: 'Home',
								item: buildAbsoluteUrl('/'),
							},
							{
								'@type': 'ListItem',
								position: 2,
								name: 'Blog',
								item: buildAbsoluteUrl(blogIndexPath),
							},
							{
								'@type': 'ListItem',
								position: 3,
								name: currentPost.title,
								item: canonicalUrl,
							},
						],
					},
					buildBlogArticleJsonLd(currentPost),
				]}
			/>
			<main id="main-content" className="mx-auto max-w-4xl px-6 py-14 lg:py-20">
				<motion.a
					href={blogIndexPath}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors mb-8 group"
				>
					<ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
					Back to Blog
				</motion.a>

				<motion.article
					initial="hidden"
					animate="visible"
					variants={pageFade}
					className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-10"
				>
					<div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-primary">
						<span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
							{currentPost.category}
						</span>
						<span className="inline-flex items-center gap-2 text-gray-400">
							<Calendar size={14} />
							{formatDate(currentPost.publishedAt)}
						</span>
						<span className="inline-flex items-center gap-2 text-gray-400">
							<Clock size={14} />
							{currentPost.readingTime}
						</span>
					</div>

					<h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
						{currentPost.title}
					</h1>
					<p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300">
						{currentPost.description}
					</p>

					<div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#14081f] p-5 text-gray-200">
						{currentPost.hero}
					</div>

					<div className="rich-text mt-10 max-w-none space-y-10">
						{(currentPost.sections || []).map((section, sectionIndex) => (
							<section key={`${section.heading}-${sectionIndex}`}>
								{section.heading && <h2>{section.heading}</h2>}
								{(section.paragraphs || []).map((paragraph, paragraphIndex) => (
									<p
										key={paragraphIndex}
										dangerouslySetInnerHTML={{ __html: renderText(paragraph) }}
									/>
								))}
								{section.bullets?.length > 0 && (
									<ul>
										{section.bullets.map((bullet, bulletIndex) => (
											<li
												key={bulletIndex}
												dangerouslySetInnerHTML={{ __html: renderText(bullet) }}
											/>
										))}
									</ul>
								)}
							</section>
						))}
					</div>

					<div className="mt-12 border-t border-white/10 pt-8">
						<p className="text-sm uppercase tracking-[0.3em] text-gray-400">
							Related articles
						</p>
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={VIEWPORT}
							variants={staggerContainer(0.06)}
							className="mt-5 grid gap-4 md:grid-cols-3"
						>
							{relatedPosts.map((relatedPost) => (
								<motion.a
									key={relatedPost.slug}
									href={relatedPost.path || `/blog/${relatedPost.slug}/`}
									variants={staggerItem}
									whileHover={hoverLift}
									style={{ '--hover-color': relatedPost.hoverColor }}
									className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover-glow hover:bg-white/10"
								>
									<p className="text-sm text-primary">{relatedPost.category}</p>
									<h3 className="mt-2 font-semibold text-white">
										{relatedPost.title}
									</h3>
								</motion.a>
							))}
						</motion.div>
					</div>

					<motion.a
						href={blogIndexPath}
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="mt-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
					>
						<ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
						Back to all articles
					</motion.a>
				</motion.article>
			</main>
		</BlogShell>
	);
};
