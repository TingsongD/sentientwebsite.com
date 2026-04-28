import { describe, expect, it } from 'vitest'
import {
  getInvalidDynamicRedirect,
  getPageMeta,
  getRouteStructuredData,
  isKnownRoutePath,
  KNOWN_ROUTE_PATHS,
  LEGACY_ROUTE_REDIRECTS,
  normalizePathname,
  renderStructuredDataScript,
} from './routeMetadata'
import { BLOG_POSTS } from './data/blogPosts'
import { FEATURES } from './data/homeFeatures'
import { INTEGRATION_PAGES } from './data/integrationPagesContent'
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
]

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings)
  }
  return []
}

describe('route metadata manifest', () => {
  it('normalizes trailing slashes and recognizes known routes', () => {
    expect(normalizePathname('/pricing/')).toBe('/pricing')
    expect(isKnownRoutePath('/pricing/')).toBe(true)
    expect(isKnownRoutePath('/blog/phase-1-live-now')).toBe(true)
    expect(isKnownRoutePath('/solutions/saas')).toBe(true)
    expect(isKnownRoutePath('/unknown-path')).toBe(false)
  })

  it('returns route-specific metadata for known pages', () => {
    expect(getPageMeta('/pricing')).toMatchObject({
      title: 'Pricing',
      canonicalPath: '/pricing',
    })
    expect(getPageMeta('/pricing').noindex).toBeUndefined()

    expect(getPageMeta('/blog/phase-1-live-now')).toMatchObject({
      title: 'Phase 1 live now',
      canonicalPath: '/blog/phase-1-live-now',
    })

    expect(getPageMeta('/integrations/wordpress')).toMatchObject({
      title: 'WordPress Integration',
      canonicalPath: '/integrations/wordpress',
    })

    expect(getPageMeta('/solutions/financial-services')).toMatchObject({
      title: 'Rate Response Recovery for Lenders',
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
    expect(SOLUTION_NAV_LIST).toHaveLength(10)
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/legal')
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/financial-services')
    expect(KNOWN_ROUTE_PATHS).not.toContain('/solutions/legal-services')
    expect(KNOWN_ROUTE_PATHS).not.toContain('/solutions/car-dealerships')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/wordpress')
    expect(KNOWN_ROUTE_PATHS.some((path) => path.includes('x.com'))).toBe(false)
    expect(LEGACY_ROUTE_REDIRECTS['/solutions/hotel-hospitality']).toBe('/solutions/hospitality')
  })

  it('returns route-aware structured data', () => {
    const home = getRouteStructuredData('/') as {
      '@graph': Array<Record<string, unknown>>
    }
    expect(home['@graph'].map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['WebSite', 'Organization', 'SoftwareApplication']),
    )

    expect(getRouteStructuredData('/pricing')).toMatchObject({
      '@type': 'WebPage',
      url: 'https://sentientwebsite.com/pricing',
      name: 'Pricing | SentientWeb',
    })

    expect(getRouteStructuredData('/blog/phase-1-live-now')).toMatchObject({
      '@type': 'Article',
      headline: 'Phase 1 live now',
      datePublished: '2026-04-10',
    })

    const solution = getRouteStructuredData('/solutions/saas') as {
      '@graph': Array<Record<string, unknown>>
    }
    expect(solution['@graph'].map((item) => item['@type'])).toEqual(
      expect.arrayContaining(['WebPage', 'Service']),
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
