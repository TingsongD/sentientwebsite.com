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
  type SolutionPageContent,
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

const SAAS_JOURNEY_STAGES = [
  {
    label: 'Stage 1',
    title: 'Visitor arrives on a high-intent page',
    body: 'A prospect reaches pricing, demo, comparison, integration, security, docs, or customer story pages and starts looking for a reason to book or leave.',
  },
  {
    label: 'Stage 2',
    title: 'AI detects demo intent',
    body: 'SentientWeb reads page context, return visits, hesitation signals, and buying behavior so the experience responds when the visitor is showing real sales intent.',
  },
  {
    label: 'Stage 3',
    title: 'AI engages with page-specific help',
    body: 'The visitor gets approved answers for ROI, plan fit, integration fit, security questions, and competitive objections without being pushed into a generic form.',
  },
  {
    label: 'Stage 4',
    title: 'AI qualifies fit before booking',
    body: 'SentientWeb confirms role, company domain, use case, stack, timeline, urgency, and fit before opening the agreed demo path.',
  },
  {
    label: 'Stage 5',
    title: 'Qualified demo gets booked',
    body: 'When fit is clear, the visitor books through the agreed Calendly or demo route while the qualification context stays attached.',
  },
  {
    label: 'Stage 6',
    title: 'Sales receives the full CRM context',
    body: 'The agreed CRM or handoff path receives visitor context, pages viewed, conversation summary, qualification answers, booking details, and a suggested sales opener.',
  },
  {
    label: 'Stage 7',
    title: 'Text and email reminders go out',
    body: 'SentientWeb sends text and email reminders before the meeting so the prospect has the meeting link, timing, and reason they booked close at hand.',
  },
] as const

const SAAS_QUALIFICATION_POINTS = [
  'Business email or company domain',
  'Role and buying involvement',
  'Primary use case and urgency',
  'Current stack and CRM fit',
  'Timeline, budget signal, and next step',
  'Questions sales should answer first',
] as const

const SAAS_HANDOFF_ITEMS = [
  {
    title: 'CRM packet',
    body: 'Sales sees the page path, qualification answers, summary, booking details, and recommended opener in the workflow they already use.',
  },
  {
    title: 'Reminder loop',
    body: 'Text and email reminders keep the meeting visible after the visitor leaves the site and before the demo starts.',
  },
  {
    title: 'Prepared sales call',
    body: 'The salesperson starts with the prospect context, not a cold calendar event or a blank discovery call.',
  },
] as const

