# SentientWeb Compliance Operations

Last updated: May 3, 2026

This folder tracks the operational controls required to support the public legal pages on `sentientwebsite.com`.

The website now publishes the required user-facing notices for the live automated assistant, voice capture, privacy rights, cookies, opt-outs, billing/refunds, accessibility, copyright, and security reporting. Those notices are only one layer of compliance. Production use also requires signed agreements, configuration evidence, response procedures, and periodic review.

## Scope

Applies to:

- `sentientwebsite.com`
- the SentientWeb live automated assistant
- Robanka Inc. as the SentientWeb **operator**
- **Google** as **AI technology provider** (Gemini Live and related AI services configured by Robanka)
- **HubSpot** as the **CRM / stored business-contact database**
- scheduling, hosting, email, ancillary analytics beyond HubSpot, security, and payment vendors

## Public Website Artifacts

The following routes must remain live and linked in the footer:

- `/privacy`
- `/terms`
- `/cookies`
- `/billing-terms`
- `/ai-disclosure`
- `/data-request`
- `/do-not-sell`
- `/accessibility`
- `/dmca`
- `/security-response`
- `/unsubscribe`
- `/legal`

Verification:

```sh
npm run lint
npm test
npm run build
npm run compliance:audit
npm run compliance:audit:production
npm run test:e2e:no-build
```

`npm run test:all` runs the normal combined technical gate: lint, unit tests, production build, Playwright E2E, website compliance audit, and package audit.
The Playwright suite verifies that legal routes return `200` and appear in the sitemap.
The compliance audit reports whether required compliance docs, built legal routes, sitemap entries, and public placeholder-leakage checks pass, while listing any unchecked production launch gates grouped by gate. It also checks that open rows in `remaining-production-items.md` match unchecked launch gates in both directions.
Use `npm run compliance:audit:production` as the release-blocking variant; it exits non-zero until every launch gate is checked.

Server-side consent evidence is owner-confirmed as required for production operations. When `SENTIENT_CONSENT_LOG_PATH` is enabled, use the local JSONL utility for restricted retrieval, retention pruning, and event deletion:

```sh
npm run consent-log:admin -- --file /var/data/sentientweb/consent-events.jsonl --list --event-id <event-id> --pretty
npm run consent-log:admin -- --file /var/data/sentientweb/consent-events.jsonl --retention-days 548 --commit
```

The Render Blueprint mounts `/var/data` as a persistent disk for this evidence path. For existing
Blueprint services, set `SENTIENT_CONSENT_LOG_SALT` manually in the Render Dashboard because
`sync: false` secrets are only prompted during initial Blueprint creation.

## Non-Code Evidence to Maintain

These records live partly or fully outside frontend code:

- Legal entity and address supplied by owner: Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada.
- Robanka Inc. DPA, subprocessors, security, retention/deletion, and breach terms are owner-specified to follow the same standard as the applicable Google/Gemini terms.
- Google Gemini / Google Cloud terms are owner-specified as the applicable Gemini Apps / Gemini Live terms, with 18-month retention.
- Maintain subprocessors/evidence packages for Robanka, Google AI services, HubSpot, hosting, scheduling, email extensions, ancillary analytics/advertising, and payment vendors.
- Maintain the AI/data protection impact assessment in `docs/compliance/ai-dpia.md`.
- Maintain the reviewed live assistant system card in `docs/compliance/ai-system-card.md`.
- Configure and retest the live assistant using `docs/compliance/assistant-system-policy.md` whenever behavior changes.
- Maintain the approved incident response plan in `docs/compliance/security-incident-response.md`.
- Maintain the approved retention schedule in `docs/compliance/retention-schedule.md`.
- Owner has determined that GDPR Article 27 representative, UK representative, and DPO appointment are not required at this time.
- Maintain that determination in `docs/compliance/eu-uk-representative-dpo-assessment.md`.
- Reconfirm age gating remains sufficient for the product audience or add stronger age/parental consent controls if the audience changes.
- Cookie, analytics, advertising, scheduling, payment, and assistant tags are owner-confirmed to match the public Cookie Policy as of May 3, 2026; refresh `docs/compliance/cookie-tag-inventory.md` before adding or changing tags.
- Payment processor is Stripe; maintain Stripe integration type and PCI scope before accepting payments.
- Maintain Stripe PCI readiness in `docs/compliance/stripe-pci-readiness.md` before accepting payments.
- Owner has stated SentientWeb will not host user content at scale; revisit DMCA agent registration if this changes.
- Keep source references current in `docs/compliance/legal-source-register.md`.
- Use `docs/compliance/jurisdiction-readiness-map.md` to map U.S., EU/UK, Canada, Australia, and New Zealand themes to public artifacts and launch gates.
- Collect vendor, admin, Stripe, and counsel evidence using `docs/compliance/evidence-request-packet.md`.
- Use `docs/compliance/placeholder-evidence-register.md` for counsel-approved summaries; optional analytics stacks without executed vendors remain flagged **PLACEHOLDER / FICTITIOUS** per audit script until launched.
- Use `docs/compliance/remaining-production-items.md` only when new unchecked launch gates exist; it currently records no open launch gates after the May 3, 2026 owner confirmations.
- Maintain production browser storage and tag disclosures in `docs/compliance/cookie-tag-inventory.md`.
- Configure and operate server-side consent evidence using `docs/compliance/consent-log-spec.md`.
- Process privacy rights requests using `docs/compliance/privacy-request-operations.md`.
- Track launch readiness using `docs/compliance/production-launch-gates.md`.
- Maintain prompt-to-artifact evidence in `docs/compliance/prompt-to-artifact-audit.md`.
- Have qualified counsel review public legal pages and operational records before treating them as counsel-approved.

## Review Cadence

Review this folder and public legal pages:

- before launching the live assistant in production
- when Robanka, Google, or another subprocessors changes
- when a new checkout, payment, marketing, analytics, or advertising tool is added
- after a security incident or material privacy request
- at least annually
