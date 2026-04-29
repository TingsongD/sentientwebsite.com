import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { TrustStrip } from '../components/TrustStrip'
import { BOOK_DEMO_URL } from '../constants'
import { FEATURES, featureSectionId } from '../data/homeFeatures'
import { SOLUTION_NAV_LIST, type SolutionSlug } from '../data/solutionPagesContent'

const ABOUT_VIDEO =
  'https://cdn.shopify.com/videos/c/o/v/521a58b4518548b7ba7e3c5ac8c76075.mp4'
const CTA_VIDEO =
  'https://cdn.shopify.com/videos/c/o/v/9c76561bb05d4ed9941cb20637732cc0.mp4'

const INTEGRATION_LOGOS = [
  { name: 'HubSpot', logoUrl: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg' },
  { name: 'OpenAI', logoUrl: 'https://cdn.worldvectorlogo.com/logos/openai.svg' },
  { name: 'Gemini', logoUrl: 'https://cdn.worldvectorlogo.com/logos/gemini-6.svg' },
  { name: 'Claude', logoUrl: 'https://cdn.worldvectorlogo.com/logos/claude-logo.svg' },
  { name: 'Shopify', logoUrl: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' },
  { name: 'Webflow', logoUrl: 'https://cdn.worldvectorlogo.com/logos/webflow-logo-1.svg' },
  { name: 'WordPress', logoUrl: 'https://cdn.worldvectorlogo.com/logos/wordpress-2.svg' },
  { name: 'Wix', logoUrl: 'https://cdn.worldvectorlogo.com/logos/wix.svg' },
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
      'Uses US SaaS revenue benchmarks and a conservative modeled share of inbound demo pipeline lost to slow routing, weak follow-up, and delayed handoff.',
  },
  'home-services': {
    usAnnualLeakUsd: 24_000_000_000,
    typicalAnnualLeakUsd: 144_000,
    sourceLabel: 'Modeled from US home-services market size and missed-call economics.',
    methodology:
      'Uses US home-services market estimates with a conservative missed-call and after-hours booking leakage model for HVAC, plumbing, and electrical demand.',
  },
  insurance: {
    usAnnualLeakUsd: 18_000_000_000,
    typicalAnnualLeakUsd: 120_000,
    sourceLabel: 'Modeled from insurance lead response benchmarks.',
    methodology:
      'Uses insurance speed-to-lead and uncontacted-lead benchmarks, then applies a conservative lost-premium and broker-fee recovery model.',
  },
  ecommerce: {
    usAnnualLeakUsd: 260_000_000_000,
    typicalAnnualLeakUsd: 240_000,
    sourceLabel: 'Baymard cart and checkout abandonment recovery estimates.',
    methodology:
      'Uses Baymard research on recoverable cart and checkout revenue, applied as the ecommerce benchmark for abandoned buying sessions.',
  },
  healthcare: {
    usAnnualLeakUsd: 150_000_000_000,
    typicalAnnualLeakUsd: 200_000,
    sourceLabel: 'US healthcare no-show cost estimates.',
    methodology:
      'Uses published US healthcare no-show cost estimates and treats missed appointments, delayed reminders, and incomplete intake as the leak category.',
  },
  edtech: {
    usAnnualLeakUsd: 12_000_000_000,
    typicalAnnualLeakUsd: 90_000,
    sourceLabel: 'Modeled from admissions and EdTech speed-to-lead benchmarks.',
    methodology:
      'Uses admissions response-time research and conservative program-value assumptions for inquiries that go cold before enrollment.',
  },
  hospitality: {
    usAnnualLeakUsd: 10_000_000_000,
    typicalAnnualLeakUsd: 175_000,
    sourceLabel: 'Hotel booking abandonment and lost direct-booking estimates.',
    methodology:
      'Uses hospitality booking-abandonment research and published lost direct-booking estimates as the US-wide leakage baseline.',
  },
  'real-estate': {
    usAnnualLeakUsd: 22_000_000_000,
    typicalAnnualLeakUsd: 235_000,
    sourceLabel: 'Modeled from real-estate speed-to-lead conversion gaps.',
    methodology:
      'Uses real-estate lead-response benchmarks and a conservative commission gap model for internet leads that go cold before contact.',
  },
  legal: {
    usAnnualLeakUsd: 109_000_000_000,
    typicalAnnualLeakUsd: 332_000,
    sourceLabel: 'Clio/legal intake research plus vendor-cited missed-call estimates.',
    methodology:
      'Uses legal intake responsiveness research, missed-call benchmarks, and vendor-cited industry leakage estimates; values should be read as directional.',
  },
  'financial-services': {
    usAnnualLeakUsd: 16_000_000_000,
    typicalAnnualLeakUsd: 150_000,
    sourceLabel: 'Modeled from financial-services lead response and application leakage.',
    methodology:
      'Uses financial-services response-time benchmarks and conservative assumptions for rate shoppers, application starts, and advisory inquiries that go stale.',
  },
} as const satisfies Record<SolutionSlug, LeakClockEstimate>

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

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
  src,
  className,
  videoClassName = 'h-full w-full object-cover',
  poster,
  reducedMotion,
}: {
  src: string
  className: string
  videoClassName?: string
  poster?: string
  reducedMotion: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [clientReady, setClientReady] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const [hasError, setHasError] = useState(false)
  const shouldRenderVideo = clientReady && !reducedMotion && !hasError

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
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          className={`${videoClassName} relative z-10 transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
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
      className="flex min-w-[176px] items-center gap-3 rounded-[18px] border border-white/10 bg-cream px-5 py-4 shadow-sm sm:min-w-[204px]"
      aria-hidden={hidden || undefined}
    >
      <img
        src={logoUrl}
        alt={hidden ? '' : `${name} logo`}
        className="h-9 max-w-[92px] shrink-0 object-contain"
        loading="eager"
        decoding="async"
      />
      <span className="font-grotesk text-[13px] uppercase tracking-wide text-background sm:text-[14px]">
        {name}
      </span>
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
          Industry-wide revenue leakage in the US
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
        Typical operator: <span className="text-[#FF8A8A]">{typicalRate}/{unit}</span>
      </span>
    </span>
  )
}

function LeakClockMethodology() {
  return (
    <details className="liquid-glass mt-8 rounded-[20px] p-5 sm:p-6">
      <summary className="cursor-pointer list-none font-grotesk text-[15px] uppercase tracking-wide text-cream [&::-webkit-details-marker]:hidden">
        How these leak rates are estimated
      </summary>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {SOLUTION_NAV_LIST.map(({ slug, navLabel }) => {
          const estimate = LEAK_CLOCK_ESTIMATES[slug]
          return (
            <article key={slug} className="border-t border-white/10 pt-4">
              <h3 className="font-grotesk text-[13px] uppercase tracking-wide text-neon">
                {navLabel}
              </h3>
              <p className="font-mono mt-2 text-[11px] uppercase leading-relaxed text-cream/55">
                {estimate.sourceLabel}
              </p>
              <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/70">
                {estimate.methodology}
              </p>
            </article>
          )
        })}
      </div>
      <p className="font-mono mt-5 border-t border-white/10 pt-4 text-[11px] uppercase leading-relaxed text-cream/45">
        These are directional estimates for comparison, not audited financial claims.
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
                  SentientWeb revenue recovery
                </p>
                <p className="font-mono mb-6 max-w-xl text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                  24/7 auto revenue recovery. One click starts chasing past lost leads.
                </p>
                <h1
                  id="hero-heading"
                  className="font-grotesk uppercase leading-[1.05] text-cream sm:leading-none text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]"
                >
                  We are digital plumbers for your revenue leaks.
                </h1>
                <p className="font-condiment pointer-events-none absolute -right-1 top-[42%] z-10 -translate-y-1/2 -rotate-1 text-[22px] text-neon opacity-90 mix-blend-exclusion sm:text-[28px] md:top-[48%] md:text-[36px] lg:right-[-8%] lg:text-[44px] normal-case">
                  Leak sealed
                </p>
                <p className="font-mono mt-8 max-w-[540px] text-[14px] uppercase leading-relaxed text-cream sm:text-[15px] md:text-[16px]">
                  AI-guided next steps that capture revenue opportunities, deliver instant
                  response paths, and hand off to humans when it matters.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={BOOK_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
                  >
                    Start recovery
                  </a>
                  <a
                    href={BOOK_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  >
                    Get instant access
                  </a>
                </div>
                <TrustStrip className="mt-8 max-w-[880px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 / product intro */}
        <section
          className="relative min-h-screen overflow-hidden bg-background"
          aria-labelledby="phase-heading"
        >
          <AmbientVideo
            className="absolute inset-0 h-full w-full overflow-hidden"
            src={ABOUT_VIDEO}
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
                    <span className="blackhole-drift-word blackhole-drift-word--revenue block shrink-0">
                      Revenue
                    </span>
                    <span
                      className="font-condiment pointer-events-none -translate-y-0.5 -rotate-1 text-[26px] text-neon mix-blend-exclusion sm:text-[34px] md:text-[42px] lg:text-[50px] normal-case sm:-translate-y-1"
                      aria-hidden
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
              Solutions
            </h2>
            <p className="font-mono mb-10 max-w-2xl text-[14px] uppercase leading-relaxed text-cream/70">
              Ten vertical playbooks for the highest-value revenue leaks: demo requests,
              emergency estimates, quotes, carts, bookings, applications, showings, intake,
              and rate response.
            </p>
            <p className="font-condiment mb-10 max-w-3xl text-[22px] normal-case leading-tight text-neon sm:text-[28px] md:text-[34px]">
              Stalled demand becomes instant next steps, detects intent, opens the right path,
              and hands off to humans with full context.
            </p>
            <div className="grid gap-5 md:grid-cols-2 lg:gap-7">
              {SOLUTION_NAV_LIST.map(({ slug, navLabel, marketLabel }) => (
                <Link
                  key={slug}
                  to={`/solutions/${slug}`}
                  className="group block min-h-[176px] rounded-[20px] border border-cream/25 bg-black p-5 text-cream shadow-[0_18px_60px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 hover:border-[#FF8A8A]/70 hover:shadow-[0_24px_80px_rgba(255,138,138,0.14)] sm:p-6 lg:min-h-[154px]"
                >
                  <SolutionLeakClock
                    navLabel={navLabel}
                    marketLabel={marketLabel}
                    estimate={LEAK_CLOCK_ESTIMATES[slug]}
                    unit={activeLeakClockUnit}
                    reducedMotion={prefersReducedMotion}
                  />
                </Link>
              ))}
            </div>
            <LeakClockMethodology />
          </div>
        </section>

        <IntegrationLogoStrip />

        {/* CTA video + closing */}
        <section className="relative w-full bg-background" aria-labelledby="cta-heading">
          <AmbientVideo
            className="relative block aspect-video w-full overflow-hidden"
            src={CTA_VIDEO}
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
                    Runs up to 20 revenue recovery channels 24/7.
                  </span>
                  <span className="mb-5 block font-condiment text-[21px] normal-case leading-tight text-neon sm:mb-7 sm:text-[32px] md:text-[44px] lg:text-[52px]">
                    our P&amp;L should not be holding its breath. Let&apos;s bring it back above water.
                  </span>
                  <span className="mb-6 block font-mono text-[11px] normal-case text-cream/70 sm:mb-8 sm:text-[13px] md:text-[14px]">
                    Get instant access / start recovery
                  </span>
                  <span className="flex flex-wrap justify-end gap-4">
                    <a
                      href={BOOK_DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full bg-neon px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background transition hover:brightness-110 sm:px-8 sm:text-[13px]"
                    >
                      Get instant access
                    </a>
                    <a
                      href={BOOK_DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="liquid-glass inline-block rounded-full px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:px-8 sm:text-[13px]"
                    >
                      Start recovery
                    </a>
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-28 bg-background py-16 sm:py-20 md:py-24 lg:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="font-mono mb-10 max-w-2xl text-[14px] uppercase leading-relaxed text-cream/70">
              Patch leaks today. Let SentientWeb chase back past lost revenue from the leads your
              funnel already let slip.
            </p>
            <h2
              id="features-heading"
              className="font-grotesk mb-10 text-[32px] uppercase leading-none text-cream sm:mb-12 sm:text-[42px] md:text-[52px] lg:mb-16 lg:text-[60px]"
            >
              Revenue recovery system
            </h2>

            <div
              className="liquid-glass mb-12 rounded-[24px] p-6 font-mono text-[12px] uppercase leading-relaxed text-cream sm:p-8 sm:text-[13px] lg:mb-16"
              role="region"
              aria-label="Example revenue recovery event"
            >
              <p className="text-neon">Leak signal: high intent</p>
              <p className="mt-2 text-neon">Intent: high</p>
              <p className="mt-4 text-cream/70">
                &gt; Visitor hesitated on pricing...
              </p>
              <p className="text-cream/70">
                &gt; Approved-source next step delivered
              </p>
              <p className="text-cream/70">
                &gt; Human support path prepared
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  id={featureSectionId(f.title)}
                  className="liquid-glass scroll-mt-28 rounded-[32px] p-6 transition hover:bg-white/10 sm:p-8"
                >
                  <h3 className="font-grotesk mb-4 text-[20px] uppercase leading-tight text-cream sm:text-[22px]">
                    {f.title}
                  </h3>
                  <ul className="list-inside list-disc space-y-2 font-mono text-[13px] uppercase leading-relaxed text-cream/75 sm:text-[14px]">
                    {f.bullets.map((b) => (
                      <li key={b} className="marker:text-neon">
                        {b}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RoiCalculatorCta />

        <SiteFooter anchorId="pricing-footer" />
      </main>
    </>
  )
}
