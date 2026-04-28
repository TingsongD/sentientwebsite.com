/* eslint-disable react-refresh/only-export-components */
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import {
  getPageMeta,
  KNOWN_ROUTE_PATHS,
  NOT_FOUND_PATH,
  renderPageHead,
  renderStructuredDataScript,
} from './routeMetadata'

export { KNOWN_ROUTE_PATHS, NOT_FOUND_PATH }

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
