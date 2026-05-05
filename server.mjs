import {
  appendFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { createServer } from 'node:http'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'

const distDir = resolve('dist')
const manifestPath = join(distDir, 'routes-manifest.json')
const manifest = loadRoutesManifest(manifestPath)
const siteHostname = validateManifestSiteUrl(manifest.siteUrl)
const knownRoutes = new Set(manifest.knownRoutes)
const notFoundRoute = manifest.notFoundPath || '/404'
validatePrerenderedRouteFiles(knownRoutes, notFoundRoute)
const legacyRedirects = validateRedirectMap(
  'legacyRedirects',
  manifest.legacyRedirects || {},
)
const dynamicFallbackRedirects = validateRedirectMap(
  'dynamicFallbackRedirects',
  manifest.dynamicFallbackRedirects || {
    '/blog/': '/blog',
    '/integrations/': '/',
    '/solutions/': '/#solutions',
  },
  { requirePrefix: true },
)
const cspScriptHashes = validateCspScriptHashes(manifest.cspScriptHashes)
const legalVersions = validateManifestLegalVersions(manifest.legalVersions)
const consentLogPath = normalizeConsentLogPath(process.env.SENTIENT_CONSENT_LOG_PATH || '')
const port = parsePort(getArgValue('--port') || process.env.PORT || '3000')
const hostname = getArgValue('--host') || process.env.HOST || '0.0.0.0'
const consentLogSalt = (process.env.SENTIENT_CONSENT_LOG_SALT || '').trim()
// Base URL for parsing request paths only; request host/scheme are not trusted here.
const requestUrlBase = 'http://localhost'
const allowedHostnames = parseAllowedHostnames(process.env.SENTIENT_ALLOWED_HOSTS || '')
const sentientWidgetOrigin = normalizeOrigin(
  process.env.VITE_SENTIENT_WIDGET_ORIGIN ||
    process.env.NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN ||
    '',
)
const sentientWidgetInstallKey = (
  process.env.VITE_SENTIENT_INSTALL_KEY ||
  process.env.NEXT_PUBLIC_SENTIENT_INSTALL_KEY ||
  ''
).trim()
const sentientWidgetWebSocketOrigin = toWebSocketOrigin(sentientWidgetOrigin)

function normalizeOrigin(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol === 'http:' && !isLocalWidgetHost(url.hostname)) return null
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
    return url.origin
  } catch {
    return null
  }
}

function isLocalWidgetHost(hostname) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'].includes(hostname)
}

function parseAllowedHostnames(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => normalizeAllowedHostname(item))
}

