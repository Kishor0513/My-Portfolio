import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Injected at build time by Vite `define` in `vite.config.js`.
// eslint-disable-next-line no-undef
const BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev';
const SW_VERSION = BUILD_ID;
const SW_MIGRATION_KEY = `sw-migration-${SW_VERSION}`;
const IS_LOCALHOST =
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1' ||
	window.location.hostname === '::1';

async function runServiceWorkerMigration() {
	if (!('serviceWorker' in navigator) || !('caches' in window)) {
		return;
	}

	try {
		const registrations = await navigator.serviceWorker.getRegistrations();
		await Promise.all(
			registrations.map((registration) => registration.unregister()),
		);

		const cacheNames = await caches.keys();
		await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

		localStorage.setItem(SW_MIGRATION_KEY, 'done');
	} catch (error) {
		console.log('Service worker migration failed:', error);
	}
}

runServiceWorkerMigration();

// Avoid stale cache confusion while developing locally.
if (IS_LOCALHOST && 'serviceWorker' in navigator) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		registrations.forEach((registration) => {
			registration.unregister();
		});
	});
}

console.log('App mounting...');
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator && !IS_LOCALHOST) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register(`/service-worker.js?v=${encodeURIComponent(SW_VERSION)}`, {
				updateViaCache: 'none',
			})
			.then((registration) => {
				console.log('Service Worker registered:', registration);
				registration.update().catch(() => {});
			})
			.catch((error) => {
				console.log('Service Worker registration failed:', error);
			});
	});
}
