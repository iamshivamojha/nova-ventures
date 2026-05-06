# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

PrimeFX is a single-page institutional trading/fintech marketing site. Built with TanStack Start and deployed on Netlify. There is no backend, no database, and no authentication — it is a purely client-rendered marketing page.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | CSS custom properties + Tailwind CSS 4 |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
src/
├── routes/
│   ├── __root.tsx       # Root HTML shell: Google Fonts links, meta tags
│   └── index.tsx        # Entire site — all sections as one page component
├── styles.css           # Global CSS: custom properties (--gold, --dark-*), all section styles
├── data/
│   └── products.ts      # Legacy scaffold data — not used by the main page
└── router.tsx           # TanStack Router setup
```

## Architecture Decisions

- **Single route**: The entire marketing page lives in `src/routes/index.tsx`. All sections (nav, hero, ticker, why-choose, serve, access, offer, stats, contact, footer) are rendered by one `PrimeFXPage` component.
- **CSS custom properties over Tailwind**: The dark financial aesthetic is driven by CSS variables (`--gold`, `--dark-2`, etc.) in `styles.css`. Tailwind is imported but the main page uses hand-crafted CSS classes.
- **No server functions or database**: The contact form is client-side only (state feedback on submit). To add real form submission, integrate Netlify Forms or a server function.
- **Canvas chart**: The "Who We Serve" section uses a `ServeChart` component that draws a line chart via the HTML Canvas API in a `useEffect`.
- **Intersection Observer**: Used in two hooks — `useFadeIn()` triggers CSS `.visible` class on scroll for `.fade-in` elements; `useCounterAnimation()` runs animated number counters in the Stats section when they enter the viewport.

## Key Sections (in order)

1. Nav — fixed top bar, logo, links, login/CTA
2. Hero — full-height, headline, stat sidebar
3. Ticker — CSS-animated scrolling price feed (static data)
4. Why Choose — 6-card grid with hover effects
5. Who We Serve — accordion cards + canvas chart
6. Direct Access — feature grid + tiered liquidity stack
7. What We Offer — tabbed panels (Liquidity / Connectivity / Risk)
8. Stats — animated counters
9. Contact — contact info + enquiry form
10. Footer — brand, links, legal disclaimer

## Development Commands

```bash
npm run dev      # Start dev server (port 3000)
netlify dev      # Start with Netlify platform emulation (port 8888)
npm run build    # Production build to dist/client
```

## Conventions

### Naming
- Components: PascalCase
- Utilities/hooks: camelCase
- Routes: kebab-case files

### Styling
- CSS custom properties for theme tokens (defined in `styles.css`)
- Hand-crafted semantic class names (`.hero`, `.why-card`, `.offer-tab`, etc.)
- Tailwind available for utility classes if needed

### TypeScript
- Strict mode enabled
- Import paths use `@/` alias for `src/*`
- Type-only imports with `type` keyword where applicable
