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
Set `VITE_SITE_URL` before `npm run build` when generating canonicals and the sitemap for a
domain other than `https://sentientwebsite.com/`.
Production widget origins must use HTTPS; plain HTTP widget origins are accepted only for local
development hosts.
Set `SENTIENT_ALLOWED_HOSTS` at runtime if the Node server should reject unexpected Host headers
itself instead of relying only on the hosting platform or edge proxy.

## Compliance

Public legal pages and the privacy preference center are part of the app. Operational compliance
records for the Robanka/Gemini Live assistant are tracked in `docs/compliance/`.

Before production use of the live assistant, complete the AI DPIA, vendor/processor register,
retention schedule, and incident response plan in that folder, then have qualified counsel review
the public legal pages and operational records.

Use `npm run compliance:audit` to verify website-side compliance artifacts and list open launch
gates. Use `npm run compliance:audit:production` as the release-blocking check; it exits non-zero
until the launch gates in `docs/compliance/production-launch-gates.md` are complete.
Use `docs/compliance/remaining-production-items.md` to fill owners, placeholders, and actual
evidence links for open gates.
If server-side consent evidence is required later, configure `SENTIENT_CONSENT_LOG_PATH` outside
`dist/` and use `npm run consent-log:admin` for restricted JSONL retrieval, retention pruning, and
event deletion.

The current production-readiness review is tracked in `docs/production-readiness.md`.

## Production Build

```sh
npm run build
npm run start
```

`npm run build` writes browser assets and prerendered pages to `dist/`, and writes the private SSR render bundle to `dist-ssr/`. The production server reads `dist/routes-manifest.json` internally but does not expose it publicly. Compression is expected to be handled by Render or another edge/proxy layer. The production health check endpoint is `/healthz`.

## Checks

```sh
npm run lint
npm test
npm run compliance:audit
npm run test:e2e
npm audit
```

Use `npm run test:e2e:no-build` only after an up-to-date `npm run build`. `npm run test:all` runs lint, unit tests, a production-like Playwright run, the website-side compliance audit, and package audit.
Set `PLAYWRIGHT_WEB_SERVER_TIMEOUT` if the local production server needs more than 30 seconds to
start on a slow machine.

GitHub Actions runs the same production-readiness check on pushes to `main` and pull requests via `.github/workflows/ci.yml`.

If port `4175` is occupied, run Playwright with an override:

```sh
PLAYWRIGHT_PORT=4185 npm run test:e2e
```
