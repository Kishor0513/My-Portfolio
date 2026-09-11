# Kishor Chaudhary - Portfolio Website

A modern, responsive portfolio website showcasing my work as a Full Stack Developer. Built with React 18, Vite, Tailwind CSS, and Framer Motion.

**Live Site**: [kishorchaudhary.com.np](https://www.kishorchaudhary.com.np)

![Portfolio Home](public/assets/home-screenshot.jpg)

## Features

- **Photo Background Hero**: Full-screen personal photo with overlay and floating tech stack icons
- **Animated Progress Bars**: Skills section with scroll-triggered progress bars
- **Project Showcase**: Project cards with real images; live-deployed projects open in an embedded demo window with real GitHub code browsing
- **Experience Timeline**: Interactive timeline component with scroll animations
- **Contact Form**: EmailJS-powered contact form with validation and success feedback
- **Performance Optimized**: Minimal CSS (~36KB gzipped), GPU-accelerated animations, lazy-loaded images
- **Accessible**: Semantic HTML, ARIA labels, `prefers-reduced-motion` support
- **Blog**: Built-in blog with markdown posts, SEO metadata, sitemap generation

## Tech Stack

| Category | Technologies |
|----------|------------|
| **Framework** | React 18 |
| **Build** | Vite |
| **Styling** | Tailwind CSS, CSS custom properties |
| **Animations** | Framer Motion |
| **Icons** | Lucide React, React Icons (Simple Icons) |
| **Email** | EmailJS |
| **Blog** | gray-matter, marked |
| **Hosting** | GitHub Pages + Cloudflare |

## Project Structure

```
├── public/                   # Static assets
│   └── assets/              # Images, icons, PDFs
├── src/
│   ├── components/
│   │   ├── blog/           # Blog page components
│   │   └── ui/             # UI components (Navbar, Timeline, etc.)
│   ├── data/               # Blog posts, site metadata
│   ├── lib/                # Utility functions
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + custom classes
├── dist/                   # Production build output
├── assets/                 # Deployed root assets (GitHub Pages)
├── blog/                   # Deployed blog pages (GitHub Pages)
├── index.html              # Deployed root HTML (GitHub Pages)
├── CNAME                   # Custom domain config
├── deploy.ps1              # PowerShell deploy script
├── vite.config.js
└── tailwind.config.js
```

## Getting Started

```bash
# Install dependencies
npm ci

# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

## Deployment

The site is served via GitHub Pages from the repository root. To deploy updates:

```bash
npm run build                    # Build to dist/
rm -rf assets blog               # Remove old root artifacts
cp -R dist/* .                   # Copy dist contents to root
git add -A && git commit -m "deploy: ..."
git push
```

Alternatively, run `deploy.ps1` (PowerShell on Windows) which automates these steps.

## Design

- **Color Palette**: Deep violet/black background (`#0f0518`) with lavender primary (`#bfa8ff`) and pink secondary (`#ff9ce6`)
- **Glassmorphism**: Frosted glass surfaces via `backdrop-filter: blur()` with subtle border highlights
- **Animations**: Custom cubic-bezier easing, staggered entrance sequences, scroll-triggered reveals
- **Typography**: Inter (body), Plus Jakarta Sans (headings), JetBrains Mono (code)

## Contact

- **Email**: kishorc2000@gmail.com
- **GitHub**: [@Kishor0513](https://github.com/Kishor0513)
- **Live**: [kishorchaudhary.com.np](https://www.kishorchaudhary.com.np)
