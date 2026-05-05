import { describe, expect, it } from 'vitest'
import { APP_DYNAMIC_ROUTE_PATTERN_LIST, APP_STATIC_ROUTE_PATHS } from './appRoutePatterns'
import { normalizeSiteUrl, SITE_URL } from './constants'
import {
  BLOG_ROUTE_PATHS,
  DYNAMIC_FALLBACK_REDIRECTS,
  getInvalidDynamicRedirect,
  getPageMeta,
  getRouteStructuredData,
  INTEGRATION_ROUTE_PATHS,
  isKnownRoutePath,
  KNOWN_ROUTE_PATHS,
  LEGACY_ROUTE_REDIRECTS,
  normalizePathname,
  renderStructuredDataScript,
  SOLUTION_ROUTE_PATHS,
  STATIC_ROUTE_PATHS,
} from './routeMetadata'
import { BLOG_POSTS } from './data/blogPosts'
import { FEATURES } from './data/homeFeatures'
import { INTEGRATION_PAGES } from './data/integrationPagesContent'
import { PRICING_META, PRICING_ROUTE_PATHS, TIER_TABLES, TRACKS } from './data/pricingStrategy'
import { SOLUTION_NAV_LIST, SOLUTION_PAGES } from './data/solutionPagesContent'

const FORBIDDEN_PUBLIC_TERMS = [
  /\bchatbot\b/i,
  /\bAI agent\b/i,
  /\bconversations\b/i,
  /\blive chat\b/i,
  /\bchat\b/i,
  /\bproactive\b/i,
  /\bqualify leads\b/i,
  /\bwidget\b/i,
  /\bbook a demo\b/i,
  /\b24\/7 availability\b/i,
  /\bfollow[- ]up\b/i,
  /\bintelligent\b/i,
  /\bautonomous\b/i,
  /\bbehavioral analysis\b/i,
  /\bsubscription\b/i,
  /\busage-based\b/i,
  /\bauto-renew\b/i,
  /\boverage\b/i,
  /\bsetup fee\b/i,
  /\bsetup fees\b/i,
  /\bper-seat\b/i,
  /\bcontract\b/i,
  /\bcheap\b/i,
]

const EXPECTED_SITE_URL = normalizeSiteUrl(
  import.meta.env.VITE_SITE_URL ||
    import.meta.env.NEXT_PUBLIC_SITE_URL ||
    'https://sentientwebsite.com/',
)

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings)
  }
  return []
}

