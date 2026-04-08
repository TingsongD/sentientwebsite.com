import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const faviconHref = `${import.meta.env.BASE_URL}favicon.svg`
const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (iconLink) iconLink.href = faviconHref
const apple = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
if (apple) apple.href = faviconHref

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
