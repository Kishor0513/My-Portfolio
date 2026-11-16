import { MotionConfig } from 'framer-motion';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Injected at build time by Vite `define` in `vite.config.js`.
// eslint-disable-next-line no-undef
const BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev';
const SW_VERSION = BUILD_ID;
const SW_MIGRATION_KEY = 'sw-migration-v2';
const IS_LOCALHOST =
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1' ||
	window.location.hostname === '::1';

const hasCompletedMigration = () => {
	try {
		return window.localStorage.getItem(SW_MIGRATION_KEY) === 'done';
	} catch {
		return false;
	}
};

const markMigrationComplete = () => {
	try {
		window.localStorage.setItem(SW_MIGRATION_KEY, 'done');
	} catch {
		// Private browsing can block storage; the migration is still best-effort.
	}
};

async function runServiceWorkerMigration() {
	if (!('serviceWorker' in navigator) || !('caches' in window)) {
		return;
	}
	if (hasCompletedMigration()) {
		return;
	}

	try {
		const registrations = await navigator.serviceWorker.getRegistrations();
		const ownRegistrations = registrations.filter((registration) =>
			[registration.active, registration.installing, registration.waiting].some(
				(worker) => worker?.scriptURL?.includes('/service-worker.js'),
			),
		);
		await Promise.all(
			ownRegistrations.map((registration) => registration.unregister()),
		);

		// Only remove this site's versioned caches, never unrelated origin caches.
		const cacheNames = await caches.keys();
		await Promise.all(
			cacheNames
				.filter((cacheName) => cacheName.startsWith('kishor-portfolio-'))
				.map((cacheName) => caches.delete(cacheName)),
		);

		markMigrationComplete();
	} catch {
		// Leave the key unset so a later visit can retry once.
	}
}

const swMigration = runServiceWorkerMigration();

// Avoid stale cache confusion while developing locally.
if (IS_LOCALHOST && 'serviceWorker' in navigator) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		registrations.forEach((registration) => {
			registration.unregister();
		});
	});
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<MotionConfig reducedMotion="user">
			<App />
		</MotionConfig>
	</React.StrictMode>,
);

// Register the service worker after the one-time migration has finished.
if ('serviceWorker' in navigator && !IS_LOCALHOST) {
	window.addEventListener('load', () => {
		swMigration
			.catch(() => {})
			.then(() =>
				navigator.serviceWorker.register(
					`/service-worker.js?v=${encodeURIComponent(SW_VERSION)}`,
					{ updateViaCache: 'none' },
				),
			)
			.then((registration) => registration.update().catch(() => {}))
			.catch(() => {});
	});
}
