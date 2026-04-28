import { expect, test } from '@playwright/test'
import { existsSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { resolve } from 'node:path'

const serverPort = Number(process.env.PLAYWRIGHT_PORT || 4175)

function readJsonLd(html: string) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  expect(match).not.toBeNull()
  return JSON.parse(match?.[1] || '{}') as Record<string, unknown>
}

function schemaTypes(schema: Record<string, unknown>) {
  const graph = schema['@graph']
  if (Array.isArray(graph)) {
    return graph.map((item) =>
      item && typeof item === 'object' ? (item as Record<string, unknown>)['@type'] : undefined,
    )
  }
  return [schema['@type']]
}

function requestWithHostHeader(hostHeader: string) {
  return new Promise<number>((resolveStatus, reject) => {
    const req = httpRequest(
      {
        host: '127.0.0.1',
        port: serverPort,
        path: '/pricing',
        headers: { Host: hostHeader },
      },
      (res) => {
        res.resume()
        res.on('end', () => resolveStatus(res.statusCode || 0))
      },
    )
    req.on('error', reject)
    req.end()
  })
}

test('unknown paths return a real 404 with noindex metadata', async ({ request }) => {
  const response = await request.get('/unknown-path')
  const html = await response.text()

  expect(response.status()).toBe(404)
  expect(html).toContain('<title>Page Not Found | SentientWeb</title>')
  expect(html).toContain('name="robots" content="noindex"')
})

test('known routes return route-specific JSON-LD', async ({ request }) => {
  const homeResponse = await request.get('/')
  const homeSchema = readJsonLd(await homeResponse.text())
  expect(schemaTypes(homeSchema)).toEqual(
    expect.arrayContaining(['WebSite', 'Organization', 'SoftwareApplication']),
  )

  const pricingResponse = await request.get('/pricing')
  const pricingSchema = readJsonLd(await pricingResponse.text())
  expect(pricingSchema).toMatchObject({
    '@type': 'WebPage',
    url: 'https://sentientwebsite.com/pricing',
    name: 'Pricing | SentientWeb',
  })

  const blogResponse = await request.get('/blog/phase-1-live-now')
  const blogSchema = readJsonLd(await blogResponse.text())
  expect(blogSchema).toMatchObject({
    '@type': 'Article',
    headline: 'Phase 1 live now',
    datePublished: '2026-04-10',
  })

  const solutionResponse = await request.get('/solutions/saas')
  const solutionSchema = readJsonLd(await solutionResponse.text())
  expect(schemaTypes(solutionSchema)).toEqual(expect.arrayContaining(['WebPage', 'Service']))
})

test('known routes return prerendered route-specific metadata', async ({ request }) => {
  const cases = [
    ['/pricing', '<title>Pricing | SentientWeb</title>'],
    ['/blog/phase-1-live-now', '<title>Phase 1 live now | SentientWeb</title>'],
    ['/integrations/wordpress', '<title>WordPress Integration | SentientWeb</title>'],
    [
      '/solutions/saas',
      '<title>Instant Demo Recovery for B2B SaaS | SentientWeb</title>',
    ],
    [
      '/solutions/home-services',
      '<title>Instant Estimate Recovery for Home Services | SentientWeb</title>',
    ],
    [
      '/solutions/financial-services',
      '<title>Rate Response Recovery for Lenders | SentientWeb</title>',
    ],
  ] as const

  for (const [path, title] of cases) {
    const response = await request.get(path)
    const html = await response.text()

    expect(response.status(), path).toBe(200)
    expect(html).toContain(title)
    expect(html).toContain(`href="https://sentientwebsite.com${path}"`)
  }
})

test('ssr bundle stays outside publicly served dist', async () => {
  expect(existsSync(resolve('dist/server'))).toBe(false)
  expect(existsSync(resolve('dist-ssr/entry-server.js'))).toBe(true)
})