function normalizeAllowedHostname(value) {
  const wildcardValue = value.replace(/^https?:\/\//i, '')
  if (wildcardValue.startsWith('*.')) {
    const hostnameValue = wildcardValue.slice(2)
    if (!hostnameValue || /[/?#*]/.test(hostnameValue)) {
      console.error(`Invalid SENTIENT_ALLOWED_HOSTS entry "${value}". Use comma-separated hostnames.`)
      process.exit(1)
    }

    try {
      const url = new URL(`http://${hostnameValue}`)
      return { type: 'wildcard', suffix: `.${url.hostname.toLowerCase()}` }
    } catch {
      console.error(`Invalid SENTIENT_ALLOWED_HOSTS entry "${value}". Use comma-separated hostnames.`)
      process.exit(1)
    }
  }

  try {
    const url = new URL(value.includes('://') ? value : `http://${value}`)
    if (url.hostname.includes('*')) throw new Error('wildcards must use *.example.com')
    return { type: 'exact', hostname: url.hostname.toLowerCase() }
  } catch {
    console.error(`Invalid SENTIENT_ALLOWED_HOSTS entry "${value}". Use comma-separated hostnames.`)
    process.exit(1)
  }
}

function isAllowedHostname(hostname) {
  return allowedHostnames.some((allowedHostname) => {
    if (allowedHostname.type === 'exact') return hostname === allowedHostname.hostname
    return hostname.endsWith(allowedHostname.suffix) && hostname.length > allowedHostname.suffix.length
  })
}

function toWebSocketOrigin(origin) {
  if (!origin) return null
  try {
    const url = new URL(origin)
    if (url.protocol === 'https:') return `wss://${url.host}`
    if (url.protocol === 'http:') return `ws://${url.host}`
  } catch {
    return null
  }
  return null
}

function buildContentSecurityPolicy() {
  const widgetSources = sentientWidgetOrigin ? ` ${sentientWidgetOrigin}` : ''
  const inlineScriptHashSources = cspScriptHashes.length
    ? ` ${cspScriptHashes.join(' ')}`
    : ''
  const widgetConnectSources = [
    sentientWidgetOrigin,
    sentientWidgetWebSocketOrigin,
  ]
    .filter(Boolean)
    .map((source) => ` ${source}`)
    .join('')

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self'${inlineScriptHashSources}${widgetSources}`,
    "script-src-attr 'none'",
    `style-src 'self' https://fonts.googleapis.com${widgetSources}`,
    "style-src-attr 'none'",
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self'${widgetConnectSources}`,
    `img-src 'self' data: blob:${widgetSources}`,
    `media-src 'self' blob:${widgetSources}`,
    "worker-src 'self' blob:",
    "frame-src https://calendly.com",
  ].join('; ')
}

function readBooleanEnv(name) {
  const value = process.env[name]
  if (!value) return null
  if (/^(1|true|yes|on)$/i.test(value)) return true
  if (/^(0|false|no|off)$/i.test(value)) return false
  return null
}

function shouldSendStrictTransportSecurity() {
  const override = readBooleanEnv('SENTIENT_HSTS_ENABLED')
  if (override !== null) return override

  return process.env.NODE_ENV === 'production' || process.env.RENDER === 'true'
}

const defaultHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), display-capture=(self), geolocation=()',
  'Content-Security-Policy': buildContentSecurityPolicy(),
  ...(shouldSendStrictTransportSecurity()
    ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' }
    : {}),
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

const consentEventTypes = new Set([
  'accept_all',
  'reject_optional',
  'save_choices',
  'withdraw',
  'gpc_detected',
])

const sensitiveConsentKeys = new Set([
  'audio',
  'assistantoutput',
  'microphone',
  'output',
  'pagecontent',
  'pagecontext',
  'prompt',
  'prompts',
  'rawaudio',
  'transcript',
  'transcripts',
])

function getArgValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) return null
  return process.argv[index + 1] || null
}

