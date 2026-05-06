# PrimeFX

An institutional-grade financial services marketing site for PrimeFX — a prime brokerage offering liquidity, connectivity, and risk solutions to professional traders, brokers, hedge funds, and exchanges.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | CSS custom properties + Tailwind CSS 4 |
| Language | TypeScript 5.7 (strict mode) |
| Deployment | Netlify |

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000` (or `http://localhost:8888` via Netlify CLI).

```bash
# Using Netlify CLI for full platform emulation
netlify dev
```

## Building for Production

```bash
npm run build
```

Output is placed in `dist/client` and served as a static site via Netlify.
