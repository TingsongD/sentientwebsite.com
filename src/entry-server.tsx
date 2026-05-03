/* eslint-disable react-refresh/only-export-components */
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { LEGAL_VERSIONS, SITE_URL } from './constants'
import {
  getPageMeta,
  DYNAMIC_FALLBACK_REDIRECTS,
  KNOWN_ROUTE_PATHS,
  LEGACY_ROUTE_REDIRECTS,
  NOT_FOUND_PATH,
  renderPageHead,
  renderStructuredDataScript,
} from './routeMetadata'

export {
  DYNAMIC_FALLBACK_REDIRECTS,
  KNOWN_ROUTE_PATHS,
  LEGACY_ROUTE_REDIRECTS,
  NOT_FOUND_PATH,
  LEGAL_VERSIONS,
  SITE_URL,
}

export function render(url: string) {
  const appHtml = renderToString(
    <HelmetProvider>
      <StaticRouter location={url}>
        <App includeMeta={false} />
      </StaticRouter>
    </HelmetProvider>,
  )

  return {
    appHtml,
    head: renderPageHead(getPageMeta(url)),
    structuredData: renderStructuredDataScript(url),
  }
}
