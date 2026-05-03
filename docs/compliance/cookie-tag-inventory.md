# Cookie and Tag Inventory

Last updated: May 3, 2026

Status: operative inventory describing **currently wired** behaviours. Owner confirmation on May 3, 2026 states that live production cookie, analytics, advertising, scheduling, payment, and assistant tags match this inventory. Expand rows before enabling analytics/advertising pixels, embedded widgets, payment scripts beyond outbound links, or additional assistant tooling.

## Current known browser storage

| Name / key | Provider | Category | Purpose | Default state | Consent required | Retention / expiry | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sentientweb:privacy-consent:v1` | SentientWeb frontend | Necessary / preference | Stores privacy choices, assistant consent, analytics consent, age confirmation, and `updatedAt` in browser local storage | Created after user chooses | Necessary for remembering choices | Until user clears local storage or updates choices | Implemented in `src/components/ConsentManager.tsx` |
| `script[data-sentient-widget-loader]` | SentientWeb / Google AI (Gemini) via Robanka ops | Live assistant | Loads Gemini Live companion script after consent (`/agent.js` on configured origin) | Not loaded before consent | Yes plus age confirmation | Google/Robanka-configured Gemini settings | `src/loadSentientWidget.ts`; Apr 2026 evidence |
| Scheduling links | Calendly | Scheduling | Visitor follows outbound links to hosted booking (`calendly.com`) | Loads only after user engages link | Depends on jurisdiction; currently link-out | Vendor defaults | Hosted pages subject to Calendly notice |
| HubSpot-hosted forms / tracking (when embedded) | HubSpot | CRM / marketing automation | Persist contacts & engagements we store for business operations | Depends on deployment + consent banners | Honour GPC for optional buckets per policy | Contacts, behavioural events HubSpot captures | HubSpot portal retention | Preference centre / HubSpot bases | Vendor DPA on file |
| Future standalone analytics pixels | *(not deployed)* | Analytics | Optional measurement outside HubSpot-centric flows | Disabled | Counsel/consent gated | Vendor-specific once enabled | Populate before activating tags |
| Future advertising pixels | *(not deployed)* | Advertising | Optional ads/retargeting | Disabled | Counsel/consent + DNS/GPC posture | Vendor-specific once enabled | Populate before activating pixels |
| Future Stripe Checkout | Stripe | Payments | Hosted checkout when payments go live | Not embedded on marketing SPA today | Mandatory payment-step notice | Stripe defaults | See `stripe-pci-readiness.md` |

## Production inventory table

| Tool | Provider | Primary domain(s) | Category | Loads before consent? | GPC honored? | Data collected | Retention (summary) | Opt-out / withdrawal | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SentientWeb consent store | SentientWeb | First-party (`sentientwebsite.com`) | Necessary / preference | After user chooses | Forces analytics off when GPC asserted | Choices + timestamps | Browser controlled | Footer Privacy choices | `ConsentManager.tsx` |
| Robanka ops / Gemini Live assistant | Robanka configures; **Google** supplies AI technology | Widget origin (`VITE_SENTIENT_WIDGET_ORIGIN`) + Google environments | Live assistant | No | N/A assistant UX | Prompts/context/audio per disclosures | Google's Gemini/Gemini Live retention consoles | Withdraw assistant consent / `/data-request` | `placeholder-evidence-register.md` |
| HubSpot CRM & lifecycle marketing | HubSpot | `hubspot.com`, `hs-scripts.com`, `hubapi.com` (non-exhaustive) | CRM / marketing automation | Depends on embed + consent posture | Honour GPC for optional analytics buckets | Contacts, engagements, attribution | HubSpot account settings | HubSpot lawful bases / unsubscribe | Vendor DPA |
| Scheduling | Calendly | `https://calendly.com` (+ Calendly CDNs during booking) | Scheduling | External navigation | Optional analytics honoured when onsite tags ship | Visitor-supplied scheduling data | Calendly terms | Booking privacy settings / vendor request | Visitor follows links |
| Additional ad/analytics stacks | Undeployed | n/a | Add before launch | Planned off until configured | Required when deployed | Fields defined per vendor | Deferred | Footer + `/do-not-sell` flows | Deferred |
| Stripe Checkout | Stripe | `https://checkout.stripe.com` | Payments | At payment initiation | Necessary for completing payment | Stripe fraud + payment metadata per Stripe notices | Stripe policy | Stripe portal + privacy requests | `stripe-pci-readiness.md` |

## Tag approval checklist

Before adding SDKs/iframes/pixels/scripts:

1. Identify category (necessary, assistant, analytics, advertising, scheduling, payments).
2. Confirm prior consent/Global Privacy Control handling.
3. Update `/privacy`, `/cookies`, `/do-not-sell`, and consent UX as needed.
4. Log vendor DPAs/evidence rows in `vendor-processor-register.md`.
5. Add Playwright regressions where loading order changes materially.

## Review cadence

- Before enabling assistants beyond current configuration  
- Before adding analytics/advertising or embedded scheduling  
- Before accepting Stripe payments publicly  
- After privacy-law or browser-signal shifts  
- Quarterly while multiple marketing tags operate  

## Launch reminder

Marketing pages must mirror this inventory whenever new tags execute in-browser. Gate 2 is closed for the current tag set; reopen it before adding new in-browser analytics, advertising, scheduling, payment, or assistant scripts.
