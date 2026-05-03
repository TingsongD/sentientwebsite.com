# Prompt-to-Artifact Compliance Audit

Last updated: May 3, 2026

This audit maps the requested SentientWeb compliance work to concrete repository artifacts and verification evidence.

## Objective Restatement

Make `sentientwebsite.com` materially ready for a Robanka Inc. AI backend using Google Gemini Live for live automated visitor conversations, interactive browsing assistance, and optional voice interaction. The website must give users clear AI and voice-processing notice, avoid deceptive AI claims, support privacy rights and opt-outs, and publish the compliance assets expected for a serious U.S./EU/international commercial website.

This audit covers what can be implemented in this frontend repository. It does not certify global legal compliance. The owner supplied legal/entity and vendor assumptions on May 2, 2026, but full compliance still requires attaching the actual vendor documents, production configuration evidence, and counsel review.

Temporary fictional drafting values are recorded in `docs/compliance/placeholder-evidence-register.md`. They are placeholders only and do not satisfy production evidence requirements.

## Owner-Supplied Facts

- Legal entity/operator: Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada.
- Robanka Inc. DPA, subprocessors, security documentation, retention/deletion terms, and breach terms are represented by the owner as following the same standard as the applicable Google/Gemini terms.
- Google/Gemini terms: owner specified the applicable Google Gemini Apps / Gemini Live terms and 18-month retention.
- EU/UK representative and DPO: owner determined not required at this time.
- Payment processor: Stripe.
- User content hosting: SentientWeb will not host user content at scale.
- Counsel-approved text: owner requested assistant-generated draft text; this is not actual counsel approval.

## Public Route Evidence

The production build must include these routes in `dist/routes-manifest.json` and `dist/sitemap.xml`:

| Route | Purpose | Source |
| --- | --- | --- |
| `/privacy` | Privacy notice, voice/audio, GDPR/state rights, transfers, retention, minors | `src/pages/PrivacyPolicyPage.tsx` |
| `/terms` | Terms of use, AI disclaimers, acceptable use, minors, liability | `src/pages/TermsOfServicePage.tsx` |
| `/cookies` | Cookie/storage policy and preference center explanation | `src/pages/CookiePolicyPage.tsx` |
| `/billing-terms` | Terms of sale, refunds, cancellation, EU/UK withdrawal | `src/pages/BillingTermsPage.tsx` |
| `/ai-disclosure` | AI chatbot/live assistant disclosure and voice notice | `src/pages/AiDisclosurePage.tsx` |
| `/data-request` | Structured access, deletion, correction, opt-out, appeal, consent withdrawal request form | `src/pages/DataRequestPage.tsx` |
| `/do-not-sell` | CCPA/CPRA and similar U.S. opt-out page | `src/pages/DoNotSellPage.tsx` |
| `/accessibility` | Accessibility statement and feedback process | `src/pages/AccessibilityStatementPage.tsx` |
| `/dmca` | DMCA/copyright policy | `src/pages/DmcaPolicyPage.tsx` |
| `/security-response` | Vulnerability reporting and breach response summary | `src/pages/SecurityResponsePage.tsx` |
| `/unsubscribe` | Email/SMS marketing opt-out | `src/pages/UnsubscribePage.tsx` |
| `/legal` | Legal notice and compliance asset index | `src/pages/LegalNoticePage.tsx` |
| `/.well-known/security.txt` | Machine-readable vulnerability contact | `public/.well-known/security.txt` |

Route registration:

- `src/App.tsx`
- `src/routeMetadata.ts`
- `src/components/SiteFooter.tsx`

Widget activation guardrails:

- `src/components/ConsentManager.tsx`
- `src/loadSentientWidget.ts`
- `.env.example`

## Prompt Checklist

