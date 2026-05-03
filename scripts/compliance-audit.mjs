import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const requireProductionReady = process.argv.includes('--production')

const legalRoutes = [
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

const requiredDocs = [
  'docs/compliance/README.md',
  'docs/compliance/ai-dpia.md',
  'docs/compliance/ai-system-card.md',
  'docs/compliance/assistant-system-policy.md',
  'docs/compliance/consent-log-spec.md',
  'docs/compliance/cookie-tag-inventory.md',
  'docs/compliance/eu-uk-representative-dpo-assessment.md',
  'docs/compliance/evidence-request-packet.md',
  'docs/compliance/jurisdiction-readiness-map.md',
  'docs/compliance/legal-source-register.md',
  'docs/compliance/placeholder-evidence-register.md',
  'docs/compliance/privacy-request-operations.md',
  'docs/compliance/prompt-to-artifact-audit.md',
  'docs/compliance/production-launch-gates.md',
  'docs/compliance/remaining-production-items.md',
  'docs/compliance/retention-schedule.md',
  'docs/compliance/security-incident-response.md',
  'docs/compliance/stripe-pci-readiness.md',
  'docs/compliance/vendor-processor-register.md',
]

const blockedPublicTerms = [
  'TBD',
  'PLACEHOLDER',
  'FICTITIOUS',
  'placeholder@',
  'placeholder.example',
  'sentientwebsite.example',
]

const requiredDynamicFallbackRedirects = {
  '/blog/': '/blog',
  '/integrations/': '/',
  '/solutions/': '/#solutions',
}

const readText = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8')

const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const hashInlineScriptContent = (content) =>
  `'sha256-${createHash('sha256').update(content).digest('base64')}'`

const htmlToText = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const listFiles = (targetPath) => {
  const absolutePath = path.join(root, targetPath)
  const stat = fs.statSync(absolutePath)

  if (stat.isFile()) return [absolutePath]

  const files = []
  const entries = fs.readdirSync(absolutePath, { withFileTypes: true })
  for (const entry of entries) {
    const childPath = path.join(absolutePath, entry.name)
    if (entry.isDirectory()) {
      files.push(...listFiles(path.relative(root, childPath)))
    } else if (entry.isFile()) {
      files.push(childPath)
    }
  }

  return files
}

const getLaunchGateItems = (markdown) => {
  const items = []
  let currentGate = 'Ungrouped'
  let inLaunchApprovalGate = false

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (Gate \d+: .+)$/)
    if (heading) {
      currentGate = heading[1]
      inLaunchApprovalGate = currentGate.startsWith('Gate 7:')
      continue
    }

    const item = line.match(/^- \[([ x])\] (.+)$/i)
    if (item) {
      items.push({
        gate: currentGate,
        checked: item[1].toLowerCase() === 'x',
        text: item[2],
      })
      continue
    }

    if (inLaunchApprovalGate) {
      const tableRow = line.match(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/)
      if (!tableRow || tableRow[1] === 'Approval' || tableRow[1].startsWith('---')) continue

      const approval = tableRow[1].trim()
      const status = tableRow[3].trim()
      items.push({
        gate: currentGate,
        checked: !/pending/i.test(status),
        text: `${approval} approval.`,
      })
    }
  }

  return items
}

const normalizeChecklistText = (text) =>
  text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const getTrackedProductionItems = (markdown) => {
  const trackedItems = new Map()

  for (const line of markdown.split('\n')) {
    const tableRow = line.match(/^\| (.+) \|$/)
    if (!tableRow) continue

    const cells = tableRow[1].split(' | ').map((cell) => cell.trim())
    if (cells.length < 5 || cells[0] === 'Item' || cells[0].startsWith('---')) continue
    if (!/^open$/i.test(cells[4])) continue

    trackedItems.set(normalizeChecklistText(cells[0]), {
      status: cells[4],
      text: cells[0],
    })
  }

  return trackedItems
}

