# SentientWeb Frontend Marketing Positioning Handoff

Last updated: May 4, 2026

Target codebase: `FrontendV5.1`

## Purpose

This document is an engineer-ready handoff for updating the SentientWeb marketing website from broad "digital plumbers for revenue leaks" positioning to the narrower B2B SaaS wedge:

> Recover demo-ready visitors before they leave.

The website should stop presenting SentientWeb as a broad, multi-vertical revenue recovery system and instead present it as a focused B2B SaaS demo recovery product for teams using HubSpot and Calendly.

The site may signal a future service-business path, but it must not present two equal product lines yet. The direction is:

> Sell one, signal two.

Primary product now:

> Demo-Ready Visitor Recovery for B2B SaaS.

Emerging path only:

> Appointment-Ready Visitor Recovery for service businesses.

## Non-Negotiable Engineer Constraints

These constraints override any older implementation notes in this document if there is a conflict.

The frontend engineer may only:

- swap copy
- add necessary new homepage sections
- add necessary new pages
- add tests for the copy, sections, and pages they touch

The frontend engineer must never:

- delete pages
- hide pages
- remove routes
- remove pages from the sitemap
- remove existing nav/footer links solely to hide a page
- delete existing helper code only because the positioning changed
- redirect existing pages to another page unless the owner explicitly approves after review

The owner will decide which pages to delete, hide, redirect, or retire after reviewing the updated website.

Design constraint:

- Keep using the existing website UI system: fonts, black/neon color theme, visual tone, spacing rhythm, glass surfaces, and current responsive style.
- Do not introduce a new typeface, color palette, component aesthetic, landing-page template, or unrelated design system.
- New sections should feel native to the current SentientWeb site, not like a separate SaaS template.

## Final Positioning To Implement

### Primary Homepage H1

> Recover demo-ready visitors before they leave.

### Homepage Subhead

> SentientWeb detects high-intent visitors on pricing, demo, comparison, and integration pages, qualifies them, books the meeting, and syncs the full context into HubSpot.

### Category

Strategic umbrella:

> High-Intent Visitor Recovery

Use this as the broad system concept when both paths need to be explained. Do not make it the homepage H1.

Homepage/product label:

> Visitor-to-Demo Engine for B2B SaaS

Primary wedge:

> Demo-Ready Visitor Recovery for B2B SaaS

Emerging path:

> Appointment-Ready Visitor Recovery for service businesses

Use the service-business path only as a lower-page emerging path. Do not replace the B2B SaaS homepage hero with it, do not make it an equal product line, and do not put it in pricing as a mature offer yet.

Avoid as main category:

- `Inbound Qualify`
- `Revenue Recovery`
- `Inbound Qualify + Revenue Recovery`
- `AI SDR`
- `AI chatbot`

### Primary ICP

Target:

- B2B SaaS companies
- $1M-$20M ARR
- sales-led or sales-assisted motion
- HubSpot as CRM or marketing system
- Calendly or simple booking flow
- high-intent pages such as pricing, demo, comparison, integration, security, docs, and customer story pages
- founder, VP Sales, Head of Growth, Demand Gen, or RevOps buyer

### Core Outcome

> More qualified booked demos from website visitors who were already showing buying intent.

### Secondary Brand Line

Use lower on the page only:

> We are digital plumbers for your revenue leaks, but the first leak we fix is demo intent.

Do not use "We are digital plumbers for your revenue leaks" as the H1.

## Current Codebase Audit

### App Structure

The app is React 19, Vite, TypeScript, React Router, Tailwind-like utility CSS, and SSR/prerendered static routes.

Important files:

| Area | File |
| --- | --- |
| Routes | `FrontendV5.1/src/App.tsx` |
| Route constants | `FrontendV5.1/src/appRoutePatterns.ts` |
| SEO/meta/JSON-LD | `FrontendV5.1/src/routeMetadata.ts` |
| Global constants | `FrontendV5.1/src/constants.ts` |
| Header/nav | `FrontendV5.1/src/components/MarketingHeader.tsx` |
| Footer/nav | `FrontendV5.1/src/components/SiteFooter.tsx` |
| Home page | `FrontendV5.1/src/pages/HomePage.tsx` |
| Feature grid copy | `FrontendV5.1/src/data/homeFeatures.ts` |
| Solution pages | `FrontendV5.1/src/data/solutionPagesContent.ts` |
| Integration pages | `FrontendV5.1/src/data/integrationPagesContent.ts` |
| Pricing copy/calculator | `FrontendV5.1/src/data/pricingStrategy.ts` and `FrontendV5.1/src/pages/PricingPage.tsx` |
| Blog copy | `FrontendV5.1/src/data/blogPosts.ts` |
| ROI calculator | `FrontendV5.1/src/pages/RevenueLeakCalculatorPage.tsx` and `FrontendV5.1/src/data/revenueLeakCalculator.ts` |
| E2E tests | `FrontendV5.1/tests/e2e/production.spec.ts` |
| Unit tests | `FrontendV5.1/src/routeMetadata.test.ts`, `FrontendV5.1/src/pricingStrategy.test.ts`, `FrontendV5.1/src/revenueLeakCalculator.test.ts` |

### Main Problem

The current site says many things at once:

- "digital plumbers for your revenue leaks"
- broad "revenue recovery"
- ten vertical playbooks
- ecommerce/cart recovery
- Shopify
- healthcare/legal/financial services
- phone/SMS booking path
- Google/Outlook calendar integration
- "20 revenue recovery channels"

That conflicts with the new strategy. The current backend supports the B2B SaaS demo recovery wedge best: website widget, behavior events, qualification, Calendly booking, and HubSpot sync. The marketing site should stop claiming more than that.

## Claims To Replace Or Deprioritize

Replace or de-emphasize in copy on primary marketing pages:

| Claim | Why |
| --- | --- |
| "We are digital plumbers for your revenue leaks" as H1 | Memorable but too broad and not concrete enough. |
| "24/7 auto revenue recovery" | Sounds generic and unsupported. |
| "chasing past lost leads" | Sounds like outbound automation rather than live demo recovery. |
| "Ten vertical playbooks" | Dilutes the B2B SaaS wedge. |
| "Runs up to 20 revenue recovery channels 24/7" | Unsupported and too broad. |
| Shopify/cart recovery | Shopify is roadmap, not current core wedge. |
| SMS/phone booking path | Not aligned with current shipped product claims. |
| Google/Outlook calendar integration | Do not claim native calendar support unless implemented. |
| broad healthcare/legal/financial positioning | Regulated verticals create trust/compliance drag before proof. |
| "pay only for recovered revenue" | Hard to measure for B2B SaaS and not the recommended pricing model. |

Allowed secondary language:

- "demo pipeline"
- "demo-ready visitors"
- "high-intent pages"
- "qualified booked demos"
- "HubSpot context"
- "Calendly booking"
- "approved content"
- "human handoff"
- "30-day pilot"

## Consolidated Feature Bundle To Enable

The website should present one coherent product system, not a grab bag of AI features.

Marketing architecture:

| Layer | Public Label | Use |
| --- | --- | --- |
| Umbrella | `High-Intent Visitor Recovery` | Strategic umbrella for explaining both paths. Do not use as the H1. |
| Main product/category | `Visitor-to-Demo Engine for B2B SaaS` | Hero eyebrow, metadata, nav, pricing, solution page. |
| Primary wedge | `Demo-Ready Visitor Recovery for B2B SaaS` | Subheads, feature explanations, reporting language, pilot offer. |
| Emerging path | `Appointment-Ready Visitor Recovery for service businesses` | Lower homepage card only. Not an equal product line yet. |
| Feature bundle label | `Demo Recovery Engine` | Optional section label for the module bundle only. Do not use as the main category. |
| Brand analogy | `We are digital plumbers for your revenue leaks` | Support section only, immediately narrowed to demo pipeline leakage. |

