import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_META_TITLE,
  GITHUB_REPO_URL,
  SEO_LAST_MODIFIED,
  SITE_NAME,
  SITE_URL,
} from './constants'
import { BLOG_POSTS, type BlogSlug } from './data/blogPosts'
import { INTEGRATION_PAGES, type IntegrationSlug } from './data/integrationPagesContent'
import { PRICING_META } from './data/pricingStrategy'
import {
  LEGACY_SOLUTION_REDIRECTS,
  SOLUTION_PAGES,
  type SolutionSlug,
} from './data/solutionPagesContent'

export type PageMetaData = {
  title: string
  description: string
  canonicalPath: string
  imageUrl?: string
  absoluteTitle?: boolean
  noindex?: boolean
}

type StructuredData = Record<string, unknown>

type FaqItem = {
  question: string
  answer: string
}

export const NOT_FOUND_PATH = '/404'

const ORGANIZATION_ID = new URL('#organization', SITE_URL).toString()
const WEBSITE_ID = new URL('#website', SITE_URL).toString()

const HOME_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What does SentientWeb do?',
    answer:
      'SentientWeb finds revenue leaks across your website, billing, CRM, scheduler, and messaging stack, then calls the right tool to recover the moment.',
  },
  {
    question: 'What does SentientWeb replace?',
    answer:
      'SentientWeb replaces generic popups, static forms, and manual chasing across revenue moments. It can route qualified buyers and customers through schedulers, CRMs, billing tools, messaging systems, routers, or webhooks.',
  },
  {
    question: 'How does SentientWeb prevent inaccurate AI answers?',
    answer:
      'SentientWeb answers from approved source content and can route sensitive security, legal, procurement, pricing, or high-value questions to a human instead of improvising.',
  },
]

const PRICING_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What counts as a qualified booked demo?',
    answer:
      'A qualified booked demo is a meeting booked after the visitor shares enough role, company, use case, timeline, stack, and fit context for sales to accept the meeting.',
  },
  {
    question: 'Do teams need HubSpot to use SentientWeb?',
    answer:
      'No. SentientWeb sits above your existing stack and calls the right CRM, workflow, API, webhook, or lightweight handoff after the business rules are mapped.',
  },
  {
    question: 'Can SentientWeb work with Chili Piper or Calendly?',
    answer:
      'Yes. SentientWeb can call the scheduler, router, territory path, account-owner workflow, or custom booking flow that matches the business moment.',
  },
  {
    question: 'How does SentientWeb prove incrementality?',
    answer:
      'The pilot proof packet includes baseline pages, detected intent, qualification answers, booked demos, sales acceptance, CRM records, and the pipeline assumptions used.',
  },
]

const TRUST_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Is SentientWeb SOC 2 certified?',
    answer:
      'SentientWeb is not currently SOC 2 certified. Security-conscious customers can review control areas, data flow, subprocessors, retention expectations, and human-handoff rules before production deployment.',
  },
  {
    question: 'How should regulated teams scope a SentientWeb pilot?',
    answer:
      'Regulated pilots can be scoped around approved website pages, approved non-sensitive content, human handoff, and a security review gate until required documents or legal paths are in place.',
  },
]

