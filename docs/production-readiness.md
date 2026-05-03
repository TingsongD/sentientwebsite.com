# SentientWeb Production Readiness Review

Last updated: May 3, 2026

Status: production-readiness checks pass with owner-supplied operational evidence recorded. Actual signed/vendor/counsel records remain outside git and must be maintained before relying on them as legal proof.

## Objective

Review the codebase, fix concrete issues, and verify whether the website is production-ready.

## Fixes Completed

| Area | Issue found | Fix |
| --- | --- | --- |
| Consent hydration | Consent state read from `localStorage` during initial client render could diverge from SSR output for returning visitors. | `src/privacyPreferences.ts` centralizes storage reads and `src/components/ConsentManager.tsx` uses `useSyncExternalStore` for browser consent state. |
| Consent evidence path | Consent choices were browser-local only, leaving no implementation path for server-side consent evidence. | `src/components/ConsentManager.tsx` posts sanitized consent events to `/consent-events`; `server.mjs` validates events, rejects sensitive payload keys, rejects public `dist` log paths, and logs only when `SENTIENT_CONSENT_LOG_PATH` is configured. |
| Consent log operations | Server-side consent logs needed a tested local path for retrieval, retention, deletion, and withdrawal evidence without exposing an admin API. | `scripts/consent-log-admin.mjs` provides dry-run-by-default JSONL listing, filtering, retention pruning, and event deletion; unit tests cover utility behavior and E2E covers configured server append plus withdrawal events. |
| Legal version drift | Public legal-page “last updated” text and server-side consent evidence policy versions could drift because they were hard-coded separately. | `src/constants.ts` now centralizes consent/legal versions, `scripts/prerender.mjs` writes them to `dist/routes-manifest.json`, and `server.mjs` validates and uses manifest `legalVersions`; the compliance audit checks legal pages against the manifest. |
| Local production test server | Playwright could fail in restricted environments when server binding was implicit. | `server.mjs` supports `--host`; `playwright.config.ts` binds to `127.0.0.1`. |
| Widget origin handling | Widget script origin was derived by string trimming only. | `src/loadSentientWidget.ts` now accepts valid HTTPS origins, allows plain HTTP only for local development hosts, and trims install keys. |
| Server widget origin handling | Server CSP/runtime config accepted any parseable URL scheme. | `server.mjs` now accepts HTTPS widget origins, allows plain HTTP only for local development hosts, and rejects other schemes. |
| Widget origin tests | Widget origin validation had no direct unit coverage. | `src/loadSentientWidget.test.ts` covers valid HTTPS, local HTTP, empty, relative, insecure remote HTTP, and non-http origins. |
| Runtime widget configuration | Docker/Render runtime env could differ from Vite build env. | `server.mjs` exposes `/sentient-widget-config.json`; `src/loadSentientWidget.ts` falls back to it after consent. |
| Widget secret handling | Docker accepted widget config as build args, which could bake an install key into static assets. | `Dockerfile` now relies on runtime env through `/sentient-widget-config.json`. |
| Footer legal links | Footer legal route exposure was not directly tested. | `tests/e2e/production.spec.ts` now verifies footer legal links and privacy choices. |
| Compliance audit portability | Recursive file walking relied on a less portable `readdirSync` shape. | `scripts/compliance-audit.mjs` now uses explicit recursive traversal. |
| Deployment health check | Render health checks depended on the homepage. | `server.mjs` now exposes `/healthz`; `render.yaml` uses it. |
| Runtime version alignment | Docker used Node 20 while local/CI checks use Node 24. | `Dockerfile` now uses Node 24 for builder and runner stages. |
| CI reliability | No GitHub Actions production-readiness workflow existed. | `.github/workflows/ci.yml` runs `npm run test:all` on pull requests and pushes to `main`. |
| Docker deployment path | Local Docker daemon was unavailable, leaving image build unverified locally. | `.github/workflows/ci.yml` builds the Docker image and smoke-tests `/healthz` plus runtime widget config with injected env vars. |
| CSP inline execution/styles | `script-src` and `style-src` allowed `'unsafe-inline'`. | `server.mjs` now removes inline execution and inline style attributes, while `scripts/prerender.mjs` adds hashes for prerendered JSON-LD; dynamic UI styling was moved to CSS/classes; E2E verifies the production header. |
| Site URL drift | Canonical URLs, sitemap generation, security.txt policy/canonical URLs, and public legal/status copy depended on hard-coded production domains in multiple places. | `SITE_URL` is normalized from `VITE_SITE_URL` / `NEXT_PUBLIC_SITE_URL`, exported through SSR, written to `routes-manifest.json`, and used by `scripts/prerender.mjs`; custom-domain unit/build/audit checks verify non-default hosts. |
| Route manifest drift | App routes could diverge from prerender metadata routes. | `src/appRoutePatterns.ts` centralizes app route patterns, and unit tests compare app static routes with prerender metadata routes. |
| Dynamic redirect drift | Invalid dynamic fallback redirects were duplicated between app metadata and the server. | `DYNAMIC_FALLBACK_REDIRECTS` is exported into the prerender manifest and consumed by `server.mjs`. |
| Dynamic slug UX | Unknown dynamic slugs redirected inconsistently by section. | The section redirects are now a deliberate manifest-backed rule and E2E verifies blog, integration, current solution, and retired solution behavior. |
| Host header hardening | Request parsing intentionally uses a local base URL, and the server previously only rejected malformed Host headers. | `server.mjs` still avoids trusting request scheme/host for routing, and now supports `SENTIENT_ALLOWED_HOSTS` to reject unexpected Host headers when production should enforce an app-level allow-list; E2E covers malformed and unallowed Host headers. |
| Runtime cache validators | The custom production server sent cache directives but no entity validators, so clients and proxies could not revalidate prerendered HTML efficiently. | `server.mjs` now sends `ETag`, `Last-Modified`, and `Content-Length` for served files and returns `304` for matching conditional requests; E2E covers the route response validator path. |
| Head metadata drift | Prerendered HTML and client Helmet tags were generated through separate paths. | `src/components/PageMeta.test.tsx` compares representative Helmet output against `renderPageHead` so title, canonical, Open Graph, Twitter, and robots metadata stay aligned. |
| HSTS deployment assumptions | HSTS depended only on `NODE_ENV=production`. | `server.mjs` also treats Render as production-like and supports `SENTIENT_HSTS_ENABLED=true/false` override; E2E runs the server with the override enabled and verifies the header. |
| E2E startup flakiness | Playwright web server timeout was fixed at 15 seconds. | `playwright.config.ts` now defaults to 30 seconds and supports `PLAYWRIGHT_WEB_SERVER_TIMEOUT`. |
| Runtime compatibility | Node engine range was unnecessarily narrow. | `package.json` and lockfile now allow Node `>=22.12 <25` and npm `>=10` while CI/Docker continue to use Node 24. |
| Widget install key expectations | Runtime widget config exposes the install key to same-origin callers when configured. | `.env.example` now documents that the install key is a public client identifier that must be scoped and rotated, not treated as a server secret. |
| Missing, malformed, or partial build artifacts | Starting the production server before build failed with a raw manifest read/parse error, and partial route HTML output, malformed redirect maps, invalid site URLs, missing legal versions, protocol-relative redirects, or invalid CSP hashes could surface later as route-level/security failures. | `server.mjs` now exits with an explicit "run npm run build" message when `dist/routes-manifest.json` is missing, malformed, missing required route data, points at absent prerendered HTML files, contains invalid site URLs, lacks legal version metadata, contains invalid redirect maps, includes protocol-relative route/redirect values, or contains invalid JSON-LD CSP hashes. |

