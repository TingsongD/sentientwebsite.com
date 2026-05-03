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
    expect.arrayContaining(['WebSite', 'Organization', 'SoftwareApplication']),
  )

  const pricingResponse = await request.get('/pricing')
  const pricingSchema = readJsonLd(await pricingResponse.text())
  expect(pricingSchema).toMatchObject({
    '@type': 'WebPage',
    url: absoluteSiteUrl('/pricing'),
    name: 'SentientWeb Pricing | Pay Only for Recovered Revenue',
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
    ['/pricing', '<title>SentientWeb Pricing | Pay Only for Recovered Revenue</title>'],
    ['/pricing/product', '<title>Product Track Pricing | SentientWeb</title>'],
    ['/pricing/service', '<title>Service Track Pricing | SentientWeb</title>'],
    ['/pricing/calculator', '<title>Revenue Recovery Calculator | SentientWeb</title>'],
    ['/pricing/enterprise', '<title>Enterprise Pricing | SentientWeb</title>'],
    ['/revenue-leak-calculator', '<title>Revenue Leak Calculator | SentientWeb</title>'],
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
    expect(html).toContain(`href="${absoluteSiteUrl(path)}"`)
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
  expect(body).toContain('Contact: mailto:hello@sentientwebsite.com')
  expect(body).toContain(`Policy: ${absoluteSiteUrl('/security-response')}`)
  expect(body).toContain(`Canonical: ${absoluteSiteUrl('/.well-known/security.txt')}`)
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
  await expect(page.getByText('The public website does not host user content at scale.')).toBeVisible()
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
  await page.goto('/')

  await expect(page.locator('script[data-sentient-widget-loader]')).toHaveCount(0)
  await expect(page.getByText('loads only after you consent')).toBeVisible()
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
  await page.getByRole('button', { name: 'I sell products online' }).click()
  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)

  const gpcPage = await page.context().newPage()
  try {
    await clearStoredConsentBeforeNavigation(gpcPage)
    await seedDataLayer(gpcPage, true)
    await gpcPage.goto('/pricing')
    await gpcPage.getByRole('button', { name: 'Accept all' }).click()
    await gpcPage.getByRole('button', { name: 'I sell products online' }).click()
    await expect.poll(async () => (await readDataLayer(gpcPage)).length).toBe(0)
  } finally {
    await gpcPage.close()
  }
})

test('pricing analytics events are emitted after analytics consent', async ({ page }) => {
  await seedDataLayer(page)
  await page.goto('/pricing')
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.getByRole('button', { name: 'I sell products online' }).click()

  await expect
    .poll(async () =>
      (await readDataLayer(page)).some(
        (event) => event.event === 'track_selected' && event.track === 'product',
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
  await page.locator('#monthly-social-comments').fill('120')
  await expect.poll(async () => (await readDataLayer(page)).length).toBe(0)

  const gpcPage = await page.context().newPage()
  try {
    await clearStoredConsentBeforeNavigation(gpcPage)
    await seedDataLayer(gpcPage, true)
    await gpcPage.goto('/revenue-leak-calculator')
    await gpcPage.getByRole('button', { name: 'Accept all' }).click()
    await gpcPage.locator('#monthly-social-comments').fill('120')
    await expect.poll(async () => (await readDataLayer(gpcPage)).length).toBe(0)
  } finally {
    await gpcPage.close()
  }
})

test('revenue calculator analytics events are emitted after analytics consent', async ({ page }) => {
  await seedDataLayer(page)
  await page.goto('/revenue-leak-calculator')
  await page.getByRole('button', { name: 'Accept all' }).click()
  await page.locator('#monthly-social-comments').fill('120')

  await expect
    .poll(async () =>
      (await readDataLayer(page)).some((event) => event.event === 'leak_input_changed'),
    )
    .toBe(true)
})

test('ROI calculator route returns 200, appears in sitemap, and is in primary nav', async ({ request, page }) => {
  const response = await request.get('/revenue-leak-calculator')
  expect(response.status()).toBe(200)

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain(absoluteSiteUrl('/revenue-leak-calculator'))

  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' }).first()
  await expect(nav.getByRole('link', { name: 'ROI Calculator' })).toHaveAttribute(
    'href',
    '/revenue-leak-calculator',
  )
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
  expect(sitemap).toContain(absoluteSiteUrl('/solutions/saas'))
  expect(sitemap).toContain(absoluteSiteUrl('/solutions/financial-services'))
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

test('pricing track selector highlights selected tracks and dims the other card', async ({ page }) => {
  await page.goto('/pricing/product')

  const productButton = page.getByRole('button', { name: 'I sell products online' })
  const serviceButton = page.getByRole('button', { name: 'I book appointments' })
  await expect(productButton).toHaveAttribute('aria-pressed', 'true')
  await expect(serviceButton).toHaveAttribute('aria-pressed', 'false')

  await expect(page.getByTestId('pricing-card-product')).toHaveCSS('opacity', '1')
  await expect(page.getByTestId('pricing-card-service')).toHaveCSS('opacity', '0.6')

  await serviceButton.click()
  await expect(serviceButton).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('pricing-card-product')).toHaveCSS('opacity', '0.6')
  await expect(page.getByTestId('pricing-card-service')).toHaveCSS('opacity', '1')
})

test('pricing calculator updates estimates and CTAs use Calendly', async ({ page }) => {
  await page.goto('/pricing/calculator')

  await expect(page.getByTestId('calculator-recovered-revenue')).toHaveText('$52,500')
  await page.locator('#product-aov').selectOption('250')
  await expect(page.getByTestId('calculator-recovered-revenue')).toHaveText('$131,250')

  await page.getByRole('button', { name: 'Service estimate' }).click()
  await expect(page.getByTestId('calculator-recovered-revenue')).toHaveText('$75,000')

  const cta = page.getByRole('link', { name: 'Start Free Pilot' }).first()
  await expect(cta).toHaveAttribute('href', 'https://calendly.com/tingsong-dai/30min')
})

test('homepage and solution pages render new positioning and trust disclosure', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'We are digital plumbers for your revenue leaks.' }),
  ).toBeVisible()

  await page.goto('/solutions/saas')
  await expect(page.getByRole('heading', { name: 'We fix the leaks in your demo pipeline' })).toBeVisible()
  await expect(page.getByText('Powered by AI').first()).toBeVisible()
  await expect(page.getByText('Encrypted in transit').first()).toBeVisible()
  await expect(page.getByText('Retention controls').first()).toBeVisible()
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
  expect(hydrationErrors).toEqual([])
})

test('homepage visual assets are first-party before consent', async ({ page, request }) => {
  const thirdPartyAssetRequests: string[] = []
  page.on('request', (assetRequest) => {
    const url = assetRequest.url()
    if (url.includes('cdn.worldvectorlogo.com') || url.includes('cdn.shopify.com')) {
      thirdPartyAssetRequests.push(url)
    }
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /digital plumbers/i })).toBeVisible()

  const html = await (await request.get('/')).text()
  expect(html).not.toContain('cdn.worldvectorlogo.com')
  expect(html).not.toContain('cdn.shopify.com')
  expect(thirdPartyAssetRequests).toEqual([])
})

test('social links do not point to generic placeholder domains', async ({ request }) => {
  const response = await request.get('/')
  const html = await response.text()

  expect(html).not.toContain('href="https://x.com"')
  expect(html).not.toContain('href="https://github.com"')
  expect(html).toContain('href="https://github.com/TingsongD/sentientweblanding2"')
})
