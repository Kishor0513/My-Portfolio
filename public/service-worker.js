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
const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.json',
	'/favicon.svg',
	'/favicon.png',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(urlsToCache))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method.toLowerCase() !== 'get') {
		return;
	}

	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					if (response && response.ok) {
						const responseClone = response.clone();
						caches
							.open(CACHE_NAME)
							.then((cache) => cache.put('/index.html', responseClone));
					}
					return response;
				})
				.catch(() => caches.match('/index.html') || caches.match('/')),
		);
		return;
	}

	if (!event.request.url.startsWith(self.location.origin)) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (response && response.ok && response.type !== 'opaque') {
					const responseClone = response.clone();
					caches
						.open(CACHE_NAME)
						.then((cache) => cache.put(event.request, responseClone));
				}
				return response;
			})
			.catch(() => caches.match(event.request)),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
	self.clients.claim();
});
