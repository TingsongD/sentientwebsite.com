import { Link, Navigate, useParams } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import { SOLUTION_PAGES, type SolutionSlug } from '../data/solutionPagesContent'

function isSolutionSlug(s: string): s is SolutionSlug {
  return s in SOLUTION_PAGES
}

export default function SolutionIndustryPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!isSolutionSlug(slug)) {
    return <Navigate to="/#solutions" replace />
  }

  const page = SOLUTION_PAGES[slug]

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:text-background"
      >
        Skip to main content
      </a>
      <MarketingHeader layout="page" />
      <main id="main-content" className="bg-background">
        <article>
          <header className="border-b border-white/10 px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10">
            <div className="mx-auto max-w-[880px]">
              <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                {page.hero.eyebrow}
              </p>
              <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[48px] md:text-[56px] lg:text-[64px]">
                {page.hero.title}
              </h1>
              <p className="font-mono mt-6 border-l-2 border-neon/60 pl-4 text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                {page.hero.deckHook}
              </p>
              <div className="mt-8 space-y-5 font-mono text-[14px] normal-case leading-relaxed text-cream/85 sm:text-[15px] md:text-[16px]">
                {page.hero.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </header>

          <section
            className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="challenges-heading"
          >
            <h2
              id="challenges-heading"
              className="font-grotesk mb-10 text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
            >
              What breaks today
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {page.challenges.map((c) => (
                <div key={c.title} className="liquid-glass rounded-[24px] p-6 sm:p-8">
                  <h3 className="font-grotesk mb-3 text-[17px] uppercase leading-snug text-cream sm:text-[19px]">
                    {c.title}
                  </h3>
                  <p className="font-mono text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="border-t border-white/10 bg-[#020a2e]/50 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="fit-heading"
          >
            <div className="mx-auto max-w-[1200px]">
              <h2
                id="fit-heading"
                className="font-grotesk mb-4 text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
              >
                How SentientWeb fits
              </h2>
              <p className="font-mono mb-10 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/55 sm:text-[14px]">
                Capabilities from the product story: qualification, Calendly booking, hybrid knowledge
                search, proactive triggers, and CRM sync — not a passive FAQ bot.
              </p>
              <ul className="grid gap-5 sm:grid-cols-2">
                {page.howWeFit.map((item) => (
                  <li
                    key={item.title}
                    className="liquid-glass rounded-[20px] border border-white/[0.06] p-6 sm:p-7"
                  >
                    <h3 className="font-grotesk mb-2 text-[15px] uppercase tracking-wide text-neon sm:text-[16px]">
                      {item.title}
                    </h3>
                    <p className="font-mono text-[12px] normal-case leading-relaxed text-cream/75 sm:text-[13px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="mx-auto max-w-[880px] px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="playbook-heading"
          >
            <h2
              id="playbook-heading"
              className="font-grotesk mb-10 text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
            >
              Go-live playbook
            </h2>
            <ol className="space-y-5">
              {page.playbook.map((step, i) => (
                <li
                  key={step.title}
                  className="liquid-glass flex gap-5 rounded-[20px] p-5 sm:gap-6 sm:p-7"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neon/15 font-grotesk text-[15px] text-neon"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-grotesk text-[16px] uppercase text-cream sm:text-[17px]">
                      {step.title}
                    </h3>
                    <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <figure className="mx-auto max-w-[880px] px-4 pb-14 sm:px-6 md:px-8 lg:px-10">
            <blockquote className="liquid-glass rounded-[24px] border border-neon/20 p-8 sm:p-10">
              <p className="font-condiment text-center text-[22px] leading-snug text-cream sm:text-[28px] md:text-[32px]">
                &ldquo;{page.pullQuote}&rdquo;
              </p>
            </blockquote>
          </figure>

          <section
            className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-label="Call to action"
          >
            <div className="mx-auto flex max-w-[880px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                {page.ctaLine}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neon px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
                >
                  Book a demo
                </a>
                <Link
                  to="/pricing"
                  className="liquid-glass rounded-full px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
                >
                  View pricing
                </Link>
                <Link
                  to={{ pathname: '/', hash: 'solutions' }}
                  className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
                >
                  All solutions
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}
