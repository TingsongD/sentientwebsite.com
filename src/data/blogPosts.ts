export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  eyebrow: string
  body: string[]
}

export const BLOG_POSTS = {
  'phase-1-live-now': {
    slug: 'phase-1-live-now',
    title: 'Phase 1 live now',
    date: '2026-04-10',
    eyebrow: 'Product · Launch',
    excerpt:
      'Demo-ready visitor recovery is live: approved-source responses, qualification, booking paths, and CRM-ready context for high-intent B2B SaaS pages.',
    body: [
      'Today we are calling Phase 1 live: the slice of SentientWeb that turns demo-ready website behavior into qualified booked demos without another brittle form wall. If you run a serious B2B SaaS site, you already know the gap: static copy and delayed response paths do not handle timeline, budget, stack fit, or security hesitation.',
      'Under the hood, Phase 1 combines structured intake, deterministic routing, Calendly booking paths, and approved-source retrieval over your knowledge base so responses stay grounded instead of generic. Pricing revisits, repeat sessions, and high-intent page depth help the system detect when visitors are closest to action.',
      'We are intentionally narrow in scope for this release. Richer content flywheels and distribution hooks remain on the roadmap; Phase 1 is about proving the core loop on your live site in days, not quarters. If you want to see demo recovery on your own pages, request a preview and we will walk through install, routing rules, and the playbook for the materials you want SentientWeb to use.',
    ],
  },
  'demo-recovery-wedge': {
    slug: 'demo-recovery-wedge',
    title: 'Why we narrowed to demo-ready visitors',
    date: '2026-05-04',
    eyebrow: 'Positioning',
    excerpt:
      'SentientWeb is focusing on one measurable B2B SaaS problem: recovering demo-ready visitors from high-intent pages before they disappear.',
    body: [
      'Broad revenue recovery created too many promises. Demo-ready visitor recovery gives us a sharper buyer, moment, surface, outcome, and proof metric.',
      'The first wedge is B2B SaaS teams with enough CRM and scheduler infrastructure to prove the handoff. We focus on pricing, demo, comparison, integration, security, and customer story pages because those pages reveal buying intent before a form submission does.',
      'The pilot metric is qualified booked demos with CRM-visible context and sales acceptance. Not message volume. Not vague engagement. Not generic automation.',
    ],
  },
} as const satisfies Record<string, BlogPost>

export type BlogSlug = keyof typeof BLOG_POSTS

export const BLOG_POST_LIST = (Object.keys(BLOG_POSTS) as BlogSlug[]).map((slug) => ({
  slug,
  title: BLOG_POSTS[slug].title,
  date: BLOG_POSTS[slug].date,
  excerpt: BLOG_POSTS[slug].excerpt,
})).sort((a, b) => (a.date < b.date ? 1 : -1))

export function isBlogSlug(s: string): s is BlogSlug {
  return Object.hasOwn(BLOG_POSTS, s)
}
