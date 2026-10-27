# Kishor Chaudhary — Portfolio

A fast, responsive personal portfolio and blog for a full stack developer. Built with React 18, Vite, Tailwind CSS, and Framer Motion, and deployed to GitHub Pages on a custom domain.

**Live site:** [kishorchaudhary.com.np](https://www.kishorchaudhary.com.np)

[GitHub](https://github.com/Kishor0513) · [Email](mailto:kishorc2000@gmail.com)

![Portfolio homepage](public/assets/home-screenshot.jpg)

## Features

- **Animated hero** — typewriter role cycle, floating tech icons, and a lightweight space background
- **Skills and experience** — scroll-triggered progress bars and an interactive career timeline
- **Project showcase** — project cards, an embedded demo window for live sites, and tabs with real code snippets
- **Contact form** — EmailJS integration with validation, loading, and success/error states
- **Blog** — index and article pages with reading metadata, related posts, and SEO tags
- **Admin panel** — password-gated editor at `/admin` for adding and editing posts in the browser
- **SEO** — canonical URLs, Open Graph/Twitter metadata, sitemap, robots.txt, and optional JSON-LD injection
- **PWA** — web app manifest and a versioned service worker with offline fallback
- **Accessible and fast** — semantic markup, ARIA labels, reduced-motion support, lazy-loaded sections, and split vendor chunks

## Tech Stack

| Category | Technologies |
| --- | --- |
| Framework | React 18 |
| Build | Vite 6, Rollup, Terser |
| Styling | Tailwind CSS 3, CSS custom properties |
| Animation | Framer Motion |
| Icons | Lucide React, React Icons |
| Email | EmailJS |
| Blog | Data-driven posts, gray-matter, custom Markdown editor |
| Hosting | GitHub Pages + Cloudflare |

## Requirements

- Node.js **>= 20.19.0**
- npm **>= 10.9.4**

The required versions are enforced by `.npmrc` (`engine-strict=true`).

## Getting Started

```bash
# Install the exact dependency tree from package-lock.json
npm ci

# Start the Vite dev server
npm run dev
```

The local dev server prints the URL (usually `http://localhost:5173`). Contact form and admin login need the environment variables below; everything else works without them.

## Environment Variables

Create a `.env` file in the project root (Vite's `envDir` points there):

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_ADMIN_PASSWORD=your_admin_password
```

| Variable | Purpose |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service used by the contact form |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template for contact submissions |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `VITE_ADMIN_PASSWORD` | Client-side password gate for `/admin` |
| `VITE_BUILD_ID` | Optional build identifier used to version the service worker cache |

All `VITE_*` values are embedded in the client bundle at build time — never put secrets in them. The admin password is only a client-side gate, not server-side authentication. `.env` is git-ignored.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run build:with-jsonld` | Build, then inject BlogPosting/BreadcrumbList JSON-LD into blog pages |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run lockfile:refresh` | Regenerate `package-lock.json` without installing |
| `npm run deps:bump` | Update dependencies within their semver ranges |

## Project Structure

```text
.
├── src/
│   ├── admin/index.html        # /admin entry
│   ├── blog/                   # /blog entry and static blog routes
│   ├── components/
│   │   ├── admin/              # Admin login and post editor
│   │   ├── blog/               # Blog index and article pages
│   │   ├── projects/           # Demo window and code tabs
│   │   └── ui/                 # Navbar, timeline, SEO head, effects
│   ├── content/posts/          # Markdown post sources
│   ├── data/                   # Site metadata, projects, posts, storage
│   ├── lib/posts.js            # Markdown/frontmatter loader
│   ├── App.jsx                 # Page routing and main sections
│   ├── index.css               # Global styles and utilities
│   └── main.jsx                # Entry point and service worker setup
├── public/                     # Static assets, manifest, sitemap, service worker
├── scripts/inject-jsonld.mjs   # Post-build structured-data injection
├── dist/                       # Production build output
├── assets/                     # Deployed static assets (GitHub Pages)
├── admin/                      # Deployed admin page (GitHub Pages)
├── blog/                       # Deployed blog pages (GitHub Pages)
├── index.html                  # Deployed root page (GitHub Pages)
├── CNAME                       # Custom domain
├── deploy.ps1                  # PowerShell build-and-copy script
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## Blog Workflow

- Seed posts live in `src/data/blogPosts.js` as structured objects (slug, path, title, description, sections, tags, dates).
- Markdown copies live in `src/content/posts/` and are parsed with `gray-matter` by `src/lib/posts.js`.
- The `/admin` panel can create, edit, and delete posts. Edits are saved to `localStorage` under `kishor_blog_posts` and merged over the static posts at runtime.

Admin edits are per-browser and never written back to the repository. Commit changes to the static post data to publish them for everyone.

## Deployment

GitHub Pages serves the repository root, so a deployment builds the site and copies `dist/` to the root. `CNAME` is kept in place for the custom domain.

```bash
# Build with structured data for blog pages
npm run build:with-jsonld

# Replace the deployed artifacts
rm -rf assets blog admin
cp -R dist/* .

# Publish
git add -A
git commit -m "deploy: ..."
git push
```

On Windows, `.\deploy.ps1` automates the build and copy steps.

## Design

- **Palette** — deep violet/black background (`#0f0518`) with lavender primary (`#bfa8ff`) and pink secondary (`#ff9ce6`)
- **Glassmorphism** — frosted surfaces via `backdrop-filter: blur()` and subtle border highlights
- **Motion** — custom cubic-bezier easing, staggered entrances, and scroll-triggered reveals
- **Typography** — Inter (body), Plus Jakarta Sans (headings), JetBrains Mono (code)

## Contact

- **Email:** [kishorc2000@gmail.com](mailto:kishorc2000@gmail.com)
- **GitHub:** [@Kishor0513](https://github.com/Kishor0513)
- **Website:** [kishorchaudhary.com.np](https://www.kishorchaudhary.com.np)
