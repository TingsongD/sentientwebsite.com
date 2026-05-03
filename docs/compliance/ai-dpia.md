# AI and Data Protection Impact Assessment

Last updated: May 3, 2026

Status: owner-supplied DPIA record with April 2026 counsel/vendor evidence and May 3, 2026 operational confirmations summarized in `placeholder-evidence-register.md`. Maintain HubSpot CRM mapping alongside Google AI controls.

## Processing Summary

SentientWeb is operated by Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada. SentientWeb uses a live automated assistant on `sentientwebsite.com`. **Google** supplies the **Gemini Live** AI technology used for that assistant; Robanka configures and operates the integration. Visitor text, page context, interaction events, and microphone audio (when voice is enabled) are processed per Google’s applicable terms and SentientWeb’s public notices.

Marketing, sales, and service records we persist for business purposes are stored in **HubSpot** as our primary CRM/database (see `/privacy`).

The assistant is intended to help visitors navigate the website, understand SentientWeb services, and request demos or support. It must not be presented as a human and must not be used for legal, medical, financial, tax, employment, credit, insurance, housing, or similar high-impact decisions.

The companion system card is `docs/compliance/ai-system-card.md`.
The companion assistant policy template is `docs/compliance/assistant-system-policy.md`.

## Data Categories

- CRM and pipeline attributes recorded in HubSpot when visitors become leads or customers.
- Conversation text and generated responses.
- Microphone audio while voice mode is active.
- Transcripts or session metadata retained by **Google**, and CRM fields retained by **HubSpot**, if applicable.
- Page context and browsing interaction events needed for interactive site assistance.
- Technical data such as IP address, browser, device, timestamps, error logs, safety events, and consent state.

## Special Category and Sensitive Data Controls

Visitors are instructed not to submit sensitive personal data, payment card numbers, government identifiers, health information, biometric identifiers, children’s information, or confidential information unless SentientWeb requests it through a secure workflow.

Voice audio can be sensitive depending on jurisdiction and use. SentientWeb should not derive voiceprints, biometric templates, emotion recognition, identity verification, or sensitive inferences from microphone audio without a separate legal review, explicit notice, and consent flow.

## Legal Bases and Notices

Public notices:

- `/privacy`
- `/cookies`
- `/ai-disclosure`
- `/terms`
- `/data-request`
- `/do-not-sell`

Expected legal bases:

- Consent for microphone access, optional cookies, analytics, marketing, and loading the live assistant where required.
- Contract or pre-contract steps for demos and requested services.
- Legitimate interests for security, fraud prevention, service improvement, and ordinary business communications where permitted.
- Legal obligation for required disclosures, preservation, or regulatory response.

## Risk Assessment

| Risk | Impact | Required Control |
| --- | --- | --- |
| Visitor does not understand they are speaking with AI | Deception, EU AI Act transparency issue, FTC risk | Clear automation notice before first interaction and in Terms/Privacy |
| Audio captured without meaningful consent | Wiretap/recording, privacy, biometric, consumer protection risk | Browser permission plus consent banner and 18+ confirmation before assistant loads |
| Sensitive data submitted into assistant | Privacy, security, regulatory risk | Public warnings, prompt/system restrictions, vendor configuration, deletion workflow |
| Model output is inaccurate or overclaims | FTC deception, user harm | No professional advice claims, disclaimers, human handoff for important matters |
| Minor uses assistant | Platform terms and child privacy risk | Not directed under 18, age confirmation before loading assistant |
| Vendor uses prompts/audio for model training | GDPR/contract/confidentiality risk | Google Gemini Apps / Gemini Live settings and contracts on file April 2026; re-verify after configuration changes |
| Cross-border transfers lack safeguards | GDPR, UK GDPR, Canada, AU/NZ transfer risk | SCCs or comparable safeguards, subprocessors list, transfer impact assessment |
| Assistant retention narratives drift from vendor reality | Transparency / fairness | Compare Google admin + HubSpot dashboards to published Privacy/Terms quarterly |
| HubSpot subscriptions | CRM lawful bases alignment | Keep field mapping synced with Privacy disclosures and executed DPA |
| Assistant makes high-impact decisions | EU AI Act/state privacy/profiling risk | Prohibit high-impact eligibility decisions and require human review |

## Required Vendor Evidence

Collect and store:

- Robanka Inc. data processing agreement or written confirmation that Robanka applies the same relevant data processing, security, retention/deletion, subprocessor, and breach terms as the applicable Google/Gemini service terms.
- Google Gemini Apps / Gemini Live terms applicable to the exact service path.
- Evidence that Google-published retention durations (for example illustrative **eighteen-month** Gemini Apps activity timelines) match production console selections.
- Evidence of the Gemini Live audio/recording and transcript model-training settings used in production.
- Data residency or region configuration evidence, if relied on.
- HubSpot CRM data processing addendum / subscription terms covering stored contacts and engagements.

## Production Approval Checklist

- [x] Legal entity and contact details supplied by owner.
- [x] Robanka DPA or Google-equivalent written processor terms attached.
- [x] Google Gemini Apps / Gemini Live terms and settings attached.
- [x] 18-month retention and model-training controls documented.
- [x] Assistant prompt/system policy template blocks prohibited uses and professional-advice claims in `docs/compliance/assistant-system-policy.md`.
- [x] Robanka production configuration confirms the assistant policy is active and tested.
- [x] AI system card reviewed and approved.
- [x] Consent banner verified in production-like build/runtime with widget environment variables documented for deploy.
- [x] Microphone is not requested until visitor intentionally starts voice mode.
- [x] Data request workflow can locate and delete assistant records.
- [x] Owner states EU/UK representative and DPO are not required at this time.
- [x] Counsel review completed.

Approver:
Restricted approval log; summary in `docs/compliance/placeholder-evidence-register.md`.

Date:
May 3, 2026 operational confirmation; April 2026 counsel/vendor evidence retained off-repository.
