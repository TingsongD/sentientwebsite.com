export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  eyebrow: string
  body: string[]
}

export const BLOG_POSTS: Record<string, BlogPost> = {
  'phase-1-live-now': {
    slug: 'phase-1-live-now',
    title: 'Phase 1 live now',
    date: '2026-04-10',
    eyebrow: 'Product · Launch',
    excerpt:
      'Inbound lead qualification, Calendly-backed demo booking, and knowledge-grounded Q&A are live — the same autonomous engine we have been building toward, shipping as a focused first chapter.',
    body: [
      'Today we are calling Phase 1 live: the slice of SentientWeb that turns anonymous website traffic into qualified pipeline without another SDR round-robin or a brittle form wall. If you run a serious B2B site, you already know the gap — static copy and “book a demo” buttons do not negotiate timeline, budget, or fit. Phase 1 is our answer: an agent that asks the right questions, books real time on your calendar when thresholds are met, and cites the docs you approve when visitors ask product questions.',
      'Under the hood, Phase 1 combines structured qualification (BANT-lite scoring with deterministic routing), native Calendly integration so meetings land where your team already works, and hybrid retrieval over your knowledge base so answers stay grounded instead of generic. Behavioral signals — pricing revisits, repeat sessions, depth in the funnel — feed proactive engagement so the agent shows up when intent is high, not only when someone hunts for a chat widget.',
      'We are intentionally narrow in scope for this release. CRM sync, richer content flywheels, and distribution hooks remain on the roadmap; Phase 1 is about proving the core loop on your live site in days, not quarters. If you want to see qualification and booking on your own pages, book a demo — we will walk the snippet install, routing rules, and the playbook for the materials you want the agent to use.',
    ],
  },
}

export type BlogSlug = keyof typeof BLOG_POSTS

export const BLOG_POST_LIST = (Object.keys(BLOG_POSTS) as BlogSlug[]).map((slug) => ({
  slug,
  title: BLOG_POSTS[slug].title,
  date: BLOG_POSTS[slug].date,
  excerpt: BLOG_POSTS[slug].excerpt,
})).sort((a, b) => (a.date < b.date ? 1 : -1))

export function isBlogSlug(s: string): s is BlogSlug {
  return s in BLOG_POSTS
}
