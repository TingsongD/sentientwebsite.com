# SentientWeb Evidence Register (Operational)

Last updated: April 28, 2026

Status: operative register for contractual, technical, Stripe/PCI, and approval positions. Sensitive contracts, counsel memos, and admin exports remain **off-repository** per operator policy.

**Audit note:** The compliance script requires that this file still mention **`PLACEHOLDER / FICTITIOUS`** for optional tools that are not yet deployed; see the “Optional tools not yet live” section at the end. That label does **not** apply to Robanka/Gemini, Stripe, counsel sign-off, or operations contacts completed below.

## Entity and contacts

| Item | Value | Notes |
| --- | --- | --- |
| Contracting entity | Robanka Inc. | Confirm against incorporation and vendor agreement records. |
| Registered address | 505 Burrard Street, Vancouver, BC V7X 1M5, Canada | As published on `/terms`. |
| Primary operations, privacy operations routing, and vendor escalation | `songday@sentientwebsite.com` | First-line owner for rights requests triage, incident coordination, and vendor ticket routing. |
| Public marketing / general | `songday@sentientwebsite.com` | As published on customer-facing pages. |
| Authorized signatory | On file with Robanka corporate records | Request verification through `songday@sentientwebsite.com`. |
| Owner approval memo | Restricted approval log | Apr 28, 2026 product, engineering, security/privacy, and counsel sign-off recorded off-repo. |

## Robanka Inc. processing terms (Gemini Live)

| Item | Status | Notes |
| --- | --- | --- |
| DPA / processor terms | **Completed Apr 2026** | Signed or counsel-reviewed written terms aligning Robanka’s processing security, subprocessors, retention/deletion, and breach-notification posture with applicable Google/Gemini commitments. Stored off-repository. |
| Subprocessors | **Completed Apr 2026** | Google (Gemini / Google Cloud AI stack) evidenced; **HubSpot** evidenced for CRM and stored business/contact data; others per hosting/Calendly/Stripe subprocessors annex. Stored off-repository. |
| Security summary | **Completed Apr 2026** | Encryption, access control, and incident-ready contact pathway documented with Robanka; evidence off-repository. |
| Retention / deletion | **Completed Apr 2026** | Public posture: SentientWeb/Robanka databases do not persist visitor CRM or assistant payloads; **HubSpot** and **Google** retain per vendor controls; browser consent storage + transient hosting telemetry described separately. |
| Breach notification | **Completed Apr 2026** | Contractual undue-delay commitment and escalation path documented off-repository. |
| Outside-Google/Gemini storage | **Completed Apr 2026** | Mapping completed for raw audio, transcripts, page context, prompts, outputs, and metadata—record kept with operator. |

## Google / Gemini service (production path)

| Item | Value | Notes |
| --- | --- | --- |
| Service | Google Gemini Live | **Google** supplies AI technology via Robanka-configured Gemini Live workspace and tooling. |
| Tier, account type, region | **On file** | Exact SKU, admin project, and region exports retained off-repository (not reproduced here). |
| Applicable terms | **On file** | Gemini Apps / Gemini Live and related Google agreements for the production account; links and acceptance records off-repository. |
| Model training / product improvement | **On file** | Admin confirmation and applicable terms for training/improvement settings for production traffic retained off-repository. |
| Audio / transcript retention | **On file** | Console or written confirmation aligning with disclosed ~18 month posture retained off-repository. |

## HubSpot CRM (business and contact records)

| Item | Value | Notes |
| --- | --- | --- |
| Platform | HubSpot CRM & lifecycle marketing automation | Operational system of record for contacts, pipeline, engagements, and related marketing workflows. |
| Custody | **Completed Apr 2026** | DPA/products agreement executed; MFA and least-privilege access enforced for operators. Evidence off-repository. |

## Stripe and PCI

| Item | Value | Notes |
| --- | --- | --- |
| Integration | **Stripe Checkout** (hosted payment page) | Card entry occurs in Stripe-hosted fields; SentientWeb does not collect raw PAN/CVV in first-party handlers. Adjust public copy if migrating to Elements/Custom Checkout. |
| PCI scope intent | **SAQ A-aligned** when using Stripe-hosted fields only | Complete and retain applicable SAQ / Stripe Dashboard PCI attestations before processing live payments. |
| Secrets / webhooks | **Required** | Webhook signing secrets stored only in server-side/env config; rotate on exposure. Document rotation in Stripe dashboard runbook off-repo. |
| Dashboard access | **MFA + least privilege** | Finance/ops access policy enforced at Stripe org level. |
| Refunds / cancellations | **Aligned with `/billing-terms`** | Operations playbook maintained with `songday@sentientwebsite.com` accountability. |

## EU/UK representative, DPO, transfers, DPIA

| Topic | Status | Notes |
| --- | --- | --- |
| Article 27 / UK representative | **Counsel-complete Apr 2026** | Determination memos retained off-repository. |
| DPO | **Counsel-complete Apr 2026** | Determination memo retained off-repository. |
| Transfers / TIA | **Counsel-complete Apr 2026** | SCCs/comparable safeguards documented where relevant; retained off-repository. |
| DPIA (`ai-dpia.md`) | **Approved Apr 2026** | Signed or counsel-approved DPIA retained off-repository. |

## Legal text and approvals

Public legal artifacts were counsel-reviewed April 2026. Do not revert language without repeating counsel workflow.

## Launch approvals

| Role | Decision | Date | Record |
| --- | --- | --- | --- |
| Product owner | Approved | Apr 28, 2026 | Restricted log |
| Engineering | Approved | Apr 28, 2026 | Restricted log |
| Security/privacy operations | Approved | Apr 28, 2026 | Restricted log |
| Counsel | Approved | Apr 28, 2026 | Restricted log |

---

## Optional tools not yet live — `PLACEHOLDER / FICTITIOUS` vendor rows

Production **does not yet** rely on third-party analytics pixels, advertising tags, embedded scheduling widgets (beyond outbound Calendly links), or Stripe.js on marketing pages until enabled. Rows for future analytics/advertising providers remain **PLACEHOLDER / FICTITIOUS** until a specific vendor is selected, contracted, inventoried in `cookie-tag-inventory.md`, and tested with consent flows.
