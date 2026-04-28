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
    eyebrow: 'Integrations / WordPress',
    title: 'Run SentientWeb on WordPress without rebuilding your site.',
    deck:
      'Add the install script to your theme or header plugin so instant access paths can recover demand on the URLs you already rank for.',
    body: [
      'WordPress powers a huge share of marketing sites and landing pages. SentientWeb fits that reality: add one script tag or a small mu-plugin, then guide visitors from high-intent pages toward the right next step.',
      'Keep editorial workflows in the CMS. SentientWeb reads from the approved sources you connect, pairs with existing forms and CRM plugins, and helps replace static contact dead ends with revenue recovery paths.',
    ],
    bullets: [
      'Install via theme footer, hooks, or a reputable header/footer script plugin.',
      'Works with caching and CDNs when loaded deferred like analytics.',
      'Use page-level rules to exclude wp-admin and checkout if needed.',
    ],
  },
  webflow: {
    slug: 'webflow',
    navLabel: 'Webflow',
    eyebrow: 'Integrations / Webflow',
    title: 'Ship SentientWeb on Webflow sites in minutes.',
    deck:
      'Paste the embed in Project Settings custom code, or add it to specific high-intent pages without a rebuild.',
    body: [
      'Webflow teams move fast on layout and content; SentientWeb matches that pace. Add the install script site-wide before the closing body tag, or scope it to pricing, services, and request pages.',
      'Styling stays on brand because your Webflow classes and interactions remain untouched while SentientWeb handles instant access paths from approved knowledge sources.',
    ],
    bullets: [
      'Global or per-page embeds from custom code settings.',
      'Compatible with Webflow hosting and exported static stacks.',
      'Intent prompts can still fire on published URLs as visitors return.',
    ],
  },
  shopify: {
    slug: 'shopify',
    navLabel: 'Shopify',
    eyebrow: 'Integrations / Shopify',
    title: 'Recover hesitant shoppers on Shopify storefronts.',
    deck:
      'Add the install script to your theme layout or product education pages so cart and product-match leaks can be addressed in real time.',
    body: [
      'Whether you run a DTC brand with editorial depth or a B2B catalog that routes larger requests to sales, the same SentientWeb recovery system applies: guided next steps, calendar-ready handoff, and answers grounded in approved content.',
      'Theme app extensions and Online Store 2.0 sections can host the script cleanly; your theme developer keeps control over load order and exclusion rules such as cart and account pages.',
    ],
    bullets: [
      'Theme-level injection for store-wide coverage.',
      'Tune prompts on product, sizing, shipping, and pricing templates.',
      'CRM handoff complements Shopify customer records where you connect it.',
    ],
  },
  wix: {
    slug: 'wix',
    navLabel: 'Wix',
    eyebrow: 'Integrations / Wix',
    title: 'Add SentientWeb to Wix sites via custom embed.',
    deck:
      'Use Wix custom code or Velo when you need finer control, with no need to leave the ecosystem you already publish in.',
    body: [
      'Marketing teams on Wix can still offer credible instant access paths. SentientWeb captures visitor intent, routes next steps, and cites approved content instead of improvising policy.',
      'Place the script site-wide for parity with other platforms, or limit it to key pages such as Services, Pricing, and Contact.',
    ],
    bullets: [
      'Custom code in Tracking & Analytics or page-level embeds.',
      'Velo-friendly if you gate load by consent or locale.',
      'Same calendar and CRM story as the rest of the product.',
    ],
  },
  custom: {
    slug: 'custom',
    navLabel: 'Custom',
    eyebrow: 'Integrations / Custom stack',
    title: 'Any stack: Next.js, Rails, static HTML, or internal portals.',
    deck:
      'If it serves HTML or SPA shells, you can install SentientWeb with one origin, one install key, and deterministic rules.',
    body: [
      'Custom stacks are the default for many teams. Drop the loader on the document shell, behind your feature flag or consent banner, and route production versus staging with separate keys.',
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
  { label: 'WordPress', slug: 'wordpress' },
  { label: 'Webflow', slug: 'webflow' },
  { label: 'Shopify', slug: 'shopify' },
  { label: 'Wix', slug: 'wix' },
  { label: 'Custom', slug: 'custom' },
]
