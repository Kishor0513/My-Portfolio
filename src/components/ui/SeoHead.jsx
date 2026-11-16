import { useEffect } from 'react';

const ensureMetaTag = (selector, attributes) => {
	let element = document.head.querySelector(selector);
	if (!element) {
		element = document.createElement('meta');
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
		document.head.appendChild(element);
	}

	return element;
};

const ensureLinkTag = (selector, attributes) => {
	let element = document.head.querySelector(selector);
	if (!element) {
		element = document.createElement('link');
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
		document.head.appendChild(element);
	}

	return element;
};

const SeoHead = ({
	title,
	description,
	canonicalUrl,
	image = 'https://www.kishorchaudhary.com.np/assets/og-image.jpg',
	type = 'website',
	twitterCard = 'summary_large_image',
	jsonLd,
}) => {
	useEffect(() => {
		document.title = title;

		ensureMetaTag('meta[name="description"]', {
			name: 'description',
		}).setAttribute('content', description);
		ensureMetaTag('meta[name="robots"]', { name: 'robots' }).setAttribute(
			'content',
			'index,follow',
		);
		ensureMetaTag('meta[property="og:type"]', {
			property: 'og:type',
		}).setAttribute('content', type);
		ensureMetaTag('meta[property="og:url"]', {
			property: 'og:url',
		}).setAttribute('content', canonicalUrl);
		ensureMetaTag('meta[property="og:title"]', {
			property: 'og:title',
		}).setAttribute('content', title);
		ensureMetaTag('meta[property="og:description"]', {
			property: 'og:description',
		}).setAttribute('content', description);
		ensureMetaTag('meta[property="og:image"]', {
			property: 'og:image',
		}).setAttribute('content', image);
		ensureMetaTag(
			'meta[name="twitter:card"], meta[property="twitter:card"]',
			{ name: 'twitter:card' },
		).setAttribute('content', twitterCard);
		ensureMetaTag(
			'meta[name="twitter:url"], meta[property="twitter:url"]',
			{ name: 'twitter:url' },
		).setAttribute('content', canonicalUrl);
		ensureMetaTag(
			'meta[name="twitter:title"], meta[property="twitter:title"]',
			{ name: 'twitter:title' },
		).setAttribute('content', title);
		ensureMetaTag(
			'meta[name="twitter:description"], meta[property="twitter:description"]',
			{ name: 'twitter:description' },
		).setAttribute('content', description);
		ensureMetaTag(
			'meta[name="twitter:image"], meta[property="twitter:image"]',
			{ name: 'twitter:image' },
		).setAttribute('content', image);
		ensureLinkTag('link[rel="canonical"]', { rel: 'canonical' }).setAttribute(
			'href',
			canonicalUrl,
		);

		const previousJsonLd = document.head.querySelector(
			'script[data-seo-jsonld="true"]',
		);
		if (previousJsonLd) {
			previousJsonLd.remove();
		}

		// Static JSON-LD is injected at build time for known article URLs.
		// Avoid adding a second, conflicting graph at runtime.
		const hasStaticJsonLd = Boolean(
			document.head.querySelector(
				'script[type="application/ld+json"]:not([data-seo-jsonld="true"])',
			),
		);

		if (jsonLd && !hasStaticJsonLd) {
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.setAttribute('data-seo-jsonld', 'true');
			script.textContent = JSON.stringify(jsonLd);
			document.head.appendChild(script);
		}
	}, [canonicalUrl, description, image, jsonLd, title, twitterCard, type]);

	return null;
};

export default SeoHead;