const STATIC_META = {
  '/': {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    canonicalPath: '/',
    absoluteTitle: true,
  },
  ...PRICING_META,
  '/blog': {
    title: 'Blog',
    description: 'Product updates and revenue recovery orchestration thinking from the SentientWeb team.',
    canonicalPath: '/blog',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How SentientWeb handles personal information, voice inputs, rights, and choices.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'The terms that govern access to and use of SentientWeb services.',
    canonicalPath: '/terms',
  },
  '/cookies': {
    title: 'Cookie Policy',
    description: 'How SentientWeb uses browser storage and privacy preferences.',
    canonicalPath: '/cookies',
  },
  '/billing-terms': {
    title: 'Billing, Refunds, and Withdrawal',
    description: 'SentientWeb billing, cancellation, refund, and consumer withdrawal terms.',
    canonicalPath: '/billing-terms',
  },
  '/ai-disclosure': {
    title: 'Automation Notice',
    description: 'Disclosure for the automated, voice-enabled website assistant.',
    canonicalPath: '/ai-disclosure',
  },
  '/data-request': {
    title: 'Data Request',
    description: 'Submit privacy rights, access, deletion, correction, and opt-out requests.',
    canonicalPath: '/data-request',
  },
  '/do-not-sell': {
    title: 'Do Not Sell or Share',
    description: 'Privacy opt-out choices for applicable U.S. state privacy laws.',
    canonicalPath: '/do-not-sell',
  },
  '/accessibility': {
    title: 'Accessibility Statement',
    description: 'SentientWeb accessibility standards, known limitations, and feedback contact.',
    canonicalPath: '/accessibility',
  },
  '/dmca': {
    title: 'DMCA Policy',
    description: 'How to send copyright notices for SentientWeb services.',
    canonicalPath: '/dmca',
  },
  '/security-response': {
    title: 'Security and Breach Response',
    description: 'How to report vulnerabilities and how SentientWeb handles security incidents.',
    canonicalPath: '/security-response',
  },
  '/unsubscribe': {
    title: 'Unsubscribe',
    description: 'Opt out of SentientWeb marketing emails and future SMS communications.',
    canonicalPath: '/unsubscribe',
  },
  '/legal': {
    title: 'Legal Notice',
    description: 'SentientWeb legal contact, notices, and compliance resources.',
    canonicalPath: '/legal',
  },
  '/trust': {
    title: 'Trust and Security',
    description: 'SentientWeb security, privacy, access, and compliance practices for revenue recovery paths.',
    canonicalPath: '/trust',
  },
  '/about': {
    title: 'About',
    description: 'How SentientWeb orchestrates revenue recovery across subscription-business websites and revenue tools.',
    canonicalPath: '/about',
  },
  '/revenue-leak-calculator': {
    title: 'Recovery ROI Calculator',
    description:
      'Estimate recovered actions, qualified next steps, pipeline influenced, and modeled ROI for revenue recovery orchestration.',
    canonicalPath: '/revenue-leak-calculator',
  },
  '/orchestrate': {
    title: 'Orchestration Layer Above Your Stack',
    description:
      'How SentientWeb sits above your existing tools and calls the right CRM, scheduler, router, or webhook to complete each revenue recovery action.',
    canonicalPath: '/orchestrate',
  },
  '/careers': {
    title: 'Careers',
    description: 'Open roles and hiring information for SentientWeb.',
    canonicalPath: '/careers',
  },
  '/status': {
    title: 'System Status',
    description: `Current health of SentientWeb customer-facing services. Source updates are published at ${GITHUB_REPO_URL}.`,
    canonicalPath: '/status',
  },
  '/knowledge-base': {
    title: 'Knowledge Base',
    description: 'SentientWeb knowledge base resources are coming soon.',
    canonicalPath: '/knowledge-base',
  },
  '/apis-sdks': {
    title: 'APIs and SDKs',
    description: 'SentientWeb API and SDK documentation is coming soon.',
    canonicalPath: '/apis-sdks',
  },
  '/documentation': {
    title: 'Documentation',
    description: 'SentientWeb product documentation is coming soon.',
    canonicalPath: '/documentation',
  },
  '/changelog': {
    title: 'Changelog',
    description: 'SentientWeb release notes and product changelog are coming soon.',
    canonicalPath: '/changelog',
  },
} as const satisfies Record<string, PageMetaData>

export const STATIC_ROUTE_PATHS = Object.keys(STATIC_META)

export const BLOG_ROUTE_PATHS = (Object.keys(BLOG_POSTS) as BlogSlug[]).map(
  (slug) => `/blog/${slug}`,
)

export const INTEGRATION_ROUTE_PATHS = (
  Object.keys(INTEGRATION_PAGES) as IntegrationSlug[]
).map((slug) => `/integrations/${slug}`)

export const SOLUTION_ROUTE_PATHS = (Object.keys(SOLUTION_PAGES) as SolutionSlug[]).map(
  (slug) => `/solutions/${slug}`,
)

export const LEGACY_ROUTE_REDIRECTS = Object.fromEntries(
  Object.entries(LEGACY_SOLUTION_REDIRECTS).map(([slug, destination]) => [
    `/solutions/${slug}`,
    destination,
  ]),
) as Record<string, string>

export const DYNAMIC_FALLBACK_REDIRECTS = {
  '/blog/': '/blog',
  '/integrations/': '/',
  '/solutions/': '/#solutions',
} as const