Do not fold the architecture under `Inbound Qualify + Revenue Recovery`. That phrase is too generic and makes SentientWeb sound like every AI SDR, chatbot, CRM, and local lead platform.

### Startup Pressure-Test Decision

The product focus decision is:

> Offer one primary product now and signal one emerging path.

| Area | One Primary Path | Two Equal Services |
| --- | ---: | ---: |
| Buyer clarity | 5/5 | 2/5 |
| Differentiation | 4/5 | 2/5 |
| Website conversion | 4/5 | 3/5 |
| Sales focus | 5/5 | 2/5 |
| Speed to proof | 5/5 | 3/5 |
| Long-term expansion | 3/5 | 4/5 |

Core assumption:

> The fastest path to revenue is proving SentientWeb can create qualified booked demos for one narrow ICP before expanding the same recovery logic to appointments.

Fatal flaws to avoid:

| Risk | Severity | Why It Matters | Fast Test |
| --- | --- | --- | --- |
| Two equal offers dilute trust | High | Buyers think SentientWeb is unfocused. | Show 10 SaaS founders both versions and ask what they think SentientWeb does. |
| `Revenue recovery` is too broad | High | It competes with Warmly, Podium, HubSpot, HighLevel, Drift, and CRMs at once. | Run outbound with `revenue recovery` vs. `recover demo-ready visitors`. |
| Service businesses need different GTM | Medium | Local service buyers care about calls, booking, reviews, SMS, and missed calls. | Try 20 service-business audits separately. |

MVP focus:

- Build: B2B SaaS demo recovery only.
- Cut: equal service-business positioning and broad revenue recovery language.
- Two-week test: 30 SaaS pricing-page audits, 10 SentientWeb.com Instant Demo Previews, and 3 pilot closes.

### Core Demo Recovery Modules

Add or update a homepage/product section that consolidates the core enabled modules:

| Module | Website Copy Meaning | Frontend Scope |
| --- | --- | --- |
| Demo-Ready Detection | Detect high-intent behavior on pricing, demo, comparison, integration, security, docs, and customer story pages. | Copy and cards only. |
| Page-Specific Recovery Playbooks | Handle the exact hesitation that belongs to the page the visitor is on. | Copy and cards only. Avoid making "concierge" the main category. |
| Qualified Demo Booking | Ask fit, role, use case, timeline, and stack questions before opening the booking path. | Copy and cards only. |
| HubSpot Context Sync | Send contact, company, page behavior, qualification answers, and conversation summary into HubSpot. | Copy and cards only. |
| Recovered Demo Reporting | Report demo-ready visitors detected, qualified visitors, booked demos, and HubSpot-visible context. | Copy and cards only. |

Recommended section title:

> The Demo Recovery Engine inside SentientWeb.

Recommended section subhead:

> Five focused modules turn demo-ready website intent into qualified booked meetings and HubSpot-ready context.

### Instant Demo Preview Acquisition Feature

Status in `FrontendV5.1`: implemented on the homepage as a copy/UI section after the demo-pipeline problem framing and before the SaaS solution section.

This is a SentientWeb.com-only prospect acquisition feature for SentientWeb's own buyers. It is not a customer product module, not part of the customer-facing `Visitor-to-Demo Engine`, and not something SentientWeb customers should be promised they can deploy for their own prospects. Keep it prominent on the SentientWeb homepage, but do not list it as a customer solution capability.

Primary positioning:

> See how SentientWeb would recover demo-ready visitors from your pricing page.

What the feature promises:

1. Prospect enters a public URL on SentientWeb.com.
2. SentientWeb analyzes a small set of public pages.
3. SentientWeb generates and hosts a narrow demo-ready visitor recovery preview.
4. Prospect claims the preview with a business email.
5. CTA pushes to a booked setup call.

Frontend scope:

- Maintain section copy, CTA copy, and placeholder UI states.
- Keep the section scoped to SentientWeb's own website acquisition funnel.
- Do not add this as a customer-facing solution page, product module, pricing entitlement, or tenant feature.
- If a backend endpoint already exists, wire the form to the provided endpoint only after backend handoff.
- Do not implement crawling, scraping, scoring, hosting, claim verification, email validation, abuse controls, or HubSpot write logic in the frontend.
- Do not fake a generated preview if the backend is not ready. Use "Request a preview" or "Book a 30-day pilot" as the fallback CTA.

Current homepage implementation:

- section id: `instant-demo-preview`
- eyebrow: `Instant Demo Preview`
- H2: `See how SentientWeb would recover demo-ready visitors from your pricing page.`
- field label: `Company website or pricing page URL`
- CTA: `Request a preview`
- current CTA destination: `BOOK_DEMO_URL`
- safety copy: public pages only, private pages/internal hosts/large crawls blocked by preview controls
- funnel copy: `URL submitted -> preview generated -> business-email claim -> booked call -> pilot`

Backend-owned requirements for SentientWeb's own acquisition flow that the frontend may reference but must not build:

- public URL crawl limited to 5-8 pages
- public-page-only validation
- blocked private hosts, localhost, internal IPs, large sites, and spam domains
- rate limits and abuse controls
- business email claim step
- domain ownership rules before embed access
- hosted preview generation
- SentientWeb-owned HubSpot and Calendly follow-up tracking
- funnel events: URL submitted -> preview generated -> claimed with business email -> booked call -> pilot

Do not market this as:

> Create your instant demo in 60 seconds.

Use instead:

> See how SentientWeb would recover demo-ready visitors from your pricing page.

### AI Voice Feedback Add-On

Add a later-page or roadmap-style section for AI voice interviews. This should be positioned as an add-on to demo recovery, not a new customer-survey vertical.

Positioning:

> AI voice interviews for lost demo, churn, and buying-objection feedback.

Recommended section title:

> When buyers do not book, learn why.

Recommended section body:

> SentientWeb can follow up with conversational AI voice interviews that capture why a buyer did not book, did not show, stalled after the demo, or started showing churn risk. The output becomes sales, growth, and customer-success feedback instead of another shallow survey score.

Strong use cases:

| Use Case | Buyer | Why It Works |
| --- | --- | --- |
| Lost-demo feedback | VP Sales / RevOps | Finds why a prospect did not book or did not show. |
| Post-demo objection capture | Sales / Growth | Captures what blocked the deal after the call. |
| Churn-risk interview | Customer Success | Asks why usage dropped or renewal is at risk. |
| NPS follow-up by voice | CX / Product | Replaces a shallow 1-10 survey with conversational why. |
| Website exit interview | Growth | Asks what stopped visitors leaving pricing or demo pages. |

Frontend scope:

- Add copy and use-case cards only.
- Do not claim Gemini Live, voice model support, calling, SMS, outbound calling, recording, transcription, consent capture, CRM writeback, or survey automation unless the backend owner confirms the exact shipped capability and compliance wording.
- Keep this below the core Visitor-to-Demo Engine for B2B SaaS story so it does not dilute the B2B SaaS wedge.

## Recommended Site Architecture

### Add Now As Homepage Sections

- Instant Demo Preview is already implemented on the homepage as SentientWeb's own acquisition flow; keep it prominent and iterate only when SentientWeb-owned backend contracts are ready.
- Lower-page `Two recovery paths` section with B2B SaaS as the primary/default path and Appointment-Ready Visitor Recovery as the emerging service-business path. This must not look like two equal services.
- Core Demo Recovery Modules
- AI Voice Feedback Add-On

### Keep Existing Pages And Routes

Do not delete, hide, redirect, or remove existing pages from nav/footer/sitemap as part of this handoff. The owner will review the copy-first update and personally decide what to retire later.

The engineer can update copy on existing pages and add new pages if needed, but existing routes should remain reachable.

### Candidate Pages To Add Later

