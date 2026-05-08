import { expect, test, type Page } from '@playwright/test'
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { createServer as createNetServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const serverPort = Number(process.env.PLAYWRIGHT_PORT || 4175)
const serverScriptPath = resolve('server.mjs')
const siteUrl = normalizeSiteUrl(
  process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sentientwebsite.com/',
)
const faviconUrl =
  'https://cdn.shopify.com/s/files/1/0792/3613/7216/files/logo_blob_2.png?v=1777947912'
const roiCtaVideoUrl =
  'https://cdn.shopify.com/videos/c/o/v/9fe664570f2b4284a76f522f11fcf58a.mp4'
const legalVersions = {
  consentVersion: 'v1',
  privacyPolicyVersion: '2026-05-02',
  cookiePolicyVersion: '2026-05-02',
  aiDisclosureVersion: '2026-05-02',
  lastUpdatedLabel: 'May 2, 2026',
}

function normalizeSiteUrl(value: string) {
  const url = new URL(value)
  return `${url.origin}/`
}

function absoluteSiteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

async function seedDataLayer(page: Page, globalPrivacyControl = false) {
  await page.addInitScript((gpcEnabled) => {
    ;(window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer = []
    if (gpcEnabled) {
      Object.defineProperty(navigator, 'globalPrivacyControl', {
        configurable: true,
        value: true,
      })
    }
  }, globalPrivacyControl)
}

async function readDataLayer(page: Page) {
  return page.evaluate(
    () => (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer || [],
  )
}

async function clearStoredConsentBeforeNavigation(page: Page) {
  await page.addInitScript((consentVersion) => {
    window.localStorage.removeItem(`sentientweb:privacy-consent:${consentVersion}`)
  }, legalVersions.consentVersion)
}

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

function requestWithHostHeader(hostHeader: string, port = serverPort) {
  return new Promise<number>((resolveStatus, reject) => {
    const req = httpRequest(
      {
        host: '127.0.0.1',
        port,
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

function getFreePort() {
  return new Promise<number>((resolvePort, reject) => {
    const probe = createNetServer()
    probe.on('error', reject)
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address()
      if (!address || typeof address === 'string') {
        probe.close()
        reject(new Error('Unable to allocate a local test port'))
        return
      }

      probe.close(() => resolvePort(address.port))
    })
  })
}

function waitForHealth(port: number, stderr: () => string) {
  const startedAt = Date.now()

  return new Promise<void>((resolveReady, reject) => {
    const retry = () => {
      if (Date.now() - startedAt > 5000) {
        reject(new Error(`Timed out waiting for test server health. stderr: ${stderr()}`))
        return
      }
      setTimeout(check, 50)
    }

    const check = () => {
      const req = httpRequest(
        {
          host: '127.0.0.1',
          port,
          path: '/healthz',
        },
        (res) => {
          res.resume()
          res.on('end', () => {
            if (res.statusCode === 200) resolveReady()
            else retry()
          })
        },
      )
      req.on('error', retry)
      req.end()
    }

    check()
  })
}

function stopServerProcess(child: ChildProcess) {
  return new Promise<void>((resolveStopped) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolveStopped()
      return
    }

    child.once('exit', () => resolveStopped())
    child.kill()
  })
}

function runServerStartup(args: string[], cwd = resolve('.'), env: NodeJS.ProcessEnv = {}) {
  return new Promise<{ code: number | null; stderr: string }>((resolveResult, reject) => {
    const child = spawn(process.execPath, [serverScriptPath, ...args], {
      cwd,
      env: { ...process.env, ...env, FORCE_COLOR: '0' },
      stdio: ['ignore', 'ignore', 'pipe'],
    })
    let stderr = ''
    const timeout = setTimeout(() => {
      child.kill()
      reject(new Error(`Timed out waiting for server.mjs ${args.join(' ')}`))
    }, 5000)

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8')
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      clearTimeout(timeout)
      resolveResult({ code, stderr })
    })
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
    expect.arrayContaining(['WebPage', 'WebSite', 'Organization', 'SoftwareApplication', 'FAQPage']),
  )

  const pricingResponse = await request.get('/pricing')
  const pricingSchema = readJsonLd(await pricingResponse.text())
  expect(schemaTypes(pricingSchema)).toEqual(
    expect.arrayContaining(['WebPage', 'BreadcrumbList', 'FAQPage']),
  )
  expect((pricingSchema['@graph'] as Array<Record<string, unknown>>)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': 'WebPage',
        url: absoluteSiteUrl('/pricing'),
        name: 'SentientWeb Pricing | 30-Day Recovery Pilot',
      }),
    ]),
  )

  const blogResponse = await request.get('/blog/phase-1-live-now')
  const blogSchema = readJsonLd(await blogResponse.text())
  expect(blogSchema).toMatchObject({
    '@type': 'Article',
    headline: 'Phase 1 live now',
    datePublished: '2026-04-10',
  })

  const solutionResponse = await request.get('/solutions/saas')
  const solutionSchema = readJsonLd(await solutionResponse.text())
  expect(schemaTypes(solutionSchema)).toEqual(
    expect.arrayContaining(['WebPage', 'BreadcrumbList', 'Service']),
  )

  const orchestrateResponse = await request.get('/orchestrate')
  const orchestrateSchema = readJsonLd(await orchestrateResponse.text())
  expect(schemaTypes(orchestrateSchema)).toEqual(
    expect.arrayContaining(['WebPage', 'BreadcrumbList']),
  )
  expect((orchestrateSchema['@graph'] as Array<Record<string, unknown>>)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        '@type': 'WebPage',
        url: absoluteSiteUrl('/orchestrate'),
        name: 'Orchestration Layer Above Your Stack | SentientWeb',
      }),
    ]),
  )
})

test('known routes return prerendered route-specific metadata', async ({ request }) => {
  const cases = [
    ['/pricing', '<title>SentientWeb Pricing | 30-Day Recovery Pilot</title>'],
    ['/pricing/product', '<title>Revenue Recovery Pilot Pricing | SentientWeb</title>'],
    ['/pricing/service', '<title>Revenue Recovery Monthly Pricing | SentientWeb</title>'],
    ['/pricing/calculator', '<title>Recovery ROI Calculator | SentientWeb</title>'],
    ['/pricing/enterprise', '<title>Scale Revenue Recovery Pricing | SentientWeb</title>'],
    ['/revenue-leak-calculator', '<title>Recovery ROI Calculator | SentientWeb</title>'],
    ['/orchestrate', '<title>Orchestration Layer Above Your Stack | SentientWeb</title>'],
    ['/blog/phase-1-live-now', '<title>Phase 1 live now | SentientWeb</title>'],
    ['/integrations/wordpress', '<title>WordPress Orchestration Layer | SentientWeb</title>'],
    [
      '/solutions/saas',
      '<title>Revenue Recovery for Subscription Businesses | SentientWeb</title>',
    ],
    [
      '/solutions/financial-services',
      '<title>Fintech Revenue Recovery | SentientWeb</title>',
    ],
    [
      '/solutions/logistics',
      '<title>Logistics Revenue Recovery | SentientWeb</title>',
    ],
  ] as const

  for (const [path, title] of cases) {
    const response = await request.get(path)
    const html = await response.text()

    expect(response.status(), path).toBe(200)
    expect(html).toContain(title)
    expect(html).toContain(`href="${absoluteSiteUrl(path)}"`)
  }
})

test('favicon and social image metadata use the Shopify logo asset', async ({ request }) => {
  const response = await request.get('/')
  const html = await response.text()

  expect(html).toContain(`rel="icon"`)
  expect(html).toContain(`href="${faviconUrl}"`)
  expect(html).toContain(`property="og:image" content="${faviconUrl}"`)
  expect(html).toContain(`name="twitter:image" content="${faviconUrl}"`)
  expect(html).not.toContain('href="/favicon.svg"')

  for (const path of ['/favicon.ico', '/favicon.svg']) {
    const iconResponse = await request.get(path, { maxRedirects: 0 })
    expect(iconResponse.status(), path).toBe(302)
    expect(iconResponse.headers().location).toBe(faviconUrl)
  }
})

test('ssr bundle stays outside publicly served dist', async () => {
  expect(existsSync(resolve('dist/server'))).toBe(false)
  expect(existsSync(resolve('dist-ssr/entry-server.js'))).toBe(true)
})

