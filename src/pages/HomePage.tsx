import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { TrustStrip } from '../components/TrustStrip'
import { BOOK_DEMO_URL } from '../constants'

const ABOUT_MEDIA = '/media/home-about.svg'
const CTA_MEDIA = '/media/home-cta.svg'

const INTEGRATION_LOGOS = [
  { name: 'HubSpot', logoUrl: '/logos/hubspot.svg' },
  { name: 'Calendly', logoUrl: '/logos/calendly.svg' },
  { name: 'WordPress', logoUrl: '/logos/wordpress.svg' },
  { name: 'Webflow', logoUrl: '/logos/webflow.svg' },
] as const

const STACK_FIT_CARDS = [
  {
    title: 'HubSpot teams',
    body: 'Launch with the native wedge: contact, company, qualification, booking, and opener context in HubSpot.',
  },
  {
    title: 'Salesforce teams',
    body: 'Map the Salesforce outcome before launch. If sales context cannot land where reps work, the pilot should not start.',
  },
  {
    title: 'Pipedrive teams',
    body: 'Scope Pipedrive or webhook handoff so lean teams do not create manual CRM work just to test demo recovery.',
  },
  {
    title: 'Custom or no CRM',
    body: 'Use the pilot fit check to decide whether a webhook, shared inbox, CRM setup, or scheduler prerequisite comes first.',
  },
] as const

const HIGH_INTENT_PAGE_CARDS = [
  {
    title: 'Pricing pages',
    body: 'Handle plan-fit, ROI, budget, and timing hesitation before the visitor leaves.',
  },
  {
    title: 'Demo pages',
    body: 'Qualify the visitor and open the right Calendly path when fit is confirmed.',
  },
  {
    title: 'Comparison pages',
    body: 'Answer competitive objections from approved content.',
  },
  {
    title: 'Integration pages',
    body: 'Confirm stack fit for HubSpot, Calendly, Salesforce, or customer tools.',
  },
  {
    title: 'Security pages',
    body: 'Route trust questions and sync requirements to sales.',
  },
  {
    title: 'Customer story pages',
    body: "Match proof to the visitor's use case and buying context.",
  },
] as const

const DEMO_RECOVERY_MODULES = [
  {
    title: 'Demo-Ready Detection',
    body: 'Detect high-intent behavior on pricing, demo, comparison, integration, security, docs, and customer story pages.',
  },
  {
    title: 'Page-Specific Recovery Playbooks',
    body: 'Handle pricing hesitation, integration questions, security concerns, and comparison-page objections with approved source content.',
  },
  {
    title: 'Qualified Demo Booking',
    body: 'Confirm company domain, role, use case, timeline, and stack fit before opening the booking path.',
  },
  {
    title: 'CRM Context Sync',
    body: 'Send contact, company, page behavior, qualification answers, and conversation summary into the agreed sales workflow.',
  },
  {
    title: 'Recovered Demo Reporting',
    body: 'Show demo-ready visitors detected, qualified visitors, booked demos, and sales-visible context.',
  },
] as const

const BUYER_OBJECTION_CARDS = [
  {
    title: 'Will this work with our CRM?',
    body: 'CRM fit is checked before launch. HubSpot is the fastest path; Salesforce, Pipedrive, and webhook handoffs are scoped before a pilot is accepted.',
  },
  {
    title: 'Can we trust the answers?',
    body: 'Recovery answers come from approved source content, with sensitive, security, legal, or high-value questions routed to a human instead of improvised.',
  },
  {
    title: 'Where is the proof?',
    body: 'The pilot produces a proof packet: baseline pages, recovered demos, qualification answers, sales acceptance, and the exact pipeline assumption used.',
  },
  {
    title: 'Are case-study rights required?',
    body: 'No. Public proof rights are optional and can be traded for a discount; they are not a condition for evaluating the 30-day pilot.',
  },
] as const

const VOICE_FEEDBACK_USE_CASES = [
  {
    title: 'Lost-demo feedback',
    body: 'Find why a prospect did not book or did not show.',
  },
  {
    title: 'Post-demo objection capture',
    body: 'Capture what blocked the deal after the call.',
  },
  {
    title: 'Churn-risk interview',
    body: 'Ask why usage dropped or renewal is at risk.',
  },
  {
    title: 'NPS follow-up by voice',
    body: 'Turn a shallow score into conversational product feedback.',
  },
  {
    title: 'Website exit interview',
    body: 'Ask what stopped visitors leaving pricing or demo pages.',
  },
] as const