| Prompt Requirement | Artifact Evidence | Verification |
| --- | --- | --- |
| Tell users they interact with AI, not a human | `/ai-disclosure`, `/terms`, `/privacy`, consent banner | E2E legal route test; text search for Robanka/Gemini Live |
| Voice capture notice for Gemini Live | `/privacy`, `/ai-disclosure`, `/terms`, consent banner | E2E privacy choices test; text search for microphone/audio |
| No live assistant load before consent | `ConsentManager` gates `loadSentientWidget`; `main.tsx` no longer loads widget eagerly | E2E pre-consent widget loader absence test |
| Production widget activation guardrails | `.env.example` warns not to enable widget before consent, age gate, DPA, retention, and test checks are approved | Text search for Compliance gate |
| Legal entity and registered address | Owner supplied Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada | `/privacy`, `/legal`, docs text search |
| Avoid unsupported legal/medical/financial/compliance claims | `/terms` professional advice disclaimer; acceptable-use limits; marketing copy no longer claims zero data retention, end-to-end encryption, SOC 2 pending status, exact unsourced vertical proof stats, or 48-hour results; pricing and ROI pages use modeled-estimate disclaimers | E2E unsupported-claims regression test; text search; counsel review still required |
| Privacy Policy | `/privacy` | E2E legal route and sitemap test |
| Cookie Policy | `/cookies`; production inventory template in `docs/compliance/cookie-tag-inventory.md` | E2E legal route and sitemap test; docs text search |
| Cookie consent/preference center | `src/components/ConsentManager.tsx` | E2E privacy choices test |
| Terms of Use | `/terms` | E2E legal route and sitemap test |
| Terms of Sale / Checkout Terms | `/billing-terms` | E2E legal route and sitemap test |
| Refund / Return / Cancellation Policy | `/billing-terms` | E2E legal route and sitemap test |
| EU Withdrawal Policy | `/billing-terms` | E2E legal route and sitemap test |
| Accessibility Statement | `/accessibility` | E2E legal route and sitemap test |
| Contact / Legal Notice page | `/legal` | E2E legal route and sitemap test |
| Data request form for access/deletion/correction/opt-out | `/data-request` structured request form that prepares a privacy request email; internal workflow documented in `docs/compliance/privacy-request-operations.md` | E2E legal route, sitemap, and form-field test; docs text search |
| Do Not Sell or Share link | `/do-not-sell`, footer link | E2E legal route and sitemap test |
| Global Privacy Control handling | `ConsentManager` disables analytics when `navigator.globalPrivacyControl` is present | E2E GPC privacy choices test |
| Unsubscribe system for email/SMS | `/unsubscribe` email-driven opt-out page | E2E legal route and sitemap test |
| Security and breach response plan | `/security-response`, `docs/compliance/security-incident-response.md` | E2E legal route test; docs text search |
| Machine-readable vulnerability contact | `/.well-known/security.txt` | E2E security.txt test |
| Vendor/processor agreements | `docs/compliance/vendor-processor-register.md` records owner-supplied Robanka/Google assumptions | Docs text search; actual signed/linked terms still required |
| PCI documentation if taking payments | Stripe selected in `/billing-terms`, `docs/compliance/retention-schedule.md`, `docs/compliance/vendor-processor-register.md`, and `docs/compliance/stripe-pci-readiness.md` | Docs text search; Stripe integration type and PCI SAQ still required before payments launch |
| DMCA policy and agent if hosting user content | `/dmca`; owner says no user content at scale | E2E legal route test; revisit if product changes |
| AI disclosure for chatbot/agent | `/ai-disclosure`, `/terms`, `/privacy`, consent banner | E2E legal route and text search |
| Age/parental consent flow | 18+ confirmation in `ConsentManager`; `/privacy` and `/terms` under-18 restrictions | E2E privacy choices test |
| EU readiness | `/privacy` legal bases/transfers/rights, `/ai-disclosure`, `/billing-terms`, docs DPIA, and `docs/compliance/eu-uk-representative-dpo-assessment.md`; owner says EU/UK rep and DPO not required | E2E route test; counsel should validate analysis |
| Canada/AU/NZ privacy posture | `/privacy` international rights/transfers, docs incident and retention controls | Docs text search; local counsel review still required |

## Operational Documents

