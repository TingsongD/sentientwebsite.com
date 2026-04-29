import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const distDir = resolve('dist')
const manifestPath = join(distDir, 'routes-manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const knownRoutes = new Set(manifest.knownRoutes)
const legacyRedirects = manifest.legacyRedirects || {}
const notFoundRoute = manifest.notFoundPath || '/404'
const port = Number(getArgValue('--port') || process.env.PORT || 3000)
const hostname = process.env.HOST || '0.0.0.0'
const requestUrlBase = 'http://localhost'
const sentientWidgetOrigin = normalizeOrigin(
  process.env.VITE_SENTIENT_WIDGET_ORIGIN ||
    process.env.NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN ||
    '',
)
const sentientWidgetWebSocketOrigin = toWebSocketOrigin(sentientWidgetOrigin)

function normalizeOrigin(value) {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
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
    `script-src 'self' 'unsafe-inline'${widgetSources}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com${widgetSources}`,
    "font-src 'self' https://fonts.gstatic.com",
    `connect-src 'self'${widgetConnectSources}`,
    `img-src 'self' data: blob: https://cdn.shopify.com https://cdnjs.cloudflare.com https://cdn.worldvectorlogo.com${widgetSources}`,
    `media-src 'self' blob: https://cdn.shopify.com${widgetSources}`,
    "worker-src 'self' blob:",
    "frame-src https://calendly.com",
  ].join('; ')
}

const defaultHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(self), display-capture=(self), geolocation=()',
  'Content-Security-Policy': buildContentSecurityPolicy(),
  ...(process.env.NODE_ENV === 'production'
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

function getArgValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) return null
  return process.argv[index + 1] || null
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
  if (!host) return true
  if (/[\s/\\]/.test(host)) return false

  try {
    new URL(`http://${host}`)
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

  if (path === '/routes-manifest.json') return true
  if (path === '/server' || path.startsWith('/server/')) return true
  if (path.endsWith('.map')) return true
  if (segments.some((segment) => segment.startsWith('.'))) return true

  return false
}

function invalidDynamicRedirect(pathname) {
  const path = normalizePathname(pathname)

  if (Object.hasOwn(legacyRedirects, path)) return legacyRedirects[path]
  if (path.startsWith('/blog/') && !knownRoutes.has(path)) return '/blog'
  if (path.startsWith('/integrations/') && !knownRoutes.has(path)) return '/'
  if (path.startsWith('/solutions/') && !knownRoutes.has(path)) return '/#solutions'

  return null
}

function sendFile(req, res, filePath, status = 200) {
  const type = contentTypes[extname(filePath)] || 'application/octet-stream'
  res.writeHead(status, {
    ...defaultHeaders,
    'Content-Type': type,
    ...(filePath.split(sep).includes('assets')
      ? { 'Cache-Control': 'public, max-age=31536000, immutable' }
      : { 'Cache-Control': 'no-cache' }),
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

function sendRedirect(res, location) {
  res.writeHead(302, {
    ...defaultHeaders,
    Location: location,
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

function sendNotFound(req, res) {
  sendFile(req, res, routeFile(notFoundRoute), 404)
}

const server = createServer((req, res) => {
  if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
    res.writeHead(405, { ...defaultHeaders, Allow: 'GET, HEAD' })
    res.end()
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
})

server.listen(port, hostname, () => {
  console.log(`SentientWeb server listening on http://${hostname}:${port}`)
})
