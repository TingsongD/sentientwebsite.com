import { Link, Navigate, useParams } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'
import { INTEGRATION_PAGES, type IntegrationSlug } from '../data/integrationPagesContent'

function isIntegrationSlug(s: string): s is IntegrationSlug {
  return s in INTEGRATION_PAGES
}

export default function IntegrationPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!isIntegrationSlug(slug)) {
    return <Navigate to="/" replace />
  }

  const page = INTEGRATION_PAGES[slug]

  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          {page.eyebrow}
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          {page.title}
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/60 pl-4 text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[15px]">
          {page.deck}
        </p>

        <div className="mt-12 space-y-6 font-mono text-[15px] normal-case leading-[1.75] text-cream/85 sm:text-[16px]">
          {page.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <ul className="mt-10 space-y-3 font-mono text-[14px] leading-relaxed text-cream/80 sm:text-[15px]">
          {page.bullets.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Book a demo
          </a>
          <Link
            to="/pricing"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            View pricing
          </Link>
          <Link
            to="/"
            className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