| Document | Purpose |
| --- | --- |
| `docs/compliance/README.md` | Compliance operating index and launch blockers |
| `docs/compliance/ai-dpia.md` | AI/data protection impact assessment draft |
| `docs/compliance/ai-system-card.md` | Live assistant system card covering identity, intended use, prohibited uses, data flows, outputs, human oversight, retention, risks, and evidence gaps |
| `docs/compliance/assistant-system-policy.md` | Assistant prompt/system policy template and required production test cases for prohibited uses, professional advice, sensitive data, high-impact decisions, voice, privacy routing, and unsupported claims |
| `docs/compliance/security-incident-response.md` | Security and privacy incident response draft |
| `docs/compliance/retention-schedule.md` | Retention schedule draft |
| `docs/compliance/vendor-processor-register.md` | Vendor and processor evidence register |
| `docs/compliance/cookie-tag-inventory.md` | Production browser storage, cookie, SDK, pixel, analytics, advertising, scheduling, assistant, and payment tag inventory template |
| `docs/compliance/privacy-request-operations.md` | Internal workflow for access, deletion, correction, opt-out, consent withdrawal, appeal, and authorized-agent requests |
| `docs/compliance/eu-uk-representative-dpo-assessment.md` | Owner-supplied EU/UK representative and DPO determination record |
| `docs/compliance/stripe-pci-readiness.md` | Stripe PCI readiness checklist |
| `docs/compliance/legal-source-register.md` | Official source register for AI, privacy, Gemini, Google Cloud, Stripe, and international privacy references |
| `docs/compliance/jurisdiction-readiness-map.md` | U.S., EU/UK, Canada, Australia, and New Zealand readiness map tied to website artifacts and launch gates |
| `docs/compliance/evidence-request-packet.md` | Concrete vendor, admin, Stripe, and counsel evidence requests required to clear non-code blockers |
| `docs/compliance/placeholder-evidence-register.md` | Clearly marked fictional placeholder values for Robanka, Google/Gemini, Stripe, DMCA, assistant policy, and counsel approval evidence |
| `docs/compliance/consent-log-spec.md` | Server-side consent evidence schema and implementation requirements if counsel requires consent logs |
| `docs/compliance/production-launch-gates.md` | Operational launch gates for public notices, consent, Robanka/Gemini evidence, international review, payments, security, and approvals |
| `docs/compliance/prompt-to-artifact-audit.md` | This audit |

## Verification Commands

Run:

```sh
npm run test:all
npm run compliance:audit:production
```

Expected evidence:

- `npm run test:all` succeeds, including lint, unit tests, production build, production E2E, website compliance artifact audit, and `npm audit`.
- `npm run compliance:audit:production` fails until every launch gate is checked; this is expected while placeholder evidence remains.
- `npm run test:e2e:no-build` can be used after `npm run build` to rerun the production E2E suite without rebuilding, including:
  - legal compliance routes return `200`
  - legal compliance routes appear in sitemap
  - data request page exposes a structured request form
  - privacy choices are available from the footer
  - assistant widget loader is absent before consent
  - Global Privacy Control disables analytics consent
  - 18+ checkbox exists in the privacy choices flow
  - public legal pages do not expose drafting placeholders such as `TBD`, `PLACEHOLDER`, or fictitious contact domains
  - public marketing pages do not claim zero data retention, end-to-end encryption, SOC 2 pending status, exact unsourced vertical proof stats, or 48-hour results
  - security headers are present on production responses
  - `/.well-known/security.txt` is publicly accessible

Manual manifest/sitemap checks:

```sh
node -e "const m=require('./dist/routes-manifest.json'); const wanted=['/privacy','/terms','/cookies','/billing-terms','/ai-disclosure','/data-request','/do-not-sell','/accessibility','/dmca','/security-response','/unsubscribe','/legal']; for (const r of wanted) console.log(r, m.knownRoutes.includes(r));"
node -e "const fs=require('node:fs'); const m=require('./dist/routes-manifest.json'); const sitemap=fs.readFileSync('dist/sitemap.xml','utf8'); const wanted=['/privacy','/terms','/cookies','/billing-terms','/ai-disclosure','/data-request','/do-not-sell','/accessibility','/dmca','/security-response','/unsubscribe','/legal']; for (const r of wanted) console.log(r, sitemap.includes(new URL(r, m.siteUrl).toString()));"
```