test('internal build artifacts are not publicly accessible', async ({ request }) => {
  for (const path of ['/server/entry-server.js', '/routes-manifest.json']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test('malformed encoded paths return 400 without killing the server', async ({ request }) => {
  const malformed = await request.get('/%E0%A4%A')
  expect(malformed.status()).toBe(400)

  const healthy = await request.get('/pricing')
  expect(healthy.status()).toBe(200)
})

test('invalid host headers return 400 without killing the server', async ({ request }) => {
  await expect(requestWithHostHeader('[]')).resolves.toBe(400)

  const healthy = await request.get('/pricing')
  expect(healthy.status()).toBe(200)
})

test('pricing responses include hardened security headers', async ({ request }) => {
  const response = await request.get('/pricing')
  const headers = response.headers()

  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['content-security-policy']).toContain("default-src 'self'")
  expect(headers['content-security-policy']).toContain("object-src 'none'")
})

test('invalid dynamic slugs redirect before serving app HTML', async ({ request }) => {
  const cases = [
    ['/blog/toString', '/blog'],
    ['/integrations/toString', '/'],
    ['/solutions/b2b-saas', '/solutions/saas'],
    ['/solutions/insurance-agencies', '/solutions/insurance'],
    ['/solutions/luxury-ecommerce', '/solutions/ecommerce'],
    ['/solutions/healthcare-clinics', '/solutions/healthcare'],
    ['/solutions/education-edtech', '/solutions/edtech'],
    ['/solutions/hotel-hospitality', '/solutions/hospitality'],
    ['/solutions/legal-services', '/solutions/legal'],
    ['/solutions/car-dealerships', '/#solutions'],
    ['/solutions/toString', '/#solutions'],
  ] as const

  for (const [path, location] of cases) {
    const response = await request.get(path, { maxRedirects: 0 })

    expect(response.status(), path).toBe(302)
    expect(response.headers().location).toBe(location)
  }
})

test('new vertical pages return 200 and retired pages stay out of sitemap', async ({ request }) => {
  const verticals = [
    'saas',
    'home-services',
    'insurance',
    'ecommerce',
    'healthcare',
    'edtech',
    'hospitality',
    'real-estate',
    'legal',
    'financial-services',
  ]

  for (const slug of verticals) {
    const response = await request.get(`/solutions/${slug}`)
    expect(response.status(), slug).toBe(200)
  }

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('https://sentientwebsite.com/solutions/saas')
  expect(sitemap).toContain('https://sentientwebsite.com/solutions/financial-services')
  expect(sitemap).not.toContain('/solutions/b2b-saas')
  expect(sitemap).not.toContain('/solutions/car-dealerships')
})

test('solutions dropdown exposes new verticals only', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Solutions' }).click()

  const nav = page.getByRole('navigation', { name: 'Primary' }).first()
  await expect(nav.getByRole('link', { name: 'B2B SaaS' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Financial Services' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Car dealerships' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Legal services' })).toHaveCount(0)
})

test('homepage and solution pages render new positioning and trust disclosure', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'We are digital plumbers for your revenue leaks.' }),
  ).toBeVisible()

  await page.goto('/solutions/saas')
  await expect(page.getByRole('heading', { name: 'We fix the leaks in your demo pipeline' })).toBeVisible()
  await expect(page.getByText('Powered by AI').first()).toBeVisible()
  await expect(page.getByText('Zero data retention').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Transparent by design' })).toBeVisible()
})

test('home hash navigation respects section scroll margins', async ({ page }) => {
  await page.goto('/#features')

  const targetTop = await page.locator('#features').evaluate((el) => {
    return el.getBoundingClientRect().top
  })

  expect(targetTop).toBeGreaterThanOrEqual(80)
})

test('mobile drawer traps focus and restores it on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const openButton = page.getByRole('button', { name: 'Open menu' })
  await openButton.click()

  const dialog = page.getByRole('dialog', { name: 'Menu' })
  await expect(dialog).toBeVisible()

  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab')
    const insideDialog = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]')
      return !!dialogEl && !!document.activeElement && dialogEl.contains(document.activeElement)
    })
    expect(insideDialog).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(openButton).toBeFocused()
})

test('reduced motion omits ambient video sources', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const videos = page.locator('video[data-ambient-video]')
  await expect(videos).toHaveCount(0)
})

test('social links do not point to generic placeholder domains', async ({ request }) => {
  const response = await request.get('/')
  const html = await response.text()

  expect(html).not.toContain('href="https://x.com"')
  expect(html).not.toContain('href="https://github.com"')
  expect(html).toContain('href="https://github.com/TingsongD/sentientweblanding2"')
})
