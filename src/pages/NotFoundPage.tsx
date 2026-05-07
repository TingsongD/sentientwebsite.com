import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

export default function NotFoundPage() {
  return (
    <MarketingPageLayout>
      <section
        className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-20 md:py-24"
        aria-labelledby="not-found-heading"
      >
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          404
        </p>
        <h1
          id="not-found-heading"
          className="font-grotesk text-[36px] uppercase leading-none text-cream sm:text-[48px] md:text-[56px]"
        >
          Page not found
        </h1>
        <p className="font-mono mt-6 text-[15px] normal-case leading-relaxed text-cream/80 sm:text-[16px]">
          This page does not exist or has moved. Head back to the main site, review pricing, or
          book a demo recovery pilot with the team.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Back to home
          </Link>
          <Link
            to="/pricing"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            View pricing
          </Link>
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
          >
            Book a demo recovery pilot
          </a>
        </div>
      </section>
    </MarketingPageLayout>
  )
}
