# SentientWeb Marketing Frontend

Vite/React marketing site with static prerendering and a small route-aware Node production server. The app serves prerendered HTML for known routes, real `404` responses for unknown paths, and route-specific metadata before JavaScript runs.

## Setup

```sh
npm install
npx playwright install chromium
```

## Development

```sh
npm run dev
```

Optional widget environment variables are documented in `.env.example`.

## Production Build

```sh
npm run build
npm run start
```

`npm run build` writes browser assets and prerendered pages to `dist/`, and writes the private SSR render bundle to `dist-ssr/`. The production server reads `dist/routes-manifest.json` internally but does not expose it publicly. Compression is expected to be handled by Render or another edge/proxy layer.

## Checks

```sh
npm run lint
npm test
npm run test:e2e
npm audit
```

Use `npm run test:e2e:no-build` only after an up-to-date `npm run build`. `npm run test:all` runs lint, unit tests, a production-like Playwright run, and audit.

If port `4175` is occupied, run Playwright with an override:

```sh
PLAYWRIGHT_PORT=4185 npm run test:e2e
```
