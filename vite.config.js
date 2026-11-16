import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buildId =
	process.env.VITE_BUILD_ID ??
	process.env.GITHUB_SHA ??
	process.env.VERCEL_GIT_COMMIT_SHA ??
	new Date().toISOString();

export default defineConfig({
	plugins: [react()],
	define: {
		__BUILD_ID__: JSON.stringify(buildId),
	},
	root: 'src',
	envDir: '..',
	publicDir: '../public',
	base: '/',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		assetsDir: 'assets',
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/index.html'),
				notFound: resolve(__dirname, 'src/404.html'),
				admin: resolve(__dirname, 'src/admin/index.html'),
				blog: resolve(__dirname, 'src/blog/index.html'),
				'blog/seo-for-react-portfolios': resolve(
					__dirname,
					'src/blog/seo-for-react-portfolios/index.html',
				),
				'blog/sitemap-and-robots-for-small-sites': resolve(
					__dirname,
					'src/blog/sitemap-and-robots-for-small-sites/index.html',
				),
				'blog/performance-checklist-for-portfolio-sites': resolve(
					__dirname,
					'src/blog/performance-checklist-for-portfolio-sites/index.html',
				),
			},
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
					'animation-vendor': ['framer-motion'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
});