const failures = []
const warnings = []
let builtSiteUrl = 'https://sentientwebsite.com/'
let builtLegalLastUpdatedLabel = 'May 2, 2026'

for (const doc of requiredDocs) {
  if (!exists(doc)) {
    failures.push(`Missing compliance document: ${doc}`)
  }
}

if (!exists('public/.well-known/security.txt')) {
  failures.push('Missing public/.well-known/security.txt')
}

if (exists('dist/routes-manifest.json')) {
  const manifest = JSON.parse(readText('dist/routes-manifest.json'))
  builtSiteUrl = manifest.siteUrl || builtSiteUrl
  const legalVersions = manifest.legalVersions
  if (!manifest.siteUrl) {
    failures.push('Route manifest is missing siteUrl')
  }
  if (!legalVersions || typeof legalVersions !== 'object' || Array.isArray(legalVersions)) {
    failures.push('Route manifest is missing legalVersions')
  } else {
    for (const key of [
      'consentVersion',
      'privacyPolicyVersion',
      'cookiePolicyVersion',
      'aiDisclosureVersion',
      'lastUpdatedLabel',
    ]) {
      if (typeof legalVersions[key] !== 'string' || legalVersions[key].trim() === '') {
        failures.push(`Route manifest legalVersions.${key} is missing`)
      }
    }
    if (typeof legalVersions.lastUpdatedLabel === 'string') {
      builtLegalLastUpdatedLabel = legalVersions.lastUpdatedLabel
    }
  }
  if (!Array.isArray(manifest.cspScriptHashes) || manifest.cspScriptHashes.length === 0) {
    failures.push('Route manifest is missing cspScriptHashes for inline JSON-LD')
  } else {
    const manifestHashes = new Set(manifest.cspScriptHashes)
    for (const hash of manifestHashes) {
      if (!/^'sha256-[A-Za-z0-9+/=]+'$/.test(hash)) {
        failures.push(`Route manifest has invalid CSP script hash: ${hash}`)
      }
    }

    for (const file of listFiles('dist').filter((distFile) => distFile.endsWith('.html'))) {
      const relativeFile = path.relative(root, file)
      const html = fs.readFileSync(file, 'utf8')
      const jsonLdScripts = html.matchAll(
        /<script\b(?=[^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g,
      )
      for (const match of jsonLdScripts) {
        const hash = hashInlineScriptContent(match[1])
        if (!manifestHashes.has(hash)) {
          failures.push(`Inline JSON-LD hash is missing from route manifest: ${relativeFile}`)
        }
      }
    }
  }
  if (!manifest.dynamicFallbackRedirects) {
    failures.push('Route manifest is missing dynamicFallbackRedirects')
  } else {
    for (const [prefix, location] of Object.entries(requiredDynamicFallbackRedirects)) {
      if (manifest.dynamicFallbackRedirects[prefix] !== location) {
        failures.push(`Route manifest dynamic fallback for ${prefix} is not ${location}`)
      }
    }
  }
  for (const route of legalRoutes) {
    if (!manifest.knownRoutes?.includes(route)) {
      failures.push(`Route manifest does not include ${route}`)
    }
  }
} else {
  warnings.push('dist/routes-manifest.json not found; run npm run build before route-manifest verification')
}

if (exists('dist/sitemap.xml')) {
  const sitemap = readText('dist/sitemap.xml')
  const sitemapLocations = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
    (match) => match[1],
  )
  for (const location of sitemapLocations) {
    if (!location.startsWith(builtSiteUrl)) {
      failures.push(`Sitemap URL does not use built siteUrl ${builtSiteUrl}: ${location}`)
    }
  }
  for (const route of legalRoutes) {
    if (!sitemap.includes(new URL(route, builtSiteUrl).toString())) {
      failures.push(`Sitemap does not include ${route}`)
    }
  }
} else {
  warnings.push('dist/sitemap.xml not found; run npm run build before sitemap verification')
}

if (exists('dist/.well-known/security.txt')) {
  const securityTxt = readText('dist/.well-known/security.txt')
  const expectedPolicy = `Policy: ${new URL('/security-response', builtSiteUrl).toString()}`
  const expectedCanonical = `Canonical: ${new URL('/.well-known/security.txt', builtSiteUrl).toString()}`
  if (!securityTxt.includes(expectedPolicy)) {
    failures.push(`security.txt does not use built siteUrl for Policy: ${expectedPolicy}`)
  }
  if (!securityTxt.includes(expectedCanonical)) {
    failures.push(`security.txt does not use built siteUrl for Canonical: ${expectedCanonical}`)
  }
} else {
  warnings.push('dist/.well-known/security.txt not found; run npm run build before security.txt verification')
}

if (exists('dist/pricing/index.html')) {
  const pricingHtml = readText('dist/pricing/index.html')
  const pricingUrl = new URL('/pricing', builtSiteUrl).toString()
  if (!pricingHtml.includes(`<link rel="canonical" href="${pricingUrl}">`)) {
    failures.push(`Prerendered pricing canonical does not use built siteUrl ${builtSiteUrl}`)
  }
  if (!pricingHtml.includes(`<meta property="og:url" content="${pricingUrl}">`)) {
    failures.push(`Prerendered pricing og:url does not use built siteUrl ${builtSiteUrl}`)
  }
  if (!pricingHtml.includes(`"url":"${pricingUrl}"`)) {
    failures.push(`Prerendered pricing JSON-LD does not use built siteUrl ${builtSiteUrl}`)
  }
} else {
  warnings.push('dist/pricing/index.html not found; run npm run build before canonical verification')
}

const builtSiteHostname = new URL(builtSiteUrl).hostname
const hostCopyChecks = [
  ['dist/privacy/index.html', `We operate ${builtSiteHostname}`],
  ['dist/terms/index.html', `By accessing ${builtSiteHostname}`],
  ['dist/cookies/index.html', `used on ${builtSiteHostname}`],
  ['dist/billing-terms/index.html', `payments on ${builtSiteHostname}`],
  ['dist/status/index.html', `Marketing site ${builtSiteHostname}`],
]

for (const [file, expectedText] of hostCopyChecks) {
  if (!exists(file)) {
    warnings.push(`${file} not found; run npm run build before public hostname copy verification`)
    continue
  }

  if (!htmlToText(readText(file)).includes(expectedText)) {
    failures.push(`${file} does not include built site hostname copy: ${expectedText}`)
  }
}

for (const route of legalRoutes) {
  const file = route === '/' ? 'dist/index.html' : `dist${route}/index.html`
  if (!exists(file)) {
    warnings.push(`${file} not found; run npm run build before legal version verification`)
    continue
  }

  if (!htmlToText(readText(file)).includes(`Last updated: ${builtLegalLastUpdatedLabel}.`)) {
    failures.push(`${file} does not use manifest legalVersions.lastUpdatedLabel`)
  }
}

for (const publicFile of ['src', 'dist', 'public', 'index.html', '.env.example', 'README.md']) {
  if (!exists(publicFile)) continue

  for (const file of listFiles(publicFile)) {
    const relativeFile = path.relative(root, file)
    if (relativeFile.includes('node_modules')) continue
    const text = fs.readFileSync(file, 'utf8')
    for (const term of blockedPublicTerms) {
      if (text.includes(term)) {
        failures.push(`Public-facing file exposes drafting term "${term}": ${relativeFile}`)
      }
    }
  }
}

for (const publicFile of ['src', 'dist', 'public', 'index.html', 'server.mjs']) {
  if (!exists(publicFile)) continue

  for (const file of listFiles(publicFile)) {
    const relativeFile = path.relative(root, file)
    if (relativeFile.includes('node_modules')) continue
    const text = fs.readFileSync(file, 'utf8')

    if (text.includes("'unsafe-inline'")) {
      failures.push(`Public-facing file includes unsafe-inline CSP allowance: ${relativeFile}`)
    }

    if (text.includes('style={') || /<[^>\n]+\sstyle\s*=/.test(text)) {
      failures.push(`Public-facing file includes inline style attribute: ${relativeFile}`)
    }
  }
}

const launchGatesPath = 'docs/compliance/production-launch-gates.md'
let checkedGates = 0
let uncheckedGates = 0
let uncheckedGateItems = []
let trackedOpenGateItems = 0
if (exists(launchGatesPath)) {
  const launchGates = readText(launchGatesPath)
  const launchGateItems = getLaunchGateItems(launchGates)
  checkedGates = launchGateItems.filter((item) => item.checked).length
  uncheckedGateItems = launchGateItems.filter((item) => !item.checked)
  uncheckedGates = uncheckedGateItems.length
}

const remainingProductionItemsPath = 'docs/compliance/remaining-production-items.md'
if (exists(remainingProductionItemsPath) && uncheckedGateItems.length > 0) {
  const trackedItems = getTrackedProductionItems(readText(remainingProductionItemsPath))
  const uncheckedGateText = new Set(uncheckedGateItems.map((item) => normalizeChecklistText(item.text)))
  for (const item of uncheckedGateItems) {
    if (!trackedItems.has(normalizeChecklistText(item.text))) {
      failures.push(`Open launch gate is missing from remaining-production-items tracker: ${item.text}`)
    } else {
      trackedOpenGateItems += 1
    }
  }
  for (const [normalizedText, item] of trackedItems) {
    if (!uncheckedGateText.has(normalizedText)) {
      failures.push(`Remaining production item is not an unchecked launch gate: ${item.text}`)
    }
  }
}

const placeholderRegisterPath = 'docs/compliance/placeholder-evidence-register.md'
if (exists(placeholderRegisterPath)) {
  const placeholderRegister = readText(placeholderRegisterPath)
  if (!placeholderRegister.includes('PLACEHOLDER / FICTITIOUS')) {
    failures.push('Placeholder evidence register is missing the PLACEHOLDER / FICTITIOUS warning')
  }
}

console.log('SentientWeb compliance audit')
console.log(`Public legal routes expected: ${legalRoutes.length}`)
console.log(`Compliance documents expected: ${requiredDocs.length}`)
console.log(`Launch gate checklist: ${checkedGates} checked, ${uncheckedGates} unchecked`)
if (uncheckedGates > 0) {
  console.log(`Remaining-items tracker coverage: ${trackedOpenGateItems}/${uncheckedGates} open gates tracked`)
}

if (warnings.length > 0) {
  console.log('\nWarnings:')
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (uncheckedGates > 0) {
  console.log('\nProduction status: BLOCKED')
  const openGateNames = Array.from(new Set(uncheckedGateItems.map((item) => item.gate)))
  console.log(
    `Reason: ${uncheckedGates} production launch gate${uncheckedGates === 1 ? '' : 's'} remain open across ${openGateNames.join(', ')}.`,
  )
  console.log('\nOpen launch gates:')
  let previousGate = ''
  for (const item of uncheckedGateItems) {
    if (item.gate !== previousGate) {
      console.log(`\n${item.gate}`)
      previousGate = item.gate
    }
    console.log(`- ${item.text}`)
  }

  if (requireProductionReady) {
    failures.push(`Production compliance audit failed: ${uncheckedGates} launch gates remain unchecked`)
  }
} else {
  console.log('\nProduction status: launch gates checked. Confirm actual evidence before relying on this audit.')
}

if (failures.length > 0) {
  console.log('\nFailures:')
  for (const failure of failures) console.log(`- ${failure}`)
  process.exit(1)
}

console.log('\nWebsite artifact status: passed')
