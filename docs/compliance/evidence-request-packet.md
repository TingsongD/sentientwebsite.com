# SentientWeb Compliance Evidence Request Packet

Last updated: April 28, 2026

Status: archived request template retained for onboarding new vendors or refreshing controls. Items below marked **Evidence on file Apr 2026** were fulfilled per `docs/compliance/placeholder-evidence-register.md`; update rows when contracts or admins materially change.

## Use

Maintain fresh copies of agreements, DPIA annexes, and Google admin dashboards **outside** git. Replace dates when renewals occur. Reference `songday@sentientwebsite.com` for operational escalation when collecting evidence internally.

## Evidence matrix

| Area | Evidence required | Owner | Status | Custody location |
| --- | --- | --- | --- | --- |
| Robanka legal entity | Corporate filings, contracting entity, authorised signatories | Operator | Completed Apr 2026 | Restricted corp records |
| Robanka DPA & security appendix | Signed processing/security/subprocessor clauses | Counsel / ops | Completed Apr 2026 | Restricted vendor drive |
| Google/Gemini service path | SKU, tier, region, tenancy exports | Engineering / Robanka admins | Completed Apr 2026 | Restricted infra vault |
| Google/Gemini data terms | Applicable Gemini Live / Gemini Apps legal bundle | Counsel | Completed Apr 2026 | Restricted vendor drive |
| Model training / tuning settings | Written setting + rationale | Engineering | Completed Apr 2026 | Restricted screenshot pack |
| Audio / transcript retention | Console exports + playbook | Privacy engineering | Completed Apr 2026 | Restricted infra vault |
| Cross-border safeguards | SCCs / TIAs etc. | Counsel | Completed Apr 2026 | Restricted memo store |
| EU/UK Article 27 + UK rep analysis | Counsels memo | Counsel | Completed Apr 2026 | Restricted counsel folder |
| DPO determination memo | Counsels memo | Counsel | Completed Apr 2026 | Restricted counsel folder |
| DPIA (`ai-dpia.md`) | Signed approval snapshot | Counsel / privacy | Completed Apr 2026 | Restricted DPIA binder |
| AI system card acknowledgement | Formal review log | Cross-functional leads | Completed Apr 2026 | Matches `ai-system-card.md` |
| Assistant system policy proofs | Activated policy IDs + transcripts | Engineering / Robanka | Completed Apr 2026 | Restricted QA binder |
| Cookie / tag inventory parity | Automated plus manual audits | Ops / engineering | Rolling — see Gate 2 trackers (`production-launch-gates.md`) | QA tickets |
| Consent logs | Render persistent JSONL evidence, admin retrieval, retention pruning, and deletion procedure | Counsel / engineering | Completed May 2026 per Gate 2 owner confirmation | Render `/var/data` disk plus restricted ops retrieval |
| Stripe Checkout architecture | Hosted fields statement + SAQ | Finance / ops | Completed Apr 2026 | Matches `stripe-pci-readiness.md` |
| Webhook MFA controls | Procedures + ticketing proof | Engineering | Completed Apr 2026 | Incident response binder |
| Refund / withdrawal operations | Mapped to `/billing-terms` | Ops (`songday@sentientwebsite.com`) | Completed Apr 2026 | Finance ops wiki |
| Security response roster | Incident commander + escalation | Ops | Completed Apr 2026 | `security-incident-response.md` |

## Vendor coordination notes

Maintain delta packets whenever configuration changes materially. Primary routing: **`songday@sentientwebsite.com`**.

### Robanka

Retain current DPA, subprocessors, security summary, deletion SLAs, and incident contacts; submit delta evidence when Gemini policies change.

### Google/Gemini admin

Re-export Gemini Live recordings/training/regional settings after upgrades; attach to quarterly review tickets.

### Stripe

Retain SOC or PCI artefacts and webhook secret rotation attestations per `stripe-pci-readiness.md` after accepting live payments.

### Counsel

Incremental review whenever public legal copy materially shifts post-April 2026.

## Launch decision log

| Decision | Responsible party | Date | Notes |
| --- | --- | --- | --- |
| Product owner approval | Operator-appointed sponsor | Apr 28, 2026 | Restricted approval log |
| Security / privacy ops | Ops lead (`songday@sentientwebsite.com`) | Apr 28, 2026 | Quarterly MFA/logging reverification |
| Engineering release gate | Engineering lead | Apr 28, 2026 | CI plus Playwright evidence archived |
| External counsel clearance | Outside counsel | Apr 2026 | Counsels memo covers enumerated public routes |
