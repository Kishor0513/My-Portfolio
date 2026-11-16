import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const BLOG_DIR = path.join(DIST, 'blog');
const STATIC_MARKER = 'data-static-jsonld="true"';

const readHtmlMeta = (html) => {
	const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
	const descMatch = html.match(
		/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
	);
	const canonicalMatch = html.match(
		/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i,
	);
	const propertyMeta = (property) => {
		const match = html.match(
			new RegExp(
				`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`,
				'i',
			),
		);
		return match ? match[1].trim() : null;
	};

	return {
		title: titleMatch ? titleMatch[1].trim() : null,
		description: descMatch ? descMatch[1].trim() : null,
		canonical: canonicalMatch ? canonicalMatch[1].trim() : null,
		image: propertyMeta('og:image'),
		publishedAt: propertyMeta('article:published_time'),
		updatedAt: propertyMeta('article:modified_time'),
	};
};

async function injectIntoFile(filePath) {
	try {
		const html = await fs.readFile(filePath, 'utf8');
		if (html.includes(STATIC_MARKER)) {
			console.log('JSON-LD already present, skipping ' + filePath);
			return;
		}

		const { title, description, canonical, image, publishedAt, updatedAt } =
			readHtmlMeta(html);
		if (!canonical) {
			console.warn(`${filePath} has no canonical; skipping JSON-LD injection.`);
			return;
		}

		const headline = (title || '').replace(/\s*\|\s*Kishor Chaudhary\s*$/i, '');
		const blogPosting = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline,
			description: description || '',
			url: canonical,
			'@id': canonical,
			author: {
				'@type': 'Person',
				name: 'Kishor Chaudhary',
				url: 'https://www.kishorchaudhary.com.np/',
			},
			publisher: {
				'@type': 'Person',
				name: 'Kishor Chaudhary',
				url: 'https://www.kishorchaudhary.com.np/',
			},
			mainEntityOfPage: canonical,
			...(image ? { image } : {}),
			...(publishedAt ? { datePublished: publishedAt } : {}),
			...(updatedAt ? { dateModified: updatedAt } : {}),
		};

		const breadcrumb = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: 'https://www.kishorchaudhary.com.np/',
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Blog',
					item: 'https://www.kishorchaudhary.com.np/blog/',
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: headline,
					item: canonical,
				},
			],
		};

		const jsonLdArray = [breadcrumb, blogPosting];
		const script =
			`\n\t\t<script type="application/ld+json" ${STATIC_MARKER}>` +
			JSON.stringify(jsonLdArray) +
			'</script>\n';

		if (html.includes('</head>')) {
			const updated = html.replace('</head>', script + '\n</head>');
			await fs.writeFile(filePath, updated, 'utf8');
			console.log('Injected JSON-LD into ' + filePath);
		} else {
			console.warn('No </head> tag found in ' + filePath + ', skipping');
		}
	} catch (err) {
		console.error('Failed to inject into ' + filePath + ':', err.message);
	}
}

async function exists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

(async () => {
	try {
		const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			const candidate = path.join(BLOG_DIR, entry.name, 'index.html');
			if (await exists(candidate)) {
				await injectIntoFile(candidate);
				continue;
			}

			// Some posts may be nested one level deeper.
			const nested = path.join(BLOG_DIR, entry.name);
			const subEntries = await fs.readdir(nested, { withFileTypes: true });
			for (const sub of subEntries) {
				if (!sub.isDirectory()) continue;
				const subFile = path.join(nested, sub.name, 'index.html');
				if (await exists(subFile)) {
					await injectIntoFile(subFile);
				}
			}
		}
		console.log('JSON-LD injection complete.');
	} catch (err) {
		console.error('Injection script failed:', err.message);
	}
})();
