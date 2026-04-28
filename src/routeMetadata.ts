import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_META_TITLE,
  GITHUB_REPO_URL,
  SITE_NAME,
  SITE_URL,
} from './constants'
import { BLOG_POSTS, type BlogSlug } from './data/blogPosts'
import { INTEGRATION_PAGES, type IntegrationSlug } from './data/integrationPagesContent'
import { SOLUTION_PAGES, type SolutionSlug } from './data/solutionPagesContent'

export type PageMetaData = {
  title: string
  description: string
  canonicalPath: string
  imageUrl?: string
  absoluteTitle?: boolean
  noindex?: boolean
}

type StructuredData = Record<string, unknown>

export const NOT_FOUND_PATH = '/404'

const ORGANIZATION_ID = new URL('#organization', SITE_URL).toString()
const WEBSITE_ID = new URL('#website', SITE_URL).toString()

const STATIC_META = {
  '/': {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    canonicalPath: '/',
    absoluteTitle: true,
  },
  '/pricing': {
    title: 'Pricing',
    description:
      'SentientWeb pricing for B2B SaaS teams, Shopify app users, and enterprise rollouts.',
    canonicalPath: '/pricing',
  },
  '/blog': {
    title: 'Blog',
    description: 'Product updates, launch notes, and thinking from the SentientWeb team.',
    canonicalPath: '/blog',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How SentientWeb collects, uses, protects, and shares personal information.',
    canonicalPath: '/privacy',
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'The terms that govern access to and use of SentientWeb services.',
    canonicalPath: '/terms',
  },
  '/trust': {
    title: 'Trust and Security',
    description: 'SentientWeb security, privacy, access, and compliance practices.',
    canonicalPath: '/trust',
  },
  '/about': {
    title: 'About',
    description: 'How SentientWeb is building autonomous website agents for serious B2B teams.',
    canonicalPath: '/about',
  },
  '/careers': {
    title: 'Careers',
    description: 'Open roles and hiring information for SentientWeb.',
    canonicalPath: '/careers',
  },
  '/status': {
    title: 'System Status',
    description: `Current health of SentientWeb public surfaces and customer-facing services. Source updates are published at ${GITHUB_REPO_URL}.`,
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

  if (path.startsWith('/blog/') && !isKnownRoutePath(path)) return '/blog'
  if (path.startsWith('/integrations/') && !isKnownRoutePath(path)) return '/'
  if (path.startsWith('/solutions/') && !isKnownRoutePath(path)) return '/#solutions'

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
      title: `${page.navLabel} Integration`,
      description: page.deck,
      canonicalPath: path,
    }
  }

  const solutionSlug = path.match(/^\/solutions\/([^/]+)$/)?.[1] || ''
  if (hasOwn(SOLUTION_PAGES, solutionSlug)) {
    const page = SOLUTION_PAGES[solutionSlug]
    return {
      title: page.navLabel,
      description: page.hero.deckHook,
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
      'B2B SaaS platform for autonomous website agents: inbound lead qualification, demo booking, product Q&A, and proactive engagement.',
  }
}

function websiteSchema(): StructuredData {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      'The Autonomous Website Agent - platform-agnostic AI for lead qualification, demo booking, and on-site engagement.',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  }
}

function softwareApplicationSchema(): StructuredData {
  return {
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      description: 'Start pilot.',
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
    inLanguage: 'en-US',
  }
}

export function getRouteStructuredData(pathname: string): StructuredData {
  const path = normalizePathname(pathname)
  const meta = getPageMeta(path)

  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        websiteSchema(),
        organizationSchema(),
        softwareApplicationSchema(),
      ],
    }
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
    : ''

  return [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    robots,
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
