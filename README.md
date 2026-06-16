# Alex Biddle — Portfolio Website

A personal cybersecurity engineering portfolio for **Alexander Biddle** — Security Engineer · Developer · Analyst.

🔗 **Live site:** https://alexanderbiddle.github.io/Alex-Biddle-Portfolio-Website/

The site presents Alex's security work the way a security report reads — identity → capability → evidence → outcome → contact — over a live, reactive deep‑space backdrop. It is a single‑page React application, deployed as static files to GitHub Pages.

---

## Overview & Scope

This is a content‑focused portfolio with a deliberately distinctive, technical aesthetic. The goal: let hiring managers, security teams, and technical collaborators understand Alex's range (offensive thinking, defensive engineering, analyst reporting, and software development) within the first viewport, and reach project or contact details without friction.

**What it is:**
- A fast, accessible SPA with seven content routes plus error states.
- A custom, hand‑built visual system — every piece of decorative imagery is canvas/WebGL, not a static image.
- A credible "security operations surface" look that stays readable and never becomes costume.

**What it is not:** a CMS, a blog engine, or a backend service. There is no server, database, or API — it is fully static.

---

## Features

- **Live three‑layer galaxy backdrop** mounted once behind every route:
  1. A **WebGL nebula** of ~1.5M points generated off the main thread by a Web Worker and uploaded as transferable buffers.
  2. A **CPU‑projected spiral galaxy** plus sparse twinkling field stars, composited with `screen` blending.
  3. A 2D **"Aether" particle network** whose nodes link by proximity and repel from the pointer.
  - Drag any open background area to **orbit** the galaxy; cards, text, and controls stay quiet.
- **Liquid‑glass navigation** — each route is a WebGL lens that refracts a cropped slice of the live backdrop through a signed‑distance/refraction shader, with a frosted CSS fallback where WebGL is unavailable.
- **Spotlight cards** — a single delegated pointer controller paints a blue radial glow and a masked border ring on hover/focus.
- **Sticky project console** — the Projects route pins a directory rail beside a clipped case‑study panel and hands scrolling off to the browser natively; on mobile it stacks into a single vertically‑flowing panel.
- **Resilient by design** — every WebGL surface and the Worker degrade gracefully (null/CSS fallback); per‑route error boundary, a 404 page, and a top‑level error boundary keep the app from ever blanking.
- **Reduced‑motion aware** — all canvases render a single static frame and animations collapse when `prefers-reduced-motion: reduce` is set.

---

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | **React 19** (React Compiler enabled) |
| Language | **TypeScript** (strict) |
| Build tool | **Vite 8** (`@vitejs/plugin-react`) |
| Routing | **React Router 7** (data router / `createBrowserRouter`) |
| Animation | **framer-motion** (hero entrance) |
| Icons | **lucide-react** (hero) · **Font Awesome 6** via CDN, SRI‑pinned |
| Rendering | WebGL + 2D Canvas + a Web Worker; no image assets for the backdrop |
| Linting | **ESLint** (typescript-eslint, react-hooks, react-refresh) |
| Testing | Node's built‑in test runner (`node --test`) |
| Hosting | **GitHub Pages** (static) |

---

## Project Structure

```
.
├── index.html                 # CSP meta, SPA route shim, Font Awesome (SRI), app mount
├── vite.config.ts             # base path + React/React-Compiler plugins
├── public/
│   ├── 404.html               # GitHub Pages SPA fallback (encodes deep link → query)
│   ├── documents/             # downloadable case-study PDFs
│   └── images/                # favicon / assets
├── src/
│   ├── main.tsx               # router + top-level ErrorBoundary, app bootstrap
│   ├── App.tsx                # shared shell: backdrop, spotlight, nav, <Outlet/>, footer
│   ├── index.css              # design tokens + all component styling
│   ├── components/
│   │   ├── NavBar.tsx · Footer.tsx · ErrorBoundary.tsx · AetherFlowBackdrop.tsx
│   │   └── ui/                # AetherFlowCanvas, LocalGalaxyCanvas, LiquidGlassSurface,
│   │                          # liquidGlassRenderer/Config/Backdrop, SpotlightCards, galaxyInteraction
│   ├── pages/                 # Home, About, Experience, Skills, Education, Projects,
│   │                          # Contact, NotFoundPage, RouteErrorPage
│   └── workers/
│       └── nebulaVolume.worker.ts   # off-thread nebula point generation
├── tests/                     # Node --test specs (config, navbar scope, routes/content)
└── docs/                      # local design/product docs (not published)
```