test('internal build artifacts are not publicly accessible', async ({ request }) => {
  const deniedPaths = [
    '/server/entry-server.js',
    '/routes-manifest.json',
    '/assets/../routes-manifest.json',
    '/assets/%2e%2e/routes-manifest.json',
    '/%2e%2e/package.json',
    '/.env',
    '/.well-known/../routes-manifest.json',
  ]

  for (const path of deniedPaths) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test('security.txt is publicly accessible for vulnerability reporting', async ({ request }) => {
  const response = await request.get('/.well-known/security.txt')
  const body = await response.text()

  expect(response.status()).toBe(200)
  expect(body).toContain('Contact: mailto:songday@sentientwebsite.com')
  expect(body).toContain(`Policy: ${absoluteSiteUrl('/security-response')}`)
  expect(body).toContain(`Canonical: ${absoluteSiteUrl('/.well-known/security.txt')}`)
})

test('robots and llms files expose canonical crawl guidance for SEO and AEO', async ({ request }) => {
  const robotsResponse = await request.get('/robots.txt')
  const robots = await robotsResponse.text()

  expect(robotsResponse.status()).toBe(200)
  expect(robots).toContain(`# AI/answer-engine guide: ${absoluteSiteUrl('/llms.txt')}`)
  expect(robots).toContain('User-agent: *')
  expect(robots).toContain('Allow: /')
  expect(robots).toContain(`Sitemap: ${absoluteSiteUrl('/sitemap.xml')}`)

  const llmsResponse = await request.get('/llms.txt')
  const llms = await llmsResponse.text()

  expect(llmsResponse.status()).toBe(200)
  expect(llms).toContain('# SentientWeb')
  expect(llms).toContain('revenue recovery orchestration for modern subscription businesses')
  expect(llms).toContain(absoluteSiteUrl('/solutions/saas'))
  expect(llms).toContain(absoluteSiteUrl('/integrations/hubspot'))
  expect(llms).toContain('approved-source answers with human handoff')
  expect(llms).not.toContain(absoluteSiteUrl('/solutions/home-services'))
  expect(llms).not.toContain(absoluteSiteUrl('/solutions/ecommerce'))
})

test('health endpoint returns a minimal no-cache response', async ({ request }) => {
  const response = await request.get('/healthz')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/json')
  expect(response.headers()['cache-control']).toBe('no-cache')
  await expect(response.json()).resolves.toEqual({ ok: true })

  const headResponse = await request.head('/healthz')
  expect(headResponse.status()).toBe(200)
  expect(headResponse.headers()['cache-control']).toBe('no-cache')
})

test('server rejects invalid startup ports with a clear error', async () => {
  const result = await runServerStartup(['--port', 'not-a-port'])

  expect(result.code).toBe(1)
  expect(result.stderr).toContain('Invalid port "not-a-port". Use an integer from 1 to 65535.')
})

test('server reports occupied startup ports with a clear error', async () => {
  const result = await runServerStartup([
    '--host',
    '127.0.0.1',
    '--port',
    String(serverPort),
  ])

  expect(result.code).toBe(1)
  expect(result.stderr).toContain(`Port ${serverPort} is already in use on host "127.0.0.1".`)
})

test('server rejects missing route manifests with a clear error', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Missing ')
    expect(result.stderr).toContain('dist/routes-manifest.json')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects malformed route manifests with a clear error', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist'))
    writeFileSync(join(tempRoot, 'dist', 'routes-manifest.json'), '{"knownRoutes":', 'utf8')

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('dist/routes-manifest.json')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects route manifests with invalid site URLs', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist'))
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({ knownRoutes: ['/'], siteUrl: 'ftp://example.com/' }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('siteUrl must be a valid http(s) URL')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects route manifests that point at missing HTML files', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist'))
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({ knownRoutes: ['/', '/404'], notFoundPath: '/404', siteUrl, legalVersions }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Missing prerendered route file for "/"')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects route manifests with invalid redirect maps', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist', '404'), { recursive: true })
    writeFileSync(join(tempRoot, 'dist', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(join(tempRoot, 'dist', '404', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({
        knownRoutes: ['/'],
        legacyRedirects: { '/retired': 'https://example.com/' },
        notFoundPath: '/404',
        siteUrl,
        legalVersions,
      }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('legacyRedirects contains invalid destination for "/retired"')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects protocol-relative redirect destinations', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist', '404'), { recursive: true })
    writeFileSync(join(tempRoot, 'dist', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(join(tempRoot, 'dist', '404', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({
        knownRoutes: ['/'],
        legacyRedirects: { '/retired': '//example.com/' },
        notFoundPath: '/404',
        siteUrl,
        legalVersions,
        cspScriptHashes: ["'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='"],
      }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('legacyRedirects contains invalid destination for "/retired"')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects route manifests with invalid CSP script hashes', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist', '404'), { recursive: true })
    writeFileSync(join(tempRoot, 'dist', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(join(tempRoot, 'dist', '404', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({
        knownRoutes: ['/'],
        notFoundPath: '/404',
        siteUrl,
        legalVersions,
        cspScriptHashes: ["'unsafe-inline'"],
      }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('cspScriptHashes contains invalid hash')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects route manifests with missing legal version metadata', async () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-server-startup-'))
  try {
    mkdirSync(join(tempRoot, 'dist', '404'), { recursive: true })
    writeFileSync(join(tempRoot, 'dist', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(join(tempRoot, 'dist', '404', 'index.html'), '<!doctype html>', 'utf8')
    writeFileSync(
      join(tempRoot, 'dist', 'routes-manifest.json'),
      JSON.stringify({
        knownRoutes: ['/'],
        notFoundPath: '/404',
        siteUrl,
        cspScriptHashes: ["'sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='"],
        legalVersions: { ...legalVersions, privacyPolicyVersion: '' },
      }),
      'utf8',
    )

    const result = await runServerStartup(['--port', '0'], tempRoot)

    expect(result.code).toBe(1)
    expect(result.stderr).toContain('Invalid ')
    expect(result.stderr).toContain('legalVersions.privacyPolicyVersion must be a non-empty string')
    expect(result.stderr).toContain('Run npm run build before starting the production server.')
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('server rejects consent log paths inside publicly served dist', async () => {
  const result = await runServerStartup(['--port', '0'], resolve('.'), {
    SENTIENT_CONSENT_LOG_PATH: 'dist/consent-events.jsonl',
  })

  expect(result.code).toBe(1)
  expect(result.stderr).toContain('Invalid SENTIENT_CONSENT_LOG_PATH')
  expect(result.stderr).toContain('publicly served dist directory')
})

test('runtime widget config endpoint is no-store and disabled without complete config', async ({ request }) => {
  const response = await request.get('/sentient-widget-config.json')

  expect(response.headers()['cache-control']).toBe('no-store')
  expect([200, 204]).toContain(response.status())

  if (response.status() === 200) {
    const config = await response.json()
    expect(config).toEqual({
      origin: expect.stringMatching(/^https?:\/\//),
      installKey: expect.any(String),
    })
  }

  const headResponse = await request.head('/sentient-widget-config.json')
  expect(headResponse.status()).toBe(response.status())
  expect(headResponse.headers()['cache-control']).toBe('no-store')
})

test('consent event endpoint accepts sanitized choices and rejects sensitive payloads', async ({
  request,
}) => {
  const validPayload = {
    eventType: 'save_choices',
    preferences: true,
    assistant: false,
    analytics: false,
    ageConfirmed: false,
    globalPrivacyControl: true,
    sourcePath: '/pricing',
  }
  const validResponse = await request.post('/consent-events', {
    data: validPayload,
  })

  expect(validResponse.status()).toBe(204)
  expect(validResponse.headers()['cache-control']).toBe('no-store')

  const sameOriginResponse = await request.post('/consent-events', {
    headers: { Origin: `http://127.0.0.1:${serverPort}` },
    data: validPayload,
  })
  expect(sameOriginResponse.status()).toBe(204)

  const crossOriginResponse = await request.post('/consent-events', {
    headers: { Origin: 'https://evil.example' },
    data: validPayload,
  })
  expect(crossOriginResponse.status()).toBe(403)

  const fetchMetadataResponse = await request.post('/consent-events', {
    headers: { 'Sec-Fetch-Site': 'cross-site' },
    data: validPayload,
  })
  expect(fetchMetadataResponse.status()).toBe(403)

  const unsupportedMediaResponse = await request.post('/consent-events', {
    headers: { 'Content-Type': 'text/plain' },
    data: JSON.stringify(validPayload),
  })
  expect(unsupportedMediaResponse.status()).toBe(415)

  const formEncodedResponse = await request.post('/consent-events', {
    form: { eventType: validPayload.eventType },
  })
  expect(formEncodedResponse.status()).toBe(415)

  const sensitiveResponse = await request.post('/consent-events', {
    data: {
      eventType: 'save_choices',
      preferences: true,
      assistant: true,
      analytics: false,
      ageConfirmed: true,
      globalPrivacyControl: false,
      sourcePath: '/',
      transcript: 'do not store this',
    },
  })

  expect(sensitiveResponse.status()).toBe(400)

  const punctuatedSensitiveResponse = await request.post('/consent-events', {
    data: {
      eventType: 'save_choices',
      preferences: true,
      assistant: false,
      analytics: false,
      ageConfirmed: false,
      globalPrivacyControl: false,
      sourcePath: '/',
      metadata: {
        'page_context': 'do not store this either',
        'assistant-output': 'also sensitive',
      },
    },
  })

  expect(punctuatedSensitiveResponse.status()).toBe(400)

  const methodResponse = await request.get('/consent-events')
  expect(methodResponse.status()).toBe(405)
  expect(methodResponse.headers().allow).toBe('POST')
})

test('consent events append sanitized JSONL when server-side logging is configured', async () => {
  const port = await getFreePort()
  const tempRoot = mkdtempSync(join(tmpdir(), 'sentientweb-consent-events-'))
  const logPath = join(tempRoot, 'consent-events.jsonl')
  let stderr = ''
  const child = spawn(
    process.execPath,
    [serverScriptPath, '--port', String(port), '--host', '127.0.0.1'],
    {
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        SENTIENT_CONSENT_LOG_PATH: logPath,
        SENTIENT_CONSENT_LOG_SALT: 'playwright-consent-log-test',
      },
      stdio: ['ignore', 'ignore', 'pipe'],
    },
  )

  child.stderr.on('data', (chunk: Buffer) => {
    stderr += chunk.toString('utf8')
  })

  try {
    await waitForHealth(port, () => stderr)

    const response = await fetch(`http://127.0.0.1:${port}/consent-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'accept_all',
        preferences: true,
        assistant: true,
        analytics: true,
        ageConfirmed: true,
        globalPrivacyControl: false,
        sourcePath: '/pricing?email=person@example.com#token',
      }),
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('cache-control')).toBe('no-store')

    const withdrawResponse = await fetch(`http://127.0.0.1:${port}/consent-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'withdraw',
        preferences: true,
        assistant: false,
        analytics: false,
        ageConfirmed: false,
        globalPrivacyControl: false,
        sourcePath: '/pricing',
      }),
    })

    expect(withdrawResponse.status).toBe(204)

    const events = readFileSync(logPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>)

    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({
      eventType: 'accept_all',
      site: new URL(siteUrl).hostname,
      consentVersion: legalVersions.consentVersion,
      privacyPolicyVersion: legalVersions.privacyPolicyVersion,
      cookiePolicyVersion: legalVersions.cookiePolicyVersion,
      aiDisclosureVersion: legalVersions.aiDisclosureVersion,
      necessary: true,
      preferences: true,
      assistant: true,
      analytics: true,
      ageConfirmed: true,
      globalPrivacyControl: false,
      sourcePath: '/pricing',
    })
    expect(events[0].eventId).toEqual(expect.any(String))
    expect(events[0].occurredAt).toEqual(expect.any(String))
    expect(events[0].requestIpHash).toEqual(expect.stringMatching(/^sha256:[a-f0-9]{64}$/))
    expect(events[0].userAgentHash).toEqual(expect.stringMatching(/^sha256:[a-f0-9]{64}$/))
    expect(events[1]).toMatchObject({
      eventType: 'withdraw',
      preferences: true,
      assistant: false,
      analytics: false,
      ageConfirmed: false,
      globalPrivacyControl: false,
      sourcePath: '/pricing',
    })
    expect(events[1].withdrawnAt).toEqual(events[1].occurredAt)
  } finally {
    await stopServerProcess(child)
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('malformed encoded paths return 400 without killing the server', async ({ request }) => {
  const malformed = await request.get('/%E0%A4%A')
  expect(malformed.status()).toBe(400)

  const healthy = await request.get('/pricing')
  expect(healthy.status()).toBe(200)
})

test('invalid or unallowed host headers return 400 without killing the server', async ({ request }) => {
  await expect(requestWithHostHeader('[]')).resolves.toBe(400)

  const healthy = await request.get('/pricing')
  expect(healthy.status()).toBe(200)

  const port = await getFreePort()
  let stderr = ''
  const child = spawn(
    process.execPath,
    [serverScriptPath, '--port', String(port), '--host', '127.0.0.1'],
    {
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        SENTIENT_ALLOWED_HOSTS: 'sentientwebsite.com,127.0.0.1,*.onrender.com',
      },
      stdio: ['ignore', 'ignore', 'pipe'],
    },
  )

  child.stderr.on('data', (chunk: Buffer) => {
    stderr += chunk.toString('utf8')
  })

  try {
    await waitForHealth(port, () => stderr)
    await expect(requestWithHostHeader('evil.example', port)).resolves.toBe(400)
    await expect(requestWithHostHeader('sentientwebsite.com', port)).resolves.toBe(200)
    await expect(requestWithHostHeader('sentientweblanding2-pr-42.onrender.com', port)).resolves.toBe(
      200,
    )
    await expect(requestWithHostHeader('onrender.com', port)).resolves.toBe(400)
  } finally {
    await stopServerProcess(child)
  }
})

test('pricing responses include hardened security headers', async ({ request }) => {
  const response = await request.get('/pricing')
  const headers = response.headers()

  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains')
  const csp = headers['content-security-policy']
  const scriptDirective = csp
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('script-src '))
  const styleDirective = csp
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('style-src '))

  expect(csp).toContain("default-src 'self'")
  expect(csp).toContain("object-src 'none'")
  expect(csp).toContain("script-src-attr 'none'")
  expect(csp).toContain("style-src-attr 'none'")
  expect(csp).toContain("media-src 'self' blob: https://cdn.shopify.com")
  expect(scriptDirective).toContain("'self'")
  expect(scriptDirective).toContain("'sha256-")
  expect(scriptDirective).not.toContain("'unsafe-inline'")
  expect(styleDirective).toBe("style-src 'self' https://fonts.googleapis.com")
})

test('static responses include validators and support conditional requests', async ({ request }) => {
  const response = await request.get('/pricing')
  const headers = response.headers()

  expect(response.status()).toBe(200)
  expect(headers.etag).toMatch(/^W\/"[a-f0-9]+-[a-f0-9]+"$/)
  expect(headers['last-modified']).toBeTruthy()
  expect(headers['content-length']).toMatch(/^\d+$/)

  const cachedResponse = await request.get('/pricing', {
    headers: { 'If-None-Match': headers.etag },
  })

  expect(cachedResponse.status()).toBe(304)
  expect(cachedResponse.headers().etag).toBe(headers.etag)
  expect(cachedResponse.headers()['cache-control']).toBe('no-cache')

  const dateCachedResponse = await request.get('/pricing', {
    headers: { 'If-Modified-Since': headers['last-modified'] },
  })

  expect(dateCachedResponse.status()).toBe(304)

  const strongEtagResponse = await request.get('/pricing', {
    headers: { 'If-None-Match': headers.etag.replace(/^W\//, '') },
  })

  expect(strongEtagResponse.status()).toBe(304)

  const changedEtagResponse = await request.get('/pricing', {
    headers: {
      'If-None-Match': 'W/"definitely-not-current"',
      'If-Modified-Since': headers['last-modified'],
    },
  })

  expect(changedEtagResponse.status()).toBe(200)
})

test('pricing deep links return 200 and appear in sitemap', async ({ request }) => {
  const pricingPaths = [
    '/pricing',
    '/pricing/product',
    '/pricing/service',
    '/pricing/calculator',
    '/pricing/enterprise',
  ]

  for (const path of pricingPaths) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
  }

  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of pricingPaths) {
    expect(sitemap).toContain(absoluteSiteUrl(path))
  }
})

test('legal compliance routes return 200 and appear in sitemap', async ({ request }) => {
  const legalPaths = [
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
  ]

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('<lastmod>2026-05-05</lastmod>')
  expect(sitemap).toContain('<changefreq>weekly</changefreq>')
  expect(sitemap).toContain('<priority>1.0</priority>')

  for (const path of legalPaths) {
    const response = await request.get(path)
    const html = await response.text()

    expect(response.status(), path).toBe(200)
    expect(html).toContain(`href="${absoluteSiteUrl(path)}"`)
    expect(sitemap).toContain(absoluteSiteUrl(path))
  }
})

test('footer exposes legal routes and privacy choices', async ({ page }) => {
  await page.goto('/')

  const footer = page.getByRole('contentinfo')
  const expectedLinks = [
    ['Privacy policy', '/privacy'],
    ['Terms of service', '/terms'],
    ['Cookie policy', '/cookies'],
    ['Billing terms', '/billing-terms'],
    ['Automation notice', '/ai-disclosure'],
    ['Data request', '/data-request'],
    ['Do not sell/share', '/do-not-sell'],
    ['Accessibility', '/accessibility'],
    ['DMCA', '/dmca'],
    ['Security response', '/security-response'],
    ['Unsubscribe', '/unsubscribe'],
    ['Legal notice', '/legal'],
  ] as const

  for (const [name, href] of expectedLinks) {
    await expect(footer.getByRole('link', { name })).toHaveAttribute('href', href)
  }

  await expect(footer.getByRole('button', { name: 'Privacy choices' })).toBeVisible()
})

test('owner-supplied legal facts render on public legal pages', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByText('505 Burrard Street, Vancouver, BC V7X 1M5')).toBeVisible()
  await expect(page.getByText(/Persistent retention lives only with HubSpot and Google/i)).toBeVisible()
  await expect(page.getByText(/do not persist visitor personal information/i)).toBeVisible()
  await expect(page.getByText(/eighteen months/i)).toBeVisible()
  await expect(page.getByText('Data Protection Officer and EU/UK representative are not required')).toBeVisible()

  await page.goto('/terms')
  await expect(page.getByText('operated by Robanka Inc.')).toBeVisible()
  await expect(page.getByText(/Persistent retention lives only with HubSpot and Google/i)).toBeVisible()
  await expect(page.getByText(/eighteen months/i)).toBeVisible()

  await page.goto('/billing-terms')
  await expect(page.getByText('use Stripe as its payment processor')).toBeVisible()

  await page.goto('/dmca')
  await expect(page.getByText('The website does not host user content at scale.')).toBeVisible()
})

test('public legal pages do not expose drafting placeholders', async ({ request }) => {
  const legalPaths = [
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
  ]
  const blockedDraftingTerms = [
    'TBD',
    'PLACEHOLDER',
    'FICTITIOUS',
    'placeholder@',
    'placeholder.example',
    'sentientwebsite.example',
  ]

  for (const path of legalPaths) {
    const response = await request.get(path)
    const html = await response.text()

    expect(response.status(), path).toBe(200)
    for (const term of blockedDraftingTerms) {
      expect(html, `${path} should not expose ${term}`).not.toContain(term)
    }
  }
})

test('public claims avoid unsupported retention, encryption, and certification wording', async ({
  request,
}) => {
  const paths = [
    '/',
    '/about',
    '/trust',
    '/pricing',
    '/revenue-leak-calculator',
    '/solutions/saas',
    '/solutions/home-services',
    '/solutions/healthcare',
    '/solutions/legal',
    '/solutions/financial-services',
  ]
  const blockedClaims = [
    'Zero data retention',
    'zero data retention',
    'zero retention',
    'End-to-end encrypted',
    'End-to-end encryption',
    'end-to-end encryption',
    'SOC 2 pending',
    'Results in 48 hours',
    'in 24-48 hours',
    '55% of demo requests die from slow response.',
    '15-20 emergency calls lost per night',
    '72% of shoppers abandon carts before purchase.',
    '25% booking abandonment',
    '40% of after-hours legal inquiries lost',
    '70% of borrowers choose the first responder',
  ]

  for (const path of paths) {
    const response = await request.get(path)
    const html = await response.text()

    expect(response.status(), path).toBe(200)
    for (const claim of blockedClaims) {
      expect(html, `${path} should not contain ${claim}`).not.toContain(claim)
    }
  }

  const trustHtml = await (await request.get('/trust')).text()
  expect(trustHtml).toContain('SentientWeb is not currently SOC 2 certified.')
})

test('data request page exposes a structured request form', async ({ page }) => {
  await page.goto('/data-request')

  await expect(page.getByLabel('Email or contact identifier')).toBeVisible()
  await expect(page.getByLabel('Country, state, province, or territory')).toBeVisible()
  await expect(page.getByRole('group', { name: 'Request type' })).toBeVisible()
  await expect(page.getByLabel('Access')).toBeVisible()
  await expect(page.getByLabel('Deletion')).toBeVisible()
  await expect(page.getByLabel('Details')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Prepare request email' })).toBeVisible()
})

test('privacy choices are available from the footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Reject optional' }).click()
  await page.getByRole('button', { name: 'Privacy choices' }).click()

  await expect(page.getByRole('heading', { name: 'Manage privacy choices' })).toBeVisible()
  const assistantConsent = page.getByRole('checkbox', { name: /^Live assistant / })
  const ageConfirmation = page.getByRole('checkbox', { name: /^I am 18 or older / })

  await expect(assistantConsent).not.toBeChecked()
  await assistantConsent.check()
  await expect(ageConfirmation).not.toBeChecked()
  await ageConfirmation.check()
  await page.getByRole('button', { name: 'Save choices' }).click()

  await expect(page.getByRole('heading', { name: 'Manage privacy choices' })).toHaveCount(0)
})

test('privacy choices record withdrawal when optional consent is revoked', async ({ page }) => {
  const consentEvents: Record<string, unknown>[] = []
  await page.route('**/consent-events', async (route) => {
    consentEvents.push(JSON.parse(route.request().postData() || '{}') as Record<string, unknown>)
    await route.fulfill({
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Accept all' }).click()
  await expect.poll(() => consentEvents.length).toBe(1)

  await page.getByRole('button', { name: 'Privacy choices' }).click()
  await page.getByRole('checkbox', { name: /^Live assistant / }).uncheck()
  await page.getByRole('button', { name: 'Save choices' }).click()

  await expect.poll(() => consentEvents.length).toBe(2)
  expect(consentEvents[0]).toMatchObject({
    eventType: 'accept_all',
    preferences: true,
    assistant: true,
    analytics: true,
    ageConfirmed: true,
  })
  expect(consentEvents[1]).toMatchObject({
    eventType: 'withdraw',
    preferences: true,
    assistant: false,
    analytics: true,
    ageConfirmed: false,
  })
})

test('privacy choices post path-only source paths', async ({ page }) => {
  const consentEvents: Record<string, unknown>[] = []
  await page.route('**/consent-events', async (route) => {
    consentEvents.push(JSON.parse(route.request().postData() || '{}') as Record<string, unknown>)
    await route.fulfill({
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    })
  })

  await page.goto('/?utm_source=campaign#private-fragment')
  await page.getByRole('button', { name: 'Reject optional' }).click()

  await expect.poll(() => consentEvents.length).toBe(1)
  expect(consentEvents[0]).toMatchObject({
    eventType: 'reject_optional',
    sourcePath: '/',
  })
})

test('privacy choices remain usable when local storage is blocked', async ({ page }) => {
  const pageErrors: string[] = []
  const consentEvents: Record<string, unknown>[] = []

  await page.addInitScript(() => {
    const blockStorage = () => {
      throw new Error('localStorage blocked for test')
    }
    Storage.prototype.getItem = blockStorage
    Storage.prototype.setItem = blockStorage
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.route('**/consent-events', async (route) => {
    consentEvents.push(JSON.parse(route.request().postData() || '{}') as Record<string, unknown>)
    await route.fulfill({
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    })
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Privacy choices' })).toBeVisible()
  await page.getByRole('button', { name: 'Reject optional' }).click()

  await expect.poll(() => consentEvents.length).toBe(1)
  await expect(page.getByRole('heading', { name: 'Privacy choices' })).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('assistant widget loader is absent before consent', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.locator('script[data-sentient-widget-loader]')).toHaveCount(0)
  await expect(page.getByText('Optional assistant and measurement tools load only')).toBeVisible()

  const consentPanel = page.locator('section[aria-labelledby="privacy-choices-title"]')
  const heroCta = page.getByRole('link', { name: 'Book a revenue recovery pilot' }).first()
  await expect(async () => {
    const panelBox = await consentPanel.boundingBox()
    const ctaBox = await heroCta.boundingBox()
    expect(panelBox).not.toBeNull()
    expect(ctaBox).not.toBeNull()
    expect(panelBox!.width).toBeLessThanOrEqual(450)
    expect(panelBox!.x).toBeGreaterThan(900)
    expect(
      panelBox!.x < ctaBox!.x + ctaBox!.width &&
        panelBox!.x + panelBox!.width > ctaBox!.x &&
        panelBox!.y < ctaBox!.y + ctaBox!.height &&
        panelBox!.y + panelBox!.height > ctaBox!.y,
    ).toBe(false)
  }).toPass()
})

test('privacy choices honor Global Privacy Control for analytics', async ({ page }) => {
  const hydrationErrors: string[] = []
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|Hydration failed|did not match|server rendered HTML/i.test(message.text())
    ) {
      hydrationErrors.push(message.text())
    }
  })
  await page.addInitScript((consentVersion) => {
    window.localStorage.setItem(
      `sentientweb:privacy-consent:${consentVersion}`,
      JSON.stringify({
        preferences: true,
        assistant: false,
        analytics: true,
        ageConfirmed: false,
        updatedAt: '2026-05-02T00:00:00.000Z',
      }),
    )
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      configurable: true,
      value: true,
    })
  }, legalVersions.consentVersion)

  await page.goto('/')
  await page.getByRole('button', { name: 'Privacy choices' }).click()

  const analyticsConsent = page.getByRole('checkbox', { name: /^Analytics / })
  await expect(
    page.getByText('Disabled because this browser is sending Global Privacy Control.'),
  ).toBeVisible()
  await expect(analyticsConsent).toBeDisabled()
  await expect(analyticsConsent).not.toBeChecked()
  expect(hydrationErrors).toEqual([])
})

test('pricing analytics events require analytics consent and honor GPC', async ({ page }) => {
  await seedDataLayer(page)
  await page.goto('/pricing')

  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)
  await page.getByRole('button', { name: 'Reject optional' }).click()
  await page.getByRole('button', { name: 'Pilot' }).click()
  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)

  const gpcPage = await page.context().newPage()
  try {
    await clearStoredConsentBeforeNavigation(gpcPage)
    await seedDataLayer(gpcPage, true)
    await gpcPage.goto('/pricing')
    await gpcPage.getByRole('button', { name: 'Accept all' }).click()
    await gpcPage.getByRole('button', { name: 'Pilot' }).click()
    await expect.poll(async () => (await readDataLayer(gpcPage)).length).toBe(0)
  } finally {
    await gpcPage.close()
  }
})

test('pricing analytics events are emitted after analytics consent', async ({ page }) => {
  await seedDataLayer(page)
  await page.goto('/pricing')
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.getByRole('button', { name: 'Pilot' }).click()

  await expect
    .poll(async () =>
      (await readDataLayer(page)).some(
        (event) => event.event === 'plan_selected' && event.plan === 'pilot',
      ),
    )
    .toBe(true)
})

test('revenue calculator analytics events require analytics consent and honor GPC', async ({
  page,
}) => {
  await seedDataLayer(page)
  await page.goto('/revenue-leak-calculator')

  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)
  await page.getByRole('button', { name: 'Reject optional' }).click()
  await page.locator('#monthly-moments').fill('1200')
  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)

  const gpcPage = await page.context().newPage()
  try {
    await clearStoredConsentBeforeNavigation(gpcPage)
    await seedDataLayer(gpcPage, true)
    await gpcPage.goto('/revenue-leak-calculator')
    await gpcPage.getByRole('button', { name: 'Accept all' }).click()
    await gpcPage.locator('#monthly-moments').fill('1200')
    await expect.poll(async () => (await readDataLayer(gpcPage)).length).toBe(0)
  } finally {
    await gpcPage.close()
  }
})

test('revenue calculator analytics events are emitted after analytics consent', async ({ page }) => {
  await seedDataLayer(page)
  await page.goto('/revenue-leak-calculator')
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.locator('#monthly-moments').fill('1200')

  await expect
    .poll(async () =>
      (await readDataLayer(page)).some((event) => event.event === 'leak_input_changed'),
    )
    .toBe(true)
})

test('ROI calculator route returns 200 and appears in sitemap', async ({ request, page }) => {
  const response = await request.get('/revenue-leak-calculator')
  expect(response.status()).toBe(200)

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(absoluteSiteUrl('/revenue-leak-calculator'))

  await page.goto('/revenue-leak-calculator')
  const main = page.locator('main')
  await expect(
    main.getByRole('heading', {
      name: 'Estimate the ROI of recovering revenue-ready website and customer moments.',
    }),
  ).toBeVisible()
  await expect(main.getByText('revenue recovery orchestration').first()).toBeVisible()
  await expect(main.getByText('Estimated recovered demos')).toBeVisible()
  await expect(main.getByText('Estimated pipeline influenced')).toBeVisible()
  await expect(main.getByText('Modeled ROI')).toBeVisible()
  await expect(main.getByRole('radio', { name: /Demo Recovery/i })).toBeVisible()
  await expect(main.getByRole('radio', { name: /Failed Payment Recovery/i })).toBeVisible()
  await expect(main.getByRole('radio', { name: /No-Show Recovery/i })).toBeVisible()
  await expect(main.getByRole('radio', { name: /Buyer Insights/i })).toBeVisible()
  await main.getByRole('radio', { name: /Failed Payment Recovery/i }).click()
  await expect(main.getByText('Estimated revenue retained')).toBeVisible()
  await expect(main.getByText('Payment recovery loop from failed charge to retained revenue.')).toBeVisible()
  await main.getByRole('radio', { name: /No-Show Recovery/i }).click()
  await expect(main.getByText('Estimated pipeline protected')).toBeVisible()
  await main.getByRole('radio', { name: /Buyer Insights/i }).click()
  await expect(main.getByText('Estimated qualified insights')).toBeVisible()
  await expect(main.getByText('Abandoned carts')).toHaveCount(0)
  await expect(main.getByText('Abandoned checkout')).toHaveCount(0)
  await expect(main.getByText('Reviews not replied')).toHaveCount(0)
  await expect(main.getByText('Social comments unanswered')).toHaveCount(0)
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
    'logistics',
  ]

  for (const slug of verticals) {
    const response = await request.get(`/solutions/${slug}`)
    expect(response.status(), slug).toBe(200)
  }

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(absoluteSiteUrl('/solutions/saas'))
  expect(sitemap).toContain(absoluteSiteUrl('/solutions/financial-services'))
  expect(sitemap).toContain(absoluteSiteUrl('/solutions/logistics'))
  expect(sitemap).not.toContain('/solutions/b2b-saas')
  expect(sitemap).not.toContain('/solutions/car-dealerships')
})

test('primary nav links to focused use cases and existing stack orchestration', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary' }).first()
  await expect(nav.getByRole('link', { name: 'Product' })).toHaveAttribute(
    'href',
    '/#features',
  )
  await expect(nav.getByRole('button', { name: 'Product' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Demo Recovery' })).toHaveAttribute(
    'href',
    '/solutions/saas',
  )
  await expect(nav.getByRole('button', { name: 'Use cases' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Pricing' })).toHaveAttribute(
    'href',
    '/pricing',
  )
  await expect(nav.getByRole('link', { name: 'Recovery ROI' })).toHaveAttribute(
    'href',
    '/revenue-leak-calculator',
  )
  await expect(nav.getByRole('button', { name: 'Solutions' })).toHaveCount(0)
  await expect(nav.getByRole('link', { name: 'Financial Services' })).toHaveCount(0)

  const stackButton = nav.getByRole('button', { name: 'Stack orchestration' })
  const useCasesButton = nav.getByRole('button', { name: 'Use cases' })
  await expect(stackButton).toBeVisible()
  await expect(useCasesButton).toBeVisible()
  await expect(async () => {
    const useCasesBox = await useCasesButton.boundingBox()
    const stackBox = await stackButton.boundingBox()
    expect(useCasesBox).not.toBeNull()
    expect(stackBox).not.toBeNull()
    expect(stackBox!.x).toBeGreaterThan(useCasesBox!.x)
  }).toPass()

  await useCasesButton.click()
  await expect(nav.getByRole('link', { name: 'Demo Recovery' }).last()).toHaveAttribute(
    'href',
    '/#demo-recovery',
  )
  await expect(nav.getByRole('link', { name: 'Failed Payment Recovery' })).toHaveAttribute(
    'href',
    '/#failed-payment-recovery',
  )
  await expect(nav.getByRole('link', { name: 'No-Show Recovery' })).toHaveAttribute(
    'href',
    '/#no-show-recovery',
  )
  await expect(nav.getByRole('link', { name: 'Buyer Insights' })).toHaveAttribute(
    'href',
    '/#buyer-insights',
  )

  await stackButton.click()
  await expect(
    nav.getByText('SentientWeb sits above your existing stack, chooses the next revenue action'),
  ).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Orchestration overview' })).toHaveAttribute(
    'href',
    '/orchestrate',
  )
  await expect(nav.getByRole('link', { name: 'HubSpot', exact: true })).toHaveAttribute(
    'href',
    '/integrations/hubspot',
  )
  await expect(nav.getByRole('link', { name: 'Salesforce' })).toHaveAttribute(
    'href',
    '/integrations/salesforce',
  )
  await expect(nav.getByRole('link', { name: 'Pipedrive' })).toHaveAttribute(
    'href',
    '/integrations/pipedrive',
  )
  await expect(nav.getByRole('link', { name: 'API & Webhooks' })).toHaveAttribute(
    'href',
    '/integrations/api-webhooks',
  )
  await expect(nav.getByRole('link', { name: 'Calendly' })).toHaveAttribute(
    'href',
    '/integrations/calendly',
  )

  await expect(nav.getByRole('link', { name: 'Not another chatbot' })).toHaveCount(0)

  await page.setViewportSize({ width: 1024, height: 768 })
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open menu' }).click()

  const dialog = page.getByRole('dialog', { name: 'Menu' })
  await expect(dialog.getByRole('link', { name: 'Product' })).toHaveAttribute(
    'href',
    '/#features',
  )
  await expect(dialog.getByText('Demo-ready detection')).toHaveCount(0)
  await expect(dialog.getByRole('link', { name: 'Demo Recovery' }).first()).toHaveAttribute(
    'href',
    '/solutions/saas',
  )
  await expect(dialog.getByText('Use cases')).toBeVisible()
  await dialog.getByText('Use cases').click()
  await expect(dialog.getByRole('link', { name: 'Demo Recovery' }).last()).toHaveAttribute(
    'href',
    '/#demo-recovery',
  )
  await expect(dialog.getByRole('link', { name: 'Failed Payment Recovery' })).toHaveAttribute(
    'href',
    '/#failed-payment-recovery',
  )
  await expect(dialog.getByRole('link', { name: 'No-Show Recovery' })).toHaveAttribute(
    'href',
    '/#no-show-recovery',
  )
  await expect(dialog.getByRole('link', { name: 'Buyer Insights' })).toHaveAttribute(
    'href',
    '/#buyer-insights',
  )
  await expect(dialog.getByRole('link', { name: 'Recovery ROI' })).toHaveAttribute(
    'href',
    '/revenue-leak-calculator',
  )
  await expect(dialog.getByText('Financial Services')).toHaveCount(0)
  await expect(dialog.getByText('Stack orchestration')).toBeVisible()
  await dialog.getByText('Stack orchestration').click()
  await expect(
    dialog.getByText('SentientWeb sits above your existing stack, chooses the next revenue action'),
  ).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Orchestration overview' })).toHaveAttribute(
    'href',
    '/orchestrate',
  )
  await expect(dialog.getByRole('link', { name: 'HubSpot', exact: true })).toHaveAttribute(
    'href',
    '/integrations/hubspot',
  )
  await expect(dialog.getByRole('link', { name: 'Salesforce' })).toHaveAttribute(
    'href',
    '/integrations/salesforce',
  )
  await expect(dialog.getByRole('link', { name: 'Pipedrive' })).toHaveAttribute(
    'href',
    '/integrations/pipedrive',
  )
  await expect(dialog.getByRole('link', { name: 'API & Webhooks' })).toHaveAttribute(
    'href',
    '/integrations/api-webhooks',
  )
  await expect(dialog.getByRole('link', { name: 'Not another chatbot' })).toHaveCount(0)
})

test('homepage preview URL feeds booking link and closing CTA keeps links outside heading', async ({ page }) => {
  await page.goto('/')

  const previewUrl = 'https://example.com/pricing?plan=pro'
  await page.locator('#preview-url').fill(previewUrl)
  const previewCta = page.getByRole('link', { name: `Request a preview for ${previewUrl}` })
  await expect(previewCta).toHaveAttribute(
    'href',
    `https://calendly.com/tingsong-dai/30min?preview_url=${encodeURIComponent(previewUrl)}`,
  )

  await expect(
    page.getByText('Add the URL so the recovery preview carries the right page context.'),
  ).toBeVisible()
  const closingCta = page.locator('section[aria-labelledby="cta-heading"]')
  await expect(closingCta.getByText('Your Stack, Orchestrated.')).toBeVisible()
  await expect(closingCta.getByText('Your stack stays. SentientWeb orchestrates it.')).toBeVisible()
  await expect(
    closingCta.getByText(
      'Backend revenue recovery service that calls your CRM, billing, scheduler, and messaging tools to complete the next business action.',
    ),
  ).toBeVisible()
  await expect(closingCta.getByText('Keep the SaaS tools you already use.')).toBeVisible()
  await expect(closingCta.getByRole('link', { name: 'See stack orchestration' })).toHaveAttribute(
    'href',
    '/orchestrate',
  )
  await expect(closingCta.getByRole('link', { name: 'Book a revenue recovery review' })).toHaveAttribute(
    'href',
    'https://calendly.com/tingsong-dai/30min',
  )
  await expect(closingCta.locator('h2#cta-heading a')).toHaveCount(0)
  await expect(closingCta.locator('h2#cta-heading').getByText('Book a 30-day pilot')).toHaveCount(0)
  await expect(closingCta.getByText('Detect, qualify, act, sync.')).toHaveCount(0)
})

test('orchestrate page renders the stack orchestration story', async ({ page, request }) => {
  const response = await request.get('/orchestrate')
  expect(response.status()).toBe(200)

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(absoluteSiteUrl('/orchestrate'))

  await page.goto('/orchestrate')
  await expect(
    page.getByRole('heading', { name: 'The orchestration layer above your existing stack.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'HubSpot use case' })).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'The orchestration layer improves from every recovered outcome.',
    }),
  ).toBeVisible()
  await expect(page.getByText('Outcome feedback improves future routing.')).toBeVisible()
  await expect(page.getByText('Repeated objections become repair work.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Not another chatbot' })).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Start with one measurable orchestration path.' }),
  ).toHaveCount(0)
  await expect(page.getByRole('heading', { name: /ManyChat story/i })).toBeVisible()
  await expect(page.getByText('what HubSpot should do')).toBeVisible()
  await expect(page.getByText('what business action should happen next')).toBeVisible()
  await expect(page.getByTestId('tool-story-section')).toHaveCount(9)
  await expect(page.getByText('SentientWeb decision').first()).toBeVisible()
  await expect(page.getByText('Tool action').first()).toBeVisible()
  await expect(page.getByText('Sales result').first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Orchestrate page sections' })).toHaveCount(0)
  const integrationsStrip = page.locator('section[aria-labelledby="integrations-strip-heading"]')
  await expect(integrationsStrip).toHaveClass(/integration-logo-strip/)
  await expect(
    integrationsStrip.getByRole('heading', {
      name: 'SentientWeb uses your existing stack as the execution layer for revenue recovery',
    }),
  ).toBeVisible()
  const integrationLogoList = integrationsStrip.getByRole('list', {
    name: 'Existing tech stack logos',
  })
  await expect(integrationLogoList.locator('img')).toHaveCount(18)
  await expect(integrationLogoList.getByRole('img', { name: 'HubSpot logo' })).toBeVisible()
  await expect(integrationLogoList.getByRole('img', { name: 'ManyChat logo' })).toHaveCount(0)
  await expect(integrationsStrip.locator('.integration-logo-track[aria-hidden="true"] img')).toHaveCount(18)
  await expect(integrationsStrip.getByRole('link')).toHaveCount(0)
})

test('pricing plan selector highlights selected plans and dims the other cards', async ({ page }) => {
  await page.goto('/pricing/product')

  const pilotButton = page.getByRole('button', { name: 'Pilot' })
  const starterButton = page.getByRole('button', { name: 'Monthly' })
  await expect(pilotButton).toHaveAttribute('aria-pressed', 'true')
  await expect(starterButton).toHaveAttribute('aria-pressed', 'false')

  await expect(page.getByTestId('pricing-card-pilot')).toHaveCSS('opacity', '1')
  await expect(page.getByTestId('pricing-card-starter')).toHaveCSS('opacity', '0.6')

  await starterButton.click()
  await expect(starterButton).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('pricing-card-pilot')).toHaveCSS('opacity', '0.6')
  await expect(page.getByTestId('pricing-card-starter')).toHaveCSS('opacity', '1')
})

test('pricing calculator updates estimates and CTAs use Calendly', async ({ page }) => {
  await page.goto('/pricing/calculator')

  await expect(
    page.getByRole('heading', { name: 'Model recovered outcomes across your revenue stack.' }),
  ).toBeVisible()
  await expect(page.getByRole('radio', { name: /Demo Recovery/i })).toHaveAttribute(
    'aria-checked',
    'true',
  )
  await expect(page.getByRole('radio', { name: /Failed Payment Recovery/i })).toBeVisible()
  await expect(page.getByTestId('calculator-recovered-demos')).toHaveText('10')
  await expect(page.getByTestId('calculator-pipeline-influenced')).toHaveText('$36,000')
  await expect(page.getByTestId('calculator-modeled-roi')).toHaveText('3,600%')

  await page.locator('#average-value').fill('30000')
  await expect(page.getByTestId('calculator-pipeline-influenced')).toHaveText('$90,000')

  await page.getByRole('radio', { name: /Failed Payment Recovery/i }).click()
  await expect(page.getByText('Estimated revenue retained')).toBeVisible()
  await expect(page.locator('#monthly-moments')).toHaveValue('300')

  const cta = page.getByRole('link', { name: 'Book a revenue recovery pilot' }).first()
  await expect(cta).toHaveAttribute('href', 'https://calendly.com/tingsong-dai/30min')
})

test('ICP objections are answered on homepage, pricing, and integration pages', async ({ page, request }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      name: 'Do not buy demo recovery if the context lands in the wrong system.',
    }),
  ).toHaveCount(0)
  await expect(page.getByText('Public proof rights are optional')).toHaveCount(0)
  await expect(page.getByText('pilot proof packet shows baseline pages')).toHaveCount(0)
  await expect(page.getByText('Does this replace anything?')).toHaveCount(0)
  await expect(page.getByText('What about SOC 2 or BAA review?')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Bring your hardest buyer questions into the preview.' }),
  ).toHaveCount(0)
  await expect(page.getByText('Healthcare SaaS')).toHaveCount(0)
  await expect(page.getByText('Logistics and vertical SaaS')).toHaveCount(0)

  await page.goto('/pricing')
  await page.getByText('Do we need a specific CRM?').click()
  await expect(page.getByText('SentientWeb sits above your stack')).toBeVisible()
  await expect(page.getByText('CRM, scheduler, billing tool')).toBeVisible()
  await page.getByText('Can this work with our scheduler or routing tools?').click()
  await expect(page.getByText('scheduler, router, territory path')).toBeVisible()
  await page.getByText('Are case-study rights required?').click()
  await expect(page.getByText('No. Published proof rights are optional')).toBeVisible()
  await page.getByText('How do you prove incrementality?').click()
  await expect(page.getByText('The proof packet includes')).toBeVisible()
  await page.getByText('How are AI answer quality and security handled?').click()
  await expect(page.getByText('Answers are grounded in approved source content')).toBeVisible()
  await page.getByText('What does the annual tier include?').click()
  await expect(page.getByText('Annual pricing can lock Starter or Growth volume')).toBeVisible()
  await page.getByText('What if procurement needs SOC 2 or a BAA?').click()
  await expect(page.getByText('SentientWeb is not currently SOC 2 certified')).toBeVisible()
  await expect(page.getByText('Modeled pricing only')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Price around recovered revenue actions.' })).toBeVisible()

  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/integrations/salesforce', '/integrations/pipedrive', '/integrations/api-webhooks']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(sitemap).toContain(absoluteSiteUrl(path))
  }

  await page.goto('/integrations/salesforce')
  await expect(page.getByText('Call Salesforce when the sales handoff is clear.')).toBeVisible()
  await expect(page.getByText('credible enough for reps to act on')).toBeVisible()

  await page.goto('/integrations/pipedrive')
  await expect(page.getByText('Call Pipedrive without forcing a CRM migration.')).toBeVisible()

  await page.goto('/integrations/api-webhooks')
  await expect(page.getByText('Call a webhook when the workflow needs a custom handoff.')).toBeVisible()

  await page.goto('/integrations/hubspot')
  await expect(page.getByText('Works with the HubSpot workspace and workflow shape')).toBeVisible()

  await page.goto('/integrations/calendly')
  await expect(page.getByText('Call your scheduler when the visitor is qualified.')).toBeVisible()

  await page.goto('/trust')
  await expect(page.getByRole('heading', { name: 'Procurement gates for regulated buyers' })).toBeVisible()
  await expect(page.getByText('not currently offering a blanket BAA')).toBeVisible()

  await page.goto('/solutions/healthcare')
  await expect(
    page.getByRole('heading', { name: 'Recover healthcare SaaS buyers who stall on trust questions' }),
  ).toBeVisible()
  await expect(page.getByText('non-PHI demo qualification')).toBeVisible()

  await page.goto('/solutions/insurance')
  await expect(
    page.getByRole('heading', {
      name: 'Recover insurance SaaS buyers who stall on risk and workflow fit',
    }),
  ).toBeVisible()

  await page.goto('/solutions/edtech')
  await expect(
    page.getByRole('heading', { name: 'Recover corporate training buyers before they leave' }),
  ).toBeVisible()

  await page.goto('/solutions/financial-services')
  await expect(
    page.getByRole('heading', {
      name: 'Recover fintech buyers who stall on trust and integration questions',
    }),
  ).toBeVisible()

  await page.goto('/solutions/logistics')
  await expect(
    page.getByRole('heading', {
      name: 'Recover logistics buyers who stall on workflow and integration fit',
    }),
  ).toBeVisible()
})

