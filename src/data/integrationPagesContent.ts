export type IntegrationPageContent = {
  slug: string
  navLabel: string
  eyebrow: string
  title: string
  deck: string
  body: string[]
  bullets: string[]
}

export const INTEGRATION_PAGES = {
  hubspot: {
    slug: 'hubspot',
    navLabel: 'HubSpot',
    eyebrow: 'Integrations / HubSpot',
    title: 'Sync every recovered demo with the context sales needs.',
    deck:
      'SentientWeb sends contacts, companies, conversation summaries, page context, qualification answers, and booked-meeting details into HubSpot.',
    body: [
      'HubSpot is the first CRM wedge. The goal is not another dashboard; the goal is to make recovered demo intent visible where the revenue team already works.',
      'Every qualified booked demo should arrive with the page path, use case, role, timeline, summary, and recommended sales opener.',
    ],
    bullets: [
      'Create or update contacts and companies.',
      'Attach conversation and page-intent summaries.',
      'Sync booked-demo context for sales preparation.',
    ],
  },
  salesforce: {
    slug: 'salesforce',
    navLabel: 'Salesforce',
    eyebrow: 'Integrations / Salesforce',
    title: 'Confirm Salesforce fit before the pilot starts.',
    deck:
      'SentientWeb treats Salesforce fit as a launch gate for Salesforce-led teams, not an afterthought discovered after a pilot call.',
    body: [
      'Many sales-led SaaS teams keep marketing activity in HubSpot but run the sales floor in Salesforce. The pilot should not create context that reps ignore because it lands in the wrong system.',
      'During setup, SentientWeb maps the required Salesforce outcome first: lead or contact update, company or account context, campaign/source attribution, qualification answers, booking details, and the sales opener your RevOps team expects.',
    ],
    bullets: [
      'Salesforce field mapping is reviewed before launch.',
      'Fallback paths can use HubSpot handoff, CSV, or webhook while deeper sync is scoped.',
      'If Salesforce context cannot be made credible, the pilot should not start.',
    ],
  },
  pipedrive: {
    slug: 'pipedrive',
    navLabel: 'Pipedrive',
    eyebrow: 'Integrations / Pipedrive',
    title: 'Pipedrive teams should not have to migrate CRM to test demo recovery.',
    deck:
      'SentientWeb scopes Pipedrive or webhook handoff during the pilot fit check so smaller SaaS teams do not create manual sales work.',
    body: [
      'Pipedrive teams are often lean and do not have RevOps capacity for a heavy implementation. The pilot should prove recovered demos without forcing a CRM migration.',
      'The setup conversation defines where a qualified booked demo should land, what fields sales needs, and what fallback is acceptable if a native sync is not the right first step.',
    ],
    bullets: [
      'Confirm Pipedrive handoff requirements before installing.',
      'Use webhook or structured export paths when a lightweight route is better.',
      'Keep the pilot measured by sales-accepted demos, not integration theater.',
    ],
  },
  'api-webhooks': {
    slug: 'api-webhooks',
    navLabel: 'API & Webhooks',
    eyebrow: 'Integrations / API and webhooks',
    title: 'Custom CRM, no CRM, or early sales stack: define the handoff first.',
    deck:
      'SentientWeb can scope a webhook or lightweight handoff path before launch so founder-led teams know whether the prerequisites are in place.',
    body: [
      'Not every promising SaaS company has HubSpot, Salesforce, or a mature scheduler. If the website has real demo intent but the sales stack is still forming, the first question is operational fit.',
      'The pilot fit check defines whether Calendly, a CRM, a shared inbox, or a webhook should receive qualified demo context, and whether traffic volume is high enough to justify a pilot now.',
    ],
    bullets: [
      'Clarify minimum traffic and scheduler prerequisites before launch.',
      'Scope webhook payloads around use case, role, stack, page path, and booking status.',
      'Tell lean teams when they should fix prerequisites before buying SentientWeb.',
    ],
  },
  calendly: {
    slug: 'calendly',
    navLabel: 'Calendly',
    eyebrow: 'Integrations / Calendly',
    title: 'Open the calendar only after the visitor is qualified.',
    deck:
      'SentientWeb qualifies demo-ready visitors first, then routes them to the agreed Calendly booking path.',
    body: [
      'Calendly keeps the v1 scheduling surface simple. SentientWeb does not claim deep scheduling, territory routing, or Google/Outlook-native logic unless those are implemented.',
      'The value is the qualification step before the calendar opens and the HubSpot context after the meeting is booked.',
    ],
    bullets: [
      'Show the booking path after qualification.',
      'Preserve use case, role, timeline, and page history.',
      'Use fallback booking links until deeper routing is implemented.',
    ],
  },
  wordpress: {
    slug: 'wordpress',
    navLabel: 'WordPress',
    eyebrow: 'Integrations / WordPress',
    title: 'Run demo recovery on WordPress without rebuilding your site.',
    deck:
      'Add the install script to pricing, demo, comparison, and integration pages so SentientWeb can recover demo-ready intent on the URLs you already rank for.',
    body: [
      'WordPress powers many B2B SaaS marketing sites and landing pages. SentientWeb fits that reality: add one script tag or a small mu-plugin, then guide demo-ready visitors from high-intent pages toward the right next step.',
      'Keep editorial workflows in the CMS. SentientWeb reads from the approved sources you connect, pairs with existing forms and CRM plugins, and moves qualified demo context into the sales workflow.',
    ],
    bullets: [
      'Install via theme footer, hooks, or a reputable header/footer script plugin.',
      'Works with caching and CDNs when loaded deferred like analytics.',
      'Use page-level rules to focus on pricing, demo, comparison, integration, and security pages.',
    ],
  },
  webflow: {
    slug: 'webflow',
    navLabel: 'Webflow',
    eyebrow: 'Integrations / Webflow',
    title: 'Ship SentientWeb on Webflow sites in minutes.',
    deck:
      'Paste the embed in Project Settings custom code, or add it to specific high-intent demo recovery pages without a rebuild.',
    body: [
      'Webflow teams move fast on layout and content; SentientWeb matches that pace. Add the install script site-wide before the closing body tag, or scope it to pricing, demo, comparison, and integration pages.',
      'Styling stays on brand because your Webflow classes and interactions remain untouched while SentientWeb handles qualification, approved answers, and the path to a booked demo.',
    ],
    bullets: [
      'Global or per-page embeds from custom code settings.',
      'Compatible with Webflow hosting and exported static stacks.',
      'Intent prompts can still fire on published URLs as demo-ready visitors return.',
    ],
  },
  shopify: {
    slug: 'shopify',
    navLabel: 'Shopify',
    eyebrow: 'Integrations / Shopify',
    title: 'Shopify recovery is a later expansion path.',
    deck:
      'The current public wedge is B2B SaaS demo recovery. Shopify remains reachable for review while commerce recovery is evaluated separately.',
    body: [
      'Commerce recovery requires different proof, pricing, and implementation details than HubSpot and Calendly demo recovery. SentientWeb is not positioning Shopify as the first wedge on the marketing site.',
      'If a B2B catalog uses Shopify as a content surface for sales-led requests, the same high-intent recovery logic can be reviewed as a custom implementation.',
    ],
    bullets: [
      'Commerce-specific recovery remains separate from the B2B SaaS pilot offer.',
      'Custom review is required before claims about carts, checkout, or product matching.',
      'CRM-visible demo context remains the primary public integration story.',
    ],
  },
  wix: {
    slug: 'wix',
    navLabel: 'Wix',
    eyebrow: 'Integrations / Wix',
    title: 'Add SentientWeb to Wix sites via custom embed.',
    deck:
      'Use Wix custom code or Velo for SaaS marketing pages where the goal is qualified demo recovery.',
    body: [
      'Marketing teams on Wix can still recover demo-ready visitors from high-intent pages. SentientWeb captures visitor intent, routes next steps, and uses approved content instead of improvising policy.',
      'Place the script site-wide for parity with other platforms, or limit it to key pages such as pricing, demo, integrations, and contact.',
    ],
    bullets: [
      'Custom code in Tracking & Analytics or page-level embeds.',
      'Velo-friendly if you gate load by consent or locale.',
      'Same Calendly and HubSpot story as the rest of the B2B SaaS product.',
    ],
  },
  custom: {
    slug: 'custom',
    navLabel: 'Custom',
    eyebrow: 'Integrations / Custom stack',
    title: 'Any stack: Next.js, Rails, static HTML, or internal portals.',
    deck:
      'If it serves HTML or SPA shells, you can install SentientWeb on high-intent pages with one origin, one install key, and deterministic rules.',
    body: [
      'Custom stacks are the default for many B2B SaaS teams. Drop the loader on the document shell, behind your feature flag or consent banner, and route production versus staging with separate keys.',
      'For SPAs, mount after hydration or lazy-load on intent so Core Web Vitals stay healthy. Server components and edge workers can inject the tag once per layout while your deployment pipeline stays in control.',
    ],
    bullets: [
      'Framework-agnostic script tag; wrap with your design system if needed.',
      'Environment-specific keys for staging and production.',
      'Talk to us for CSP, nonce, and third-party cookie policies.',
    ],
  },
} as const satisfies Record<string, IntegrationPageContent>

export type IntegrationSlug = keyof typeof INTEGRATION_PAGES

export const INTEGRATION_NAV_LINKS: { label: string; slug: IntegrationSlug }[] = [
  { label: 'HubSpot', slug: 'hubspot' },
  { label: 'Salesforce', slug: 'salesforce' },
  { label: 'Pipedrive', slug: 'pipedrive' },
  { label: 'API & Webhooks', slug: 'api-webhooks' },
  { label: 'Calendly', slug: 'calendly' },
  { label: 'WordPress', slug: 'wordpress' },
  { label: 'Webflow', slug: 'webflow' },
  { label: 'Shopify', slug: 'shopify' },
  { label: 'Wix', slug: 'wix' },
  { label: 'Custom', slug: 'custom' },
]