---

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Full‑viewport galaxy hero with primary/secondary actions |
| `/About` | Identity and focused profile panels |
| `/Experience` | Mission analysis, simulation modeling, technical support timeline |
| `/Skills` | Categorized technical archive |
| `/Education` | Cybersecurity & CS, CompTIA credentials, course archive |
| `/Projects` | Sticky console with project directory and full case studies + documents |
| `/Contact` | Availability, focus chips, and direct channels (email, LinkedIn, GitHub) |
| `*` | 404 "Signal Lost" |

---

## Design Language

**"The Abyssal Blue Signal Grid."** Ink‑black infrastructure surfaces (`#000407` → `#000D16`) lit by selective electric‑blue signals (`#0D9EFF`, `#AEDFFF`) for hierarchy, status, and interaction. Type is **Plus Jakarta Sans**; controls are square‑framed at `8px` (pills reserved for nav and status). The atmospheric galaxy keeps a broader blue/violet/magenta/warm spectrum so the interface palette stays disciplined while the artwork stays alive. Full tokens and rules live in `docs/DESIGN.md` and `docs/PRODUCT.md` (kept local, not published).

---

## Getting Started

**Prerequisites:** Node.js 20+ (LTS) and npm.

```bash
# install dependencies
npm install

# start the dev server (HMR)
npm run dev

# type-check + production build → dist/
npm run build

# preview the production build locally
npm run preview
```

> Note: `vite.config.ts` sets `base: '/Alex-Biddle-Portfolio-Website/'` for GitHub Pages, so the dev server serves the app under that sub‑path.

---

## Scripts

| Script | Action |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` (type‑check) then `vite build` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run ESLint over the project |
| `npm test` | Run the Node test suite in `tests/` |
| `npm run deploy` | Build and publish `dist/` via `gh-pages` |

---

## Testing

Tests use Node's built‑in runner (no extra framework) and cover the liquid‑glass config math, the navbar's liquid‑glass scoping, and route/page content snapshots:

```bash
npm test
```

When editing page copy, update the corresponding assertions in `tests/portfolioRoutes.test.ts`.

---

## Deployment

The site deploys to **GitHub Pages** two ways:

- **Automatic (preferred):** the [`Deploy static content to Pages`](.github/workflows/deploy.yml) GitHub Actions workflow runs on every push to `main` (and via manual dispatch). It installs with `npm ci`, runs `npm run build`, and uploads `dist/` to Pages.
- **Manual:** `npm run deploy` builds and pushes `dist/` with the `gh-pages` package.

Two details make clean URLs work on a static host:
- `vite.config.ts` `base` and `package.json` `homepage` are pinned to the project sub‑path.
- `public/404.html` + the inline shim in `index.html` round‑trip deep links through the query string so a refresh on any route survives.

---

## Accessibility & Robustness

- Targets **WCAG 2.2 AA** contrast; visible keyboard focus rings; semantic navigation; readable body line lengths; large touch targets.
- Decorative canvases are `aria-hidden` and never intercept foreground controls.
- Honors `prefers-reduced-motion` across CSS and every canvas renderer.
- A strict CSP meta tag, an SRI‑pinned Font Awesome stylesheet, and `-webkit-` vendor prefixes (`backdrop-filter`, `user-select`) for Safari/iOS.

---

## Author

**Alexander Biddle** — Cybersecurity Specialist & Developer
[GitHub](https://github.com/AlexanderBiddle) · [LinkedIn](https://www.linkedin.com/in/alex-biddle12)

© 2026 Alexander Biddle. All rights reserved. Personal portfolio project — not licensed for redistribution.
