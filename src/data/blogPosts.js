import { buildAbsoluteUrl, SITE_NAME } from './site';

export const blogPosts = [
	{
		slug: 'seo-for-react-portfolios',
		path: '/blog/seo-for-react-portfolios/',
		title: 'SEO for React Portfolios: What Actually Matters',
		description:
			'A practical checklist for making a React portfolio easier for Google to crawl, understand, and trust.',
		excerpt:
			'The fastest SEO wins come from clear titles, crawlable URLs, and content that gives search engines enough context.',
		hoverColor: '#c2410c',
		category: 'SEO',
		readingTime: '6 min read',
		publishedAt: '2026-05-24',
		updatedAt: '2026-05-24',
		tags: ['SEO', 'React', 'Metadata', 'Internal Linking'],
		hero: 'Build pages that explain themselves before the JavaScript bundle even finishes loading.',
		sections: [
			{
				heading: '1. Give each page a single job',
				paragraphs: [
					'Google does not need a portfolio that tries to be everything at once. It needs one page that clearly says who you are, what you build, and why the page exists.',
					'For a portfolio, that usually means a focused homepage, a dedicated blog index, and article pages that are about one topic each.',
				],
				bullets: [
					'Use a unique title tag for every page.',
					'Keep the main heading aligned with the search intent.',
					'Make the canonical URL match the page users should share.',
				],
			},
			{
				heading: '2. Write metadata that sounds human',
				paragraphs: [
					'Metadata is still one of the fastest ways to improve click-through rate. A title like "Kishor Chaudhary | Full Stack Developer" is fine for the home page, but a blog article should explain the actual topic.',
					'Descriptions work best when they describe the value of the page, not just the author.',
				],
				bullets: [
					'Keep titles specific and below about 60 characters when possible.',
					'Write descriptions that read like a reason to click.',
					'Set Open Graph and Twitter card tags for every important route.',
				],
			},
			{
				heading: '3. Add structured data and internal links',
				paragraphs: [
					'Structured data does not guarantee rankings, but it does help search engines understand the type of page they are looking at. For a blog post, BlogPosting markup is a good fit.',
					'Internal links matter too. If your homepage points to the blog and the blog points back to the homepage and other articles, discovery becomes much easier.',
				],
				bullets: [
					'Use BlogPosting JSON-LD on article pages.',
					'Link related posts near the bottom of each article.',
					'Keep the sitemap aligned with the actual URL structure.',
				],
			},
		],
	},
	{
		slug: 'sitemap-and-robots-for-small-sites',
		path: '/blog/sitemap-and-robots-for-small-sites/',
		title: 'Why Sitemap.xml Still Matters for Small Sites',
		description:
			'A short guide to keeping sitemap.xml and robots.txt useful on a small portfolio or blog.',
		excerpt:
			'Even a small site benefits from a clean sitemap because it gives crawlers a direct map of the pages that matter most.',
		hoverColor: '#0ea5e9',
		category: 'Indexing',
		readingTime: '5 min read',
		publishedAt: '2026-05-24',
		updatedAt: '2026-05-24',
		tags: ['Sitemap', 'Robots.txt', 'Indexing', 'SEO'],
		hero: 'A sitemap is the shortest path between your site structure and a crawler’s understanding of it.',
		sections: [
			{
				heading: '1. Treat the sitemap like a table of contents',
				paragraphs: [
					'A sitemap is most useful when it only includes pages you actually want indexed. That means keeping it focused on the homepage, blog index, article pages, and any core service pages.',
					'If a page is thin, duplicate, or temporary, it does not belong in the sitemap.',
				],
				bullets: [
					'List your canonical URLs only.',
					'Use trailing slashes consistently if your host serves them that way.',
					'Update lastmod when content meaningfully changes.',
				],
			},
			{
				heading: '2. Keep robots.txt simple',
				paragraphs: [
					'For a personal website, robots.txt should usually be boring. Allow crawling, point to the sitemap, and avoid blocking pages that should rank.',
					'Blocking too much can make a site harder to understand rather than more private.',
				],
				bullets: [
					'Allow the site by default.',
					'Add the sitemap URL at the end of the file.',
					'Do not block CSS or JavaScript unless you have a strong reason.',
				],
			},
			{
				heading: '3. Keep sitemap and navigation in sync',
				paragraphs: [
					'If the sitemap lists a page that the navigation never links to, that is a signal something is out of sync. Search engines may still discover it, but users may not.',
					'For this site, the blog navigation, homepage blog section, and sitemap should all point at the same article URLs.',
				],
				bullets: [
					'Update the sitemap when you add or remove posts.',
					'Use the same URL format in menus, cards, and canonical tags.',
					'Check Google Search Console after deploying changes.',
				],
			},
		],
	},
	{
		slug: 'performance-checklist-for-portfolio-sites',
		path: '/blog/performance-checklist-for-portfolio-sites/',
		title: 'Performance Checklist for Portfolio Sites That Need to Rank',
		description:
			'A practical performance checklist for keeping a visual portfolio fast enough for users and search engines.',
		excerpt:
			'Speed influences both user experience and search visibility, so a portfolio should load like a lightweight landing page, not a demo app.',
		hoverColor: '#10b981',
		category: 'Performance',
		readingTime: '7 min read',
		publishedAt: '2026-05-24',
		updatedAt: '2026-05-24',
		tags: ['Performance', 'Core Web Vitals', 'Images', 'SEO'],
		hero: 'A beautiful portfolio still has to load fast enough to be worth indexing.',
		sections: [
			{
				heading: '1. Compress media before anything else',
				paragraphs: [
					'Large hero images and heavy assets are usually the first thing slowing a portfolio down. If the site uses a lot of visuals, those files should be optimized before tuning code.',
					'For this site, that means keeping image assets appropriately sized, using modern formats when possible, and avoiding unnecessary animation overhead on content pages.',
				],
				bullets: [
					'Use lazy loading for below-the-fold images.',
					'Prefer compressed WebP or AVIF for large assets when feasible.',
					'Always include meaningful alt text.',
				],
			},
			{
				heading: '2. Reduce initial JavaScript work',
				paragraphs: [
					'If every section of the site is interactive, the browser has more work to do before the page feels ready. Static content should stay static until there is a clear reason to hydrate it.',
					'That is why the blog pages in this update stay lighter than the main landing page.',
				],
				bullets: [
					'Split heavy features away from reading-focused pages.',
					'Only load 3D or animation-heavy components where they add value.',
					'Prefer semantic HTML for article content.',
				],
			},
			{
				heading: '3. Watch Core Web Vitals after deployment',
				paragraphs: [
					'What matters in production is measured, not assumed. Lighthouse, Search Console, and real user metrics tell you whether the changes helped.',
					'Once the blog and sitemap are live, the next step is to monitor crawl coverage and page experience in Search Console.',
				],
				bullets: [
					'Test the homepage and each article page separately.',
					'Check LCP, INP, and CLS after adding new sections.',
					'Revisit assets and layouts that create unnecessary layout shifts.',
				],
			},
		],
	},
];

export const blogIndexPath = '/blog/';

export const getBlogPostBySlug = (slug) =>
	blogPosts.find((post) => post.slug === slug);

export const buildBlogArticleJsonLd = (post) => {
	const url = buildAbsoluteUrl(post.path || `/blog/${post.slug}/`);

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': url,
		headline: post.title,
		description: post.description,
		author: {
			'@type': 'Person',
			name: SITE_NAME,
		},
		publisher: {
			'@type': 'Person',
			name: SITE_NAME,
		},
		datePublished: post.publishedAt,
		dateModified: post.updatedAt || post.publishedAt,
		mainEntityOfPage: url,
		keywords: (post.tags || []).join(', '),
		url,
	};
};