test('homepage and solution pages render new positioning and trust disclosure', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      name: 'Revenue recovery orchestration for modern subscription businesses.',
    }),
  ).toBeVisible()
  await expect(
    page.getByText(
      'SentientWeb finds revenue leaks across your website, billing, CRM, scheduler, and messaging stack, then calls the right tool to recover the moment.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'One operating layer from revenue intent to recovered action.',
    }),
  ).toBeVisible()
  const features = page.locator('#features')
  await expect(features).toHaveClass(/cinematic-funnel/)
  await expect(page.locator('.funnel-scroll-feature')).toHaveCount(0)
  await expect(features).toContainText('Top of the funnel')
  await expect(features).toContainText('Mid-funnel')
  await expect(features).toContainText('Bottom of the funnel')
  await expect(features).toContainText('High-intent page detection')
  await expect(features).toContainText('Business-goal orchestration')
  await expect(features).toContainText('Text and email reminders')
  await expect(
    features.getByRole('heading', { name: 'What better recovery can move.' }),
  ).toBeVisible()
  await expect(features.locator('.recovery-target-card')).toHaveCount(4)
  await expect(
    features.getByText(
      'Recover more demo-ready visitors from pricing, comparison, security, and integration pages.',
    ),
  ).toBeVisible()
  await expect(
    features.getByText(
      'Recover failed payments and cancellation-risk accounts before avoidable churn closes.',
    ),
  ).toBeVisible()
  await expect(
    features.getByText(
      'Bring missed meetings back with context-aware reminders and low-friction reschedule paths.',
    ),
  ).toBeVisible()
  await expect(
    features.getByText(
      'Surface more recurring objections, revenue friction, and repair work from live buyer behavior.',
    ),
  ).toBeVisible()
  for (const [metric, label, tone, color] of [
    ['Up to 80% Demo booking lift', 'Demo booking lift', 'demo', 'rgb(167, 139, 250)'],
    ['Up to 45% Payment recovery', 'Payment recovery', 'payment', 'rgb(85, 214, 255)'],
    ['Up to 30% No-show reduction', 'No-show reduction', 'meeting', 'rgb(255, 206, 92)'],
    ['Up to 80% Buyer insight lift', 'Buyer insight lift', 'insights', 'rgb(255, 138, 203)'],
  ] as const) {
    const targetCard = features.locator('.recovery-target-card').filter({ hasText: label })
    await expect(targetCard).toHaveClass(new RegExp(`recovery-target-card--${tone}`))
    await expect(targetCard.locator('.recovery-target-card__stat')).toContainText(metric)
    expect(
      await targetCard
        .locator('.recovery-target-card__stat')
        .evaluate((el) => getComputedStyle(el).color),
    ).toBe(color)
  }
  await expect(features.locator('[data-testid="cinematic-funnel-particles"] > span')).toHaveCount(54)
  await expect(features.locator('[data-testid="cinematic-funnel-particles"] > span[style]')).toHaveCount(0)
  await expect(features.locator('.cinematic-funnel-anchor[style]')).toHaveCount(0)
  await expect(
    page.getByRole('heading', {
      name: 'Recover revenue when intent already exists.',
    }),
  ).toBeVisible()
  const revenueLeaks = page.locator('#revenue-recovery-use-cases')
  await expect(revenueLeaks.getByText('Revenue recovery use cases')).toBeVisible()
  await expect(revenueLeaks.locator('.ambient-video-fallback')).toHaveCount(0)
  await expect(revenueLeaks.locator('video[data-ambient-video]')).toHaveCount(0)
  await expect(revenueLeaks.getByText('Core workflow')).toBeVisible()
  await expect(revenueLeaks.getByText('Payment recovery', { exact: true })).toBeVisible()
  await expect(revenueLeaks.getByText('Meeting recovery')).toBeVisible()
  await expect(revenueLeaks.getByText('Revenue insights')).toBeVisible()
  await expect(revenueLeaks.getByRole('heading', { name: 'Demo Recovery' })).toBeVisible()
  await expect(revenueLeaks.getByRole('heading', { name: 'Failed Payment Recovery' })).toBeVisible()
  await expect(revenueLeaks.getByRole('heading', { name: 'No-Show Recovery' })).toBeVisible()
  await expect(revenueLeaks.getByRole('heading', { name: 'Buyer Insights' })).toBeVisible()
  for (const useCaseTheme of [
    {
      heading: 'Demo Recovery',
      id: 'demo-recovery',
      themeClass: 'use-case-theme--purple',
      color: 'rgb(167, 139, 250)',
    },
    {
      heading: 'Failed Payment Recovery',
      id: 'failed-payment-recovery',
      themeClass: 'use-case-theme--blue',
      color: 'rgb(85, 214, 255)',
    },
    {
      heading: 'No-Show Recovery',
      id: 'no-show-recovery',
      themeClass: 'use-case-theme--yellow',
      color: 'rgb(255, 206, 92)',
    },
    {
      heading: 'Buyer Insights',
      id: 'buyer-insights',
      themeClass: 'use-case-theme--pink',
      color: 'rgb(255, 138, 203)',
    },
  ]) {
    const card = revenueLeaks
      .getByRole('heading', { name: useCaseTheme.heading })
      .locator('xpath=ancestor::article[1]')
    await expect(card).toHaveClass(new RegExp(useCaseTheme.themeClass))
    await expect(page.locator(`#${useCaseTheme.id}`)).toHaveClass(
      new RegExp(useCaseTheme.themeClass),
    )
    expect(
      await card.locator('.use-case-accent-pill').evaluate((el) => getComputedStyle(el).color),
    ).toBe(useCaseTheme.color)
  }
  for (const useCaseSection of [
    {
      id: 'demo-recovery',
      heading: 'Give high-intent visitors a demo trailer before they leave.',
      storyboard: 'Demo Recovery storyboard',
      surface: 'Meeting path opened',
    },
    {
      id: 'failed-payment-recovery',
      heading: 'Recover payment and cancellation risk before revenue walks away.',
      storyboard: 'Failed Payment Recovery storyboard',
      surface: 'Save path opened',
    },
    {
      id: 'no-show-recovery',
      heading: 'Recover no-shows while the buying context is still usable.',
      storyboard: 'No-Show Recovery storyboard',
      surface: 'Meeting rescheduled',
    },
    {
      id: 'buyer-insights',
      heading: 'Turn buyer hesitation into weekly revenue repair work.',
      storyboard: 'Buyer Insights storyboard',
      surface: 'Repair work queued',
    },
  ]) {
    const section = page.locator(`#${useCaseSection.id}`)
    await expect(section.getByRole('heading', { name: useCaseSection.heading })).toBeVisible()
    await expect(section.locator('article').getByText('Use case', { exact: true }).first()).toBeVisible()
    await expect(section.getByText('Storyboard walkthrough')).toHaveCount(0)
    await expect(
      section.getByText('Four image-led moments show the workflow from the first signal'),
    ).toHaveCount(0)
    await expect(section.getByText('Walkthrough diagram')).toHaveCount(0)
    await expect(section.getByRole('list', { name: useCaseSection.storyboard })).toBeVisible()
    await expect(section.locator('.use-case-storyboard__panel')).toHaveCount(4)
    await expect(section.getByText(useCaseSection.surface)).toBeVisible()
  }
  for (const removedVertical of [
    'Home Services',
    'Insurance',
    'Ecommerce',
    'Healthcare',
    'EdTech',
    'Hospitality',
    'Real Estate',
    'Legal',
    'Financial Services',
  ]) {
    await expect(revenueLeaks.getByText(removedVertical, { exact: true })).toHaveCount(0)
  }
  await expect(
    page.getByRole('heading', { name: /Your.*buyers.*are already on.*the site/i }),
  ).toHaveCount(0)
  const sectionOrder = await page.evaluate(() => {
    const ids = ['revenue-recovery-use-cases', 'instant-demo-preview', 'features']
    return ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? 0)
  })
  expect(sectionOrder[0]).toBeLessThan(sectionOrder[1])
  expect(sectionOrder[1]).toBeLessThan(sectionOrder[2])
  await expect(page.getByRole('heading', { name: 'Give high-intent visitors a demo trailer before they leave.' })).toBeVisible()
  const integrationsStrip = page.locator('section[aria-labelledby="integrations-strip-heading"]')
  await expect(integrationsStrip).toHaveClass(/integration-logo-strip/)
  await expect(
    integrationsStrip.getByRole('heading', {
      name: 'SentientWeb uses your existing stack as the execution layer for revenue recovery',
    }),
  ).toBeVisible()
  const integrationLogoList = integrationsStrip.getByRole('list', {
    name: 'Existing tech stack logos',
  })
  await expect(integrationLogoList.locator('img')).toHaveCount(18)
  for (const logoName of [
    'HubSpot',
    'Salesforce',
    'Pipedrive',
    'API and Webhooks',
    'Calendly',
    'WordPress',
    'Webflow',
    'Shopify',
    'Wix',
    'OpenAI',
    'Claude',
    'Gemini',
    'Warmly',
    'Podium',
    'HighLevel',
    'Drift',
    'Chili Piper',
    'Custom stack',
  ]) {
    await expect(integrationLogoList.getByRole('img', { name: `${logoName} logo` })).toBeVisible()
  }
  await expect(integrationsStrip.locator('.integration-logo-track[aria-hidden="true"] img')).toHaveCount(18)
  await expect(integrationsStrip.locator('.integration-logo-track[aria-hidden="true"] img').first()).toHaveAttribute(
    'alt',
    '',
  )
  expect(
    await integrationsStrip.evaluate((el) =>
      getComputedStyle(el).backgroundImage.includes('linear-gradient'),
    ),
  ).toBe(true)
  await expect(
    page.getByText(
      'Recover high-intent visitors from pricing, demo, comparison, integration, security, and customer story pages.',
    ),
  ).toHaveCount(0)
  await expect(
    page.getByText(
      'We are digital plumbers for your revenue leaks, but the first leak we fix is demo intent.',
    ),
  ).toHaveCount(0)
  await expect(
    page.getByText('Appointment-Ready Visitor Recovery for service businesses').first(),
  ).toHaveCount(0)
  await expect(page.getByText('Emerging path / early access')).toHaveCount(0)
  await expect(
    page.getByRole('heading', {
      name: 'Find the demo-intent leak on your own site.',
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'The pilot is designed to answer the questions your CEO, RevOps, and sales leader will ask.',
    }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('heading', {
      name: 'Built for subscription businesses with revenue moments to recover.',
    }),
  ).toBeVisible()
  const roiCalculatorSection = page.locator('section[aria-label="ROI calculator"]').first()
  await expect(roiCalculatorSection.locator('video')).toHaveAttribute('src', roiCtaVideoUrl)
  const roiCalculatorLink = roiCalculatorSection.getByRole('link', {
    name: 'Estimate recoverable demos in the last 30 days.',
  })
  await expect(roiCalculatorLink).toHaveAttribute('href', '/revenue-leak-calculator')
  await expect(roiCalculatorLink).toHaveClass(/ai-rainbow-cta/)
  await expect(roiCalculatorLink.locator('.ai-rainbow-cta__label')).toHaveText(
    'Estimate recoverable demos in the last 30 days.',
  )
  await expect(roiCalculatorLink.locator('.ai-rainbow-cta__sparkles')).toHaveAttribute(
    'aria-hidden',
    'true',
  )
  await expect(roiCalculatorLink.locator('.ai-rainbow-cta__sparkles > span')).toHaveCount(6)
  await expect(roiCalculatorLink.locator('.ai-rainbow-cta__sparkles > span[style]')).toHaveCount(
    0,
  )
  expect(
    await roiCalculatorLink.evaluate((el) =>
      getComputedStyle(el).backgroundImage.includes('conic-gradient'),
    ),
  ).toBe(true)
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.goto('/solutions/saas')
  await expect(page.getByRole('heading', { name: 'Recover high-intent revenue moments before they disappear.' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'What better recovery can move.' }),
  ).toBeVisible()
  await expect(page.locator('.recovery-target-card')).toHaveCount(4)
  await expect(
    page.getByText(
      'Recover more demo-ready visitors from pricing, comparison, security, and integration pages.',
    ),
  ).toBeVisible()
  await expect(
    page.getByText(
      'Recover failed payments and cancellation-risk accounts before avoidable churn closes.',
    ),
  ).toBeVisible()
  await expect(
    page.getByText(
      'Bring missed meetings back with context-aware reminders and low-friction reschedule paths.',
    ),
  ).toBeVisible()
  await expect(
    page.getByText(
      'Surface more recurring objections, revenue friction, and repair work from live buyer behavior.',
    ),
  ).toBeVisible()
  await expect(page.getByText('Modeled targets. Actual results depend on traffic quality')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'The revenue recovery journey, start to finish.' }),
  ).toBeVisible()
  await expect(page.getByText('Visitor arrives on a high-intent page')).toBeVisible()
  await expect(page.getByText('AI detects demo intent')).toBeVisible()
  await expect(page.getByText('AI engages with page-specific help')).toBeVisible()
  await expect(page.getByText('AI qualifies fit before booking')).toBeVisible()
  await expect(page.getByText('Qualified demo gets booked')).toBeVisible()
  await expect(page.getByText('Sales receives the full CRM context')).toBeVisible()
  await expect(page.getByText('Text and email reminders go out')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'The prospect shows up to the demo meeting.' }),
  ).toBeVisible()
  await expect(page.getByText('AI orchestration layer').first()).toBeVisible()
  await expect(page.getByText('Human handoff when needed').first()).toBeVisible()
  await expect(page.getByText('Stack-ready context').first()).toBeVisible()
  await expect(page.getByText('Encrypted action paths').first()).toBeVisible()
  await expect(page.getByText('Result-based pricing').first()).toBeVisible()
  await expect(page.getByText('Aligned to recovered revenue').first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Result-based pricing/i }).first()).toHaveAttribute(
    'href',
    '/pricing',
  )
  await expect(page.getByText('Retention controls')).toHaveCount(0)
  await expect(page.getByText('18-month maximum disclosed')).toHaveCount(0)
  await expect(page.getByText('Powered by AI')).toHaveCount(0)
  await expect(page.getByText('Human support always available')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Transparent by design' })).toBeVisible()
})

