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
      'Revenue leak recovery is live: instant access paths, approved-source responses, and calendar-ready next steps for high-intent website visitors.',
    body: [
      'Today we are calling Phase 1 live: the slice of SentientWeb that turns anonymous website traffic into recovered revenue opportunities without another brittle form wall. If you run a serious B2B site, you already know the gap: static copy and delayed response paths do not handle timeline, budget, or fit. Phase 1 is our answer: AI-guided next steps that schedule time when thresholds are met and cite the docs you approve.',
      'Under the hood, Phase 1 combines structured intake, deterministic routing, native calendar integration, and hybrid retrieval over your knowledge base so responses stay grounded instead of generic. Pricing revisits, repeat sessions, and funnel depth help the system detect intent when visitors are closest to action.',
      'We are intentionally narrow in scope for this release. CRM sync, richer content flywheels, and distribution hooks remain on the roadmap; Phase 1 is about proving the core loop on your live site in days, not quarters. If you want to see revenue recovery on your own pages, request instant access and we will walk through install, routing rules, and the playbook for the materials you want SentientWeb to use.',
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