- `/instant-demo` for SentientWeb.com acquisition only
- `/demo-recovery-calculator`
- `/compare/warmly`
- `/compare/drift`
- `/compare/chili-piper`

### Owner-Review Items, Not Engineer Tasks

These may be reviewed by the owner later, but the engineer should not perform them in this pass:

- removing non-SaaS solution links
- hiding Shopify integration pages
- hiding or removing the ROI calculator
- redirecting retired solution pages
- removing pages from the sitemap
- deleting helper code or route records

### Future Redirect Ideas For Owner Review Only

If the owner later decides to retire non-SaaS pages, these are possible destinations. Do not implement these redirects without explicit owner approval.

Recommended:

| Old Route | Destination |
| --- | --- |
| `/solutions/home-services` | `/solutions/saas` or `/#solutions` |
| `/solutions/insurance` | `/solutions/saas` or `/#solutions` |
| `/solutions/ecommerce` | `/solutions/saas` or `/#solutions` |
| `/solutions/healthcare` | `/solutions/saas` or `/#solutions` |
| `/solutions/edtech` | `/solutions/saas` or `/#solutions` |
| `/solutions/hospitality` | `/solutions/saas` or `/#solutions` |
| `/solutions/real-estate` | `/solutions/saas` or `/#solutions` |
| `/solutions/legal` | `/solutions/saas` or `/#solutions` |
| `/solutions/financial-services` | `/solutions/saas` or `/#solutions` |

Do not change sitemap behavior until the owner has reviewed and approved page retirement.

## File-By-File Engineering Instructions

## 1. `FrontendV5.1/src/pages/HomePage.tsx`

### Current Issues

Current important old copy:

- line 405: `SentientWeb revenue recovery`
- line 408: `24/7 auto revenue recovery. One click starts chasing past lost leads.`
- line 414: `We are digital plumbers for your revenue leaks.`
- line 420: `AI-guided next steps that capture revenue opportunities...`
- line 506: `Ten vertical playbooks...`
- line 560: `Runs up to 20 revenue recovery channels 24/7.`
- line 607: `Revenue recovery system powered by Predictive Intent analysis`

### Replace Hero Copy

Use:

```tsx
<p>Visitor-to-Demo Engine for B2B SaaS</p>

<p>
  For HubSpot and Calendly teams losing high-intent website visitors before they book.
</p>

<h1>Recover demo-ready visitors before they leave.</h1>

<p>
  SentientWeb detects high-intent visitors on pricing, demo, comparison, and integration pages,
  qualifies them, books the meeting, and syncs the full context into HubSpot.
</p>
```

### Replace Hero CTAs

If `/instant-demo` is not built yet:

```tsx
Primary: Book a 30-day pilot -> BOOK_DEMO_URL
Secondary: See how demo recovery works -> #features
```

If `/instant-demo` is built as a SentientWeb.com acquisition route:

```tsx
Primary: See your demo recovery preview -> /instant-demo
Secondary: Book a 30-day pilot -> BOOK_DEMO_URL
```

Do not use:

- Start recovery
- Get instant access
- Start now

These are vague.

### Add Feature Enablement Sections

Homepage feature-section status:

- `Instant Demo Preview` is already implemented after the hero/problem story as a SentientWeb.com-only acquisition section.
- `Two recovery paths` should be added as a lower homepage section with two cards, not a first-load pop-up and not two equal product lines.
- `Core Demo Recovery Modules` and `AI Voice Feedback Add-On` still need to be added as dedicated sections if not present in the latest branch.

Section requirements:

0. `Two recovery paths`
   - Do not use a first-load modal or forced pop-up.
   - Add a native lower homepage section with two cards.
   - Card 1 must be the primary/default path: `Demo-Ready Visitor Recovery for B2B SaaS`.
   - Card 2 must be clearly secondary: `Appointment-Ready Visitor Recovery for service businesses`.
   - Keep B2B SaaS visually first and materially more prominent.
   - Label the service-business card `emerging path`, `early access`, or similar.
   - Do not price or describe the service-business card like a mature product line.
   - Do not let service-business copy take over the hero, metadata, pricing, or main product category.

1. `Core Demo Recovery Modules`
   - Use the module cards from "Demo Recovery Module Bundle" in the copy bank.
   - Label the section as the `Demo Recovery Engine inside SentientWeb`.
   - Keep `Visitor-to-Demo Engine for B2B SaaS` as the product/category label.

2. `Instant Demo Preview`
   - Maintain the current URL-input UI and `Request a preview` CTA on SentientWeb.com.
   - Treat this as SentientWeb's own lead-generation flow, not a feature customers enable on their websites.
   - Do not include it in customer solution modules, customer pricing entitlements, or tenant-facing product capability lists.
   - Current CTA points to `BOOK_DEMO_URL`.
   - If backend endpoint details are later provided, wire the form only to the agreed backend contract.
   - Do not build crawler, hosted preview generation, claim verification, abuse controls, or HubSpot tracking in frontend code.

3. `AI Voice Feedback Add-On`
   - Add use-case cards for lost-demo feedback, post-demo objection capture, churn-risk interview, NPS follow-up by voice, and website exit interview.
   - Keep this section below the core demo recovery story.
   - Do not imply voice calling, Gemini Live, transcription, recording, or CRM writeback is live unless the backend owner confirms the exact shipped capability.

### Replace Decorative "Leak sealed" Text

Current:

> Leak sealed

Use:

> Demo booked

Do not remove the handwritten overlay. If it visually fights the H1, swap only the copy and flag the design concern for owner review.

### Replace Phase 1 Product Intro

Current section is mostly a large visual headline:

> Revenue Leaks: The Black Hole Sucking Your Profits Dry

Replace with a concrete problem section:

Headline:

> Your demo-ready buyers are already on the site.

Subhead:

> They compare pricing, check integrations, read security pages, and hesitate before filling out a form. SentientWeb catches that moment and routes it to a qualified booked demo.

Suggested bullets:

- Pricing-page visitors hesitate over plan fit and ROI.
- Comparison-page visitors need a clear answer before they bounce.
- Integration-page visitors want to know whether the stack works.
- Security-page visitors need trust context before they book.
- Demo-page visitors need fast qualification, not a long form.

### Replace Solutions Section

Current section renders `SOLUTION_NAV_LIST` and says "Ten vertical playbooks."

For this positioning, add a focused B2B SaaS section. Do not delete or hide existing solution pages or routes.

Replace with either:

Option A, one focused solution card:

```text
Solution
B2B SaaS demo recovery
Recover high-intent visitors from pricing, demo, comparison, integration, security, and customer story pages.
```

Option B, high-intent page grid:

| Card | Copy |
| --- | --- |
| Pricing pages | Handle plan-fit, ROI, budget, and timing hesitation. |
| Demo pages | Qualify the visitor and open the right Calendly path. |
| Comparison pages | Answer competitive objections from approved content. |
| Integration pages | Confirm stack fit for HubSpot, Calendly, Salesforce, or customer tools. |
| Security pages | Route trust questions and sync requirements to sales. |
| Customer story pages | Match proof to the visitor's use case. |

Recommendation: add Option B on homepage and keep `/solutions/saas` as the dedicated SaaS solution page. Leave all existing pages reachable until the owner decides otherwise.

### Replace CTA Video Section

Current:

> Runs up to 20 revenue recovery channels 24/7.

Use:

> One focused recovery loop: detect, qualify, book, sync.

Supporting line:

> SentientWeb turns high-intent website behavior into qualified booked demos with HubSpot context attached.

CTA:

> Book a 30-day pilot

### Replace Feature Example Event

Current:

```text
Leak signal: high intent
Intent: high
> Visitor hesitated on pricing...
> Approved-source next step delivered
> Human support path prepared
```

Use:

```text
Demo-ready score: 95
Pages viewed: /pricing, /integrations/hubspot, /security
> Visitor asked about HubSpot sync
> Qualified on use case, company domain, role, and timing
> Calendly opened with sales context synced to HubSpot
```

### Reframe Leak Clock

The `LEAK_CLOCK_ESTIMATES` and `SolutionLeakClock` section should not be the core homepage experience anymore. It reinforces broad industry leakage and many verticals.

Recommended implementation:

- Do not delete `LEAK_CLOCK_ESTIMATES`, `SolutionLeakClock`, or `LeakClockMethodology`.
- If the section remains visible, swap surrounding copy so it is clearly secondary to the Visitor-to-Demo Engine.
- If the engineer believes it should be hidden or removed, flag it for owner review instead of making the change.
- If removing many imports, run TypeScript and lint to catch unused symbols.

## 2. `FrontendV5.1/src/data/homeFeatures.ts`

### Current Issue

The current feature grid is broad:

- Revenue leak detection
- Instant access paths
- Approved-source responses
- Zero-miss coverage
- Secure handoff
- Vertical playbooks

Replace with the new five or six feature blocks.

### Recommended `FEATURES`

```ts
export const FEATURES = [
  {
    title: 'Demo-ready detection',
    bullets: [
      'Scores visitors on pricing, demo, comparison, integration, security, and docs pages.',
      'Separates casual traffic from buyers showing real sales intent.',
      'Triggers the concierge only when the page behavior warrants it.',
    ],
  },
  {
    title: 'Page-specific concierge',
    bullets: [
      'Pricing pages get ROI and plan-fit guidance.',
      'Comparison pages get approved differentiation.',
      'Integration pages get stack-fit questions and next steps.',
    ],
  },
  {
    title: 'Qualified demo booking',
    bullets: [
      'Collects company domain, use case, role, and timeline before opening the calendar.',
      'Books only visitors who meet the agreed qualification rules.',
      'Keeps sales calendars clear of low-fit meetings.',
    ],
  },
  {
    title: 'HubSpot context sync',
    bullets: [
      'Creates or updates the contact and company record.',
      'Adds pages viewed, transcript summary, qualification answers, and booking context.',
      'Gives sales the opener before the call starts.',
    ],
  },
  {
    title: 'Recovered demo reporting',
    bullets: [
      'Tracks demo-ready visitors detected, qualified, booked, and sales-accepted.',
      'Shows which pages create the most recovered demo opportunities.',
      'Keeps the pilot measured around qualified booked demos, not chat volume.',
    ],
  },
  {
    title: 'Human handoff',
    bullets: [
      'Lets a human join or follow up when the buyer needs a person.',
      'Routes complex or sensitive questions out of automation.',
      'Preserves the full context for the handoff.',
    ],
  },
] as const
```

Important: if these titles change, `featureSectionId` will produce new anchors. Update nav/test expectations if they reference old anchors.

## 3. `FrontendV5.1/src/data/solutionPagesContent.ts`

### Current Issue

This file currently powers ten vertical solution pages. The homepage and footer render them from `SOLUTION_NAV_LIST`.

Current B2B SaaS page is the closest fit, but still says:

- "We fix the leaks in your demo pipeline"
- "Replace your request form"
- "calendar-ready pipeline"
- broad "revenue opportunities"

### Recommended Scope

For the positioning PR, emphasize B2B SaaS in copy and any new sections.

Implementation options:

1. Allowed: update the SaaS page copy and add B2B SaaS-focused homepage sections.
2. Allowed: add new B2B SaaS comparison or instant-demo pages.
3. Not allowed in this pass: removing non-SaaS entries from `SOLUTION_PAGES`, hiding routes, redirecting routes, noindexing pages, or removing nav/footer links solely to hide a page.

Recommendation: keep all current pages live and reachable. The owner will review and decide which pages to retire later.

### Replacement `saas` Copy

Use:

```ts
saas: {
  slug: 'saas',
  navLabel: 'B2B SaaS',
  marketLabel: 'HubSpot + Calendly B2B SaaS teams',
  accentColor: '#6366f1',
  metaTitle: 'Visitor-to-Demo Engine for B2B SaaS',
  metaDescription:
    'Recover demo-ready visitors from pricing, demo, comparison, and integration pages. SentientWeb qualifies, books, and syncs the context into HubSpot.',
  plumberMetaphor: 'Digital plumbing for your demo pipeline.',
  hero: {
    eyebrow: 'Solutions / B2B SaaS',
    title: 'Recover demo-ready visitors before they leave',
    subtitle:
      'SentientWeb detects high-intent website visitors, guides the right page-specific conversation, qualifies the buyer, books the meeting, and syncs the full context into HubSpot.',
    primaryCta: 'Book a 30-day pilot',
    secondaryCta: 'See the recovery flow',
  },
  proofStat:
    'The highest-intent visitors are often already on pricing, demo, comparison, integration, and security pages.',
  features: [
    {
      title: 'Detect demo-ready behavior',
      body: 'Score visits to pricing, demo, comparison, integration, security, docs, and customer story pages so the team can focus on real buying intent.',
    },
    {
      title: 'Handle page-specific hesitation',
      body: 'Answer plan-fit, stack-fit, security, ROI, and competitive questions from approved source content before the visitor leaves.',
    },
    {
      title: 'Qualify before booking',
      body: 'Collect company domain, use case, role, timeline, and stack context before showing the booking path.',
    },
    {
      title: 'Sync the full story to HubSpot',
      body: 'Send page path, transcript summary, qualification answers, booking details, and suggested sales opener into HubSpot.',
    },
  ],
  steps: [
    {
      title: 'Visitor shows demo intent',
      body: 'They revisit pricing, compare alternatives, inspect integrations, or start the demo path.',
    },
    {
      title: 'Concierge qualifies the buyer',
      body: 'SentientWeb asks the minimum questions needed to confirm fit, use case, role, timing, and stack.',
    },
    {
      title: 'Qualified demo gets booked',
      body: 'The visitor books through Calendly and the full context lands in HubSpot for sales.',
    },
  ],
  caseStudy: {
    eyebrow: 'Demo recovery',
    title: 'Turn high-intent page visits into qualified booked demos.',
    body: 'The first pilot should be judged on qualified booked demos, sales-accepted context, and whether HubSpot shows incremental opportunity from existing website traffic.',
  },
  disclosure:
    'SentientWeb uses approved customer content for answers and routes sensitive or complex questions to humans.',
  bottomCta: 'Book a 30-day pilot',
}
```

### Redirects

If removing non-SaaS solution pages, update `LEGACY_SOLUTION_REDIRECTS` and `DYNAMIC_FALLBACK_REDIRECTS` to avoid broken links.

The tests currently expect `SOLUTION_NAV_LIST` length 10. Update that test.

## 4. `FrontendV5.1/src/data/integrationPagesContent.ts`

### Current Issue

Current integrations include Shopify and broad platform install language. Shopify is not the first wedge and should not be in primary marketing.

### Recommended Integrations

Primary:

- HubSpot
- Calendly
- WordPress
- Webflow
- Custom

Optional:

- Wix, if the install story is actually supported and tested

Owner-review item, not an engineer task:

- Shopify can be de-emphasized in copy if needed, but do not hide or remove the page/link without owner approval.

### Implementation Notes

Current file only models website install platforms. To include HubSpot and Calendly, add integration records for:

```ts
hubspot: {
  slug: 'hubspot',
  navLabel: 'HubSpot',
  eyebrow: 'Integrations / HubSpot',
  title: 'Sync every recovered demo with the context sales needs.',
  deck:
    'SentientWeb sends contacts, companies, conversation summaries, page context, qualification answers, and booked-meeting details into HubSpot.',
  body: [
    'HubSpot is the first CRM wedge. The goal is not another dashboard; the goal is to make recovered demo intent visible where the revenue team already works.',
    'Every qualified booked demo should arrive with the page path, use case, role, timeline, transcript summary, and recommended sales opener.',
  ],
  bullets: [
    'Create or update contacts and companies.',
    'Attach conversation and page-intent summaries.',
    'Sync booked-demo context for sales follow-up.',
  ],
}
```

