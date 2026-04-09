import type { ReactNode } from 'react'
import { MarketingHeader } from './MarketingHeader'
import { SiteFooter } from './SiteFooter'

export function MarketingPageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:text-background"
      >
        Skip to main content
      </a>
      <MarketingHeader layout="page" />
      <main id="main-content" className="min-h-[50vh] bg-background">
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