function loadRoutesManifest(filePath) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${filePath}. Run npm run build before starting the production server.`)
    process.exit(1)
  }

  try {
    const parsedManifest = JSON.parse(readFileSync(filePath, 'utf8'))
    if (
      !parsedManifest ||
      typeof parsedManifest !== 'object' ||
      !Array.isArray(parsedManifest.knownRoutes)
    ) {
      throw new Error('routes-manifest.json must include a knownRoutes array.')
    }

    return parsedManifest
  } catch (error) {
    console.error(`Invalid ${filePath}. Run npm run build before starting the production server.`)
    if (error instanceof Error) console.error(error.message)
    process.exit(1)
  }
}

function failInvalidManifest(message) {
  console.error(
    `Invalid ${manifestPath}. ${message} Run npm run build before starting the production server.`,
  )
  process.exit(1)
}

function validateManifestSiteUrl(siteUrl) {
  if (typeof siteUrl !== 'string') {
    failInvalidManifest('siteUrl must be a valid http(s) URL.')
  }

  try {
    const url = new URL(siteUrl)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
      failInvalidManifest('siteUrl must be a valid http(s) URL.')
    }
    return url.hostname
  } catch {
    failInvalidManifest('siteUrl must be a valid http(s) URL.')
  }
}

function validateRedirectMap(name, redirects, options = {}) {
  if (
    !redirects ||
    typeof redirects !== 'object' ||
    Array.isArray(redirects)
  ) {
    failInvalidManifest(`${name} must be an object.`)
  }

  for (const [source, destination] of Object.entries(redirects)) {
    if (
      !isValidManifestRoute(source) ||
      (options.requirePrefix && !source.endsWith('/'))
    ) {
      failInvalidManifest(`${name} contains invalid source "${source}".`)
    }
    if (!isValidRedirectDestination(destination)) {
      failInvalidManifest(`${name} contains invalid destination for "${source}".`)
    }
  }

  return redirects
}

function validateCspScriptHashes(hashes) {
  if (!Array.isArray(hashes) || hashes.length === 0) {
    failInvalidManifest('cspScriptHashes must be a non-empty array.')
  }

  for (const hash of hashes) {
    if (typeof hash !== 'string' || !/^'sha256-[A-Za-z0-9+/=]+'$/.test(hash)) {
      failInvalidManifest(`cspScriptHashes contains invalid hash "${hash}".`)
    }
  }

  return hashes
}

function validateManifestLegalVersions(legalVersions) {
  const requiredVersionKeys = [
    'consentVersion',
    'privacyPolicyVersion',
    'cookiePolicyVersion',
    'aiDisclosureVersion',
    'lastUpdatedLabel',
  ]

  if (!legalVersions || typeof legalVersions !== 'object' || Array.isArray(legalVersions)) {
    failInvalidManifest('legalVersions must be an object.')
  }

  for (const key of requiredVersionKeys) {
    if (typeof legalVersions[key] !== 'string' || legalVersions[key].trim() === '') {
      failInvalidManifest(`legalVersions.${key} must be a non-empty string.`)
    }
  }

  return legalVersions
}

function normalizeConsentLogPath(value) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return null

  const resolvedPath = resolve(trimmedValue)
  if (resolvedPath === distDir || resolvedPath.startsWith(`${distDir}${sep}`)) {
    console.error(
      'Invalid SENTIENT_CONSENT_LOG_PATH. Consent logs must not be written inside the publicly served dist directory.',
    )
    process.exit(1)
  }

  return resolvedPath
}

function validatePrerenderedRouteFiles(routes, fallbackRoute) {
  if (!isValidManifestRoute(fallbackRoute)) {
    failInvalidManifest('notFoundPath must be an absolute route path.')
  }

  for (const route of new Set([...routes, fallbackRoute])) {
    if (!isValidManifestRoute(route)) {
      failInvalidManifest(`knownRoutes contains invalid route "${route}".`)
    }

    const filePath = routeFile(route)
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      console.error(
        `Missing prerendered route file for "${route}": ${filePath}. Run npm run build before starting the production server.`,
      )
      process.exit(1)
    }
  }
}

function isValidManifestRoute(route) {
  if (typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//')) {
    return false
  }
  const segments = route.split('/').filter(Boolean)
  return !segments.some((segment) => segment === '.' || segment === '..')
}

function isValidRedirectDestination(destination) {
  if (
    typeof destination !== 'string' ||
    !destination.startsWith('/') ||
    destination.startsWith('//')
  ) {
    return false
  }
  if (/[\r\n]/.test(destination)) return false
  const [path] = destination.split('#')
  return isValidManifestRoute(path || '/')
}

function parsePort(value) {
  const portValue = String(value).trim()
  const portNumber = Number(portValue)

  if (!/^\d+$/.test(portValue) || portNumber < 1 || portNumber > 65535) {
    console.error(`Invalid port "${value}". Use an integer from 1 to 65535.`)
    process.exit(1)
  }

  return portNumber
}

function getListenErrorCode(error) {
  if (!error || typeof error !== 'object' || !('code' in error)) return null
  return error.code
}

function exitOnListenError(error) {
  const code = getListenErrorCode(error)

  if (code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use on host "${hostname}".`)
  } else if (code === 'EACCES' || code === 'EPERM') {
    console.error(`Cannot listen on ${hostname}:${port}. Check host and port permissions.`)
  } else if (code === 'EADDRNOTAVAIL' || code === 'ENOTFOUND') {
    console.error(`Cannot listen on host "${hostname}". Check the configured HOST value.`)
  } else {
    console.error(`Failed to start server on ${hostname}:${port}.`)
    if (error instanceof Error) console.error(error.message)
  }

  process.exit(1)
}

function normalizePathname(pathname) {
  return pathname.replace(/\/+$/, '') || '/'
}

