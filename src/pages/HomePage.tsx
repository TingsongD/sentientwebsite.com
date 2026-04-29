import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { TrustStrip } from '../components/TrustStrip'
import { BOOK_DEMO_URL } from '../constants'
import { FEATURES, featureSectionId } from '../data/homeFeatures'
import { SOLUTION_NAV_LIST } from '../data/solutionPagesContent'

const ABOUT_VIDEO =
  'https://cdn.shopify.com/videos/c/o/v/521a58b4518548b7ba7e3c5ac8c76075.mp4'
const CTA_VIDEO =
  'https://cdn.shopify.com/videos/c/o/v/9c76561bb05d4ed9941cb20637732cc0.mp4'

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

export default function HomePage() {
  const { pathname, hash } = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()

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
                  Instant access paths for the revenue moments your website leaks today
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SOLUTION_NAV_LIST.map(({ slug, navLabel, marketLabel }) => (
                <Link
                  key={slug}
                  to={`/solutions/${slug}`}
                  className="liquid-glass rounded-[20px] p-5 transition hover:bg-white/10"
                >
                  <span className="font-grotesk block text-[14px] uppercase tracking-wide text-cream">
                    {navLabel}
                  </span>
                  <span className="font-mono mt-2 block text-[11px] uppercase leading-relaxed text-cream/55">
                    {marketLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA video + closing */}
        <section className="relative w-full bg-background" aria-labelledby="cta-heading">
          <AmbientVideo
            className="relative block aspect-video w-full overflow-hidden"
            src={CTA_VIDEO}
            reducedMotion={prefersReducedMotion}
          />

          <div className="pointer-events-none absolute inset-0">
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
                  <span className="mb-4 block sm:mb-6 md:mb-8 lg:mb-10">
                    Ten leak repair paths.
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

        <SiteFooter anchorId="pricing-footer" />
      </main>
    </>
  )
}