test('revenue recovery use-case cards render on mobile without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const acceptButton = page.getByRole('button', { name: 'Accept all' })
  if (await acceptButton.isVisible()) {
    await acceptButton.click()
  }

  const useCases = page.locator('#revenue-recovery-use-cases')
  const demoRecoveryCard = useCases.getByRole('heading', { name: 'Demo Recovery' }).locator('..')
  await demoRecoveryCard.scrollIntoViewIfNeeded()

  await expect(demoRecoveryCard).toBeVisible()
  await expect(demoRecoveryCard.getByText('Core workflow')).toBeVisible()
  await expect(demoRecoveryCard.getByText('Recovered actions measured across the stack.')).toBeVisible()

  const metrics = await demoRecoveryCard.evaluate((el) => {
    const rect = el.getBoundingClientRect()
    return {
      height: rect.height,
      width: rect.width,
      x: rect.x,
    }
  })

  expect(metrics.height).toBeGreaterThanOrEqual(260)
  expect(metrics.width).toBeLessThanOrEqual(390)
  expect(metrics.x).toBeGreaterThanOrEqual(0)

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1
  })
  expect(hasHorizontalOverflow).toBe(false)
})

test('home hash navigation respects section scroll margins', async ({ page }) => {
  await page.goto('/#features')

  const targetTop = await page.locator('#features').evaluate((el) => {
    return el.getBoundingClientRect().top
  })

  expect(targetTop).toBeGreaterThanOrEqual(80)
})