function routeFile(route) {
  if (route === '/') return join(distDir, 'index.html')
  return join(distDir, route.replace(/^\//, ''), 'index.html')
}

function safeDecodePathname(pathname) {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return null
  }
}

function safeParseRequestUrl(reqUrl) {
  try {
    return new URL(reqUrl, requestUrlBase)
  } catch {
    return null
  }
}

function isValidHostHeader(host) {
  if (!host) return allowedHostnames.length === 0
  if (/[\s/\\]/.test(host)) return false

  try {
    const hostname = new URL(`http://${host}`).hostname.toLowerCase()
    if (allowedHostnames.length > 0 && !isAllowedHostname(hostname)) return false
    return true
  } catch {
    return false
  }
}

function safeDistPath(decodedPathname) {
  const decoded = decodedPathname
  const candidate = normalize(join(distDir, decoded))
  if (candidate !== distDir && !candidate.startsWith(`${distDir}${sep}`)) return null
  return candidate
}

function isDeniedPublicPath(pathname) {
  const path = normalizePathname(pathname)
  const segments = path.split('/').filter(Boolean)

  if (path === '/.well-known/security.txt') return false
  if (path === '/routes-manifest.json') return true
  if (path === '/server' || path.startsWith('/server/')) return true
  if (path.endsWith('.map')) return true
  if (segments.some((segment) => segment.startsWith('.'))) return true

  return false
}

function invalidDynamicRedirect(pathname) {
  const path = normalizePathname(pathname)

  if (Object.hasOwn(legacyRedirects, path)) return legacyRedirects[path]
  for (const [prefix, location] of Object.entries(dynamicFallbackRedirects)) {
    if (path.startsWith(prefix) && !knownRoutes.has(path)) return location
  }

  return null
}

function sendFile(req, res, filePath, status = 200) {
  const type = contentTypes[extname(filePath)] || 'application/octet-stream'
  const fileStat = statSync(filePath)
  const etag = getFileEtag(fileStat)
  const cacheControl = filePath.split(sep).includes('assets')
    ? 'public, max-age=31536000, immutable'
    : 'no-cache'
  const headers = {
    ...defaultHeaders,
    'Content-Type': type,
    'Cache-Control': cacheControl,
    ETag: etag,
    'Last-Modified': fileStat.mtime.toUTCString(),
  }

  if (status === 200 && requestMatchesFileValidator(req, etag, fileStat)) {
    res.writeHead(304, {
      ...defaultHeaders,
      'Cache-Control': cacheControl,
      ETag: etag,
      'Last-Modified': fileStat.mtime.toUTCString(),
    })
    res.end()
    return
  }

  res.writeHead(status, {
    ...headers,
    'Content-Length': fileStat.size,
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  const stream = createReadStream(filePath)
  stream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, {
        ...defaultHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      })
    }
    res.end('Internal Server Error')
  })
  stream.pipe(res)
}

function getFileEtag(fileStat) {
  return `W/"${fileStat.size.toString(16)}-${Math.floor(fileStat.mtimeMs).toString(16)}"`
}

function requestMatchesFileValidator(req, etag, fileStat) {
  const ifNoneMatch = req.headers['if-none-match']
  if (typeof ifNoneMatch === 'string') {
    const requestedEtags = ifNoneMatch.split(',').map((value) => value.trim())
    return requestedEtags.some(
      (requestedEtag) =>
        requestedEtag === '*' || weaklyMatchesEtag(requestedEtag, etag),
    )
  }

  const ifModifiedSince = req.headers['if-modified-since']
  if (typeof ifModifiedSince === 'string') {
    const requestedTime = Date.parse(ifModifiedSince)
    const fileTime = Math.floor(fileStat.mtime.getTime() / 1000) * 1000
    if (Number.isFinite(requestedTime) && fileTime <= requestedTime) {
      return true
    }
  }

  return false
}

function weaklyMatchesEtag(requestedEtag, currentEtag) {
  return normalizeEtagForWeakComparison(requestedEtag) === normalizeEtagForWeakComparison(currentEtag)
}