describe('route metadata manifest', () => {
  it('normalizes the canonical site URL to an origin root', () => {
    expect(SITE_URL).toBe(EXPECTED_SITE_URL)
    expect(normalizeSiteUrl('https://example.com')).toBe('https://example.com/')
    expect(normalizeSiteUrl('https://example.com/some/path?ignored=true')).toBe(
      'https://example.com/',
    )
    expect(() => normalizeSiteUrl('ftp://example.com')).toThrow('Invalid VITE_SITE_URL')
  })

  it('normalizes trailing slashes and recognizes known routes', () => {
    expect(normalizePathname('/pricing/')).toBe('/pricing')
    expect(isKnownRoutePath('/pricing/')).toBe(true)
    expect(isKnownRoutePath('/pricing/product')).toBe(true)
    expect(isKnownRoutePath('/pricing/service')).toBe(true)
    expect(isKnownRoutePath('/pricing/calculator')).toBe(true)
    expect(isKnownRoutePath('/pricing/enterprise')).toBe(true)
    expect(isKnownRoutePath('/revenue-leak-calculator')).toBe(true)
    expect(isKnownRoutePath('/orchestrate')).toBe(true)
    expect(isKnownRoutePath('/blog/phase-1-live-now')).toBe(true)
    expect(isKnownRoutePath('/solutions/saas')).toBe(true)
    expect(isKnownRoutePath('/unknown-path')).toBe(false)
  })

  it('returns route-specific metadata for known pages', () => {
    expect(getPageMeta('/pricing')).toMatchObject({
      title: 'SentientWeb Pricing | Visitor-to-Demo Engine',
      canonicalPath: '/pricing',
      absoluteTitle: true,
    })
    expect(getPageMeta('/pricing').noindex).toBeUndefined()

    expect(getPageMeta('/pricing/product')).toMatchObject({
      title: 'Demo Recovery Pilot Pricing',
      canonicalPath: '/pricing/product',
    })

    expect(getPageMeta('/pricing/service')).toMatchObject({
      title: 'Demo Recovery Monthly Pricing',
      canonicalPath: '/pricing/service',
    })

    expect(getPageMeta('/revenue-leak-calculator')).toMatchObject({
      title: 'Demo Recovery Calculator',
      canonicalPath: '/revenue-leak-calculator',
    })

    expect(getPageMeta('/orchestrate')).toMatchObject({
      title: 'Orchestrate Your Existing Tech',
      canonicalPath: '/orchestrate',
    })

    expect(getPageMeta('/blog/phase-1-live-now')).toMatchObject({
      title: 'Phase 1 live now',
      canonicalPath: '/blog/phase-1-live-now',
    })

    expect(getPageMeta('/integrations/wordpress')).toMatchObject({
      title: 'WordPress Integration',
      canonicalPath: '/integrations/wordpress',
    })

    expect(getPageMeta('/solutions/financial-services')).toMatchObject({
      title: 'Fintech SaaS Demo Recovery',
      canonicalPath: '/solutions/financial-services',
    })
  })

  it('returns noindex metadata for unknown pages', () => {
    expect(getPageMeta('/unknown-path')).toMatchObject({
      title: 'Page Not Found',
      canonicalPath: '/unknown-path',
      noindex: true,
    })
  })

  it('knows production redirects for invalid dynamic slugs', () => {
    expect(getInvalidDynamicRedirect('/blog/toString')).toBe('/blog')
    expect(getInvalidDynamicRedirect('/integrations/toString')).toBe('/')
    expect(getInvalidDynamicRedirect('/solutions/b2b-saas')).toBe('/solutions/saas')
    expect(getInvalidDynamicRedirect('/solutions/car-dealerships')).toBe('/#solutions')
    expect(getInvalidDynamicRedirect('/solutions/toString')).toBe('/#solutions')
    expect(getInvalidDynamicRedirect('/pricing')).toBeNull()
  })

  it('exports the new vertical routes without retired solution pages', () => {
    expect(SOLUTION_NAV_LIST).toHaveLength(11)
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/legal')
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/financial-services')
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/logistics')
    for (const path of PRICING_ROUTE_PATHS) {
      expect(KNOWN_ROUTE_PATHS).toContain(path)
    }
    expect(KNOWN_ROUTE_PATHS).toContain('/revenue-leak-calculator')
    expect(KNOWN_ROUTE_PATHS).toContain('/orchestrate')
    expect(KNOWN_ROUTE_PATHS).not.toContain('/solutions/legal-services')
    expect(KNOWN_ROUTE_PATHS).not.toContain('/solutions/car-dealerships')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/wordpress')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/hubspot')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/salesforce')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/pipedrive')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/api-webhooks')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/calendly')
    expect(KNOWN_ROUTE_PATHS).toEqual(
      expect.arrayContaining([
        '/privacy',
        '/terms',
        '/cookies',
        '/billing-terms',
        '/ai-disclosure',
        '/data-request',
        '/do-not-sell',
        '/accessibility',
        '/dmca',
        '/security-response',
        '/unsubscribe',
        '/legal',
      ]),
    )
    expect(KNOWN_ROUTE_PATHS.some((path) => path.includes('x.com'))).toBe(false)
    expect(LEGACY_ROUTE_REDIRECTS['/solutions/hotel-hospitality']).toBe('/solutions/hospitality')
  })

  it('keeps app route patterns in sync with prerender metadata routes', () => {
    expect([...APP_STATIC_ROUTE_PATHS].sort()).toEqual([...STATIC_ROUTE_PATHS].sort())
    expect([...APP_DYNAMIC_ROUTE_PATTERN_LIST].sort()).toEqual([
      '/blog/:slug',
      '/integrations/:slug',
      '/solutions/:slug',
    ].sort())

    expect(BLOG_ROUTE_PATHS.every((path) => path.startsWith('/blog/'))).toBe(true)
    expect(INTEGRATION_ROUTE_PATHS.every((path) => path.startsWith('/integrations/'))).toBe(true)
    expect(SOLUTION_ROUTE_PATHS.every((path) => path.startsWith('/solutions/'))).toBe(true)
    expect(DYNAMIC_FALLBACK_REDIRECTS).toEqual({
      '/blog/': '/blog',
      '/integrations/': '/',
      '/solutions/': '/#solutions',
    })
  })

  it('returns route-aware structured data', () => {
    const home = getRouteStructuredData('/') as {
      '@graph': Array<Record<string, unknown>>
    }
    expect(home['@graph'].map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['WebPage', 'WebSite', 'Organization', 'SoftwareApplication', 'FAQPage']),
    )

    const pricing = getRouteStructuredData('/pricing') as {
      '@graph': Array<Record<string, unknown>>
    }
    expect(pricing['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'WebPage',
          url: new URL('/pricing', SITE_URL).toString(),
          name: 'SentientWeb Pricing | Visitor-to-Demo Engine',
        }),
        expect.objectContaining({ '@type': 'BreadcrumbList' }),
        expect.objectContaining({ '@type': 'FAQPage' }),
      ]),
    )

    expect(getRouteStructuredData('/blog/phase-1-live-now')).toMatchObject({
      '@type': 'Article',
      headline: 'Phase 1 live now',
      datePublished: '2026-04-10',
    })

    const solution = getRouteStructuredData('/solutions/saas') as {
      '@graph': Array<Record<string, unknown>>
    }
    expect(solution['@graph'].map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['WebPage', 'BreadcrumbList', 'Service']),
    )
    expect(solution['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ serviceType: 'B2B SaaS demo recovery' }),
      ]),
    )
  })

  it('renders JSON-LD script safely', () => {
    const script = renderStructuredDataScript('/pricing')
    expect(script).toContain('type="application/ld+json"')
    expect(script).toContain('"@type":"WebPage"')
    expect(script).not.toContain('</script><script')
  })

  it('keeps vertical manifest fields complete', () => {
    for (const page of Object.values(SOLUTION_PAGES)) {
      expect(page.features).toHaveLength(4)
      expect(page.steps).toHaveLength(3)
      expect(page.hero.primaryCta.length).toBeGreaterThan(0)
      expect(page.hero.secondaryCta.length).toBeGreaterThan(0)
      expect(page.proofStat.length).toBeGreaterThan(0)
      expect(page.disclosure.length).toBeGreaterThan(0)
      expect(page.metaTitle.length).toBeGreaterThan(0)
      expect(page.metaDescription.length).toBeGreaterThan(0)
    }
  })

  it('keeps public data copy clear of forbidden positioning terms', () => {
    const publicStrings = [
      ...collectStrings(SOLUTION_PAGES),
      ...collectStrings(FEATURES),
      ...collectStrings(INTEGRATION_PAGES),
      ...collectStrings(PRICING_META),
      ...collectStrings(TRACKS),
      ...collectStrings(TIER_TABLES),
      ...collectStrings(BLOG_POSTS),
      ...KNOWN_ROUTE_PATHS.flatMap((path) => {
        const meta = getPageMeta(path)
        return [meta.title, meta.description]
      }),
    ]

    for (const text of publicStrings) {
      for (const term of FORBIDDEN_PUBLIC_TERMS) {
        expect(text, `${term} matched "${text}"`).not.toMatch(term)
      }
    }
  })
})