The website-side compliance audit also guards against regression for these hardening items: built manifests must include `siteUrl`, `dynamicFallbackRedirects`, and inline JSON-LD CSP hashes, and public-facing source/build artifacts must not reintroduce CSP `'unsafe-inline'` or inline style attributes.

## Prompt-to-Artifact Audit

| Requirement or feedback | Artifact evidence | Verification evidence | Current state |
| --- | --- | --- | --- |
| Review and fix CSP use of `'unsafe-inline'` for scripts and styles. | `server.mjs`, `scripts/prerender.mjs`, `src/index.css`, `public/favicon.svg`. | E2E security-header test; compliance audit scans public artifacts for `'unsafe-inline'` and inline style attributes. | Fixed and covered. |
| Account for public exposure of `/sentient-widget-config.json` install key. | `server.mjs`, `src/loadSentientWidget.ts`, `.env.example`, `README.md`. | E2E runtime widget config test; widget origin unit tests; no-store response header. | Fixed by documenting the key as public client config and preventing cache/storage assumptions. |
| Remove fragile HSTS dependency on only `NODE_ENV=production`. | `server.mjs`, `playwright.config.ts`. | E2E starts server with `SENTIENT_HSTS_ENABLED=true` and verifies `Strict-Transport-Security`. | Fixed and covered. |
| Centralize canonical/sitemap `SITE_URL`. | `src/constants.ts`, `src/entry-server.tsx`, `scripts/prerender.mjs`, `vite.config.ts`, `index.html`, public legal/status pages. | Unit tests for URL normalization, including `VITE_SITE_URL=https://example.com`; E2E canonical/sitemap/security.txt assertions; compliance audit checks built manifest, sitemap, security.txt, hostname copy, pricing canonical, Open Graph URL, and JSON-LD. | Fixed and covered. |
| Avoid route/manifest drift between `App.tsx` and metadata/prerender routes. | `src/appRoutePatterns.ts`, `src/App.tsx`, `src/routeMetadata.ts`, `scripts/prerender.mjs`. | Unit test compares app static routes with metadata routes and dynamic patterns; E2E checks representative routes and sitemap coverage. | Fixed and covered. |
| Make invalid dynamic slug behavior deliberate. | `src/routeMetadata.ts`, `server.mjs`, `dist/routes-manifest.json`. | Unit redirect tests; E2E redirect tests for blog, integrations, current solution redirects, and retired solution redirects. | Fixed and covered. |
| Guard against drift between prerendered head metadata and Helmet metadata. | `src/components/PageMeta.tsx`, `src/components/PageMeta.test.tsx`, `src/routeMetadata.ts`. | Unit test compares title, canonical, robots, Open Graph, and Twitter signatures for representative routes. | Fixed and covered. |
| Loosen unusually narrow Node/npm engines while keeping runtime alignment. | `package.json`, `package-lock.json`, `Dockerfile`, `.github/workflows/ci.yml`. | `npm run test:all`; CI workflow uses Node 24 and builds/smoke-tests Docker. | Fixed; local Docker daemon still unavailable, so Docker path is CI-verified. |
| Reduce Playwright web server startup flake risk. | `playwright.config.ts`, `README.md`. | `PLAYWRIGHT_WEB_SERVER_TIMEOUT` support and successful E2E run. | Fixed and covered. |
| Make missing, malformed, or partial build artifacts operationally clear. | `server.mjs`. | Production server exits with explicit "run npm run build" message when manifest is absent, malformed, points at missing route HTML, contains an invalid `siteUrl`, lacks valid `legalVersions`, contains invalid or protocol-relative redirect maps, or contains invalid CSP hashes; normal build/start, missing-manifest, malformed-manifest, invalid-site-url, invalid-legal-versions, missing-route-file, invalid-redirect-map, protocol-relative-redirect, and invalid-CSP-hash startup paths are covered by E2E. | Fixed and covered. |
| Make Host header handling an explicit deployment choice. | `server.mjs`, `.env.example`, `README.md`. | E2E covers malformed Host rejection and configured `SENTIENT_ALLOWED_HOSTS` rejection/allowance. | Fixed and covered. |
| Verify legal/compliance placeholders are not public launch approvals. | `docs/compliance/production-launch-gates.md`, `docs/compliance/remaining-production-items.md`, `scripts/compliance-audit.mjs`. | `npm run compliance:audit` passes website artifact checks; `npm run compliance:audit:production` passes once all launch gates are checked. | Fixed and covered; actual evidence remains off-repository. |