export const KNOWN_ROUTE_PATHS = [
  ...STATIC_ROUTE_PATHS,
  ...BLOG_ROUTE_PATHS,
  ...INTEGRATION_ROUTE_PATHS,
  ...SOLUTION_ROUTE_PATHS,
] as const

const KNOWN_ROUTE_SET = new Set<string>(KNOWN_ROUTE_PATHS)

function hasOwn<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(obj, key)
}

export function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

export function isKnownRoutePath(pathname: string) {
  return KNOWN_ROUTE_SET.has(normalizePathname(pathname))
}

export function getInvalidDynamicRedirect(pathname: string) {
  const path = normalizePathname(pathname)

  if (Object.hasOwn(LEGACY_ROUTE_REDIRECTS, path)) return LEGACY_ROUTE_REDIRECTS[path]
  for (const [prefix, location] of Object.entries(DYNAMIC_FALLBACK_REDIRECTS)) {
    if (path.startsWith(prefix) && !isKnownRoutePath(path)) return location
  }

  return null
}

export function getPageMeta(pathname: string): PageMetaData {
  const path = normalizePathname(pathname)

  if (hasOwn(STATIC_META, path)) return STATIC_META[path]

  const blogSlug = path.match(/^\/blog\/([^/]+)$/)?.[1] || ''
  if (hasOwn(BLOG_POSTS, blogSlug)) {
    const post = BLOG_POSTS[blogSlug]
    return {
      title: post.title,
      description: post.excerpt,
      canonicalPath: path,
    }
  }

  const integrationSlug = path.match(/^\/integrations\/([^/]+)$/)?.[1] || ''
  if (hasOwn(INTEGRATION_PAGES, integrationSlug)) {
    const page = INTEGRATION_PAGES[integrationSlug]
    return {
      title: `${page.navLabel} Orchestration Layer`,
      description: page.deck,
      canonicalPath: path,
    }
  }

  const solutionSlug = path.match(/^\/solutions\/([^/]+)$/)?.[1] || ''
  if (hasOwn(SOLUTION_PAGES, solutionSlug)) {
    const page = SOLUTION_PAGES[solutionSlug]
    return {
      title: page.metaTitle,
      description: page.metaDescription,
      canonicalPath: path,
    }
  }

  return {
    title: 'Page Not Found',
    description: 'The requested SentientWeb page could not be found.',
    canonicalPath: path === NOT_FOUND_PATH ? NOT_FOUND_PATH : path,
    noindex: true,
  }
}

export function getFullTitle(meta: Pick<PageMetaData, 'title' | 'absoluteTitle'>) {
  return meta.absoluteTitle ? meta.title : `${meta.title} | ${SITE_NAME}`
}

export function getCanonicalUrl(canonicalPath: string) {
  return new URL(canonicalPath, SITE_URL).toString()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeJsonLd(value: string) {
  return value.replace(/</g, '\\u003c')
}

function organizationSchema(): StructuredData {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE_URL,
    description:
      'SentientWeb orchestrates revenue recovery across subscription-business websites and revenue tools.',
    foundingDate: '2026',
    sameAs: [GITHUB_REPO_URL],
    knowsAbout: [
      'revenue recovery orchestration',
      'pricing page conversion',
      'comparison page conversion',
      'qualified recovered actions',
      'CRM handoff',
      'approved-source AI answers',
      'visitor-to-revenue conversion',
    ],
  }
}

function websiteSchema(): StructuredData {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      'SentientWeb orchestrates revenue recovery across subscription-business websites and revenue tools.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  }
}

function softwareApplicationSchema(): StructuredData {
  return {
    '@type': 'SoftwareApplication',
    '@id': new URL('#software', SITE_URL).toString(),
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Revenue recovery orchestration for subscription businesses that detects intent, qualifies the moment, calls the right tool, and syncs stack-ready context.',
    featureList: [
      'High-intent page detection',
      'Approved-source objection handling',
      'Qualification before booking',
      'CRM context sync',
      'Recovered revenue reporting',
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Subscription business revenue teams',
    },
    offers: {
      '@type': 'Offer',
      description: 'Book a revenue recovery pilot.',
      url: getCanonicalUrl('/pricing'),
    },
  }
}