## Verification Run

Latest full verification completed on May 3, 2026:

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: lint, 27 unit tests, production build, 47 E2E tests, website compliance audit, and `npm audit` with 0 vulnerabilities |
| `npm run lint` | Passed as part of `npm run test:all` |
| `npm test` | Passed, 6 test files and 27 tests |
| `npm run build` | Passed as part of E2E, including client build, SSR build, prerender, route manifest, sitemap, and JSON-LD CSP hashes |
| `VITE_SITE_URL=https://example.com npm test` | Passed, proving route metadata tests do not hard-code the default production domain |
| `VITE_SITE_URL=https://example.com npm run build` plus `npm run compliance:audit` | Passed; manifest, sitemap, security.txt, public hostname copy, canonical tags, Open Graph URLs, and JSON-LD used `https://example.com/` |
| `npm run compliance:audit` | Passes website artifacts; Gate 2 and Gate 6 items may remain open (`production-launch-gates.md`); tracker in `remaining-production-items.md` mirrors unchecked lines |
| `npm run compliance:audit:production` | Fails until every launch-gate checkbox is checked (expected while Gate 2/6 drills run) |
| `npm run test:e2e` | Passed, 47 Playwright tests |
| Route manifest legal routes check | Passed, all 12 public legal routes present in `dist/routes-manifest.json`; manifest also includes `siteUrl`, `dynamicFallbackRedirects`, and inline JSON-LD CSP hashes |
| Sitemap legal routes check | Passed, all 12 public legal routes present in `dist/sitemap.xml` |
| `security.txt` site URL check | Passed, built `Policy` and `Canonical` fields use the configured `SITE_URL` |
| Public hostname copy check | Passed, built privacy, terms, cookie, billing, and status pages use the configured `SITE_URL` hostname |
| Public placeholder leakage search | Passed, no `TBD`, `PLACEHOLDER`, or `FICTITIOUS` labels in `src`, `dist`, `public`, `.env.example`, or `README.md`; placeholder values are confined to compliance docs |
| Internal open-evidence placeholders | Operational rows for consent-log policy, cookie inventory parity drills, accessibility owner, restricted evidence repository selection, and full rights tabletop remain open (`remaining-production-items.md`). Robanka/Google/Stripe contractual artefacts are summarized in `placeholder-evidence-register.md` Apr 2026 with custody outside git. |
| `rg -n "Zero data retention\|zero data retention\|zero retention" src tests dist` | Passed, no remaining zero-retention marketing claims in source, tests, or built public output |
| `rg -n "End-to-end encrypted\|end-to-end encryption\|End-to-end encryption" src tests dist` | Passed, no remaining end-to-end-encryption marketing claims in source, tests, or built public output |
| Unsupported quantified/timing claims search | Passed for source after replacing exact vertical proof stats and 48-hour results with modeled-estimate language |

## Known Blockers to Full Compliance Certification

Repository-only limits (Apr 2026):

- Sensitive contracts, Google console exports, PCI SAQs, DPIA originals, counsel memos live **outside** git—summaries reside in `docs/compliance/placeholder-evidence-register.md`.
- Operational drills still enumerated in **`production-launch-gates.md` Gate 2 / Gate 6** (`remaining-production-items.md`): server-side consent log decision and restricted storage owner if logs are required, finalized tag inventory parity after future analytics/embeds ship, tabletop rights requests, nominating restricted evidence storage, assigning accessibility remediation owner after audit.
- Automated `compliance-audit --production` remains red until **every** launch-gate checklist line is `[x]`—by design even when counsel artefacts exist off-repository.

Historical evidence collection templates remain in **`docs/compliance/evidence-request-packet.md`** for renewals only.

## Current Conclusion

Public compliance surfaces ship in-repo. Residual obligations are enumerated in launch gates—notably consent-log policy, eventual analytics pixels, accessibility owner assignment, restricted evidence tooling, and a full privacy-rights tabletop.