const FUNNEL_FEATURE_GROUPS = [
  {
    stage: 'Top of the funnel',
    summary: 'Detect and recover buying intent before a visitor becomes another anonymous bounce.',
    features: [
      {
        title: 'High-intent page detection',
        body: 'Scores visits to pricing, demo, comparison, integration, security, docs, and customer story pages.',
      },
      {
        title: 'Instant Demo Preview',
        body: 'Lets prospects request a SentientWeb recovery preview from a public pricing or website URL.',
      },
      {
        title: 'Page recovery surfaces',
        body: 'Handles pricing, demo, comparison, integration, security, and customer-story hesitation moments.',
      },
      {
        title: 'Service-business early path',
        body: 'Keeps appointment-ready visitor recovery visible as an emerging path without making it the primary product.',
      },
    ],
  },
  {
    stage: 'Mid-funnel',
    summary: 'Turn active hesitation into a guided conversation that confirms whether the visitor is worth sales time.',
    features: [
      {
        title: 'Page-specific AI engagement',
        body: 'Responds with the right plan-fit, ROI, stack-fit, security, or competitive context for the page they are on.',
      },
      {
        title: 'Approved-source answers',
        body: 'Uses approved content instead of generic responses when visitors ask buying or trust questions.',
      },
      {
        title: 'Qualification questions',
        body: 'Collects role, company domain, use case, stack, timeline, urgency, and fit before the calendar opens.',
      },
      {
        title: 'Human handoff',
        body: 'Routes complex, sensitive, or high-value conversations to a person with the full context preserved.',
      },
      {
        title: 'Integration context',
        body: 'Keeps HubSpot, Calendly, WordPress, Webflow, and custom install paths visible in the buying journey.',
      },
    ],
  },
  {
    stage: 'Bottom of the funnel',
    summary: 'Convert qualified website intent into a booked meeting sales can actually prepare for.',
    features: [
      {
        title: 'Calendly demo booking',
        body: 'Opens the agreed booking path only after the visitor has shared enough context to qualify the meeting.',
      },
      {
        title: 'CRM context sync',
        body: 'Sends page behavior, qualification answers, summary, booking details, and a suggested opener into the agreed sales workflow.',
      },
      {
        title: 'Text and email reminders',
        body: 'Sends reminders before the meeting so the prospect has the link, timing, and reason they booked.',
      },
      {
        title: 'Recovered demo reporting',
        body: 'Tracks detected demo-ready visitors, qualified visitors, booked demos, and sales-visible context.',
      },
      {
        title: 'ROI calculator',
        body: 'Models recovered demos and pipeline influence from existing high-intent website traffic.',
      },
      {
        title: 'Voice feedback add-on',
        body: 'Captures why buyers did not book, did not show, stalled after demo, or signaled churn risk.',
      },
    ],
  },
] as const

type LeakClockUnit = 'day' | 'hour'

type LeakClockEstimate = {
  usAnnualLeakUsd: number
  typicalAnnualLeakUsd: number
  sourceLabel: string
  methodology: string
}

const LEAK_CLOCK_UNITS: LeakClockUnit[] = ['day', 'hour']

const LEAK_CLOCK_ESTIMATES = {
  saas: {
    usAnnualLeakUsd: 35_000_000_000,
    typicalAnnualLeakUsd: 180_000,
    sourceLabel: 'Modeled from US SaaS revenue and speed-to-lead decay research.',
    methodology:
      'Uses US SaaS revenue benchmarks and a conservative modeled share of inbound demo pipeline lost to slow routing, weak response loops, and delayed handoff.',
  },
} as const satisfies Record<'saas', LeakClockEstimate>

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

function annualLeakToRate(value: number, unit: LeakClockUnit) {
  if (unit === 'hour') return value / 365 / 24
  return value / 365
}

function formatLeakRate(value: number) {
  if (value >= 1_000_000) return compactCurrency.format(value)
  return currency.format(value)
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPrefersReducedMotion(media.matches)

    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return prefersReducedMotion
}