## Technical Release Checklist

| Requirement | Evidence | Status |
| --- | --- | --- |
| Lint clean | `npm run lint` | Passed |
| Unit tests | `npm test` | Passed, 6 files and 27 tests |
| Production build | `npm run build` as part of `npm run test:all` | Passed |
| Production E2E | `npm run test:e2e` as part of `npm run test:all` | Passed, 53 Playwright tests |
| Runtime version contract | `package.json`, `package-lock.json`, `Dockerfile`, `.github/workflows/ci.yml` | Node 24 aligned |
| CI production-readiness gate | `.github/workflows/ci.yml` | Runs `npm run test:all`, Docker build, Docker `/healthz`, and runtime widget config smoke tests with injected env vars |
| Deployment health check | `/healthz`, `render.yaml`, E2E GET/HEAD health test | Passed |
| Security dependency audit | `npm audit` as part of `npm run test:all` | Passed, 0 vulnerabilities |
| Website compliance artifacts | `npm run compliance:audit` as part of `npm run test:all` | Passed for website artifacts, including the prompt-to-artifact audit |
| Production launch gates | `npm run compliance:audit:production` | Passed after May 3, 2026 owner confirmations closed Gate 2 and Gate 6 |
| Public legal routes | E2E route and sitemap checks | Passed |
| Consent and assistant gating | E2E privacy choices, GPC, and pre-consent widget-loader tests | Passed |
| Security response file | E2E `/.well-known/security.txt` check | Passed |
| Internal artifact exposure | E2E denied-file and SSR-bundle tests | Passed |
| Public placeholder leakage | E2E legal-page placeholder test and compliance audit | Passed |
| Unsupported public claims | E2E claims regression test | Passed |

