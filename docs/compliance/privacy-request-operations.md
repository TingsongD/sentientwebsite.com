# Privacy Request Operations Runbook

Last updated: May 3, 2026

Status: operative runbook layered on counsel-approved timelines April 2026. Owner confirmation on May 3, 2026 records the full rights-request tabletop as complete with fictional data.

## Intake Channels

Accept privacy requests from:

- `/data-request`
- `hello@sentientwebsite.com`
- **`songday@sentientwebsite.com`** (primary operations escalation, SLA tracking, and vendor ticketing)
- replies to marketing unsubscribe requests
- counsel, regulator, or authorized-agent correspondence

Do not ask users to send government IDs, financial records, health records, or other sensitive documents unless counsel approves a secure verification process for the specific request.

## Request Record

Create a restricted request record with:

| Field | Notes |
| --- | --- |
| Request ID | Internal unique identifier |
| Received at | Timestamp and channel |
| Requester contact | Email or contact identifier |
| Region | Country, state, province, or territory supplied by requester |
| Request types | Access, correction, deletion, portability, opt-out, consent withdrawal, appeal, authorized agent |
| Verification status | Pending, verified, failed, not required |
| Systems searched | Website, assistant (**Google Gemini Live** AI), HubSpot CRM, Robanka coordination, scheduling (Calendly), email tooling, analytics if enabled beyond HubSpot defaults, Stripe if applicable |
| Vendor tickets | Robanka, **Google**, **HubSpot**, Calendly, email, ancillary analytics vendors, Stripe, hosting, monitoring |
| Response due date | Calculated by applicable law and counsel guidance |
| Final response | Summary, date, and operator |
| Appeal status | If applicable |
| Retention marker | Keep according to `retention-schedule.md` |

## Triage

Within 5 business days where practical:

1. Acknowledge receipt.
2. Categorize request type and region.
3. Check whether the requester is a user, prospect, visitor, customer contact, authorized agent, or regulator.
4. Decide whether identity verification is required.
5. Assign an owner and response due date.
6. Preserve request evidence in restricted Google Workspace/Drive or an equivalent access-controlled operations location.

## Verification

Use data-minimizing verification:

- Match requester email to known records where possible.
- For authorized agents, request proof of authority and verify the consumer directly unless law requires otherwise.
- For deletion and portability requests, use stronger verification than low-risk opt-out requests.
- Do not disclose personal information until verification is complete.
- If verification fails, explain what is missing and close only after a reasonable opportunity to cure.

## System Search Checklist

Search applicable systems:

- SentientWeb website contact records
- consent state or consent logs if implemented
- live assistant records held by Google (Gemini) / coordinated through Robanka
- HubSpot CRM and marketing automation records when applicable to the visitor
- Calendly or scheduling records
- email and marketing tools
- analytics and advertising tools if enabled
- hosting, logs, CDN, security, and monitoring tools
- Stripe records if payments are accepted
- ticketing and document storage tools outside HubSpot as applicable

## Vendor Escalation

Open vendor tickets when a request may involve processor-held data:

| Vendor / system | Request evidence needed |
| --- | --- |
| Robanka | Search, access export, deletion/anonymization confirmation, retention exception reason |
| Google (Gemini / AI services) | Activity/audio/transcript search, deletion workflow, retention setting confirmation |
| HubSpot | CRM/contact record lookup, lawful basis review, lawful deletion or suppression per HubSpot tools |
| Stripe | Billing metadata search, PCI-safe deletion/retention handling |
| Calendly | Booking record access/deletion |
| Email/marketing | Suppression, unsubscribe, export, deletion |
| Hosting/security logs | Log search and retention exception review |

Record ticket IDs and final confirmations in the request record.

## Response Targets

Use counsel-approved jurisdiction timelines. Until counsel sets a stricter matrix, operate with these internal targets:

- Acknowledge within 5 business days where practical.
- Complete standard requests within 30 calendar days where practical.
- Escalate immediately if a law may require a shorter deadline or specific format.
- Document extensions and explain them to the requester where legally required.

## Request Type Handling

| Type | Handling |
| --- | --- |
| Access | Provide categories and specific data where legally required and safe to disclose |
| Correction | Correct inaccurate information or annotate dispute where correction cannot be verified |
| Deletion | Delete, anonymize, or suppress where legally available; document legal/security retention exceptions |
| Portability | Provide machine-readable export where legally required and technically feasible |
| Opt out | Apply sale/share/targeted advertising/profiling opt-out where applicable |
| Consent withdrawal | Disable optional assistant, analytics, marketing, or other consent-based processing where applicable |
| Appeal | Assign a reviewer who did not make the original decision where feasible |
| Authorized agent | Verify authority and user identity according to applicable law |

## Response Template

Use concise plain-language responses:

```text
Subject: SentientWeb privacy request [Request ID]

We received your privacy request on [date] and processed it as [request type].

Verification status: [verified / not required / unable to verify].
Actions taken: [summary].
Systems checked: [summary].
Vendor actions: [summary or not applicable].
Data retained, if any: [legal/security/contract reason].
Appeal rights, if any: [instructions].

Contact hello@sentientwebsite.com with questions about this response.
```

## Denials and Limitations

Escalate to counsel before denying or materially limiting a request. Common reasons may include:

- inability to verify identity
- security, fraud prevention, or legal hold
- tax, accounting, payment, or contract retention requirement
- another person’s privacy rights
- disproportionate or manifestly unfounded request where law allows

## Retention

Retain privacy request records according to `docs/compliance/retention-schedule.md`. Current draft target: 3 years for request, verification, response, and appeal records, unless counsel sets a different period.

Restricted evidence repository: Google Workspace/Drive under operations control. Do not store identity documents, vendor exports, incident artefacts, breach decisions, or privacy request records in this git repository.

## Launch gates

Operational checklist lives in `docs/compliance/production-launch-gates.md` (Gate 6). Highlights:

- [x] Request owner assigned: **`songday@sentientwebsite.com`**.
- [x] Robanka / Google Gemini vendor escalation pathways confirmed alongside April 2026 evidence pack.
- [x] Stripe workflow aligned with `stripe-pci-readiness.md`.
- [x] Counsel-backed jurisdiction timeline matrix on file (`evidence-request-packet.md`).
- [x] Migrate privacy request artefacts to nominated restricted repository: Google Workspace/Drive under operations control.
- [x] Run full rights-request tabletop covering access, deletion, correction, opt-out, appeal, and consent withdrawal. Completed May 3, 2026 with fictional data.
