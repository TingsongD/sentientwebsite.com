import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

export default function AboutPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company / About
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          We fix the revenue leaks hiding inside websites
        </h1>
        <p className="font-mono mt-6 text-[14px] uppercase leading-relaxed text-cream/55 sm:text-[15px]">
          Digital plumbers for modern revenue teams
        </p>

        <div className="mt-12 space-y-8 font-mono text-[15px] normal-case leading-[1.75] text-cream/85 sm:text-[16px]">
          <p className="text-[17px] font-medium leading-snug text-cream sm:text-[18px]">
            SentientWeb exists because most websites leak revenue at the exact moment visitors are
            ready to move. Forms wait. Teams sleep. Buyers hesitate. A competitor responds first.
          </p>

          <p>
            We build AI-guided recovery paths that meet visitors with instant access, approved-source
            next steps, and a clear route to human support. The goal is not to replace judgment. The
            goal is to keep valuable intent alive until the right person can take over.
          </p>

          <p>
            The same system adapts across verticals: SaaS demo requests, home service estimates,
            insurance quotes, carts, patient access, enrollments, direct bookings, property matches,
            legal intake, and rate estimates. Each path is built around the revenue leak that market
            actually feels.
          </p>

          <p>
            Trust matters because these moments often include sensitive context. SentientWeb keeps
            human support available, uses encryption in transit, and publishes retention controls
            for the AI-assisted experience.
          </p>

          <p>
            We are building for teams that want practical revenue recovery, not another dashboard to
            manage. If your site already attracts demand, our job is to help more of that demand
            reach the next step.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Get instant access
          </a>
          <Link
            to="/pricing"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            View pricing
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