function SaasSolutionPage({
  page,
  accentBackgroundClass,
}: {
  page: SolutionPageContent
  accentBackgroundClass: string
}) {
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
            <div className="mx-auto max-w-[1120px]">
              <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                SOLUTION
              </p>
              <h1 className="font-grotesk max-w-[920px] text-[34px] uppercase leading-[1.08] text-cream sm:text-[48px] md:text-[56px] lg:text-[64px]">
                Recover demo-ready visitors before they leave.
              </h1>
              <p className="font-mono mt-6 max-w-[860px] border-l-2 border-neon/60 pl-4 text-[13px] uppercase leading-relaxed text-cream/72 sm:text-[14px] md:text-[15px]">
                From the first high-intent page view to the moment the prospect joins the demo,
                SentientWeb detects intent, answers the active hesitation, qualifies fit, books the
                meeting, sends text and email reminders, and gives sales the context to start
                prepared.
              </p>
              <p className="font-condiment mt-8 text-[26px] leading-tight text-neon sm:text-[34px]">
                {page.plumberMetaphor}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <CtaLink accentBackgroundClass={accentBackgroundClass}>
                  Book a 30-day pilot
                </CtaLink>
                <CtaLink accentBackgroundClass={accentBackgroundClass} variant="secondary">
                  See the recovery flow
                </CtaLink>
              </div>
              <TrustStrip className="mt-8 max-w-[940px]" />
            </div>
          </header>

          <section
            className="border-b border-white/10 bg-[#020a2e]/45 px-4 py-10 sm:px-6 md:px-8 lg:px-10"
            aria-label="Solution summary"
          >
            <div className="mx-auto flex max-w-[1120px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-grotesk text-[20px] uppercase leading-tight text-cream sm:text-[24px]">
                One visitor-to-demo path
              </p>
              <p className="font-mono max-w-2xl text-[13px] uppercase leading-relaxed text-neon sm:text-[14px]">
                Detect, engage, qualify, book, sync, remind, meet.
              </p>
            </div>
          </section>

          <section
            id="how-it-works"
            className="mx-auto max-w-[1260px] px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10"
            aria-labelledby="journey-heading"
          >
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Complete journey
            </p>
            <h2
              id="journey-heading"
              className="font-grotesk max-w-[900px] text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
            >
              The visitor-to-demo journey, start to finish.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              SentientWeb works the moment already happening on your site: a buyer is evaluating
              fit, looking for proof, and deciding whether the demo is worth booking.
            </p>
            <ol className="mt-10 space-y-5">
              {SAAS_JOURNEY_STAGES.map((stage, index) => (
                <li key={stage.title} className="relative">
                  {index < SAAS_JOURNEY_STAGES.length - 1 ? (
                    <span
                      className="absolute left-6 top-16 hidden h-[calc(100%+1.25rem)] w-px bg-neon/25 sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <div className="liquid-glass relative grid gap-5 rounded-[24px] p-6 sm:grid-cols-[8rem_1fr] sm:p-7 lg:grid-cols-[10rem_1fr]">
                    <div className="flex items-center gap-4 sm:block">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neon/45 bg-background font-grotesk text-[18px] text-neon"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <p className="font-mono sm:mt-5 text-[11px] uppercase tracking-widest text-neon">
                        {stage.label}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-grotesk text-[20px] uppercase leading-tight text-cream sm:text-[24px]">
                        {stage.title}
                      </h3>
                      <p className="font-mono mt-4 max-w-3xl text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                        {stage.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            className="border-y border-white/10 bg-[#020a2e]/50 px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10"
            aria-labelledby="qualification-heading"
          >
            <div className="mx-auto grid max-w-[1120px] gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div>
                <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  Qualified before calendar
                </p>
                <h2
                  id="qualification-heading"
                  className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[38px]"
                >
                  The AI earns the booking path.
                </h2>
                <p className="font-mono mt-5 text-[13px] normal-case leading-relaxed text-cream/72 sm:text-[14px]">
                  The goal is not another anonymous meeting. SentientWeb collects the minimum
                  context sales needs to know whether the visitor is a real fit and what they care
                  about before the demo appears.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SAAS_QUALIFICATION_POINTS.map((point) => (
                  <div key={point} className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="font-mono text-[12px] uppercase leading-relaxed text-cream/80">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10"
            aria-labelledby="handoff-heading"
          >
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Sales handoff
            </p>
            <h2
              id="handoff-heading"
              className="font-grotesk max-w-[860px] text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
            >
              The prospect shows up to the demo meeting.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              The final moment is simple: the prospect arrives, the salesperson knows what caused
              the meeting, and the first question starts from real website intent instead of a cold
              calendar event.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SAAS_HANDOFF_ITEMS.map((item) => (
                <article key={item.title} className="liquid-glass rounded-[22px] p-6 sm:p-7">
                  <h3 className="font-grotesk text-[18px] uppercase leading-tight text-cream sm:text-[20px]">
                    {item.title}
                  </h3>
                  <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="trust-heading"
          >
            <div className="mx-auto grid max-w-[1120px] gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
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
                      Secure response handling protects visitor and qualification data in transit.
                    </p>
                  </div>
                  <div className="liquid-glass rounded-[18px] p-4">
                    <UserRound className="mb-3 h-5 w-5 text-neon" aria-hidden />
                    <p className="uppercase text-cream">Human support path</p>
                    <p className="mt-2 text-cream/60">
                      Sales or support can take over when the buyer needs a person.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 lg:px-10"
            aria-label="Call to action"
          >
            <div className="mx-auto flex max-w-[1120px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono max-w-xl text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                Book a 30-day pilot and measure the path from detected intent to qualified booked
                demos with sales-accepted CRM context.
              </p>
              <div className="flex flex-wrap gap-4">
                <CtaLink accentBackgroundClass={accentBackgroundClass}>
                  Book a 30-day pilot
                </CtaLink>
                <Link
                  to={{ pathname: '/', hash: 'features' }}
                  className="liquid-glass rounded-full px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
                >
                  See product modules
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

export default function SolutionIndustryPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  if (!isSolutionSlug(slug)) {
    const legacyRedirect = getLegacySolutionRedirect(slug)
    return <Navigate to={legacyRedirect || '/#solutions'} replace />
  }

  const page = SOLUTION_PAGES[slug]
  const accentBackgroundClass = getAccentBackgroundClass(page.accentColor)

  if (slug === 'saas') {
    return <SaasSolutionPage page={page} accentBackgroundClass={accentBackgroundClass} />
  }

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
                Recovery context detected
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