test('cinematic funnel mobile layout stays scroll-driven without horizontal overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#features')

  const features = page.locator('#features')
  await expect(features).toHaveClass(/cinematic-funnel/)
  await expect(page.locator('.funnel-scroll-feature')).toHaveCount(0)
  await expect(features.locator('.cinematic-funnel-pin')).toBeVisible()
  await expect(features.locator('.cinematic-funnel-copy')).toBeVisible()
  await expect(features.locator('.cinematic-funnel-stage')).toBeVisible()
  await expect(features.locator('.cinematic-funnel-side')).toBeVisible()
  await expect(features.locator('.cinematic-funnel-mobile-list')).toBeHidden()
  await expect(features.locator('[data-testid="cinematic-funnel-particles"] > span')).toHaveCount(54)
  await expect(features.locator('[data-testid="cinematic-funnel-particles"] > span[style]')).toHaveCount(0)
  await expect(features.locator('.cinematic-funnel-anchor[style]')).toHaveCount(0)

  await features.evaluate((el) => {
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY)
  })

  const mobileLayout = await page.evaluate(() => {
    const readRect = (selector: string) => {
      const element = document.querySelector(selector)
      if (!element) return null
      const rect = element.getBoundingClientRect()
      return {
        bottom: rect.bottom,
        height: rect.height,
        top: rect.top,
        width: rect.width,
      }
    }

    return {
      copy: readRect('.cinematic-funnel-copy'),
      pinPosition: getComputedStyle(document.querySelector('.cinematic-funnel-pin')!).position,
      side: readRect('.cinematic-funnel-side'),
      stage: readRect('.cinematic-funnel-stage'),
      viewportHeight: window.innerHeight,
    }
  })

  expect(mobileLayout.pinPosition).toBe('sticky')
  for (const zone of [mobileLayout.copy, mobileLayout.stage]) {
    expect(zone?.width).toBeGreaterThan(0)
    expect(zone?.height).toBeGreaterThan(0)
    expect(zone?.top).toBeGreaterThanOrEqual(-1)
  }

  const initialStep = await features.getAttribute('data-active-step')
  await features.evaluate((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top + (el as HTMLElement).offsetHeight * 0.52)
  })
  await expect
    .poll(async () => features.getAttribute('data-active-step'))
    .not.toBe(initialStep)

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1
  })
  expect(hasHorizontalOverflow).toBe(false)
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
  const hydrationErrors: string[] = []
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|Hydration failed|did not match|server rendered HTML/i.test(message.text())
    ) {
      hydrationErrors.push(message.text())
    }
  })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const videos = page.locator('video[data-ambient-video]')
  await expect(videos).toHaveCount(0)
  await expect(page.locator('video[data-hero-background-video]')).toHaveCount(0)
  expect(hydrationErrors).toEqual([])
})