## Release Commands

Use this command for technical production readiness:

```sh
npm run test:all
```

Latest result:

```text
Passed: lint, 30 unit tests, build, 54 E2E tests, website compliance audit, npm audit with 0 vulnerabilities.
```

Docker image build was not verified locally because Docker Desktop/daemon was not running:

```text
docker build -t sentientweb-production-readiness .
ERROR: Cannot connect to the Docker daemon at unix:///Users/tingsongdai/.docker/run/docker.sock.
```

The Dockerfile itself is aligned with the checked Node 24 runtime. The CI workflow now verifies the Docker image path by building the image and smoke-testing `/healthz` plus `/sentient-widget-config.json` with injected runtime env vars, matching Render-style runtime behavior.

Use this command for legal/compliance production approval:

```sh
npm run compliance:audit:production
```

Latest result:

```text
Passed: all launch gates checked; remaining-production-items has no open rows.
```

## Operational Evidence

The codebase is technically ready for production deployment and `npm run compliance:audit:production` passes after the May 3, 2026 owner confirmations. The site should not be treated as legally certified unless the off-repository evidence is real, current, and approved by the appropriate legal/operations owner.

Evidence to maintain outside git:

- Signed or otherwise authoritative Robanka, Google/Gemini, Stripe, hosting, email, analytics, and scheduling records.
- Google Workspace/Drive restricted evidence for consent logs, privacy requests, incidents, breach decisions, and approvals.
- Updated cookie/tag inventory before adding new analytics, advertising, embedded scheduling, payment, or assistant scripts.
- Counsel/vendor replacement records for any owner-supplied drafting assumptions.

Authoritative gate list:

- `docs/compliance/production-launch-gates.md`
- `docs/compliance/remaining-production-items.md`
- `docs/compliance/evidence-request-packet.md`
- `docs/compliance/placeholder-evidence-register.md`

## Conclusion

Technical production readiness is verified, and the repository production compliance audit is green when built artifacts are current. Legal certification still depends on maintaining the real off-repository evidence summarized by these docs.