function AmbientVideo({
  mediaSrc,
  className,
  videoClassName = 'h-full w-full object-cover',
  reducedMotion,
}: {
  mediaSrc: string
  className: string
  videoClassName?: string
  reducedMotion: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [clientReady, setClientReady] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const [hasError, setHasError] = useState(false)
  const shouldRenderVideo = clientReady && !reducedMotion && !hasError && mediaSrc.endsWith('.mp4')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep video URLs out of SSR/hydration markup
    setClientReady(true)
  }, [])

  useEffect(() => {
    if (!shouldRenderVideo) return
    const video = videoRef.current
    if (!video) return

    let cancelled = false
    void video.play().catch(() => {
      if (!cancelled) setHasError(true)
    })

    return () => {
      cancelled = true
      video.pause()
    }
  }, [shouldRenderVideo])

  const showVideo = canPlay && shouldRenderVideo

  return (
    <div className={className} aria-hidden>
      <div className="ambient-video-fallback absolute inset-0" />
      <img
        src={mediaSrc}
        alt=""
        className={`${videoClassName} relative z-10 transition-opacity duration-500 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
        loading="eager"
        decoding="async"
      />
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          className={`${videoClassName} relative z-10 transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          src={mediaSrc}
          loop
          muted
          playsInline
          preload="metadata"
          data-ambient-video
          onCanPlay={() => setCanPlay(true)}
          onError={() => setHasError(true)}
        />
      ) : null}
    </div>
  )
}

function IntegrationLogoItem({
  name,
  logoUrl,
  hidden = false,
}: {
  name: string
  logoUrl: string
  hidden?: boolean
}) {
  return (
    <li
      className="flex min-w-[96px] items-center justify-center px-6 py-3 sm:min-w-[128px] sm:px-8"
      aria-hidden={hidden || undefined}
    >
      <img
        src={logoUrl}
        alt={hidden ? '' : `${name} logo`}
        className="h-10 w-auto max-w-[90px] shrink-0 object-contain sm:h-12 sm:max-w-[112px]"
        loading="eager"
        decoding="async"
      />
    </li>
  )
}

function IntegrationLogoStrip() {
  return (
    <section
      className="overflow-hidden border-y border-white/10 bg-background py-8 sm:py-10"
      aria-labelledby="integrations-strip-heading"
    >
      <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
        <h2
          id="integrations-strip-heading"
          className="font-mono mb-5 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]"
        >
          Integrates with
        </h2>
      </div>
      <div className="integration-logo-marquee" role="list" aria-label="Integration logos">
        <ul className="integration-logo-track">
          {INTEGRATION_LOGOS.map((logo) => (
            <IntegrationLogoItem key={logo.name} {...logo} />
          ))}
        </ul>
        <ul className="integration-logo-track" aria-hidden>
          {INTEGRATION_LOGOS.map((logo) => (
            <IntegrationLogoItem key={`duplicate-${logo.name}`} {...logo} hidden />
          ))}
        </ul>
      </div>
    </section>
  )
}

function SolutionLeakClock({
  navLabel,
  marketLabel,
  estimate,
  unit,
  reducedMotion,
}: {
  navLabel: string
  marketLabel: string
  estimate: LeakClockEstimate
  unit: LeakClockUnit
  reducedMotion: boolean
}) {
  const usRate = formatLeakRate(annualLeakToRate(estimate.usAnnualLeakUsd, unit))
  const typicalRate = formatLeakRate(annualLeakToRate(estimate.typicalAnnualLeakUsd, unit))

  return (
    <span className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <span className="flex min-w-0 flex-col gap-4">
          <span className="font-mono text-[10px] uppercase leading-tight tracking-widest text-cream/55 sm:text-[11px]">
          B2B SaaS demo recovery context in the US
          </span>
        <span className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-4">
          <span className="font-grotesk block text-[24px] uppercase leading-none tracking-normal text-cream sm:text-[32px] lg:text-[42px]">
            {navLabel}
          </span>
          <span
            className={`font-grotesk text-[28px] uppercase leading-none text-[#FF8A8A] sm:text-[34px] lg:text-[40px] ${
              reducedMotion ? '' : 'leak-rate-flash'
            }`}
          >
            {usRate}/{unit}
          </span>
        </span>
        <span className="font-mono block text-[14px] uppercase leading-relaxed tracking-wide text-cream/60 transition group-hover:text-cream/75 sm:text-[16px]">
          {marketLabel}
        </span>
      </span>
      <span className="font-mono text-[11px] uppercase leading-relaxed text-cream/55 sm:text-[12px] md:max-w-[190px] md:text-right">
        Modeled operator gap: <span className="text-[#FF8A8A]">{typicalRate}/{unit}</span>
      </span>
    </span>
  )
}

