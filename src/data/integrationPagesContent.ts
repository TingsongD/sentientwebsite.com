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
    eyebrow: 'Orchestration layer / HubSpot',
    title: 'Call HubSpot when a recovered demo is ready for sales.',
    deck:
      'SentientWeb sits above HubSpot, decides when a buyer is sales-ready, then uses HubSpot to create or update the record with the context sales needs.',
    body: [
      'HubSpot is one execution surface in the revenue stack. The goal is not another dashboard; the goal is to make recovered intent visible where the revenue team already works.',
      'Every recovered revenue moment should arrive with the page path, use case, role, timeline, summary, and recommended next action. HubSpot Free and Starter can work when the needed contact, company, note, and meeting fields are available; Professional and Enterprise unlock deeper workflow options.',
    ],
    bullets: [
      'Works with HubSpot Free, Starter, Professional, and Enterprise after a field check.',
      'Create or update contacts and companies.',
      'Attach conversation and page-intent summaries.',
      'Sync booked-demo context for sales preparation.',
    ],
  },
  salesforce: {
    slug: 'salesforce',
    navLabel: 'Salesforce',
    eyebrow: 'Orchestration layer / Salesforce',
    title: 'Call Salesforce when the sales handoff is clear.',
    deck:
      'SentientWeb acts one layer above Salesforce: qualify the buyer moment first, then use Salesforce when the handoff rules say sales should act.',
    body: [
      'Many revenue teams keep marketing activity in one system but run the sales floor in Salesforce. SentientWeb should not create context that reps ignore because it lands in the wrong system.',
      'During setup, SentientWeb maps the required Salesforce outcome first: lead or contact update, company or account context, campaign/source attribution, qualification answers, booking details, and the sales opener your RevOps team expects.',
    ],
    bullets: [
      'Salesforce field mapping is reviewed before launch.',
      'Fallback paths can use HubSpot handoff, CSV, or webhook while deeper sync is scoped.',
      'Salesforce context should be credible enough for reps to act on.',
    ],
  },
  pipedrive: {
    slug: 'pipedrive',
    navLabel: 'Pipedrive',
    eyebrow: 'Orchestration layer / Pipedrive',
    title: 'Call Pipedrive without forcing a CRM migration.',
    deck:
      'SentientWeb can keep Pipedrive as the execution surface while the orchestration layer decides what context should reach sales and when.',
    body: [
      'Pipedrive teams are often lean and do not have RevOps capacity for a heavy implementation. SentientWeb should recover revenue moments without forcing a CRM migration.',
      'The setup conversation defines where a qualified booked demo should land, what fields sales needs, and what fallback is acceptable if a native sync is not the right first step.',
    ],
    bullets: [
      'Confirm Pipedrive handoff requirements before installing.',
      'Use webhook or structured export paths when a lightweight route is better.',
      'Keep the work measured by sales-accepted outcomes, not integration theater.',
    ],
  },
  'api-webhooks': {
    slug: 'api-webhooks',
    navLabel: 'API & Webhooks',
    eyebrow: 'Orchestration layer / API and webhooks',
    title: 'Call a webhook when the workflow needs a custom handoff.',
    deck:
      'SentientWeb can use API and webhook routes as execution surfaces after it decides the visitor, account, or payment moment needs a custom action.',
    body: [
      'Not every subscription business has the same CRM, scheduler, billing system, or messaging stack. If the business has real revenue intent, the first question is which execution surface should receive the action.',
      'The fit check defines whether a CRM, billing system, scheduler, shared inbox, lifecycle platform, or webhook should receive the context, and which business outcome should be recovered first.',
    ],
    bullets: [
      'Clarify the revenue moment, traffic source, and execution surface before launch.',
      'Scope webhook payloads around use case, role, stack, page path, subscription state, and action status.',
      'Show teams which stack prerequisites unlock the strongest recovery loop.',
    ],
  },
  calendly: {
    slug: 'calendly',
    navLabel: 'Calendly',
    eyebrow: 'Orchestration layer / Calendly',
    title: 'Call your scheduler when the visitor is qualified.',
    deck:
      'SentientWeb sits above the calendar, qualifies the visitor first, then opens the right scheduler, router, or workflow when the meeting is worth protecting.',
    body: [
      'The buying logic is the same whether the team uses Calendly, Chili Piper, a custom scheduler, or a routed workflow: qualify first, then open the right meeting path.',
      'Setup defines whether the handoff should go to a scheduler link, router, territory-specific URL, account owner, or custom workflow. The value is the qualification step before the calendar opens and the revenue context after the meeting is booked.',
    ],
    bullets: [
      'Show the booking path after qualification.',
      'Preserve use case, role, timeline, and page history.',
      'Route to the right scheduler, router, or custom booking link based on the agreed rules.',
    ],
  },
  wordpress: {
    slug: 'wordpress',
    navLabel: 'WordPress',
    eyebrow: 'Orchestration layer / WordPress',
    title: 'Put the orchestration layer above your WordPress site.',
    deck:
      'Add the install script to pricing, demo, comparison, billing, account, support, and integration pages so SentientWeb can recover revenue intent on the URLs you already rank for.',
    body: [
      'WordPress powers many subscription-business websites and landing pages. SentientWeb fits that reality: add one script tag or a small mu-plugin, then guide high-intent visitors and customers toward the right next step.',
      'Keep editorial workflows in the CMS. SentientWeb reads from the approved sources you connect, pairs with existing forms and plugins, and moves qualified context into the right revenue workflow.',
    ],
    bullets: [
      'Install via theme footer, hooks, or a reputable header/footer script plugin.',
      'Works with caching and CDNs when loaded deferred like analytics.',
      'Use page-level rules to focus on pricing, demo, checkout, billing, comparison, integration, and security pages.',
    ],
  },
  webflow: {
    slug: 'webflow',
    navLabel: 'Webflow',
    eyebrow: 'Orchestration layer / Webflow',
    title: 'Put the orchestration layer above your Webflow site.',
    deck:
      'Paste the embed in Project Settings custom code, or add it to specific high-intent revenue recovery pages without a rebuild.',
    body: [
      'Webflow teams move fast on layout and content; SentientWeb matches that pace. Add the install script site-wide before the closing body tag, or scope it to pricing, demo, checkout, account, comparison, and integration pages.',
      'Styling stays on brand because your Webflow classes and interactions remain untouched while SentientWeb handles qualification, approved answers, and the path to the next revenue action.',
    ],
    bullets: [
      'Global or per-page embeds from custom code settings.',
      'Compatible with Webflow hosting and exported static stacks.',
      'Intent prompts can still fire on published URLs as high-intent visitors and customers return.',
    ],
  },
  shopify: {
    slug: 'shopify',
    navLabel: 'Shopify',
    eyebrow: 'Orchestration layer / Shopify',
    title: 'Use Shopify pages as orchestration surfaces.',
    deck:
      'SentientWeb can sit above Shopify as an orchestration surface for purchase, subscription, cancellation, and support recovery moments.',
    body: [
      'Commerce recovery uses the same orchestration principle: detect the revenue moment, choose the next action, and call the right tool in the stack.',
      'Shopify pages can support purchase recovery, subscription recovery, product-fit questions, account support, or sales-led requests when the workflow is scoped correctly.',
    ],
    bullets: [
      'Recover checkout, subscription, cancellation, and product-fit moments.',
      'Use Shopify together with CRM, billing, support, messaging, and webhook actions.',
      'Route each moment to the system that can complete the outcome.',
    ],
  },
  wix: {
    slug: 'wix',
    navLabel: 'Wix',
    eyebrow: 'Orchestration layer / Wix',
    title: 'Put SentientWeb above Wix with a custom embed.',
    deck:
      'Use Wix custom code or Velo for subscription-business pages where the goal is revenue recovery.',
    body: [
      'Marketing teams on Wix can still recover high-intent visitors and customers from important pages. SentientWeb captures intent, routes next steps, and uses approved content instead of improvising policy.',
      'Place the script site-wide for parity with other platforms, or limit it to key pages such as pricing, demo, checkout, account, stack-fit, and contact.',
    ],
    bullets: [
      'Custom code in Tracking & Analytics or page-level embeds.',
      'Velo-friendly if you gate load by consent or locale.',
      'Use the same orchestration model across CRM, scheduler, billing, messaging, and webhook tools.',
    ],
  },
  custom: {
    slug: 'custom',
    navLabel: 'Custom',
    eyebrow: 'Orchestration layer / Custom',
    title: 'Any stack can become an orchestration surface.',
    deck:
      'If it serves HTML or SPA shells, you can install SentientWeb on high-intent pages with one origin, one install key, and deterministic rules.',
    body: [
      'Custom stacks are common for subscription businesses. Drop the loader on the document shell, behind your feature flag or consent banner, and route production versus staging with separate keys.',
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