```ts
calendly: {
  slug: 'calendly',
  navLabel: 'Calendly',
  eyebrow: 'Integrations / Calendly',
  title: 'Open the calendar only after the visitor is qualified.',
  deck:
    'SentientWeb qualifies demo-ready visitors first, then routes them to the agreed Calendly booking path.',
  body: [
    'Calendly keeps the v1 scheduling surface simple. SentientWeb should not claim deep scheduling, territory routing, or Google/Outlook-native logic unless those are implemented.',
    'The value is the qualification step before the calendar opens and the HubSpot context after the meeting is booked.',
  ],
  bullets: [
    'Show the booking path after qualification.',
    'Preserve use case, role, timeline, and page history.',
    'Use fallback booking links until deeper routing is implemented.',
  ],
}
```

Update `INTEGRATION_NAV_LINKS` to:

```ts
[
  { label: 'HubSpot', slug: 'hubspot' },
  { label: 'Calendly', slug: 'calendly' },
  { label: 'WordPress', slug: 'wordpress' },
  { label: 'Webflow', slug: 'webflow' },
  { label: 'Custom', slug: 'custom' },
]
```

If no logo exists for Calendly, either add a first-party simple text logo asset or render text-only integration chips on the homepage.

## 5. `FrontendV5.1/src/pages/HomePage.tsx` Integration Logos

### Current Issue

`INTEGRATION_LOGOS` includes Shopify at line 19. That creates a primary homepage claim.

Recommended list:

```ts
const INTEGRATION_LOGOS = [
  { name: 'HubSpot', logoUrl: '/logos/hubspot.svg' },
  { name: 'Calendly', logoUrl: '/logos/calendly.svg' },
  { name: 'WordPress', logoUrl: '/logos/wordpress.svg' },
  { name: 'Webflow', logoUrl: '/logos/webflow.svg' },
  { name: 'Custom sites', logoUrl: '/logos/custom.svg' },
] as const
```

If adding assets is too much for the first PR, replace the logo strip with text chips:

- HubSpot
- Calendly
- WordPress
- Webflow
- Custom script install

Avoid OpenAI/Gemini/Claude logos as primary proof. They make the buyer think the product is about models, not demo recovery.

## 6. `FrontendV5.1/src/data/pricingStrategy.ts`

### Current Issue

The pricing model is product/service recovery:

- `$500/month base`
- `20% of recovered revenue`
- product track
- service track
- cart abandonment
- SMS/phone
- Google/Outlook calendar

This conflicts with B2B SaaS demo recovery.

### Recommended Pricing Model

Replace product/service tracks with demo recovery pricing.

Recommended public pricing:

| Plan | Public Copy |
| --- | --- |
| 30-Day Pilot | First 10 customers: no setup fee with case-study rights. Pay $100-$150 per qualified booked demo, or $500 minimum after the first qualified booking. |
| Starter | $999/month includes 5 qualified booked demos, then $100 per additional qualified booked demo. |
| Growth | $1,500/month includes 15 qualified booked demos, then $75 per additional qualified booked demo. |
| Scale | $3,000/month includes 40 qualified booked demos, then custom success fee. |
| Annual | $12k-$18k/year after a successful pilot, with pilot credit applied. |

### Define A Qualified Booked Demo

Put this definition on the pricing page:

> A qualified booked demo means the visitor provided a business email or company domain, matched the agreed ICP, shared a relevant use case, gave role or buying involvement, and booked through the approved calendar path.

### Replace `PricingTrack`

Current type:

```ts
export type PricingTrack = 'product' | 'service'
```

Recommended:

```ts
export type PricingPlan = 'pilot' | 'starter' | 'growth' | 'scale'
```

or keep UI simpler:

```ts
export type PricingTrack = 'pilot' | 'subscription'
```

Do not keep product/service language.

### Calculator

The current pricing calculator estimates ecommerce/product revenue and service bookings. Either:

1. leave it reachable and swap surrounding copy to avoid overclaiming, or
2. add a new demo recovery calculator section/page.

Do not remove or hide the existing calculator route. The owner will decide later whether to retire it.

Recommended v1 demo recovery calculator inputs:

- monthly high-intent page visitors
- current demo conversion rate
- target recovered demo rate
- average contract value
- demo-to-opportunity conversion rate

Suggested labels:

```text
Monthly high-intent page visitors
Current demo conversion rate
Recovered demo lift
Average contract value
Demo-to-opportunity rate
```

Suggested outputs:

```text
Estimated recovered demos
Estimated qualified booked demos
Estimated pipeline influenced
Estimated SentientWeb fee
```

Important: show "modeled estimate only" and do not promise revenue.

## 7. `FrontendV5.1/src/pages/PricingPage.tsx`

### Current Issues

Current H1:

> Fix first. Then pay. Like a plumber.

Current pricing body:

> $500/month keeps us on call...

Current FAQ and calculator are broad revenue recovery.

### Recommended Pricing Page H1

> Pricing built around qualified booked demos.

Subhead:

> Start with a 30-day pilot. If SentientWeb does not create qualified booked demos from your high-intent pages, the pilot tells us quickly.

Trust pills:

- 30-day pilot
- Qualified booked demos
- HubSpot proof
- Case-study discount

### Recommended FAQ

Replace FAQ items with:

| Question | Answer |
| --- | --- |
| What counts as a qualified booked demo? | A visitor must provide business email or domain, match the agreed ICP, share a relevant use case, indicate role or buying involvement, and book through the approved calendar path. |
| Do you charge for chat volume? | No. The pilot should be measured around qualified booked demos and HubSpot-visible context, not message count. |
| What happens if traffic is too low? | We will say so during setup. The wedge works best when pricing, demo, comparison, or integration pages already get meaningful traffic. |
| Can this work with Calendly? | Yes. The v1 booking path should use Calendly unless a customer requires deeper routing later. |
| Does this replace Chili Piper, Drift, or Qualified? | No. It is a focused demo recovery layer for teams that want a lighter HubSpot-first path before buying a broader platform. |
| Do you identify anonymous people? | The v1 promise is behavior-based demo intent and self-identified qualification. Do not lead with person-level identification. |

## 8. `FrontendV5.1/src/constants.ts`

Update:

```ts
export const DEFAULT_META_TITLE =
  'SentientWeb | Recover Demo-Ready Visitors Before They Leave'

export const DEFAULT_META_DESCRIPTION =
  'SentientWeb detects high-intent visitors on pricing, demo, comparison, and integration pages, qualifies them, books the meeting, and syncs the full context into HubSpot.'
```

## 9. `FrontendV5.1/index.html`

Update static fallback metadata:

Current:

- keywords include `revenue recovery`, `digital plumbers`, `vertical landing pages`
- description says `fixes website revenue leaks`

Recommended:

```html
<meta
  name="description"
  content="SentientWeb recovers demo-ready B2B SaaS visitors from pricing, demo, comparison, and integration pages, then books qualified meetings and syncs context into HubSpot."
/>
```

Recommended keywords:

```text
SentientWeb, demo recovery, B2B SaaS, qualified booked demos, HubSpot, Calendly, pricing page conversion, demo page conversion
```

Also update OG/Twitter descriptions.

## 10. `FrontendV5.1/src/routeMetadata.ts`

### Static Meta

Update:

- `/` title and description via constants
- `/blog` description
- `/about` description
- `/trust` description if it says "sensitive revenue recovery paths"
- `/revenue-leak-calculator` title/description if route remains

### Structured Data

Update:

```ts
organizationSchema().description
websiteSchema().description
serviceType for solution pages
```

