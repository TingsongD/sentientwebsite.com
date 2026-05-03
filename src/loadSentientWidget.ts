/**
 * Loads the Sentient widget script only when origin + install key are set.
 * Keeps dev/build working without .env; avoids invalid script URLs in index.html.
 */
type WidgetConfig = {
  origin: string
  installKey: string
}

let widgetLoadVersion = 0

export function normalizeWidgetOrigin(value: string | undefined): string | null {
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

function isLocalWidgetHost(hostname: string) {
  return ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'].includes(hostname)
}

export function resolveWidgetConfig(
  originValue: string | undefined,
  keyValue: string | undefined,
): WidgetConfig | null {
  const origin = normalizeWidgetOrigin(originValue)
  const installKey = (keyValue || '').trim()
  if (!origin || !installKey) return null

  return { origin, installKey }
}

function getBundledWidgetConfig(): WidgetConfig | null {
  return resolveWidgetConfig(
    import.meta.env.VITE_SENTIENT_WIDGET_ORIGIN ||
      import.meta.env.NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN,
    import.meta.env.VITE_SENTIENT_INSTALL_KEY || import.meta.env.NEXT_PUBLIC_SENTIENT_INSTALL_KEY,
  )
}

async function getRuntimeWidgetConfig(): Promise<WidgetConfig | null> {
  try {
    const response = await fetch('/sentient-widget-config.json', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
    if (response.status === 204) return null
    if (!response.ok) return null

    const config = (await response.json()) as Partial<WidgetConfig>
    return resolveWidgetConfig(
      typeof config.origin === 'string' ? config.origin : undefined,
      typeof config.installKey === 'string' ? config.installKey : undefined,
    )
  } catch {
    return null
  }
}

export async function loadSentientWidget(): Promise<void> {
  const requestVersion = ++widgetLoadVersion
  const existing = document.querySelector('script[data-sentient-widget-loader]')
  if (existing) return

  const config = (await getRuntimeWidgetConfig()) || getBundledWidgetConfig()
  if (!config || requestVersion !== widgetLoadVersion) return

  const latestExisting = document.querySelector('script[data-sentient-widget-loader]')
  if (latestExisting) return

  const script = document.createElement('script')
  script.src = new URL('/agent.js', config.origin).toString()
  script.defer = true
  script.dataset.installKey = config.installKey
  script.dataset.sentientWidgetLoader = 'true'
  document.body.appendChild(script)
}

export function removeSentientWidget(): void {
  widgetLoadVersion += 1
  document.querySelectorAll('script[data-sentient-widget-loader]').forEach((script) => {
    script.remove()
  })
}
