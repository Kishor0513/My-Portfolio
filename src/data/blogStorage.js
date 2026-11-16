import { blogPosts as staticPosts } from './blogPosts';

const STORAGE_KEY = 'kishor_blog_posts';
const TOMBSTONE_KEY = 'kishor_blog_deleted';

const hasStorage = () =>
	typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function readJsonArray(key) {
	if (!hasStorage()) return [];
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeJson(key, value) {
	if (!hasStorage()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be full or blocked (private mode); keep the site usable.
	}
}

function getStoredPosts() {
	return readJsonArray(STORAGE_KEY).filter((post) => post && post.slug);
}

function getTombstones() {
	return readJsonArray(TOMBSTONE_KEY).filter((slug) => typeof slug === 'string');
}

function saveTombstones(slugs) {
	writeJson(TOMBSTONE_KEY, Array.from(new Set(slugs)));
}

export function getBlogPosts() {
	const stored = getStoredPosts();
	const deleted = new Set(getTombstones());
	const merged = staticPosts
		.filter((post) => !deleted.has(post.slug))
		.map((post) => ({ ...post }));

	for (const post of stored) {
		if (deleted.has(post.slug)) continue;
		const index = merged.findIndex((item) => item.slug === post.slug);
		if (index !== -1) {
			merged[index] = { ...merged[index], ...post };
		} else {
			merged.push(post);
		}
	}

	return merged.sort(
		(a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0),
	);
}

export function saveBlogPosts(posts) {
	const cleaned = Array.isArray(posts)
		? posts.filter((post) => post && post.slug)
		: [];
	writeJson(STORAGE_KEY, cleaned);
}

export function createPost(post) {
	const slug = post?.slug?.trim();
	if (!slug) return;

	const stored = getStoredPosts().filter((item) => item.slug !== slug);
	stored.push({
		...post,
		slug,
		path: post.path || `/blog/${slug}/`,
	});
	saveBlogPosts(stored);
	// Creating a post at a tombstoned slug should bring it back.
	saveTombstones(getTombstones().filter((item) => item !== slug));
}

export function updatePost(slug, updates) {
	if (!slug) return;
	const nextSlug = (updates.slug || slug).trim();
	if (!nextSlug) return;

	const staticMatch = staticPosts.find((post) => post.slug === slug);
	const storedMatch = getStoredPosts().find((post) => post.slug === slug);
	const stored = getStoredPosts().filter(
		(post) => post.slug !== slug && post.slug !== nextSlug,
	);

	stored.push({
		...(storedMatch || staticMatch || {}),
		...updates,
		slug: nextSlug,
		path: updates.path || `/blog/${nextSlug}/`,
	});
	saveBlogPosts(stored);

	const tombstones = getTombstones().filter((item) => item !== nextSlug);
	// If a static post is renamed, hide the original static URL.
	if (staticMatch && slug !== nextSlug) tombstones.push(slug);
	saveTombstones(tombstones);
}

export function deletePost(slug) {
	const stored = getStoredPosts().filter((post) => post.slug !== slug);
	saveBlogPosts(stored);

	if (staticPosts.some((post) => post.slug === slug)) {
		saveTombstones([...getTombstones(), slug]);
	}
}

export function getPostBySlug(slug) {
	return getBlogPosts().find((post) => post.slug === slug);
}

export function importPosts(posts) {
	if (!Array.isArray(posts)) return;

	const imported = posts.filter((post) => post && post.slug);
	const stored = getStoredPosts();

	for (const post of imported) {
		const index = stored.findIndex((item) => item.slug === post.slug);
		if (index !== -1) {
			stored[index] = post;
		} else {
			stored.push(post);
		}
	}

	saveBlogPosts(stored);
	const importedSlugs = new Set(imported.map((post) => post.slug));
	saveTombstones(getTombstones().filter((slug) => !importedSlugs.has(slug)));
}
