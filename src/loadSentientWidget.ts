/**
 * Loads the Sentient widget script only when origin + install key are set.
 * Keeps dev/build working without .env; avoids invalid script URLs in index.html.
 */
export function loadSentientWidget(): void {
  const origin = (
    import.meta.env.VITE_SENTIENT_WIDGET_ORIGIN ||
    import.meta.env.NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN ||
    ''
  ).replace(/\/$/, '')
  const key =
    import.meta.env.VITE_SENTIENT_INSTALL_KEY ||
    import.meta.env.NEXT_PUBLIC_SENTIENT_INSTALL_KEY ||
    ''

  if (!origin || !key) return

  const existing = document.querySelector('script[data-sentient-widget-loader]')
  if (existing) return

  const script = document.createElement('script')
  script.src = `${origin}/agent.js`
  script.defer = true
  script.dataset.installKey = key
  script.dataset.sentientWidgetLoader = 'true'
  document.body.appendChild(script)
}