test('homepage visual assets use approved sources before consent', async ({ page, request }) => {
  const thirdPartyAssetRequests: string[] = []
  page.on('request', (assetRequest) => {
    const url = assetRequest.url()
    const isAllowedFavicon = url === faviconUrl
    const isAllowedRoiCtaVideo = url === roiCtaVideoUrl
    if (
      url.includes('cdn.worldvectorlogo.com') ||
      (url.includes('cdn.shopify.com') && !isAllowedFavicon && !isAllowedRoiCtaVideo)
    ) {
      thirdPartyAssetRequests.push(url)
    }
  })

  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      name: 'Revenue recovery orchestration for modern subscription businesses.',
    }),
  ).toBeVisible()
  await expect(
    page.locator('section[aria-labelledby="hero-heading"] video[data-hero-background-video]'),
  ).toHaveAttribute('src', roiCtaVideoUrl)

  const html = await (await request.get('/')).text()
  expect(html).not.toContain('cdn.worldvectorlogo.com')
  expect(html).toContain(faviconUrl)
  expect(html).toContain(roiCtaVideoUrl)
  expect(thirdPartyAssetRequests).toEqual([])
})

test('social links do not point to generic placeholder domains', async ({ request }) => {
  const response = await request.get('/')
  const html = await response.text()

  expect(html).not.toContain('href="https://x.com"')
  expect(html).not.toContain('href="https://github.com"')
  expect(html).toContain('href="https://github.com/TingsongD/sentientwebsite.com"')
})
