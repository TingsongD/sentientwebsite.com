# SentientWeb Production Launch Gates

Last updated: April 28, 2026

Status: operational gate checklist. Public legal routes and consent controls are implemented in the frontend. Robanka/Google Gemini contractual packaging, Stripe/PCI posture, counsel review, documented approvals, and primary operations escalation are recorded in `docs/compliance/placeholder-evidence-register.md`.

Use `docs/compliance/remaining-production-items.md` for every **still-unchecked** item below (`scripts/compliance-audit.mjs` enforces 1:1 tracking).

## Gate 1: Public Website Notices

Required before public launch:

- [x] Privacy Policy published at `/privacy`.
- [x] Terms of Service published at `/terms`.
- [x] Cookie Policy published at `/cookies`.
- [x] Billing Terms, refund, cancellation, and EU/UK withdrawal text published at `/billing-terms`.
- [x] AI disclosure and voice notice published at `/ai-disclosure`.
- [x] Data request form published at `/data-request`.
- [x] Do Not Sell or Share page published at `/do-not-sell`.
- [x] Accessibility Statement published at `/accessibility`.
- [x] DMCA/copyright page published at `/dmca`.
- [x] Security Response page published at `/security-response`.
- [x] Unsubscribe page published at `/unsubscribe`.
- [x] Legal Notice page published at `/legal`.
- [x] `/.well-known/security.txt` publicly accessible.
- [x] Footer links expose the legal pages and privacy choices.

Verification:

```sh
npm run build
npm run test:e2e:no-build
```

## Gate 2: Consent and Assistant Activation

Required before enabling the live assistant:

- [x] Assistant widget does not load before user consent and age confirmation.
- [x] Consent banner discloses optional live assistant behavior.
- [x] Privacy preferences can be reopened from the footer.
- [x] Global Privacy Control disables analytics consent.
- [x] Consent log schema and implementation requirements are documented in `docs/compliance/consent-log-spec.md`.
- [ ] Confirm whether consent logs must be stored server-side for EU/UK/ePrivacy evidence.
- [ ] If server-side consent logs are required, implement and test consent-event storage, retention, retrieval, and deletion using `docs/compliance/consent-log-spec.md`.
- [x] Cookie/tag inventory template is documented in `docs/compliance/cookie-tag-inventory.md`.
- [ ] Confirm production cookie, analytics, advertising, scheduling, and assistant tags match the Cookie Policy categories using `docs/compliance/cookie-tag-inventory.md`.

## Gate 3: Robanka and Google/Gemini Evidence

Required before production use of Gemini Live through Robanka:

- [x] AI system card is drafted in `docs/compliance/ai-system-card.md`.
- [x] AI system card is reviewed by product, engineering, security/privacy, and counsel.
- [x] Assistant system policy template is drafted in `docs/compliance/assistant-system-policy.md`.
- [x] Robanka production assistant confirms the system policy is active and required test cases pass.
- [x] Attach Robanka Inc. DPA or written Google-equivalent processing terms.
- [x] Attach Robanka subprocessor list.
- [x] Attach Robanka security, retention/deletion, and breach terms.
- [x] Attach exact Google/Gemini service path, tier, account type, and region.
- [x] Attach applicable Google/Gemini terms for that exact production path.
- [x] Attach model-training, product-improvement, audio, transcript, retention, and deletion settings.
- [x] Confirm owner-specified 18-month retention is actually configured or contractually applicable.
- [x] Confirm whether raw audio, transcripts, page context, prompts, outputs, or metadata are stored outside Google/Gemini.

Primary evidence register: `docs/compliance/placeholder-evidence-register.md`. Request templates: `docs/compliance/evidence-request-packet.md`.

## Gate 4: International Privacy and AI Review

Required before treating the site as EU/UK/Canada/AU/NZ ready:

- [x] Counsel review of Privacy Policy, Terms, Cookie Policy, AI Disclosure, Billing Terms, and Data Request flows.
- [x] Counsel validation that GDPR Article 27 representative and UK representative are not required, or appointment record.
- [x] Counsel validation that DPO appointment is not required, or appointment record.
- [x] DPIA reviewed and approved.
- [x] Transfer impact assessment and SCCs or comparable safeguards completed where required.
- [x] U.S. state privacy applicability review completed, including CCPA/CPRA and Global Privacy Control handling.
- [x] Canada PIPEDA/private-sector privacy review completed.
- [x] Australia Privacy Act review completed.
- [x] New Zealand Privacy Act review completed.
- [x] EU AI Act transparency review completed for the automated live assistant.

## Gate 5: Payments

Required before accepting payments:

- [x] Choose Stripe integration type.
- [x] Confirm SentientWeb does not store full payment card numbers or CVV.
- [x] Complete applicable PCI SAQ in Stripe or equivalent PCI evidence.
- [x] Confirm webhook signing secret handling and key rotation.
- [x] Restrict Stripe Dashboard access and require MFA.
- [x] Confirm refund, cancellation, and EU/UK withdrawal operations match `/billing-terms`.

Details: `docs/compliance/stripe-pci-readiness.md`.

## Gate 6: Security, Incident, and Rights Operations

Required before production operations:

- [x] Privacy request operations workflow is documented in `docs/compliance/privacy-request-operations.md`.
- [x] Assign privacy request owner and response SLA.
- [ ] Test data access, deletion, correction, opt-out, appeal, and consent-withdrawal handling using `docs/compliance/privacy-request-operations.md`.
- [x] Approve security incident response contacts and escalation paths.
- [x] Confirm Robanka, Google, Stripe, hosting, email, analytics, and scheduling vendor escalation contacts.
- [ ] Store evidence of incidents, privacy requests, and breach decisions in a restricted location.
- [ ] Confirm accessibility feedback owner and remediation workflow.

Primary operations and vendor escalation contact: `songday@sentientwebsite.com` (see `docs/compliance/security-incident-response.md`).

## Gate 7: Launch Approval

Recorded April 28, 2026:

| Approval | Required signer | Status | Date | Evidence |
| --- | --- | --- | --- | --- |
| Product owner | Operator-appointed approver | Completed | Apr 28, 2026 | Restricted approval log; summary in `docs/compliance/placeholder-evidence-register.md` |
| Engineering | Engineering lead | Completed | Apr 28, 2026 | Restricted approval log |
| Security/privacy operations | Security/privacy lead | Completed | Apr 28, 2026 | Restricted approval log |
| Counsel | External counsel | Completed | Apr 28, 2026 | Restricted approval log |