function LeakClockMethodology() {
  const estimate = LEAK_CLOCK_ESTIMATES.saas

  return (
    <details className="liquid-glass mt-8 rounded-[20px] p-5 sm:p-6">
      <summary className="cursor-pointer list-none font-grotesk text-[15px] uppercase tracking-wide text-cream [&::-webkit-details-marker]:hidden">
        How this B2B SaaS estimate is modeled
      </summary>
      <article className="mt-5 border-t border-white/10 pt-4">
        <h3 className="font-grotesk text-[13px] uppercase tracking-wide text-neon">
          B2B SaaS
        </h3>
        <p className="font-mono mt-2 text-[11px] uppercase leading-relaxed text-cream/55">
          {estimate.sourceLabel}
        </p>
        <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/70">
          {estimate.methodology}
        </p>
      </article>
      <p className="font-mono mt-5 border-t border-white/10 pt-4 text-[11px] uppercase leading-relaxed text-cream/45">
        This is a directional estimate for B2B SaaS demo recovery, not an audited financial claim
        or product commitment.
      </p>
    </details>
  )
}

export default function HomePage() {
  const { pathname, hash } = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [leakClockUnit, setLeakClockUnit] = useState<LeakClockUnit>('day')
  const activeLeakClockUnit = prefersReducedMotion ? 'day' : leakClockUnit

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash) return
    const id = hash.replace(/^#/, '')
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({
      block: 'start',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [pathname, hash, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = window.setInterval(() => {
      setLeakClockUnit((current) => {
        const index = LEAK_CLOCK_UNITS.indexOf(current)
        return LEAK_CLOCK_UNITS[(index + 1) % LEAK_CLOCK_UNITS.length]
      })
    }, 2400)

    return () => window.clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:text-background"
      >
        Skip to main content
      </a>

      <main id="main-content">
        {/* Hero */}
        <section
          className="relative min-h-screen overflow-hidden rounded-b-[32px] bg-background"
          aria-labelledby="hero-heading"
        >
          <div className="ambient-video-fallback absolute inset-0 h-full w-full" aria-hidden />

          <div className="relative z-10 flex min-h-screen flex-col">
            <MarketingHeader layout="hero" />

            <div className="mx-auto flex w-full max-w-[1831px] flex-1 flex-col justify-center px-4 pb-16 pt-10 sm:px-6 md:px-8 lg:px-10 lg:pb-24">
              <div className="relative max-w-[880px] lg:ml-16 xl:ml-32">
                <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  Visitor-to-Demo Engine for B2B SaaS
                </p>
                <p className="font-mono mb-6 max-w-[620px] text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                  We are digital plumbers for your revenue leaks, but the first leak we fix is demo
                  intent: visitors who reach high-intent pages and leave before booking.
                </p>
                <h1
                  id="hero-heading"
                  className="font-grotesk uppercase leading-[1.05] text-cream sm:leading-none text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]"
                >
                  Recover demo-ready visitors before they leave.
                </h1>
                <p className="font-condiment pointer-events-none absolute -right-1 top-[42%] z-10 -translate-y-1/2 -rotate-1 text-[22px] text-neon opacity-90 mix-blend-exclusion sm:text-[28px] md:top-[48%] md:text-[36px] lg:right-[-8%] lg:text-[44px] normal-case">
                  Demo booked
                </p>
                <p className="font-mono mt-8 max-w-[540px] text-[13px] uppercase leading-relaxed text-neon sm:text-[14px] md:text-[15px]">
                  Digital plumbing for your demo pipeline.
                </p>
                <p className="font-mono mt-5 max-w-[540px] text-[14px] uppercase leading-relaxed text-cream sm:text-[15px] md:text-[16px]">
                  SentientWeb detects high-intent visitors on pricing, demo, comparison, and
                  integration pages, qualifies them, books the meeting, and syncs the full context
                  into the sales workflow your team actually uses.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={BOOK_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  >
                    Book a 30-day pilot
                  </a>
                  <a
                    href="#features"
                    className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
                  >
                    See how demo recovery works
                  </a>
                </div>
                <TrustStrip className="mt-8 max-w-[880px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Funnel feature overview */}
        <section
          id="features"
          className="scroll-mt-28 border-t border-white/10 bg-background py-16 sm:py-20 md:py-24 lg:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Product
            </p>
            <h2
              id="features-heading"
              className="font-grotesk max-w-[1040px] text-[32px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]"
            >
              One scroll from top-of-funnel intent to a booked demo.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              SentientWeb brings the visible homepage capabilities into one continuous path:
              detect intent, engage the hesitation, qualify fit, book the meeting, sync context,
              and learn from what did not convert.
            </p>

            <div className="mt-12 grid gap-7">
              {FUNNEL_FEATURE_GROUPS.map((group) => (
                <section
                  key={group.stage}
                  className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-7 lg:p-8"
                  aria-labelledby={`funnel-${group.stage.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                >
                  <div className="mb-6 grid gap-3 lg:grid-cols-[0.7fr_1fr] lg:items-end">
                    <h3
                      id={`funnel-${group.stage.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="font-grotesk text-[26px] uppercase leading-tight text-cream sm:text-[34px]"
                    >
                      {group.stage}
                    </h3>
                    <p className="font-mono text-[12px] uppercase leading-relaxed text-cream/62 sm:text-[13px] lg:text-right">
                      {group.summary}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.features.map((feature) => (
                      <article
                        key={feature.title}
                        className="liquid-glass rounded-[20px] p-5 transition hover:bg-white/10 sm:p-6"
                      >
                        <h4 className="font-grotesk text-[17px] uppercase leading-tight text-cream sm:text-[19px]">
                          {feature.title}
                        </h4>
                        <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                          {feature.body}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue leaks */}
        <section
          id="revenue-leaks"
          className="relative overflow-hidden bg-background"
          aria-labelledby="revenue-leaks-heading"
        >
          <AmbientVideo
            className="absolute inset-0 h-full w-full overflow-hidden"
            mediaSrc={ABOUT_MEDIA}
            reducedMotion={prefersReducedMotion}
          />

          <div className="relative z-10 mx-auto max-w-[1831px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 lg:py-24 xl:py-32">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <div className="shrink-0">
                <h2
                  id="revenue-leaks-heading"
                  className="font-grotesk uppercase leading-none text-cream text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
                >
                  <span className="flex flex-wrap items-end gap-x-2 sm:gap-x-3 md:gap-x-4">
                    <span className="blackhole-drift-word blackhole-drift-word--revenue block shrink-0">
                      Revenue
                    </span>
                    <span
                      className="font-condiment pointer-events-none -translate-y-0.5 -rotate-1 text-[26px] text-neon mix-blend-exclusion sm:text-[34px] md:text-[42px] lg:text-[50px] normal-case sm:-translate-y-1"
                    >
                      Leaks
                    </span>
                    <span className="block">:</span>
                  </span>
                  <span className="mt-1 block sm:mt-0">The Black Hole</span>
                  <span className="mt-1 block sm:mt-0">
                    Sucking Your{' '}
                    <span className="blackhole-drift-word blackhole-drift-word--profits inline-block text-neon">
                      Profits
                    </span>{' '}
                    Dry
                  </span>
                </h2>
              </div>
              <div className="max-w-[600px]">
                <p className="font-mono text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                  Demo intent is the leak SentientWeb fixes. This B2B SaaS model shows where
                  high-intent visitors disappear before sales sees the demand, qualifies the buyer,
                  or books the meeting.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Link
                to="/solutions/saas"
                className="group block min-h-[176px] rounded-[20px] border border-cream/25 bg-black p-5 text-cream shadow-[0_18px_60px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 hover:border-[#FF8A8A]/70 hover:shadow-[0_24px_80px_rgba(255,138,138,0.14)] sm:p-6 lg:min-h-[154px]"
              >
                <SolutionLeakClock
                  navLabel="B2B SaaS"
                  marketLabel="HubSpot + Calendly B2B SaaS teams"
                  estimate={LEAK_CLOCK_ESTIMATES.saas}
                  unit={activeLeakClockUnit}
                  reducedMotion={prefersReducedMotion}
                />
              </Link>
            </div>
            <LeakClockMethodology />
          </div>
        </section>

        {/* Phase 1 / product intro */}
        <section
          className="relative min-h-screen overflow-hidden bg-background"
          aria-labelledby="phase-heading"
        >
          <AmbientVideo
            className="absolute inset-0 h-full w-full overflow-hidden"
            mediaSrc={ABOUT_MEDIA}
            reducedMotion={prefersReducedMotion}
          />

          <div className="relative z-10 mx-auto max-w-[1831px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 lg:py-24 xl:py-32">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <div className="shrink-0">
                <h2
                  id="phase-heading"
                  className="font-grotesk uppercase leading-none text-cream text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
                >
                  <span className="flex flex-wrap items-end gap-x-2 sm:gap-x-3 md:gap-x-4">
                    <span className="block shrink-0">Your</span>
                    <span
                      className="font-condiment pointer-events-none -translate-y-0.5 -rotate-1 text-[26px] text-neon mix-blend-exclusion sm:text-[34px] md:text-[42px] lg:text-[50px] normal-case sm:-translate-y-1"
                      aria-hidden
                    >
                      demo-ready
                    </span>
                    <span className="block">buyers</span>
                  </span>
                  <span className="mt-1 block sm:mt-0">are already on</span>
                  <span className="mt-1 block sm:mt-0">the site.</span>
                </h2>
              </div>
              <div className="max-w-[620px]">
                <p className="font-mono text-[14px] uppercase leading-relaxed text-cream/75 sm:text-[15px]">
                  They compare pricing, check integrations, read security pages, and hesitate
                  before filling out a form. SentientWeb catches that moment and routes it to a
                  qualified booked demo.
                </p>
                <ul className="mt-8 grid gap-3 font-mono text-[12px] uppercase leading-relaxed text-cream/70 sm:text-[13px]">
                  {[
                    'Pricing-page visitors hesitate over plan fit and ROI.',
                    'Comparison-page visitors need a clear answer before they bounce.',
                    'Integration-page visitors want to know whether the stack works.',
                    'Security-page visitors need trust context before they book.',
                    'Demo-page visitors need fast qualification, not a long form.',
                  ].map((item) => (
                    <li key={item} className="liquid-glass rounded-[18px] px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Instant demo preview */}
        <section
          id="instant-demo-preview"
          className="scroll-mt-28 border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="instant-demo-preview-heading"
        >
          <div className="mx-auto grid max-w-[1831px] gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div>
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                Instant Demo Preview
              </p>
              <h2
                id="instant-demo-preview-heading"
                className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
              >
                See how SentientWeb would recover demo-ready visitors from your pricing page.
              </h2>
              <p className="font-mono mt-5 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                Enter a public URL and get a preview of the recovery path SentientWeb would create
                for high-intent visitors on your own site.
              </p>
            </div>

            <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
              <label className="block" htmlFor="preview-url">
                <span className="font-grotesk mb-2 block text-[12px] uppercase tracking-wide text-cream/80">
                  Company website or pricing page URL
                </span>
                <input
                  id="preview-url"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com/pricing"
                  className="min-h-12 w-full rounded-[16px] border border-white/10 bg-background px-4 py-3 font-mono text-[13px] normal-case text-cream outline-none transition placeholder:text-cream/35 focus:border-neon"
                />
              </label>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neon px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
                >
                  Request a preview
                </a>
                <p className="font-mono max-w-[360px] text-[11px] uppercase leading-relaxed text-cream/50">
                  URL submitted - preview generated - business-email claim - booked call - pilot
                </p>
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <h3 className="font-grotesk text-[15px] uppercase tracking-wide text-cream">
                  Claim your recovery preview.
                </h3>
                <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/65">
                  Use a business email so we can send the hosted preview, show the detected
                  demo-intent moments, and walk through the setup path.
                </p>
                <p className="font-mono mt-4 text-[11px] uppercase leading-relaxed text-cream/45">
                  SentientWeb only analyzes public pages for the preview. Private pages, internal
                  hosts, and large crawls are blocked by backend controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Two recovery paths */}
        <section
          className="border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="recovery-paths-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Two recovery paths
            </p>
            <h2
              id="recovery-paths-heading"
              className="font-grotesk max-w-[900px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              Start with demo-ready visitor recovery.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              SentientWeb&apos;s primary product is Demo-Ready Visitor Recovery for B2B SaaS.
              Appointment-Ready Visitor Recovery for service businesses is an emerging path using
              the same high-intent recovery logic.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[28px] border border-neon/45 bg-neon/[0.06] p-6 shadow-[0_28px_90px_rgba(111,255,0,0.12)] sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
                  Primary path / B2B SaaS
                </p>
                <h3 className="font-grotesk mt-4 text-[26px] uppercase leading-tight text-cream sm:text-[34px]">
                  Demo-Ready Visitor Recovery for B2B SaaS
                </h3>
                <p className="font-mono mt-4 text-[13px] uppercase leading-relaxed text-cream/75 sm:text-[14px]">
                  Recover demo-ready visitors before they leave.
                </p>
                <p className="font-mono mt-4 max-w-2xl text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[14px]">
                  For B2B SaaS teams turning pricing, demo, comparison, security, and
                  integration-page intent into qualified booked meetings with CRM-visible context.
                </p>
                <Link
                  to="/solutions/saas"
                  className="mt-7 inline-flex rounded-full bg-neon px-7 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
                >
                  Explore B2B SaaS recovery
                </Link>
              </article>

              <article className="liquid-glass rounded-[28px] p-6 opacity-90 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cream/50">
                  Emerging path / early access
                </p>
                <h3 className="font-grotesk mt-4 text-[22px] uppercase leading-tight text-cream sm:text-[28px]">
                  Appointment-Ready Visitor Recovery for service businesses
                </h3>
                <p className="font-mono mt-4 text-[13px] uppercase leading-relaxed text-cream/70">
                  Recover appointment-ready visitors before they leave.
                </p>
                <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/60">
                  For service businesses turning service, pricing, booking, and location-page intent
                  into qualified appointments.
                </p>
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex rounded-full border border-white/15 px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:border-neon hover:text-neon sm:text-[13px]"
                >
                  Preview service recovery
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* Demo recovery modules */}
        <section
          className="border-t border-white/10 bg-background py-16 sm:py-20 md:py-24"
          aria-labelledby="demo-engine-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Inside the Visitor-to-Demo Engine
            </p>
            <h2
              id="demo-engine-heading"
              className="font-grotesk max-w-[960px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              The Demo Recovery Engine inside SentientWeb.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              Five focused modules turn demo-ready website intent into qualified booked meetings
              and HubSpot-ready context.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {DEMO_RECOVERY_MODULES.map((module) => (
                <article
                  key={module.title}
                  className="liquid-glass rounded-[24px] p-5 transition hover:bg-white/10 sm:p-6"
                >
                  <h3 className="font-grotesk text-[17px] uppercase leading-tight text-cream sm:text-[19px]">
                    {module.title}
                  </h3>
                  <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                    {module.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section
          id="solutions"
          className="scroll-mt-28 border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="solutions-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <h2
              id="solutions-heading"
              className="font-grotesk mb-4 text-[28px] uppercase leading-tight text-cream sm:text-[36px] md:text-[44px]"
            >
              B2B SaaS demo recovery
            </h2>
            <p className="font-mono mb-10 max-w-2xl text-[14px] uppercase leading-relaxed text-cream/70">
              Recover high-intent visitors from pricing, demo, comparison, integration, security,
              and customer story pages.
            </p>
            <p className="font-condiment mb-10 max-w-3xl text-[22px] normal-case leading-tight text-neon sm:text-[28px] md:text-[34px]">
              We are digital plumbers for your revenue leaks, but the first leak we fix is demo
              intent.
            </p>
            <div className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {HIGH_INTENT_PAGE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="liquid-glass rounded-[22px] p-5 transition hover:bg-white/10 sm:p-6"
                >
                  <h3 className="font-grotesk text-[18px] uppercase leading-tight text-cream sm:text-[20px]">
                    {card.title}
                  </h3>
                  <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stack fit */}
        <section
          className="border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="stack-fit-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Stack fit
            </p>
            <h2
              id="stack-fit-heading"
              className="font-grotesk max-w-[960px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              Do not buy demo recovery if the context lands in the wrong system.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              The first pilot step is a CRM and scheduler fit check. If your sales team lives in
              Salesforce, Pipedrive, a custom CRM, or no CRM yet, the handoff path is decided before
              installation.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {STACK_FIT_CARDS.map((card) => (
                <article key={card.title} className="liquid-glass rounded-[22px] p-5 sm:p-6">
                  <h3 className="font-grotesk text-[17px] uppercase leading-tight text-cream sm:text-[19px]">
                    {card.title}
                  </h3>
                  <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Objection handling */}
        <section
          className="border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="buyer-objections-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Buyer objections answered
            </p>
            <h2
              id="buyer-objections-heading"
              className="font-grotesk max-w-[980px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              The pilot is designed to answer the questions your CEO, RevOps, and sales leader will ask.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {BUYER_OBJECTION_CARDS.map((card) => (
                <article key={card.title} className="liquid-glass rounded-[22px] p-5 sm:p-6">
                  <h3 className="font-grotesk text-[17px] uppercase leading-tight text-cream sm:text-[19px]">
                    {card.title}
                  </h3>
                  <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <IntegrationLogoStrip />

        {/* CTA video + closing */}
        <section className="relative w-full bg-background" aria-labelledby="cta-heading">
          <AmbientVideo
            className="relative block aspect-video w-full overflow-hidden"
            mediaSrc={CTA_MEDIA}
            reducedMotion={prefersReducedMotion}
          />
          <div className="absolute inset-0 z-10 bg-background/45" aria-hidden />

          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="pointer-events-auto absolute top-1/2 right-0 w-full -translate-y-1/2 px-6 text-right sm:px-10 lg:pl-[15%] lg:pr-[20%]">
              <div className="relative ml-auto inline-block max-w-4xl">
                <p
                  className="font-condiment pointer-events-none absolute -left-2 -top-8 z-10 text-[17px] text-neon mix-blend-exclusion sm:-top-10 sm:text-[28px] md:-top-14 md:text-[44px] lg:-left-4 lg:-top-16 lg:text-[56px] xl:text-[68px] normal-case"
                  aria-hidden
                >
                  One engine
                </p>
                <h2
                  id="cta-heading"
                  className="font-grotesk uppercase leading-tight text-cream text-[18px] sm:text-[32px] md:text-[44px] lg:text-[52px] xl:text-[60px]"
                >
                  <span className="mb-4 block text-[14px] sm:mb-6 sm:text-[20px] md:mb-8 md:text-[26px] lg:mb-10 lg:text-[30px] xl:text-[34px]">
                    One focused recovery loop: detect, qualify, book, sync.
                  </span>
                  <span className="mb-5 block font-condiment text-[21px] normal-case leading-tight text-neon sm:mb-7 sm:text-[32px] md:text-[44px] lg:text-[52px]">
                    Turn high-intent website behavior into qualified booked demos with HubSpot
                    or CRM-ready context attached.
                  </span>
                  <span className="mb-6 block font-mono text-[11px] normal-case text-cream/70 sm:mb-8 sm:text-[13px] md:text-[14px]">
                    Book a 30-day pilot
                  </span>
                  <span className="flex flex-wrap justify-end gap-4">
                    <a
                      href={BOOK_DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-neon px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background transition hover:brightness-110 sm:px-8 sm:text-[13px]"
                    >
                      Book a 30-day pilot
                    </a>
                    <Link
                      to="/solutions/saas"
                      className="liquid-glass inline-block rounded-full px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:px-8 sm:text-[13px]"
                    >
                      See qualified demo flow
                    </Link>
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* AI voice feedback add-on */}
        <section
          className="border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="voice-feedback-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Voice feedback add-on
            </p>
            <h2
              id="voice-feedback-heading"
              className="font-grotesk max-w-[900px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              When buyers do not book, learn why.
            </h2>
            <p className="font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              AI voice interviews capture lost-demo, buying-objection, churn-risk, and NPS
              follow-up feedback so sales, growth, and customer-success teams can fix the real
              blocker.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {VOICE_FEEDBACK_USE_CASES.map((useCase) => (
                <article key={useCase.title} className="liquid-glass rounded-[22px] p-5 sm:p-6">
                  <h3 className="font-grotesk text-[17px] uppercase leading-tight text-cream sm:text-[19px]">
                    {useCase.title}
                  </h3>
                  <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                    {useCase.body}
                  </p>
                </article>
              ))}
            </div>
            <p className="font-mono mt-8 max-w-3xl border-t border-white/10 pt-5 text-[11px] uppercase leading-relaxed text-cream/45 sm:text-[12px]">
              Voice workflows require confirmed consent, retention, and backend configuration
              before launch.
            </p>
          </div>
        </section>

        <RoiCalculatorCta />

        <SiteFooter anchorId="pricing-footer" />
      </main>
    </>
  )
}
