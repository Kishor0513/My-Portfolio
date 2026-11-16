// Service Worker for Kishor Portfolio
const CACHE_PREFIX = 'kishor-portfolio-';
const cacheVersion = (() => {
	try {
		const url = new URL(self.location.href);
		return url.searchParams.get('v') || 'dev';
	} catch {
		return 'dev';
	}
})();

const CACHE_NAME = `${CACHE_PREFIX}${cacheVersion}`;
const APP_SHELL = [
	'/',
	'/index.html',
	'/manifest.json',
	'/favicon.svg',
	'/favicon.png',
	'/favicon.ico',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			// Add files individually so one missing icon cannot break the install.
			await Promise.all(
				APP_SHELL.map(async (url) => {
					try {
						const response = await fetch(url, { cache: 'reload' });
						if (response.ok) await cache.put(url, response);
					} catch {
						// Offline or missing file: the runtime fetch handler can fill it later.
					}
				}),
			);
			await self.skipWaiting();
		})(),
	);
});

async function networkFirstNavigation(request) {
	try {
		const response = await fetch(request);
		// Only cache the app shell. Caching a nested article response as
		// /index.html would poison the offline fallback for every route.
		if (
			response &&
			response.ok &&
			response.type === 'basic' &&
			new URL(request.url).pathname === '/'
		) {
			const cache = await caches.open(CACHE_NAME);
			await cache.put('/index.html', response.clone());
		}
		return response;
	} catch {
		const cache = await caches.open(CACHE_NAME);
		return (
			(await cache.match('/index.html')) ||
			(await cache.match('/')) ||
			Response.error()
		);
	}
}

async function cacheFirst(request) {
	const cache = await caches.open(CACHE_NAME);
	const cached = await cache.match(request);
	if (cached) return cached;

	try {
		const response = await fetch(request);
		if (response && response.ok && response.type === 'basic') {
			await cache.put(request, response.clone());
		}
		return response;
	} catch {
		return cached || Response.error();
	}
}

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') {
		return;
	}

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) {
		return;
	}

	if (request.mode === 'navigate') {
		event.respondWith(networkFirstNavigation(request));
		return;
	}

	if (request.headers.has('range')) {
		return;
	}

	event.respondWith(cacheFirst(request));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const cacheNames = await caches.keys();
			await Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
					return undefined;
				}),
			);
			await self.clients.claim();
		})(),
	);
});
