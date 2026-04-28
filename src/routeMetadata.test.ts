import { describe, expect, it } from 'vitest'
import {
  getInvalidDynamicRedirect,
  getPageMeta,
  getRouteStructuredData,
  isKnownRoutePath,
  KNOWN_ROUTE_PATHS,
  normalizePathname,
  renderStructuredDataScript,
} from './routeMetadata'

describe('route metadata manifest', () => {
  it('normalizes trailing slashes and recognizes known routes', () => {
    expect(normalizePathname('/pricing/')).toBe('/pricing')
    expect(isKnownRoutePath('/pricing/')).toBe(true)
    expect(isKnownRoutePath('/blog/phase-1-live-now')).toBe(true)
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
    expect(getInvalidDynamicRedirect('/solutions/toString')).toBe('/#solutions')
    expect(getInvalidDynamicRedirect('/pricing')).toBeNull()
  })

  it('exports all route paths without placeholder social domains', () => {
    expect(KNOWN_ROUTE_PATHS).toContain('/solutions/legal-services')
    expect(KNOWN_ROUTE_PATHS).toContain('/integrations/wordpress')
    expect(KNOWN_ROUTE_PATHS.some((path) => path.includes('x.com'))).toBe(false)
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
  })

  it('renders JSON-LD script safely', () => {
    const script = renderStructuredDataScript('/pricing')
    expect(script).toContain('type="application/ld+json"')
    expect(script).toContain('"@type":"WebPage"')
    expect(script).not.toContain('</script><script')
  })
})