Recommended:

```ts
description:
  'SentientWeb recovers demo-ready B2B SaaS visitors, qualifies them, books meetings, and syncs context into HubSpot.'
```

For SaaS solution service type:

```ts
serviceType: 'B2B SaaS demo recovery'
```

## 11. `FrontendV5.1/src/components/MarketingHeader.tsx`

### Current Issue

Header builds Product, Solutions, Integrations from broad data and includes ROI calculator.

### Recommended Nav

Desktop:

- Product
  - Demo-Ready Detection
  - Page-Specific Concierge
  - Qualified Demo Booking
  - HubSpot Context Sync
  - Recovered Demo Reporting
- Solution
  - B2B SaaS
- Pricing
- Integrations
  - HubSpot
  - Calendly
  - WordPress
  - Webflow
  - Custom

Do not remove from primary nav in this pass:

- ROI Calculator, unless the owner explicitly approves hiding it after review
- broad multi-vertical solution dropdown
- Shopify

Actions:

```text
Log in
Book pilot
See preview
```

If no SentientWeb.com `/instant-demo` acquisition route exists, make both pilot/preview actions point to Calendly or use one CTA only.

## 12. `FrontendV5.1/src/components/SiteFooter.tsx`

### Current Issue

Footer product links include "Instant access", generic docs, APIs, ROI calculator, and all solution verticals.

### Recommended Footer

Product:

- Visitor-to-Demo Engine -> `/#features`
- Pricing -> `/pricing`
- B2B SaaS -> `/solutions/saas`
- HubSpot integration -> `/integrations/hubspot`
- Calendly integration -> `/integrations/calendly`

Company:

- About
- Trust & Security
- Blog
- Legal notice

De-emphasize in copy only; do not remove links without owner approval:

- ROI Calculator until rebuilt
- Knowledge base / APIs / Documentation if they are ComingSoon pages
- broad Solutions column with 10 verticals

Keep legal/privacy links unchanged.

## 13. `FrontendV5.1/src/components/RoiCalculatorCta.tsx`

Current CTA:

> Calculate your ROI

This sends people to a broad `revenue-leak-calculator`.

Recommendation:

Do not remove or hide this component in this pass. Repurpose copy only, or add a new demo-recovery calculator page/section and leave the existing route reachable.

Repurposed copy:

```text
Estimate recovered demos
```

Route:

```text
/demo-recovery-calculator
```

Do not keep "Revenue Leak Calculator" in primary nav.

## 14. `FrontendV5.1/src/pages/RevenueLeakCalculatorPage.tsx`

### Current Issue

This page models top/mid/bottom funnel leakage including cart and checkout. It is no longer aligned with the B2B SaaS wedge.

Recommended options:

1. Keep the route and swap surrounding copy to reduce mismatch.
2. Add a new `DemoRecoveryCalculatorPage` while leaving the existing page reachable.
3. Flag redirect/removal as an owner-review decision.

Recommended first PR:

- Do not remove from primary nav/home CTA without owner approval.
- Keep route reachable.
- Add a follow-up ticket to rebuild.

Recommended second PR:

- Rename route to `/demo-recovery-calculator`.
- Update `APP_ROUTE_PATHS`, `STATIC_META`, e2e tests, sitemap, and links.

## 15. `FrontendV5.1/src/pages/AboutPage.tsx`

Replace broad about copy with narrower company narrative.

Recommended H1:

> We recover the demo intent hiding inside B2B SaaS websites.

Opening paragraph:

> SentientWeb exists because high-intent buyers often reach pricing, demo, comparison, integration, and security pages before sales ever sees them. Forms wait. Buyers hesitate. Context disappears. SentientWeb keeps that moment alive and turns it into a qualified booked demo.

Replace broad vertical paragraph with:

> We are starting with B2B SaaS teams using HubSpot and Calendly because the problem is measurable: demo-ready visitors detected, qualified conversations, booked meetings, HubSpot context, and sales-accepted opportunities.

Keep trust paragraph, but update to:

> Trust matters because these moments include business context, buying intent, and sometimes sensitive requirements. SentientWeb uses approved source content, keeps human handoff available, and publishes clear AI and retention notices.

## 16. `FrontendV5.1/src/pages/CareersPage.tsx`

Update company description:

Current:

> digital plumbing for website revenue leaks

Use:

> SentientWeb is building a demo recovery engine for B2B SaaS teams: detect demo-ready visitors, qualify them, book the meeting, and sync the full context into HubSpot.

Update role copy:

- "defined ICPs and verticals" -> "defined B2B SaaS ICP"
- "revenue leaks to instant access paths" -> "demo-page, pricing-page, and comparison-page intent to qualified booked demos"

## 17. `FrontendV5.1/src/data/blogPosts.ts`

Update the existing launch post or add a new post.

Recommended new post:

```ts
'demo-recovery-wedge': {
  slug: 'demo-recovery-wedge',
  title: 'Why we narrowed to demo-ready visitors',
  date: '2026-05-04',
  eyebrow: 'Positioning',
  excerpt:
    'SentientWeb is focusing on one measurable B2B SaaS problem: recovering demo-ready visitors from high-intent pages before they leave.',
  body: [
    'Broad revenue recovery created too many promises. Demo-ready visitor recovery gives us a sharper buyer, moment, surface, outcome, and proof metric.',
    'The first wedge is B2B SaaS teams using HubSpot and Calendly. We focus on pricing, demo, comparison, integration, security, and customer story pages because those pages reveal buying intent before a form submission does.',
    'The pilot metric is qualified booked demos with HubSpot-visible context. Not chat volume. Not vague engagement. Not generic automation.',
  ],
}
```

If adding this post, update tests that assume only the `phase-1-live-now` post or fixed route list.

## 18. Legal, Trust, Privacy, AI Disclosure Pages

Do not rewrite legal pages for positioning unless copy becomes inaccurate.

Keep:

- microphone disclosure
- AI disclosure
- consent text
- HubSpot/Google retention language
- privacy preference behavior
- legal route links

But remove unsupported marketing language from legal/terms only if it is promotional and outdated, for example:

- `website revenue recovery software` can become `website demo recovery software`
- future SMS language can remain if it is legally defensive, but do not use SMS as a public product claim

Before changing legal pages, verify with the existing compliance tests.

## Copy Bank For The Engineer

### Homepage Hero

Eyebrow:

> Visitor-to-Demo Engine for B2B SaaS

H1:

> Recover demo-ready visitors before they leave.

Subhead:

> SentientWeb detects high-intent visitors on pricing, demo, comparison, and integration pages, qualifies them, books the meeting, and syncs the full context into HubSpot.

Primary CTA:

> Book a 30-day pilot

Secondary CTA:

> See how it works

### Problem Section

H2:

> Demo-ready buyers leave before sales sees them.

Body:

> They compare pricing, check integrations, read security pages, and hesitate before filling out a form. By the time sales follows up, the context is gone or the buyer has moved on.

### Two Recovery Paths Section

Do not use a first-visit pop-up or modal. Add this as a normal lower homepage section after the initial problem framing. The section should signal expansion without making the service-business path look equal to the B2B SaaS offer.

Section eyebrow:

> Two recovery paths

H2:

> Start with demo-ready visitor recovery.

Subhead:

> SentientWeb's primary product is Demo-Ready Visitor Recovery for B2B SaaS. Appointment-Ready Visitor Recovery for service businesses is an emerging path using the same high-intent recovery logic.

Card 1, primary/default:

```text
B2B SaaS
Demo-Ready Visitor Recovery for B2B SaaS
Recover demo-ready visitors before they leave.
For HubSpot and Calendly teams turning pricing, demo, comparison, and integration-page intent into qualified booked meetings.
CTA: Explore B2B SaaS recovery -> /solutions/saas
```

Card 2, emerging:

