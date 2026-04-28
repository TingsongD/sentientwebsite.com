import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(rootDir, 'dist')
const ssrDir = resolve(rootDir, 'dist-ssr')
const templatePath = resolve(distDir, 'index.html')
const ssrEntryPath = resolve(ssrDir, 'entry-server.js')

const template = await readFile(templatePath, 'utf8')
const { render, KNOWN_ROUTE_PATHS, LEGACY_ROUTE_REDIRECTS, NOT_FOUND_PATH } = await import(
  pathToFileURL(ssrEntryPath).href
)
const siteUrl = 'https://sentientwebsite.com/'

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

async function writeRoute(route) {
  const { appHtml, head, structuredData } = render(route)
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

for (const route of routes) {
  await writeRoute(route)
}

await writeFile(
  resolve(distDir, 'routes-manifest.json'),
  JSON.stringify(
    {
      knownRoutes: KNOWN_ROUTE_PATHS,
      legacyRedirects: LEGACY_ROUTE_REDIRECTS,
      notFoundPath: NOT_FOUND_PATH,
    },
    null,
    2,
  ),
)

const sitemapEntries = KNOWN_ROUTE_PATHS.map((route) => {
  const loc = new URL(route, siteUrl).toString()
  return `  <url><loc>${loc}</loc></url>`
}).join('\n')

await writeFile(
  resolve(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`,
)
