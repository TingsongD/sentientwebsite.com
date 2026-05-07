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
      'Revenue recovery orchestration is live: approved-source responses, qualification, workflow actions, and stack-ready context for high-intent revenue moments.',
    body: [
      'Today we are calling the revenue orchestration layer live: SentientWeb turns high-intent website and customer behavior into qualified next actions without another brittle form wall. Subscription businesses already know the gap: static copy and delayed response paths do not handle timeline, budget, stack fit, security hesitation, payment friction, or cancellation risk.',
      'Under the hood, SentientWeb combines structured intake, deterministic routing, workflow actions, and approved-source retrieval over your knowledge base so responses stay grounded instead of generic. Pricing revisits, repeat sessions, billing moments, and high-intent page depth help the system detect when visitors or customers are closest to action.',
      'If you want to see revenue recovery on your own pages, request a preview and we will walk through install, routing rules, and the playbook for the materials and tools you want SentientWeb to use.',
    ],
  },
  'revenue-recovery-orchestration': {
    slug: 'revenue-recovery-orchestration',
    title: 'Why revenue recovery needs orchestration',
    date: '2026-05-04',
    eyebrow: 'Positioning',
    excerpt:
      'SentientWeb focuses on measurable revenue moments: recovering high-intent visitors, missed follow-ups, payment friction, cancellation risk, and buyer hesitation before the opportunity disappears.',
    body: [
      'Revenue recovery works when the system knows the buyer or customer, the moment, the surface, the outcome, and the proof metric.',
      'SentientWeb focuses on pricing, demo, checkout, billing, account, comparison, integration, security, and customer-story pages because those surfaces reveal intent before a form submission, payment event, cancellation request, or support ticket does.',
      'The proof metric is qualified recovered action with stack-visible context and business acceptance. Not message volume. Not vague engagement. Not generic automation.',
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
