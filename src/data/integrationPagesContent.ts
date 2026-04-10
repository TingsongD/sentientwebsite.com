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
  wordpress: {
    slug: 'wordpress',
    navLabel: 'WordPress',
    eyebrow: 'Integrations · WordPress',
    title: 'Run SentientWeb on WordPress without rebuilding your site.',
    deck:
      'Drop the agent snippet into your theme or a header plugin—qualification, booking, and knowledge-grounded answers go live on the same URLs you already rank for.',
    body: [
      'WordPress powers a huge share of marketing sites and landing pages. SentientWeb is platform-agnostic by design: one script tag (or a tiny mu-plugin if you prefer server-side injection) surfaces the autonomous agent on every template—classic themes, block themes, and headless front-ends that still ship HTML from WP.',
      'Keep editorial workflows in the CMS; the agent reads from the knowledge sources you connect in SentientWeb, not from random page scrapes you did not approve. Pair it with your existing forms and CRM plugins as you phase out static “contact us” dead ends.',
    ],
    bullets: [
      'Install via theme footer, hooks, or a reputable header/footer script plugin.',
      'Works with caching and CDNs—load the widget deferred like analytics.',
      'Use page-level rules to exclude wp-admin and checkout if needed.',
    ],
  },
  webflow: {
    slug: 'webflow',
    navLabel: 'Webflow',
    eyebrow: 'Integrations · Webflow',
    title: 'Ship the agent on Webflow sites in minutes.',
    deck:
      'Paste the embed in Project Settings → Custom Code, or drop it on specific pages—Designer-friendly, no rebuild required.',
    body: [
      'Webflow teams move fast on layout and content; SentientWeb matches that pace. Add the install snippet to site-wide before </body> for consistent behavior across CMS-driven pages, or scope it to high-intent templates such as pricing and demo request routes.',
      'Styling stays on-brand because the agent renders in its own layer—your classes and interactions in Webflow remain untouched while the agent handles qualification, Calendly booking, and Q&A from your approved knowledge base.',
    ],
    bullets: [
      'Global or per-page embeds from Custom Code settings.',
      'Compatible with Webflow hosting and exported static stacks.',
      'Behavioral triggers still fire on published URLs as visitors return.',
    ],
  },
  shopify: {
    slug: 'shopify',
    navLabel: 'Shopify',
    eyebrow: 'Integrations · Shopify',
    title: 'Engage shoppers and B2B buyers on Shopify storefronts.',
    deck:
      'Add the snippet to your theme’s layout or checkout-adjacent landing pages—ideal for hybrid commerce + content sites that still need demos and qualification.',
    body: [
      'Whether you run a DTC brand with a heavy editorial blog or a B2B catalog that routes enterprise deals to sales, the same SentientWeb engine applies: structured questions, calendar booking, and answers grounded in docs you control.',
      'Theme app extensions and Online Store 2.0 sections can host the script cleanly; your theme developer keeps full control over load order and exclusion rules (e.g., cart and account).',
    ],
    bullets: [
      'Theme-level injection for store-wide presence.',
      'Tune triggers on product and pricing templates for high intent.',
      'CRM handoff complements Shopify customer records where you connect it.',
    ],
  },
  wix: {
    slug: 'wix',
    navLabel: 'Wix',
    eyebrow: 'Integrations · Wix',
    title: 'Add SentientWeb to Wix sites via custom embed.',
    deck:
      'Use Wix Custom Code or Velo when you need finer control—no need to leave the ecosystem you already publish in.',
    body: [
      'Marketing teams on Wix can still offer an enterprise-grade conversational layer: the agent qualifies visitors, books meetings, and cites approved content instead of hallucinating policy.',
      'Place the snippet site-wide for parity with other platforms, or limit it to key pages such as Services, Pricing, and Contact.',
    ],
    bullets: [
      'Custom Code in Tracking & Analytics or page-level embeds.',
      'Velo-friendly if you gate load by consent or locale.',
      'Same Calendly and CRM story as the rest of the product.',
    ],
  },
  custom: {
    slug: 'custom',
    navLabel: 'Custom',
    eyebrow: 'Integrations · Custom stack',
    title: 'Any stack—Next.js, Rails, static HTML, or internal portals.',
    deck:
      'If it serves HTML or SPA shells, you can install SentientWeb: one origin, one install key, deterministic rules.',
    body: [
      'Custom stacks are the default for many of our customers. Drop the loader on the document shell, behind your feature flag or consent banner, and route production vs staging with separate keys.',
      'For SPAs, mount after hydration or lazy-load on intent so core Web Vitals stay healthy. Server components and edge workers can inject the tag once per layout—same agent, your deployment pipeline.',
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
  { label: 'WordPress', slug: 'wordpress' },
  { label: 'Webflow', slug: 'webflow' },
  { label: 'Shopify', slug: 'shopify' },
  { label: 'Wix', slug: 'wix' },
  { label: 'Custom', slug: 'custom' },
]
