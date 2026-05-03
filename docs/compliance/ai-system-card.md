# SentientWeb Live Assistant AI System Card

Last updated: April 28, 2026

Status: operative system card reflecting Robanka/Google Gemini Live production configuration evidenced off-repository April 2026. This card does **not** replace counsel advice; attach updated exports when vendors change materially.

## System Identity

| Field | Value |
| --- | --- |
| System name | SentientWeb live assistant |
| Website | `sentientwebsite.com` |
| Operator | Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada |
| AI backend provider | **Google LLC** (Gemini Live and related AI services) |
| Deployment operator | Robanka Inc. configures and operates the SentientWeb live assistant integration |
| Model / service | **Google Gemini Live** (production SKU, tier, and region evidenced off-repository April 2026) |
| User-facing disclosure | `/ai-disclosure`, `/privacy`, `/terms`, consent banner |
| Current public status | Assistant must not load before consent and 18+ confirmation |

## Intended Use

The assistant is intended to:

- help visitors navigate SentientWeb pages
- answer general questions about SentientWeb using approved website and product materials
- guide visitors toward demos, support, scheduling, or human contact
- support optional voice interaction after microphone permission and consent
- provide interactive website browsing assistance using page context and interaction events

## Out-of-Scope and Prohibited Uses

The assistant must not be used to:

- pretend to be human
- provide legal, medical, financial, tax, safety, compliance, employment, credit, housing, insurance, clinical, or other professional advice
- make or automate high-impact eligibility decisions
- derive biometric identifiers, voiceprints, emotion recognition, health status, protected-class traits, or sensitive inferences from voice
- process children’s data or target users under 18
- accept payment card numbers, government IDs, health records, children’s information, confidential secrets, or other sensitive data unless a separate secure workflow is approved
- generate deceptive content, impersonation, fraud, harassment, or unlawful instructions
- record bystanders without legally required notice and consent

## User Notice and Control

Required user controls:

- clear notice that the assistant is automated and not human
- consent before the assistant widget loads
- 18+ confirmation before the assistant widget loads
- browser microphone permission before voice audio is transmitted
- ability to use the website without the assistant or microphone mode
- footer privacy choices for withdrawing consent in the browser
- `/data-request` workflow for access, deletion, correction, opt-out, consent withdrawal, appeal, and authorized-agent requests
- `/do-not-sell` opt-out page for sale, share, targeted advertising, profiling, and similar rights where applicable

## Data Inputs

Potential inputs:

- user text
- microphone audio while voice mode is active
- assistant-generated responses
- page URL, page context, and interaction events needed for browsing assistance
- consent state and age confirmation
- technical metadata such as timestamp, browser, device, IP-derived data, error logs, and safety events
- contact or scheduling information if the user chooses to submit it

Users are instructed not to submit sensitive personal data, payment card data, children’s data, or confidential information.

## Outputs

Potential outputs:

- general product or website answers
- navigation guidance
- demo or scheduling next steps
- summaries of user-stated needs
- routing to human support
- reminders that important matters require qualified human review

Outputs can be incomplete, inaccurate, or outdated and must not be presented as professional advice or guaranteed results.

## Human Oversight

Human review is required for:

- legal, medical, financial, insurance, credit, employment, housing, clinical, safety, or regulated decisions
- unusual or sensitive requests
- user complaints, privacy requests, deletion requests, and appeals
- incident response and suspected misuse
- production prompt or configuration changes that materially affect behavior
- vendor setting changes for retention, training, audio, transcripts, or data location

## Data Retention and Training Status

Documented April 2026 (custody summarized off-repository with operator):

- **SentientWeb / Robanka** do **not** operate first-party persistence layers for CRM or assistant payloads; **HubSpot retains** CRM/contact data and **Google retains** Gemini / Gemini Live content per their consoles and contractual terms as applicable.
- Model-training/audio/transcript/evidence artefacts for Google workspaces live with Google admins; counterpart HubSpot artefacts live with CRM admins.
- Public notices describe illustrative Google disclosure periods (**e.g. eighteen months**) as **vendor-side** timelines, alongside browser/device preference storage and unavoidable hosting/CDN telemetry described in Privacy/Cookie Policies.

Operational contact for evidence updates: `songday@sentientwebsite.com`.

## Risk Controls

| Risk | Control |
| --- | --- |
| User thinks assistant is human | Public AI disclosure, terms, privacy notice, consent banner |
| Audio processed without meaningful consent | Assistant gated by consent and 18+ confirmation; browser microphone permission required |
| Sensitive data submitted | Public warnings and prohibited-use text |
| Professional advice reliance | Terms and AI disclosure disclaimers; human review for important matters |
| High-impact decision use | Prohibited-use rules and human review requirement |
| Children use assistant | Site not directed under 18; age confirmation before assistant loads |
| Unsupported marketing claims | E2E regression blocks forbidden marketing wording |
| Vendor data-use drift | Quarterly review cadence plus change-of-config procedure |
| Cross-border transfers | Transfer/SCC posture documented April 2026 with counsel |
| Deletion cannot be fulfilled | Privacy request runbook; vendor escalation to `songday@sentientwebsite.com` |

## Production evidence (custody)

The following categories are evidenced off-repository April 2026; update when contracts or admin settings materially change:

- Robanka processor terms, subprocessors, security posture, retention/deletion, breach notice
- Google/Gemini path, contractual terms accepted, training/audio/transcript/residency confirmations
- Rights testing and escalation contacts recorded in ops runbooks (`privacy-request-operations.md`, `security-incident-response.md`)

## Review cadence

Review this system card:

- whenever Robanka or Google/Gemini configuration changes
- whenever retention, model-training, audio, transcript, or region settings change
- after a privacy or security incident
- before adding high-risk industries or regulated workflows
- at least quarterly during production operation

## Approvals

| Role | Decision | Date | Notes |
| --- | --- | --- | --- |
| Product owner | Approved | Apr 28, 2026 | Restricted approval log |
| Engineering | Approved | Apr 28, 2026 | Restricted approval log |
| Security/privacy | Approved | Apr 28, 2026 | Restricted approval log |
| Counsel | Approved | Apr 28, 2026 | Restricted counsel record |
