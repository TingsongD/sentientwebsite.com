# Data Retention Schedule

Last updated: May 3, 2026

Status: operative schedule matching public privacy commitments. SentientWeb and Robanka **do not** operate dedicated databases storing visitor CRM payloads or Gemini Live session artefacts; persistence is attributable to **HubSpot** (CRM), **Google** (assistant), server-side consent evidence when `SENTIENT_CONSENT_LOG_PATH` is configured, plus unavoidable browser preference storage and transient hosting/CDN telemetry.

## Principles

- Do not claim SentientWeb/Robanka retain visitor personal datasets outside vendor platforms listed here.
- Keep HubSpot/Google console settings reconciled with public Privacy/Terms language.
- Document browser-side consent artefacts separately from vendor CRM data.
- Delete or revoke access when lawful rights requests conclude and vendors confirm completion.

## Schedule

| Data Category | Purpose | Custody / retention posture | Owner | Notes |
| --- | --- | --- | --- | --- |
| Website consent prefs | Honour privacy centre choices | Visitor browser/local storage controlled by visitor | Product/engineering | Not a SentientWeb server database |
| HubSpot CRM objects | Contacts, pipelines, engagement history | HubSpot-hosted retention dashboards & legal bases | Marketing/ops | Canonical store for business development data routed to CRM |
| Calendly booking payloads | Scheduling | Retained within Calendly plus mirrors/sync into HubSpot if integration enabled | Sales/ops | Honour Calendly DPA exports |
| Assistant inputs/outputs/logs | Gemini Live UX | Persisted strictly per **Google** terms/settings | Privacy eng + Google admins | Coordinate deletion via Google tooling |
| Security / CDN telemetry | Availability and abuse mitigation | Hosting/vendor logs with provider retention | Infrastructure | Transient or minimisation commitments |
| Marketing email artefacts | Outreach | HubSpot or connected ESP per subscription | Marketing | Suppression handled in HubSpot where applicable |
| Billing / invoicing artifacts | Taxes and contracts | Finance systems plus Stripe-hosted records | Finance | Applies when paid pilots exist |
| Payment card artefacts | Charging customers | Stripe only (no Sentient PAN storage) | Finance | Maintain PCI artefacts |
| Privacy request dossiers | Regulatory proof | Internal ops evidence store (outside git) subject to counsel policy | Privacy/legal | Not visitor CRM database |
| Incident evidence | Investigations | Incident tooling per counsel/security plan | Security | Follow incident response playbook |
| Server-side consent evidence | Consent proof and dispute/audit support | Restricted JSONL via `SENTIENT_CONSENT_LOG_PATH`; prune by retention procedure | Privacy/legal | Current procedure: 548 days unless counsel changes it |

## Deletion workflow

1. Verify identity or legal authority per `privacy-request-operations.md`.
2. Locate affected records inside **HubSpot** and/or **Google** admin consoles plus any ancillary vendor tickets.
3. Issue vendor-specific deletion, suppression, or export instructions; capture confirmation identifiers.
4. Preserve only what law or contracts require; escalate conflicts to counsel.
5. Close with the consumer within published SLAs after vendors acknowledge completion.

## Maintenance items

- [x] Initial audit recorded that no undisclosed SentientWeb database retains CRM or Gemini payloads; recheck quarterly and after architecture changes.
- [x] Vendor retention screenshot refresh rule documented; refresh whenever Google, HubSpot, Stripe, or consent-log retention settings change materially.
- [x] Server-side consent logging acknowledgement recorded May 3, 2026; operate per `docs/compliance/consent-log-spec.md`.
