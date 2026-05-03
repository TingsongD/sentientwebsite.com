# SentientWeb Jurisdiction Readiness Map

Last updated: April 28, 2026

Status: operational mapping, not legal certification. Vendor counsel packs for Robanka, **Google (Gemini Live AI technology)**, **HubSpot CRM storage**, Stripe, and cross-border posture were finalized **April 2026** (custody summarized in `placeholder-evidence-register.md`). Rows below still cite **Gate 2** (cookie/consent artefacts) or **Gate 6** (operations drills) wherever those artifacts remain mechanically open—see `production-launch-gates.md`.

## Scope

Applies to:

- public website visitors
- optional live assistant use
- optional microphone/voice use
- page context and interaction metadata used for interactive browsing assistance
- future payment flows through Stripe
- privacy, cookie, AI transparency, security, accessibility, marketing unsubscribe, and data-rights surfaces

## Mapping

| Jurisdiction / regime | Practical obligation theme | Implemented artifact | Remaining gate |
| --- | --- | --- | --- |
| U.S. FTC Act / AI claims | Avoid deceptive or unfair AI claims; do not imply the assistant is human; do not overstate legal, medical, financial, or compliance capability | `/ai-disclosure`, `/terms`, `/privacy`, professional-advice disclaimers, consent banner | Counsel review of all marketing and assistant claims before launch |
| U.S. state privacy laws, including CCPA/CPRA where applicable | Notice at collection, access/deletion/correction/opt-out rights, Do Not Sell or Share link, Global Privacy Control handling where required | `/privacy`, `/data-request`, `/do-not-sell`, footer privacy choices, GPC analytics disabling test | Final applicability review, production vendor inventory, server-side consent/opt-out evidence if required |
| U.S. email/SMS marketing | Unsubscribe mechanism for marketing communications | `/unsubscribe`, footer link | Confirm email/SMS provider suppression workflow and response SLA |
| U.S. payments / PCI | Avoid storing card data; complete applicable PCI documentation before accepting payments | `/billing-terms`, `stripe-pci-readiness.md`, `production-launch-gates.md` | **Gate 5 complete Apr 2026** — reverified before first live charges |
| U.S. DMCA | Copyright notice and agent registration if hosting user content at scale | `/dmca` states no user content at scale | Counsel validation; register DMCA agent if product scope changes |
| EU GDPR / UK GDPR | Transparent privacy notice, legal bases, processor/vendor disclosures, rights, retention, transfers, security, minors, DPIA where risk requires | `/privacy`, `/data-request`, `ai-dpia.md`, `retention-schedule.md`, `vendor-processor-register.md` | DPA/subprocessor evidence, transfer safeguards, DPIA approval, counsel validation |
| EU ePrivacy / cookie consent | Prior consent for non-essential cookies and similar technologies; preference management | `/cookies`, `ConsentManager`, footer privacy choices | Final cookie/tag inventory; consent logs if needed |
| EU AI Act transparency | Users should know they are interacting with an AI system; special care for generative/interactive systems | `/ai-disclosure`, `/terms`, `/privacy`, consent banner | Counsel review of AI Act role/classification and final disclosure placement |
| EU/UK representative and DPO | Assess whether representative or DPO appointment is required | `eu-uk-representative-dpo-assessment.md`; public legal text reflects owner determination | Counsel validation or appointment evidence |
| Canada PIPEDA and provincial privacy posture | Accountability, identified purposes, consent, limiting collection/use/retention, safeguards, openness, access/correction, challenge process | `/privacy`, `/data-request`, `/security-response`, `retention-schedule.md` | Canadian counsel review; breach/incident workflow approval; province-specific review if targeted |
| Australia Privacy Act / APP posture | Collection notice, purpose limitation, access/correction, security, cross-border disclosure, notifiable data breach readiness if applicable | `/privacy`, `/data-request`, `/security-response`, `security-incident-response.md` | Australian applicability and APP entity review; breach notification workflow approval |
| New Zealand Privacy Act 2020 | Collection notice, storage/security, access/correction, retention, use/disclosure limits, overseas disclosure considerations | `/privacy`, `/data-request`, `/security-response`, `retention-schedule.md` | NZ applicability review; overseas disclosure and breach workflow approval |
| Accessibility | Accessibility statement and feedback route | `/accessibility` | Accessibility audit and remediation owner |
| Security incident response | Reporting path and internal incident response procedure | `/security-response`, `/.well-known/security.txt`, `security-incident-response.md` | Approve owner list, vendor contacts, evidence storage, breach decision workflow |
| Vendor/processor governance | Processor agreements, subprocessors, security, retention/deletion, breach terms | `vendor-processor-register.md`, `evidence-request-packet.md` | **Robanka / Google AI / HubSpot / Stripe evidence on file Apr 2026**; refresh whenever vendors materially changes |

## Primary Source Register

Primary sources checked or referenced for this map:

- FTC artificial intelligence topic page: https://www.ftc.gov/industry/technology/artificial-intelligence
- EU AI Act Article 50 transparency obligations: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50
- GDPR text: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- California CCPA information: https://oag.ca.gov/privacy/ccpa
- Canada PIPEDA topic page: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/
- Australia Privacy Act page: https://www.oaic.gov.au/privacy/privacy-legislation/the-privacy-act
- New Zealand Privacy Act principles: https://www.privacy.org.nz/privacy-principles/
- Google Gemini Apps Privacy Hub: https://support.google.com/gemini/answer/13594961
- Stripe PCI compliance guide: https://stripe.com/guides/pci-compliance

## Repository boundaries and residual checklist items

- Contracts, Google admin screenshots, PCI SAQs, DPIA annexes, and counsel memos are **intentionally stored off-repository**—this map references file names only.
- Operational tasks that still rely on runnable evidence (Gate 2 undecided consent logging, Gate 6 rights-request drill, accessibility owner nomination, restricted evidence repository selection) remain **open** despite April 2026 counsel approvals.
- Optional analytics/advertising tags are still **undeployed**; refresh this map whenever those stacks go live.

Primary operational routing for evidence updates: **`songday@sentientwebsite.com`**.

## Current Readiness

The public website surfaces are implemented and verified. Jurisdiction-wide compliance remains conditional on the launch gates and evidence packet.
