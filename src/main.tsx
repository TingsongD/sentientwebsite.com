import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop.tsx'
import './index.css'
import App from './App.tsx'

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

const root = document.getElementById('root')!
const hasPrerenderedMarkup = Array.from(root.childNodes).some((node) => {
  if (node.nodeType === Node.COMMENT_NODE) return false
  if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim())
  return true
})

if (hasPrerenderedMarkup) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
