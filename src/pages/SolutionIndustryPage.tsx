import { Link, Navigate, useParams } from 'react-router-dom'
import { ShieldCheck, UserRound } from 'lucide-react'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { TrustStrip } from '../components/TrustStrip'
import { BOOK_DEMO_URL } from '../constants'
import {
  getLegacySolutionRedirect,
  SOLUTION_PAGES,
  type SolutionSlug,
} from '../data/solutionPagesContent'

function isSolutionSlug(s: string): s is SolutionSlug {
  return Object.hasOwn(SOLUTION_PAGES, s)
}

const ACCENT_BACKGROUND_CLASS_BY_COLOR: Record<string, string> = {
  '#6366f1': 'bg-[#6366f1]',
  '#059669': 'bg-[#059669]',
  '#2563eb': 'bg-[#2563eb]',
  '#7c3aed': 'bg-[#7c3aed]',
  '#0891b2': 'bg-[#0891b2]',
  '#ea580c': 'bg-[#ea580c]',
  '#4f46e5': 'bg-[#4f46e5]',
}

function getAccentBackgroundClass(accentColor: string) {
  return ACCENT_BACKGROUND_CLASS_BY_COLOR[accentColor] || 'bg-neon'
}

function CtaLink({
  children,
  accentBackgroundClass,
  variant = 'primary',
}: {
  children: string
  accentBackgroundClass: string
  variant?: 'primary' | 'secondary'
}) {
  const base =
    'inline-flex rounded-full px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide transition sm:text-[13px]'

  return (
    <a
      href={BOOK_DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={
        variant === 'primary'
          ? `${base} ${accentBackgroundClass} text-background hover:brightness-110`
          : `${base} liquid-glass text-cream hover:bg-white/10`
      }
    >
      {children}
    </a>
  )
}

export default function SolutionIndustryPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!isSolutionSlug(slug)) {
    const legacyRedirect = getLegacySolutionRedirect(slug)
    return <Navigate to={legacyRedirect || '/#solutions'} replace />
  }

  const page = SOLUTION_PAGES[slug]
  const accentBackgroundClass = getAccentBackgroundClass(page.accentColor)

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
            <div className="mx-auto max-w-[1080px]">
              <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                {page.hero.eyebrow}
              </p>
              <h1 className="font-grotesk max-w-[880px] text-[34px] uppercase leading-[1.08] text-cream sm:text-[48px] md:text-[56px] lg:text-[64px]">
                {page.hero.title}
              </h1>
              <p className="font-mono mt-6 max-w-[780px] border-l-2 border-neon/60 pl-4 text-[13px] uppercase leading-relaxed text-cream/72 sm:text-[14px] md:text-[15px]">
                {page.hero.subtitle}
              </p>
              <p className="font-condiment mt-8 text-[26px] leading-tight text-neon sm:text-[34px]">
                {page.plumberMetaphor}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <CtaLink accentBackgroundClass={accentBackgroundClass}>
                  {page.hero.primaryCta}
                </CtaLink>
                <CtaLink accentBackgroundClass={accentBackgroundClass} variant="secondary">
                  {page.hero.secondaryCta}
                </CtaLink>
              </div>
              <TrustStrip className="mt-8 max-w-[940px]" />
            </div>
          </header>

          <section
            className="border-b border-white/10 bg-[#020a2e]/45 px-4 py-10 sm:px-6 md:px-8 lg:px-10"
            aria-label="Proof stat"
          >
            <div className="mx-auto flex max-w-[1080px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-grotesk text-[20px] uppercase leading-tight text-cream sm:text-[24px]">
                Revenue leak detected
              </p>
              <p className="font-mono max-w-2xl text-[13px] uppercase leading-relaxed text-neon sm:text-[14px]">
                {page.proofStat}
              </p>
            </div>
          </section>

          <section
            className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="features-heading"
          >
            <h2
              id="features-heading"
              className="font-grotesk mb-10 text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
            >
              What we recover
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {page.features.map((feature) => (
                <article key={feature.title} className="liquid-glass rounded-[24px] p-6 sm:p-8">
                  <h3 className="font-grotesk mb-3 text-[17px] uppercase leading-snug text-cream sm:text-[19px]">
                    {feature.title}
                  </h3>
                  <p className="font-mono text-[12px] normal-case leading-relaxed text-cream/72 sm:text-[13px]">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="how-it-works"
            className="border-t border-white/10 bg-[#020a2e]/50 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="how-heading"
          >
            <div className="mx-auto max-w-[1080px]">
              <h2
                id="how-heading"
                className="font-grotesk mb-10 text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
              >
                How it works
              </h2>
              <ol className="grid gap-5 md:grid-cols-3">
                {page.steps.map((step, i) => (
                  <li key={step.title} className="liquid-glass rounded-[22px] p-6 sm:p-7">
                    <span
                      className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full font-grotesk text-[15px] text-background ${accentBackgroundClass}`}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <h3 className="font-grotesk text-[16px] uppercase text-cream sm:text-[17px]">
                      {step.title}
                    </h3>
                    <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            className="mx-auto max-w-[1080px] px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="proof-heading"
          >
            <div className="liquid-glass rounded-[28px] border border-neon/20 p-7 sm:p-10">
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                {page.caseStudy.eyebrow}
              </p>
              <h2
                id="proof-heading"
                className="font-grotesk text-[26px] uppercase leading-tight text-cream sm:text-[34px]"
              >
                {page.caseStudy.title}
              </h2>
              <p className="font-mono mt-5 max-w-[780px] text-[13px] normal-case leading-relaxed text-cream/75 sm:text-[14px]">
                {page.caseStudy.body}
              </p>
            </div>
          </section>

          <section
            className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="trust-heading"
          >
            <div className="mx-auto grid max-w-[1080px] gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
              <div>
                <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  AI disclosure
                </p>
                <h2
                  id="trust-heading"
                  className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
                >
                  Transparent by design
                </h2>
              </div>
              <div className="space-y-4 font-mono text-[13px] normal-case leading-relaxed text-cream/75 sm:text-[14px]">
                <p>{page.disclosure}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="liquid-glass rounded-[18px] p-4">
                    <ShieldCheck className="mb-3 h-5 w-5 text-neon" aria-hidden />
                    <p className="uppercase text-cream">Encrypted in transit</p>
                    <p className="mt-2 text-cream/60">
                      Secure response handling protects visitor data in transit.
                    </p>
                  </div>
                  <div className="liquid-glass rounded-[18px] p-4">
                    <UserRound className="mb-3 h-5 w-5 text-neon" aria-hidden />
                    <p className="uppercase text-cream">Human support path</p>
                    <p className="mt-2 text-cream/60">
                      Visitors can ask for a person whenever the next step needs one.
                    </p>
                  </div>
                </div>
                {slug === 'healthcare' ? (
                  <p className="text-cream/55">
                    Healthcare deployments should be reviewed with your compliance team. BAA support
                    is treated as a roadmap requirement, not a certification claim.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section
            className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-label="Call to action"
          >
            <div className="mx-auto flex max-w-[1080px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono max-w-xl text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                {page.bottomCta}
              </p>
              <div className="flex flex-wrap gap-4">
                <CtaLink accentBackgroundClass={accentBackgroundClass}>
                  {page.hero.primaryCta}
                </CtaLink>
                <Link
                  to={{ pathname: '/', hash: 'solutions' }}
                  className="liquid-glass rounded-full px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
                >
                  All solutions
                </Link>
              </div>
            </div>
          </section>
        </article>
        <RoiCalculatorCta />
      </main>
      <SiteFooter />
    </>
  )
}
