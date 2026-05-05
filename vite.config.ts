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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-helmet-async')
          ) {
            return 'router-vendor'
          }
        },
      },
    },
  },
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
