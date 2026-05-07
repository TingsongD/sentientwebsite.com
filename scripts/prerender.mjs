import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(rootDir, 'dist')
const ssrDir = resolve(rootDir, 'dist-ssr')
const templatePath = resolve(distDir, 'index.html')
const ssrEntryPath = resolve(ssrDir, 'entry-server.js')

const template = await readFile(templatePath, 'utf8')
const {
  render,
  DYNAMIC_FALLBACK_REDIRECTS,
  KNOWN_ROUTE_PATHS,
  LEGAL_VERSIONS,
  LEGACY_ROUTE_REDIRECTS,
  NOT_FOUND_PATH,
  SEO_LAST_MODIFIED,
  SITE_URL,
} = await import(pathToFileURL(ssrEntryPath).href)

const headPattern =
  /<!--app-head-start-->[\s\S]*?<!--app-head-end-->/
const jsonLdPattern =
  /<!--app-jsonld-start-->[\s\S]*?<!--app-jsonld-end-->/
const appMarker = '<!--app-html-->'

if (!headPattern.test(template)) {
  throw new Error('index.html is missing app head markers')
}

if (!template.includes(appMarker)) {
  throw new Error('index.html is missing app HTML marker')
}

if (!jsonLdPattern.test(template)) {
  throw new Error('index.html is missing app JSON-LD markers')
}

function routeToFile(route) {
  if (route === '/') return resolve(distDir, 'index.html')
  return resolve(distDir, route.replace(/^\//, ''), 'index.html')
}

function getInlineScriptHash(scriptHtml) {
  const content = scriptHtml.match(/^<script\b[^>]*>([\s\S]*)<\/script>$/)?.[1]
  if (typeof content !== 'string') {
    throw new Error(`Unable to hash inline script: ${scriptHtml.slice(0, 80)}`)
  }
  return `'sha256-${createHash('sha256').update(content).digest('base64')}'`
}

const cspScriptHashes = new Set()

async function writeRoute(route) {
  const { appHtml, head, structuredData } = render(route)
  cspScriptHashes.add(getInlineScriptHash(structuredData))
  const html = template
    .replace(headPattern, `<!--app-head-start-->\n    ${head}\n    <!--app-head-end-->`)
    .replace(
      jsonLdPattern,
      `<!--app-jsonld-start-->\n    ${structuredData}\n    <!--app-jsonld-end-->`,
    )
    .replace(appMarker, appHtml)
  const filePath = routeToFile(route)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, html)
}

const routes = [...KNOWN_ROUTE_PATHS, NOT_FOUND_PATH]
const llmsRouteAllowlist = new Set([
  '/',
  '/pricing',
  '/pricing/calculator',
  '/trust',
  '/revenue-leak-calculator',
  '/orchestrate',
  '/integrations/hubspot',
  '/integrations/salesforce',
  '/integrations/pipedrive',
  '/integrations/api-webhooks',
  '/integrations/calendly',
  '/integrations/wordpress',
  '/integrations/webflow',
  '/integrations/custom',
  '/solutions/saas',
  '/solutions/insurance',
  '/solutions/healthcare',
  '/solutions/edtech',
  '/solutions/financial-services',
  '/solutions/logistics',
])

for (const route of routes) {
  await writeRoute(route)
}

await writeFile(
  resolve(distDir, 'routes-manifest.json'),
  JSON.stringify(
    {
      knownRoutes: KNOWN_ROUTE_PATHS,
      legacyRedirects: LEGACY_ROUTE_REDIRECTS,
      dynamicFallbackRedirects: DYNAMIC_FALLBACK_REDIRECTS,
      notFoundPath: NOT_FOUND_PATH,
      siteUrl: SITE_URL,
      legalVersions: LEGAL_VERSIONS,
      cspScriptHashes: [...cspScriptHashes].sort(),
    },
    null,
    2,
  ),
)

const sitemapEntries = KNOWN_ROUTE_PATHS.map((route) => {
  const loc = new URL(route, SITE_URL).toString()
  const priority = route === '/' ? '1.0' : route.startsWith('/solutions/') ? '0.8' : '0.7'
  const changefreq = route === '/' || route === '/pricing' ? 'weekly' : 'monthly'
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${SEO_LAST_MODIFIED}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}).join('\n')

await writeFile(
  resolve(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
)

await writeFile(
  resolve(distDir, 'robots.txt'),
  [
    '# SentientWeb crawler policy',
    `# AI/answer-engine guide: ${new URL('/llms.txt', SITE_URL).toString()}`,
    'User-agent: *',
    'Allow: /',
    'Disallow: /routes-manifest.json',
    `Sitemap: ${new URL('/sitemap.xml', SITE_URL).toString()}`,
    '',
  ].join('\n'),
)

const llmsContent = [
  '# SentientWeb',
  '',
  '> SentientWeb is revenue recovery orchestration for modern subscription businesses. It detects revenue-ready moments across website, billing, CRM, scheduler, and messaging surfaces, qualifies the moment, calls the right tool, and syncs stack-ready context.',
  '',
  '## Primary Audience',
  '',
  '- Subscription-business CEOs, founders, RevOps leaders, sales leaders, lifecycle leaders, and growth teams',
  '- Companies with pricing, demo, checkout, billing, account, comparison, integration, security, docs, or customer-story pages that already attract revenue intent',
  '',
  '## Core Pages',
  '',
  ...KNOWN_ROUTE_PATHS.filter((route) => llmsRouteAllowlist.has(route)).map(
    (route) => `- ${new URL(route, SITE_URL).toString()}`,
  ),
  '',
  '## Canonical Positioning',
  '',
  '- Category: revenue recovery orchestration for subscription businesses',
  '- Outcome: qualified recovered actions with stack-ready context',
  '- Replaces: generic popups, static forms, and manual chasing across revenue moments',
  '- Orchestrates: CRM, scheduler, billing, messaging, routing, webhook, and custom handoff tools',
  '- Trust model: approved-source answers with human handoff for sensitive security, legal, procurement, pricing, or high-value questions',
  '',
].join('\n')

await writeFile(resolve(distDir, 'llms.txt'), llmsContent)

const securityTxtPath = resolve(distDir, '.well-known', 'security.txt')
await mkdir(dirname(securityTxtPath), { recursive: true })
await writeFile(
  securityTxtPath,
  [
    'Contact: mailto:songday@sentientwebsite.com',
    `Policy: ${new URL('/security-response', SITE_URL).toString()}`,
    'Preferred-Languages: en',
    `Canonical: ${new URL('/.well-known/security.txt', SITE_URL).toString()}`,
    'Expires: 2027-05-02T00:00:00Z',
    '',
  ].join('\n'),
)