function webPageSchema(meta: PageMetaData): StructuredData {
  const url = getCanonicalUrl(meta.canonicalPath)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: getFullTitle(meta),
    description: meta.description,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    dateModified: SEO_LAST_MODIFIED,
    inLanguage: 'en-US',
  }
}

function breadcrumbSchema(path: string): StructuredData {
  const normalizedPath = normalizePathname(path)
  const segments = normalizedPath.split('/').filter(Boolean)
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: SITE_NAME,
      item: SITE_URL,
    },
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const meta = getPageMeta(currentPath)
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: meta.title,
      item: getCanonicalUrl(currentPath),
    })
  })

  return {
    '@type': 'BreadcrumbList',
    '@id': `${getCanonicalUrl(normalizedPath)}#breadcrumb`,
    itemListElement: items,
  }
}

function faqSchema(path: string, faqItems: FaqItem[]): StructuredData {
  return {
    '@type': 'FAQPage',
    '@id': `${getCanonicalUrl(path)}#faq`,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

function routeFaqItems(path: string): FaqItem[] {
  if (path === '/') return HOME_FAQ_ITEMS
  if (path.startsWith('/pricing')) return PRICING_FAQ_ITEMS
  if (path === '/trust') return TRUST_FAQ_ITEMS
  return []
}

function webPageGraph(path: string, extraItems: StructuredData[] = []): StructuredData {
  const meta = getPageMeta(path)
  const faqItems = routeFaqItems(path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPageSchema(meta),
      ...(path === '/' ? [websiteSchema(), organizationSchema(), softwareApplicationSchema()] : []),
      ...(path === '/' ? [] : [breadcrumbSchema(path)]),
      ...(faqItems.length > 0 ? [faqSchema(path, faqItems)] : []),
      ...extraItems,
    ],
  }
}

export function getRouteStructuredData(pathname: string): StructuredData {
  const path = normalizePathname(pathname)
  const meta = getPageMeta(path)

  if (path === '/') {
    return webPageGraph(path)
  }

  const blogSlug = path.match(/^\/blog\/([^/]+)$/)?.[1] || ''
  if (hasOwn(BLOG_POSTS, blogSlug)) {
    const post = BLOG_POSTS[blogSlug]
    const url = getCanonicalUrl(path)

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      image: meta.imageUrl || DEFAULT_OG_IMAGE_URL,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      author: { '@id': ORGANIZATION_ID },
      publisher: organizationSchema(),
      inLanguage: 'en-US',
    }
  }

  const solutionSlug = path.match(/^\/solutions\/([^/]+)$/)?.[1] || ''
  if (hasOwn(SOLUTION_PAGES, solutionSlug)) {
    const page = SOLUTION_PAGES[solutionSlug]
    const url = getCanonicalUrl(path)

    return webPageGraph(path, [
      {
          '@type': 'Service',
          '@id': `${url}#service`,
          name: page.metaTitle,
          description: page.metaDescription,
          provider: { '@id': ORGANIZATION_ID },
          areaServed: page.marketLabel,
          audience: {
            '@type': 'BusinessAudience',
            audienceType: page.marketLabel,
          },
          category: 'Revenue recovery orchestration',
          serviceType:
            solutionSlug === 'saas'
              ? 'Subscription business revenue recovery'
              : `${page.marketLabel} revenue recovery`,
          termsOfService: getCanonicalUrl('/terms'),
          url,
      },
    ])
  }

  const faqItems = routeFaqItems(path)
  if (path !== '/' && faqItems.length > 0) return webPageGraph(path)

  if (path === '/pricing' || path === '/orchestrate' || path.startsWith('/integrations/')) {
    return webPageGraph(path)
  }

  return webPageSchema(meta)
}

export function renderStructuredDataScript(pathname: string) {
  return `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(getRouteStructuredData(pathname)))}</script>`
}

export function renderPageHead(meta: PageMetaData) {
  const fullTitle = getFullTitle(meta)
  const url = getCanonicalUrl(meta.canonicalPath)
  const imageUrl = meta.imageUrl || DEFAULT_OG_IMAGE_URL
  const robots = meta.noindex
    ? '<meta name="robots" content="noindex">'
    : '<meta name="robots" content="index,follow,max-image-preview:large">'

  return [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    robots,
    `<meta name="last-modified" content="${SEO_LAST_MODIFIED}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
  ].filter(Boolean).join('\n    ')
}
