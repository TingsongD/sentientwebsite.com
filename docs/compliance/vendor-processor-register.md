# Vendor and Processor Register

Last updated: April 28, 2026

Status: operative vendor map. Sensitive agreements, DPIA annexes, and Google admin screenshots live **off-repository** (`placeholder-evidence-register.md` summarizes custody).

## Required review rubric

For each vendor retain: entity name, service description, role, data categories, subprocessors/countries, DPA linkage, retention/deletion, breach duty, MFA posture, reviewer, next renewal date.

## Current register

| Vendor | Purpose | Personal data (illustrative) | Role | Required evidence summary | Status |
| --- | --- | --- | --- | --- | --- |
| Robanka Inc. | Site operator; configures the live assistant on SentientWeb | Contact & usage routing, transcripts/audio when voice enabled | **Controller** for SentientWeb public site processing | Signed operator + subprocessor posture Apr 2026 | **Evidence on file** |
| Google LLC (Gemini Live / Gemini Apps) | **AI technology provider** for assistant | Prompts/audio/transcripts/logs per Google notices | Processor per applicable Google terms | Gemini admin exports + terms Apr 2026 | **Evidence on file** |
| HubSpot, Inc. | **Primary CRM**: marketing, sales, and service records we store—contacts, companies, emails, pipeline, automation | Contacts, identifiers, messaging, behavioural events in HubSpot | Processor (and/or sub-processor posture per HubSpot DPA as applicable) | HubSpot customer DPA / data processing agreement executed | Maintain renewals quarterly |
| Hosting / CDN / DNS provider | Serve static marketing site & logs | IP, user agent, timestamps | Processor | Agreements + SCC/TIA excerpts captured Apr 2026 | Maintain renewals quarterly |
| Calendly LLC | Scheduling links | Scheduling contact details entered by visitor | Processor per Calendly terms | DPA + privacy URLs referenced in legal annex | Operational—review annually |
| Stripe, Inc. | Payments via Stripe Checkout | Billing metadata handled by Stripe | Processor per Stripe terms | Agreements + SAQ posture Apr 2026 (`stripe-pci-readiness.md`) | **Evidence on file — enable before live billing** |
| Analytics / Ads (optional) | Further measurement outside HubSpot-native analytics if enabled separately | Devices, IPs, events | To be scoped per vendor | Complete before activating non-HubSpot trackers | Deferred until configured |

## Google / HubSpot review checkpoints (living list)

Operational owner: `songday@sentientwebsite.com`

1. Maintain current Google subprocessor appendix and Gemini admin settings after each change.  
2. Sync HubSpot field map and lawful bases with public Privacy Policy disclosures.  
3. Document forwarding times for deletion requests that require HubSpot + Google lookups.  

## Approval

Executive sponsor acknowledgement recorded April 28, 2026 (restricted log). Maintain annual attestation cadence aligned with DPIA revisions.