```text
Service Businesses
Appointment-Ready Visitor Recovery for service businesses
Recover appointment-ready visitors before they leave.
For service businesses turning service, pricing, booking, and location-page intent into qualified appointments.
CTA: Preview service recovery -> BOOK_DEMO_URL
```

Implementation notes:

- B2B SaaS card appears first and should look like the primary path.
- Service-business card should be labeled `emerging path`, `early access`, or similar.
- Do not make the two cards visually equal. The service-business card should be visibly secondary.
- Do not add service-business pricing, a service-business product page, or service-business nav priority in this pass.
- Do not use `B2C Service` as the public headline; use `Appointment-Ready Visitor Recovery`.
- Do not use `Inbound Qualify + Revenue Recovery` as the umbrella or section title.
- Do not add a forced visitor-choice popup.
- Do not change the main homepage hero away from demo-ready visitor recovery.

### How It Works

H2:

> Detect. Qualify. Book. Sync.

Cards:

1. Detect demo-ready intent  
   Score high-intent behavior across pricing, demo, comparison, integration, security, and docs pages.

2. Guide the page-specific conversation  
   Answer the hesitation that belongs to that page using approved source content.

3. Qualify before the calendar opens  
   Confirm company domain, use case, role, timeline, and stack fit.

4. Book the qualified demo  
   Open the approved Calendly path when the visitor meets the agreed threshold.

5. Sync HubSpot context  
   Send the summary, pages viewed, qualification answers, and suggested sales opener to HubSpot.

### Reporting Section

H2:

> Prove recovered demos, not chat volume.

Body:

> SentientWeb reports demo-ready visitors detected, qualified conversations, booked demos, attended demos, sales-accepted meetings, and HubSpot-visible context.

### Demo Recovery Module Bundle

Section eyebrow:

> Inside the Visitor-to-Demo Engine

H2:

> The Demo Recovery Engine inside SentientWeb.

Subhead:

> Five focused modules turn demo-ready website intent into qualified booked meetings and HubSpot-ready context.

Cards:

1. Demo-Ready Detection  
   Detect high-intent behavior on pricing, demo, comparison, integration, security, docs, and customer story pages.

2. Page-Specific Recovery Playbooks  
   Handle pricing hesitation, integration questions, security concerns, and comparison-page objections with approved source content.

3. Qualified Demo Booking  
   Confirm company domain, role, use case, timeline, and stack fit before opening the booking path.

4. HubSpot Context Sync  
   Send contact, company, page behavior, qualification answers, and conversation summary into HubSpot.

5. Recovered Demo Reporting  
   Show demo-ready visitors detected, qualified visitors, booked demos, and sales-visible context.

### Instant Demo Preview Section

Scope note:

> This is for SentientWeb.com prospects only. It should not be marketed as a customer-deployable product feature.

Section eyebrow:

> Instant Demo Preview

H2:

> See how SentientWeb would recover demo-ready visitors from your pricing page.

Subhead:

> Enter a public URL and get a preview of the recovery path SentientWeb would create for high-intent visitors on your own site.

Form label:

> Company website or pricing page URL

Primary CTA:

> Request a preview

Future CTA after backend endpoint is ready:

> Generate preview

Current destination:

> `BOOK_DEMO_URL`

Claim step headline:

> Claim your recovery preview.

Claim step body:

> Use a business email so we can send the hosted preview, show the detected demo-intent moments, and walk through the setup path.

Safety/support copy:

> SentientWeb only analyzes public pages for the preview. Private pages, internal hosts, and large crawls are blocked by backend controls.

Do not add:

- "Create your instant demo in 60 seconds"
- SEO/backlink promises
- auto-publishing language
- embed access before business-email claim
- competitor-site spying language

### AI Voice Feedback Section

Section eyebrow:

> Voice feedback add-on

H2:

> When buyers do not book, learn why.

Subhead:

> AI voice interviews capture lost-demo, buying-objection, churn-risk, and NPS follow-up feedback so sales, growth, and customer-success teams can fix the real blocker.

Use-case cards:

1. Lost-demo feedback  
   Find why a prospect did not book or did not show.

2. Post-demo objection capture  
   Capture what blocked the deal after the call.

3. Churn-risk interview  
   Ask why usage dropped or renewal is at risk.

4. NPS follow-up by voice  
   Turn a shallow score into conversational product feedback.

5. Website exit interview  
   Ask what stopped visitors leaving pricing or demo pages.

Compliance-safe caveat:

> Voice workflows require confirmed consent, retention, and backend configuration before launch.

### Pricing Page

H1:

> Pricing built around qualified booked demos.

Subhead:

> Start with a 30-day pilot. Measure the work by qualified booked demos and HubSpot-visible context.

Qualified demo definition:

> A qualified booked demo means the visitor matched the agreed ICP, shared a relevant use case, provided business email or company domain, indicated role or buying involvement, and booked through the approved calendar path.

### About Page

H1:

> We recover the demo intent hiding inside B2B SaaS websites.

### Footer Tagline

> Demo recovery for HubSpot-powered B2B SaaS teams.

## Design Guidance

Keep the existing visual language. The engineer must preserve the current UI fonts, black/neon color theme, glass surfaces, visual tone, spacing rhythm, and responsive design patterns while making the content quieter and more operational.

Recommended changes:

- Reduce oversized metaphor copy.
- Keep the black/neon visual system.
- Avoid decorative "leak" language as primary messaging.
- Use denser B2B SaaS product sections instead of broad vertical cards.
- Do not create a landing-page style hero with vague hype. The first viewport must say exactly what the product does.
- Keep CTA labels specific.

Button labels should be clear commands:

- Book a 30-day pilot
- See how it works
- View pricing
- See HubSpot sync
- See qualified demo flow

Avoid:

- Start recovery
- Get instant access
- Start now

## Implementation Order

### PR 1: Positioning and Homepage

Files:

- `FrontendV5.1/src/pages/HomePage.tsx`
- `FrontendV5.1/src/data/homeFeatures.ts`
- `FrontendV5.1/src/components/MarketingHeader.tsx`
- `FrontendV5.1/src/components/SiteFooter.tsx`
- `FrontendV5.1/src/components/RoiCalculatorCta.tsx`

Tasks:

1. Replace hero copy.
2. Reframe leak clock and 10-vertical homepage copy without deleting pages/routes.
3. Replace feature grid.
4. Update nav and footer copy labels only; do not remove links.
5. Swap ROI calculator CTA copy if needed; do not hide the route.
6. Do not remove proof-strip logos in this pass; swap adjacent claims or flag unsupported logos for owner review.

### PR 2: Solution and Integration Data

Files:

- `FrontendV5.1/src/data/solutionPagesContent.ts`
- `FrontendV5.1/src/data/integrationPagesContent.ts`
- `FrontendV5.1/src/appRoutePatterns.ts`
- `FrontendV5.1/src/routeMetadata.ts`

Tasks:

1. Position B2B SaaS as the primary solution in copy.
2. Add HubSpot and Calendly integration pages.
3. Update Shopify integration copy only if needed; do not hide the page.
4. Do not update redirects for retired solution pages without owner approval.
5. Update route metadata copy, but do not remove pages from sitemap without owner approval.

### PR 3: Pricing

Files:

- `FrontendV5.1/src/data/pricingStrategy.ts`
- `FrontendV5.1/src/pages/PricingPage.tsx`
- `FrontendV5.1/src/pricingStrategy.test.ts`

Tasks:

1. Replace product/service tracks with demo recovery pricing.
2. Define qualified booked demo.
3. Replace unsupported SMS/phone/Google/Outlook claims in copy.
4. Reframe calculator copy or add a new calculator; do not remove the existing page.
5. Update pricing tests.

### PR 4: Meta, Blog, About, Careers, Tests

Files:

