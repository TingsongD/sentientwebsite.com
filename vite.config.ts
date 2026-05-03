import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeSiteUrl(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`Invalid VITE_SITE_URL: ${value}`)
  }
  return `${url.origin}/`
}

function configuredSiteUrl() {
  return normalizeSiteUrl(
    process.env.VITE_SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://sentientwebsite.com/',
  )
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sentient-site-url-template',
      transformIndexHtml(html) {
        return html.replaceAll('%SENTIENT_SITE_URL%', configuredSiteUrl())
      },
    },
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