function normalizeEtagForWeakComparison(etag) {
  return etag.replace(/^W\//i, '')
}

function sendRedirect(res, location) {
  res.writeHead(302, {
    ...defaultHeaders,
    Location: location,
    'Cache-Control': 'no-cache',
  })
  res.end()
}

function sendMethodNotAllowed(res, allow) {
  res.writeHead(405, {
    ...defaultHeaders,
    Allow: allow,
    'Cache-Control': 'no-cache',
  })
  res.end()
}

function sendBadRequest(req, res) {
  res.writeHead(400, {
    ...defaultHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.end('Bad Request')
}

function sendPayloadTooLarge(res) {
  res.writeHead(413, {
    ...defaultHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end('Payload Too Large')
}

function sendForbidden(res) {
  res.writeHead(403, {
    ...defaultHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end('Forbidden')
}

function sendUnsupportedMediaType(res) {
  res.writeHead(415, {
    ...defaultHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end('Unsupported Media Type')
}

function sendInternalError(res) {
  if (res.headersSent) {
    res.end()
    return
  }

  res.writeHead(500, {
    ...defaultHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end('Internal Server Error')
}

function sendNotFound(req, res) {
  sendFile(req, res, routeFile(notFoundRoute), 404)
}

function sendHealth(req, res) {
  res.writeHead(200, {
    ...defaultHeaders,
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.end(JSON.stringify({ ok: true }))
}

function sendWidgetConfig(req, res) {
  if (!sentientWidgetOrigin || !sentientWidgetInstallKey) {
    res.writeHead(204, {
      ...defaultHeaders,
      'Cache-Control': 'no-store',
    })
    res.end()
    return
  }

  res.writeHead(200, {
    ...defaultHeaders,
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.end(
    JSON.stringify({
      origin: sentientWidgetOrigin,
      installKey: sentientWidgetInstallKey,
    }),
  )
}

function readRequestBody(req, maxBytes = 8192) {
  return new Promise((resolveBody, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString('utf8')
      if (Buffer.byteLength(body, 'utf8') > maxBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }))
        req.destroy()
      }
    })
    req.on('end', () => resolveBody(body))
    req.on('error', reject)
  })
}

function hasSensitiveConsentKey(value) {
  if (!value || typeof value !== 'object') return false

  for (const [key, nestedValue] of Object.entries(value)) {
    if (sensitiveConsentKeys.has(normalizeConsentKey(key))) return true
    if (hasSensitiveConsentKey(nestedValue)) return true
  }

  return false
}

function normalizeConsentKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normalizeConsentSourcePath(sourcePath) {
  if (typeof sourcePath !== 'string') return '/'

  const [withoutHash] = sourcePath.split('#')
  const [pathOnly] = withoutHash.split('?')
  const path = pathOnly || '/'
  if (!isValidRedirectDestination(path)) return null

  return normalizePathname(path)
}

function normalizeConsentEvent(payload, req) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  if (hasSensitiveConsentKey(payload)) return null
  if (!consentEventTypes.has(payload.eventType)) return null

  const booleanFields = [
    'preferences',
    'assistant',
    'analytics',
    'ageConfirmed',
    'globalPrivacyControl',
  ]
  for (const field of booleanFields) {
    if (typeof payload[field] !== 'boolean') return null
  }

  const sourcePath = normalizeConsentSourcePath(payload.sourcePath)
  if (!sourcePath) return null

  const occurredAt = new Date().toISOString()

  return {
    eventId: randomUUID(),
    eventType: payload.eventType,
    occurredAt,
    site: siteHostname,
    consentVersion: legalVersions.consentVersion,
    privacyPolicyVersion: legalVersions.privacyPolicyVersion,
    cookiePolicyVersion: legalVersions.cookiePolicyVersion,
    aiDisclosureVersion: legalVersions.aiDisclosureVersion,
    necessary: true,
    preferences: payload.preferences,
    assistant: payload.ageConfirmed ? payload.assistant : false,
    analytics: payload.globalPrivacyControl ? false : payload.analytics,
    ageConfirmed: payload.ageConfirmed,
    globalPrivacyControl: payload.globalPrivacyControl,
    sourcePath,
    ...(payload.eventType === 'withdraw' ? { withdrawnAt: occurredAt } : {}),
    requestIpHash: hashConsentValue(req.socket.remoteAddress),
    userAgentHash: hashConsentValue(req.headers['user-agent']),
  }
}

function hashConsentValue(value) {
  if (!consentLogSalt || !value) return undefined
  return `sha256:${createHash('sha256').update(`${consentLogSalt}:${value}`).digest('hex')}`
}

function persistConsentEvent(event) {
  if (!consentLogPath) return

  mkdirSync(dirname(consentLogPath), { recursive: true })
  appendFileSync(consentLogPath, `${JSON.stringify(event)}\n`, 'utf8')
}

function getSingleHeader(value) {
  if (Array.isArray(value)) return value[0] || ''
  return typeof value === 'string' ? value : ''
}

function requestHasJsonContentType(req) {
  const contentType = getSingleHeader(req.headers['content-type'])
  const mediaType = contentType.split(';')[0].trim().toLowerCase()
  return mediaType === 'application/json'
}

function normalizeRequestHost(host) {
  try {
    return new URL(`http://${host}`).host.toLowerCase()
  } catch {
    return null
  }
}

function requestHasAllowedConsentOrigin(req) {
  const secFetchSite = getSingleHeader(req.headers['sec-fetch-site']).toLowerCase()
  if (secFetchSite === 'cross-site') return false

  const origin = getSingleHeader(req.headers.origin)
  if (!origin) return true
  if (/[\r\n]/.test(origin)) return false

  const requestHost = normalizeRequestHost(getSingleHeader(req.headers.host))
  if (!requestHost) return false

  try {
    const originUrl = new URL(origin)
    if (originUrl.protocol !== 'http:' && originUrl.protocol !== 'https:') return false
    return originUrl.host.toLowerCase() === requestHost
  } catch {
    return false
  }
}

async function sendConsentEvent(req, res) {
  if (req.method !== 'POST') {
    sendMethodNotAllowed(res, 'POST')
    return
  }

  if (!requestHasAllowedConsentOrigin(req)) {
    sendForbidden(res)
    return
  }

  if (!requestHasJsonContentType(req)) {
    sendUnsupportedMediaType(res)
    return
  }

  let payload
  try {
    payload = JSON.parse(await readRequestBody(req))
  } catch (error) {
    if (error && typeof error === 'object' && error.statusCode === 413) {
      sendPayloadTooLarge(res)
      return
    }
    sendBadRequest(req, res)
    return
  }

  const event = normalizeConsentEvent(payload, req)
  if (!event) {
    sendBadRequest(req, res)
    return
  }

  try {
    persistConsentEvent(event)
  } catch {
    sendInternalError(res)
    return
  }

  res.writeHead(204, {
    ...defaultHeaders,
    'Cache-Control': 'no-store',
  })
  res.end()
}

async function handleRequest(req, res) {
  if (!req.url) {
    sendMethodNotAllowed(res, 'GET, HEAD')
    return
  }

  if (!isValidHostHeader(req.headers.host)) {
    sendBadRequest(req, res)
    return
  }

  const url = safeParseRequestUrl(req.url)
  if (url === null) {
    sendBadRequest(req, res)
    return
  }

  const decodedPathname = safeDecodePathname(url.pathname)
  if (decodedPathname === null) {
    sendBadRequest(req, res)
    return
  }

  const pathname = normalizePathname(decodedPathname)
  const redirect = invalidDynamicRedirect(pathname)

  if (pathname === '/consent-events') {
    await sendConsentEvent(req, res)
    return
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendMethodNotAllowed(res, 'GET, HEAD')
    return
  }

  if (pathname === '/healthz') {
    sendHealth(req, res)
    return
  }

  if (pathname === '/sentient-widget-config.json') {
    sendWidgetConfig(req, res)
    return
  }

  if (redirect) {
    sendRedirect(res, redirect)
    return
  }

  if (isDeniedPublicPath(pathname)) {
    sendNotFound(req, res)
    return
  }

  const staticPath = safeDistPath(decodedPathname)
  if (staticPath && existsSync(staticPath) && statSync(staticPath).isFile()) {
    sendFile(req, res, staticPath)
    return
  }

  if (knownRoutes.has(pathname)) {
    sendFile(req, res, routeFile(pathname))
    return
  }

  sendNotFound(req, res)
}

const server = createServer((req, res) => {
  handleRequest(req, res).catch(() => sendInternalError(res))
})

server.on('error', exitOnListenError)

server.listen(port, hostname, () => {
  console.log(`SentientWeb server listening on http://${hostname}:${port}`)
})