- `FrontendV5.1/src/constants.ts`
- `FrontendV5.1/index.html`
- `FrontendV5.1/src/routeMetadata.ts`
- `FrontendV5.1/src/pages/AboutPage.tsx`
- `FrontendV5.1/src/pages/CareersPage.tsx`
- `FrontendV5.1/src/data/blogPosts.ts`
- `FrontendV5.1/src/routeMetadata.test.ts`
- `FrontendV5.1/tests/e2e/production.spec.ts`

Tasks:

1. Update SEO defaults.
2. Update structured data.
3. Update about/careers copy.
4. Add or update blog post.
5. Update e2e copy expectations.
6. Update route metadata expectations.

## Test Updates Required

### `FrontendV5.1/tests/e2e/production.spec.ts`

Update:

- pricing JSON-LD name should expect `SentientWeb Pricing | Visitor-to-Demo Engine`
- prerendered route title cases should expect pilot/monthly demo recovery pricing titles
- pricing calculator copy should avoid ecommerce/service-track language
- homepage test should expect `Recover demo-ready visitors before they leave.`
- solution test should expect `Recover demo-ready visitors before they leave`
- visual asset test should keep the plumber analogy as lower-page support copy, not the H1
- homepage test should verify the new `Demo Recovery Engine inside SentientWeb` section renders
- homepage test should verify the lower `Two recovery paths` section renders with `Demo-Ready Visitor Recovery for B2B SaaS` and `Appointment-Ready Visitor Recovery for service businesses`
- homepage test should verify the service-business path is labeled as an emerging path and is not presented as an equal product line
- homepage test should verify no first-load modal is required to choose a path
- homepage test should verify the instant demo preview section uses `See how SentientWeb would recover demo-ready visitors from your pricing page.`
- homepage test should verify the AI voice feedback add-on section uses `When buyers do not book, learn why.`
- tests should not require frontend network calls for crawler, preview generation, voice interviews, or CRM writeback unless backend contracts are provided

New expected homepage heading:

```ts
page.getByRole('heading', {
  name: 'Recover demo-ready visitors before they leave.',
})
```

New SaaS solution heading:

```ts
page.getByRole('heading', {
  name: 'Recover demo-ready visitors before they leave',
})
```

Do not remove retired solution routes in this pass. If the owner later approves route retirement, update route metadata cases accordingly.

### `FrontendV5.1/src/routeMetadata.test.ts`

Update:

- expected pricing title
- expected solution title
- `SOLUTION_NAV_LIST` length
- `KNOWN_ROUTE_PATHS` expectations
- `LEGACY_ROUTE_REDIRECTS` expectations
- structured data serviceType

Current forbidden public terms list may need review. Keep forbidding:

- chatbot
- AI agent
- autonomous
- behavior analysis
- SMS
- phone
- Shopify if no longer shipped
- guaranteed
- SOC 2 if not proven
- HIPAA if not supported

Do not forbid all forms of "book" because the site must talk about booked demos. The current regex forbids `book a demo`, which is acceptable, but make sure it does not block "booked demos."

### `FrontendV5.1/src/pricingStrategy.test.ts`

Replace old product/service formula tests with demo recovery tests.

Example:

```ts
it('calculates demo recovery estimates', () => {
  const estimate = calculateDemoRecoveryEstimate({
    highIntentVisitors: 1000,
    currentDemoConversionRate: 2,
    recoveredDemoLiftRate: 1,
    averageContractValue: 12000,
    demoToOpportunityRate: 30,
  })

  expect(estimate.currentDemos).toBe(20)
  expect(estimate.recoveredDemos).toBe(10)
  expect(estimate.pipelineInfluenced).toBe(36000)
})
```

Adjust based on the final formula.

## QA Checklist

### Grep Checks

Run after implementation:

```bash
rg -n "digital plumbers|revenue leaks|20 revenue|Shopify|cart abandonment|SMS|Phone and SMS|Google and Outlook|Product Track|Service Track|Pay Only for Recovered Revenue" FrontendV5.1/src FrontendV5.1/index.html FrontendV5.1/tests
```

Expected:

- no primary marketing usage of those terms
- legal defensive SMS copy may remain in legal pages only
- old tests should not reference old H1

### Commands

From `FrontendV5.1`:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

If time is short:

```bash
npm run lint
npm test
npm run build
```

### Visual QA

Check at:

- 390 x 844 mobile
- 768 x 1024 tablet
- 1440 x 900 desktop
- 1920 x 1080 desktop

Important visual checks:

- H1 does not wrap awkwardly.
- CTA buttons do not overflow on mobile.
- Header dropdown labels remain usable; do not remove links to hide pages without owner approval.
- Footer copy prioritizes the new B2B SaaS story; do not remove links to hide pages without owner approval.
- Unsupported model/vendor logos are flagged for owner review rather than removed in this pass.
- Pricing page tables are readable on mobile.
- Legal footer remains accessible.

### SEO/SSR QA

Check:

- prerendered home title and meta description
- `/pricing` title and JSON-LD
- `/solutions/saas` title and JSON-LD
- sitemap still includes existing pages unless the owner explicitly approved page retirement
- canonical URLs still correct
- existing pages remain reachable unless the owner explicitly approved redirects or noindex behavior

## Acceptance Criteria

The update is done when:

1. The homepage H1 is exactly or nearly:
   > Recover demo-ready visitors before they leave.
2. The homepage subhead says the product detects, qualifies, books, and syncs context into HubSpot.
3. The site copy no longer presents 10 verticals as the primary product; existing nav/footer links remain unless the owner separately approves hiding pages.
4. Shopify, SMS/phone, cart recovery, healthcare, legal, financial services, and "20 channels" are not primary marketing claims.
5. Pricing is framed around qualified booked demos, not broad recovered revenue.
6. `/solutions/saas` is the primary solution page.
7. HubSpot and Calendly are first-class integration stories.
8. Tests are updated for the new positioning.
9. `npm run lint`, `npm test`, and `npm run build` pass.
10. The copy does not make unsupported compliance, identity, SMS, Shopify, or revenue-guarantee claims.
11. Homepage includes copy for the core Demo Recovery modules inside the Visitor-to-Demo Engine for B2B SaaS.
12. Homepage includes a normal lower-page `Two recovery paths` section, not a first-load modal.
13. The path cards use `Demo-Ready Visitor Recovery for B2B SaaS` as the primary path and `Appointment-Ready Visitor Recovery for service businesses` as the clearly labeled emerging path.
14. Homepage includes the implemented SentientWeb.com-only Instant Demo Preview section with URL-entry copy, `Request a preview` CTA to `BOOK_DEMO_URL`, and clear backend-owned functionality boundaries.
15. Homepage includes an AI Voice Feedback Add-On section positioned below the core demo recovery story.
16. Frontend code does not implement crawling, preview generation, claim verification, voice workflows, or CRM writeback unless backend contracts are explicitly provided.
17. Existing pages, routes, nav/footer links, and sitemap entries are not deleted, hidden, redirected, or noindexed by the engineer.
18. New and revised sections preserve the current SentientWeb UI fonts, black/neon color theme, glass styling, and responsive visual system.
19. The website does not use `Inbound Qualify`, `Revenue Recovery`, or `Inbound Qualify + Revenue Recovery` as the main product/category label.
20. The service-business path is visible but secondary; the site still sells B2B SaaS demo recovery as the primary product.

## Final Copy North Star

Every public page should make this obvious:

> SentientWeb helps B2B SaaS teams recover demo-ready visitors from high-intent website pages. It qualifies the buyer, books the meeting, and sends the full context to HubSpot.

The service-business path may be visible only as a secondary emerging path:

> Also exploring service businesses: Appointment-Ready Visitor Recovery.

If a section does not support the primary B2B SaaS sentence, swap its copy or add a better supporting section. Do not remove or hide pages; flag page-retirement recommendations for owner review.
