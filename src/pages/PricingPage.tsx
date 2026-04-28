import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CircleDollarSign, Wrench } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import {
  calculateProductEstimate,
  calculateServiceEstimate,
  pricingTrackFromPath,
  TIER_TABLES,
  TRACKS,
  type PricingTrack,
} from '../data/pricingStrategy'

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const TRUST_PILLS = ['No onboarding charge', 'Cancel anytime', 'Results in 48 hours'] as const

const PRODUCT_VISITOR_OPTIONS = [1000, 5000, 10000, 50000, 100000] as const
const PRODUCT_AOV_OPTIONS = [25, 50, 100, 250, 500] as const
const SERVICE_VISITOR_OPTIONS = [500, 1000, 5000, 10000, 25000] as const
const SERVICE_TICKET_OPTIONS = [150, 500, 1000, 3000, 10000] as const

function trackPricingEvent(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !Array.isArray(window.dataLayer)) return
  window.dataLayer.push({ event, ...payload })
}

function formatCurrency(value: number) {
  return currency.format(Math.round(value))
}

function formatNumber(value: number) {
  return number.format(Math.round(value))
}

function trackFromQuery(search: string): PricingTrack | null {
  const track = new URLSearchParams(search).get('track')
  return track === 'product' || track === 'service' ? track : null
}

function TrackSelector({
  selectedTrack,
  onSelect,
}: {
  selectedTrack: PricingTrack | null
  onSelect: (track: PricingTrack) => void
}) {
  return (
    <div
      className="mx-auto grid max-w-[520px] gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-2 sm:grid-cols-2"
      aria-label="Select pricing track"
    >
      {(['product', 'service'] as const).map((track) => {
        const selected = selectedTrack === track
        return (
          <button
            key={track}
            type="button"
            aria-pressed={selected}
            className={`rounded-full px-5 py-3 font-grotesk text-[12px] uppercase tracking-wide transition sm:text-[13px] ${
              selected
                ? 'bg-neon text-background'
                : 'liquid-glass text-cream hover:bg-white/10'
            }`}
            onClick={() => onSelect(track)}
          >
            {TRACKS[track].selectorLabel}
          </button>
        )
      })}
    </div>
  )
}

function PricingCard({
  track,
  selectedTrack,
  onCtaClick,
}: {
  track: PricingTrack
  selectedTrack: PricingTrack | null
  onCtaClick: (track: PricingTrack) => void
}) {
  const content = TRACKS[track]
  const dimmed = selectedTrack !== null && selectedTrack !== track
  const highlighted = selectedTrack === track

  return (
    <article
      data-testid={`pricing-card-${track}`}
      className={`liquid-glass flex h-full flex-col rounded-[28px] p-6 transition sm:p-8 ${
        highlighted ? 'ring-2 ring-neon/60' : 'ring-1 ring-white/[0.06]'
      } ${dimmed ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
            {content.label}
          </p>
          <h2 className="font-grotesk mt-3 text-[24px] uppercase leading-tight text-cream sm:text-[30px]">
            {track === 'product' ? 'Recovered Revenue' : 'Recovered Bookings'}
          </h2>
          <p className="font-mono mt-3 text-[12px] uppercase leading-relaxed text-cream/60 sm:text-[13px]">
            {content.audience}
          </p>
        </div>
        <CircleDollarSign className="h-8 w-8 shrink-0 text-neon" aria-hidden />
      </div>

      <div className="my-8 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="font-grotesk text-[44px] leading-none text-cream sm:text-[52px]">$500</p>
          <p className="font-mono mt-2 text-[11px] uppercase tracking-wide text-cream/55">
            /month base retainer
          </p>
        </div>
        <p className="font-grotesk text-[28px] text-neon sm:text-[32px]">+</p>
        <div>
          <p className="font-grotesk text-[23px] uppercase leading-tight text-neon sm:text-[26px]">
            {content.kicker}
          </p>
          <p className="font-mono mt-2 text-[11px] uppercase tracking-wide text-cream/55">
            {content.kickerDetail}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="font-grotesk text-[13px] uppercase tracking-wide text-cream">
          What is included
        </p>
        <ul className="mt-4 space-y-3 font-mono text-[12px] uppercase leading-relaxed text-cream/75 sm:text-[13px]">
          <li className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
            {content.included}
          </li>
          {content.features.map((feature) => (
            <li key={feature} className="flex gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-8">
        <a
          href={BOOK_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-full bg-neon px-6 py-3 text-center font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          onClick={() => onCtaClick(track)}
        >
          {content.cta}
        </a>
        <p className="font-mono mt-3 text-center text-[11px] uppercase leading-relaxed text-cream/45">
          30 days free. No credit card required.
        </p>
      </div>
    </article>
  )
}

function SelectControl({
  id,
  label,
  value,
  options,
  prefix = '',
  suffix = '',
  onChange,
}: {
  id: string
  label: string
  value: number
  options: readonly number[]
  prefix?: string
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-grotesk mb-2 block text-[12px] uppercase tracking-wide text-cream/80">
        {label}
      </span>
      <select
        id={id}
        value={value}
        className="w-full rounded-[16px] border border-white/10 bg-background px-4 py-3 font-mono text-[13px] uppercase text-cream outline-none transition focus:border-neon"
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {prefix}
            {number.format(option)}
            {suffix}
          </option>
        ))}
      </select>
    </label>
  )
}

function SliderControl({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-grotesk mb-2 flex items-center justify-between text-[12px] uppercase tracking-wide text-cream/80">
        <span>{label}</span>
        <span className="text-neon">{value}%</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        className="w-full accent-[#b5fc41]"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function RecoveryCalculator({
  activeTrack,
  onTrackChange,
}: {
  activeTrack: PricingTrack
  onTrackChange: (track: PricingTrack) => void
}) {
  const [productVisitors, setProductVisitors] = useState(10000)
  const [averageOrderValue, setAverageOrderValue] = useState(100)
  const [abandonmentRate, setAbandonmentRate] = useState(70)
  const [serviceVisitors, setServiceVisitors] = useState(5000)
  const [averageTicket, setAverageTicket] = useState(500)
  const [bookingRate, setBookingRate] = useState(3)

  const productEstimate = useMemo(
    () =>
      calculateProductEstimate({
        visitors: productVisitors,
        averageOrderValue,
        abandonmentRate,
      }),
    [abandonmentRate, averageOrderValue, productVisitors],
  )

  const serviceEstimate = useMemo(
    () =>
      calculateServiceEstimate({
        visitors: serviceVisitors,
        averageTicket,
        bookingRate,
      }),
    [averageTicket, bookingRate, serviceVisitors],
  )

  const estimateViewedRef = useRef<string | null>(null)

  useEffect(() => {
    const signature =
      activeTrack === 'product'
        ? `${activeTrack}:${productVisitors}:${averageOrderValue}:${abandonmentRate}`
        : `${activeTrack}:${serviceVisitors}:${averageTicket}:${bookingRate}`

    if (estimateViewedRef.current === signature) return
    estimateViewedRef.current = signature
    trackPricingEvent('estimate_viewed', { track: activeTrack })
  }, [
    abandonmentRate,
    activeTrack,
    averageOrderValue,
    averageTicket,
    bookingRate,
    productVisitors,
    serviceVisitors,
  ])

  const setCalculatorTrack = (track: PricingTrack) => {
    onTrackChange(track)
    trackPricingEvent('track_selected', { track, source: 'calculator' })
  }

  const onProductChange = (setter: (value: number) => void, value: number) => {
    setter(value)
    trackPricingEvent('calculator_used', { track: 'product' })
  }

  const onServiceChange = (setter: (value: number) => void, value: number) => {
    setter(value)
    trackPricingEvent('calculator_used', { track: 'service' })
  }

  const activeEstimate = activeTrack === 'product' ? productEstimate : serviceEstimate

  return (
    <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
            Revenue calculator
          </p>
          <h2 className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]">
            What could you recover?
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {(['product', 'service'] as const).map((track) => (
            <button
              key={track}
              type="button"
              aria-pressed={activeTrack === track}
              className={`rounded-full px-5 py-3 font-grotesk text-[11px] uppercase tracking-wide transition sm:text-[12px] ${
                activeTrack === track
                  ? 'bg-neon text-background'
                  : 'liquid-glass text-cream hover:bg-white/10'
              }`}
              onClick={() => setCalculatorTrack(track)}
            >
              {track === 'product' ? 'Product estimate' : 'Service estimate'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-5">
          {activeTrack === 'product' ? (
            <>
              <SelectControl
                id="product-visitors"
                label="Monthly website visitors"
                value={productVisitors}
                options={PRODUCT_VISITOR_OPTIONS}
                onChange={(value) => onProductChange(setProductVisitors, value)}
              />
              <SelectControl
                id="product-aov"
                label="Average order value"
                value={averageOrderValue}
                options={PRODUCT_AOV_OPTIONS}
                prefix="$"
                onChange={(value) => onProductChange(setAverageOrderValue, value)}
              />
              <SliderControl
                id="abandonment-rate"
                label="Cart abandonment rate"
                min={60}
                max={85}
                value={abandonmentRate}
                onChange={(value) => onProductChange(setAbandonmentRate, value)}
              />
            </>
          ) : (
            <>
              <SelectControl
                id="service-visitors"
                label="Monthly website visitors"
                value={serviceVisitors}
                options={SERVICE_VISITOR_OPTIONS}
                onChange={(value) => onServiceChange(setServiceVisitors, value)}
              />
              <SelectControl
                id="average-ticket"
                label="Average service ticket"
                value={averageTicket}
                options={SERVICE_TICKET_OPTIONS}
                prefix="$"
                onChange={(value) => onServiceChange(setAverageTicket, value)}
              />
              <SliderControl
                id="booking-rate"
                label="Current booking rate"
                min={1}
                max={10}
                value={bookingRate}
                onChange={(value) => onServiceChange(setBookingRate, value)}
              />
            </>
          )}
        </div>

        <div className="rounded-[24px] border border-neon/25 bg-neon/[0.04] p-6">
          <dl className="space-y-5">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                {activeTrack === 'product'
                  ? 'Estimated monthly recovered revenue'
                  : 'Revenue recovered'}
              </dt>
              <dd
                className="font-grotesk mt-1 text-[30px] leading-none text-cream sm:text-[38px]"
                data-testid="calculator-recovered-revenue"
              >
                {formatCurrency(activeEstimate.recoveredRevenue)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                {activeTrack === 'product'
                  ? 'Estimated recovery instances'
                  : 'Estimated recovered bookings'}
              </dt>
              <dd className="font-grotesk mt-1 text-[24px] text-neon">
                {activeTrack === 'product'
                  ? formatNumber(productEstimate.recoveries)
                  : formatNumber(serviceEstimate.bookings)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Estimated monthly fee
              </dt>
              <dd className="font-grotesk mt-1 text-[24px] text-cream">
                {formatCurrency(activeEstimate.fee)}
              </dd>
            </div>
            <div className="border-t border-white/10 pt-5">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                You keep
              </dt>
              <dd
                className="font-grotesk mt-1 text-[32px] leading-none text-neon sm:text-[42px]"
                data-testid="calculator-client-keeps"
              >
                {formatCurrency(activeEstimate.clientKeeps)}
              </dd>
            </div>
          </dl>
          <p className="font-mono mt-6 text-[11px] uppercase leading-relaxed text-cream/45">
            Estimates only. Actual results vary.
          </p>
        </div>
      </div>
    </div>
  )
}

function TierTable({
  track,
  onEnterpriseClick,
}: {
  track: PricingTrack
  onEnterpriseClick: () => void
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] liquid-glass">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <caption className="sr-only">{TRACKS[track].label} tier comparison</caption>
        <thead>
          <tr>
            {['Tier', 'Monthly base', 'Included', 'Performance fee', 'Additional recoveries', 'Trigger'].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b border-white/15 px-4 py-4 font-grotesk text-[12px] uppercase tracking-wide text-cream/70 sm:px-5 sm:text-[13px]"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {TIER_TABLES[track].map((row) => {
            const isGrowth = row.tier === 'growth'
            const isEnterprise = row.tier === 'enterprise'
            return (
              <tr key={row.tier} className={isGrowth ? 'bg-neon/[0.04]' : undefined}>
                <th
                  scope="row"
                  className="border-b border-white/10 px-4 py-4 font-grotesk text-[14px] uppercase text-cream sm:px-5"
                >
                  <span>{row.tier}</span>
                  {isGrowth ? (
                    <span className="ml-3 rounded-full bg-[#ffd700] px-2 py-1 font-mono text-[10px] uppercase text-background">
                      Most popular
                    </span>
                  ) : null}
                </th>
                <td className="border-b border-white/10 px-4 py-4 font-mono text-[12px] uppercase text-cream/75 sm:px-5">
                  {row.monthlyBase}
                </td>
                <td className="border-b border-white/10 px-4 py-4 font-mono text-[12px] uppercase text-cream/75 sm:px-5">
                  {row.included}
                </td>
                <td className="border-b border-white/10 px-4 py-4 font-mono text-[12px] uppercase text-cream/75 sm:px-5">
                  {row.kicker}
                </td>
                <td className="border-b border-white/10 px-4 py-4 font-mono text-[12px] uppercase text-cream/75 sm:px-5">
                  {row.additionalRecoveries}
                </td>
                <td className="border-b border-white/10 px-4 py-4 font-mono text-[12px] uppercase text-cream/75 sm:px-5">
                  {isEnterprise ? (
                    <a
                      href={BOOK_DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon underline-offset-4 transition hover:underline"
                      onClick={onEnterpriseClick}
                    >
                      Talk to Sales
                    </a>
                  ) : (
                    row.upgradeTrigger
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function PricingPage() {
  const { pathname, search } = useLocation()
  const routeTrack = pricingTrackFromPath(pathname)
  const queryTrack = trackFromQuery(search)
  const initialTrack = routeTrack || queryTrack
  const [selectedTrack, setSelectedTrack] = useState<PricingTrack | null>(initialTrack)
  const [calculatorTrack, setCalculatorTrack] = useState<PricingTrack>(initialTrack || 'product')
  const calculatorRef = useRef<HTMLElement>(null)
  const enterpriseRef = useRef<HTMLElement>(null)
  const tierRef = useRef<HTMLElement>(null)
  const tierEventSentRef = useRef(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync selected pricing state to route/deep link
    setSelectedTrack(initialTrack)
    if (initialTrack) {
      setCalculatorTrack(initialTrack)
    }
  }, [initialTrack])

  useEffect(() => {
    trackPricingEvent('pricing_page_view', { path: pathname })
  }, [pathname])

  useEffect(() => {
    if (pathname === '/pricing/calculator') {
      calculatorRef.current?.scrollIntoView({ block: 'start' })
    } else if (pathname === '/pricing/enterprise') {
      enterpriseRef.current?.scrollIntoView({ block: 'start' })
    }
  }, [pathname])

  useEffect(() => {
    const target = tierRef.current
    if (!target || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || tierEventSentRef.current) return
        tierEventSentRef.current = true
        trackPricingEvent('tier_comparison_view')
      },
      { threshold: 0.35 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const selectTrack = (track: PricingTrack) => {
    setSelectedTrack(track)
    setCalculatorTrack(track)
    trackPricingEvent('track_selected', { track, source: 'selector' })
  }

  const onCtaClick = (track?: PricingTrack) => {
    trackPricingEvent('cta_click', { track: track || selectedTrack || 'none' })
  }

  const onEnterpriseClick = () => {
    trackPricingEvent('enterprise_click')
  }

  const comparisonTrack = selectedTrack || calculatorTrack

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
        <section
          className="mx-auto max-w-[1831px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
          aria-labelledby="pricing-heading"
        >
          <div className="mx-auto max-w-[980px] text-center">
            <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              SentientWeb / Pay for results
            </p>
            <h1
              id="pricing-heading"
              className="font-grotesk text-[40px] uppercase leading-none text-cream sm:text-[56px] md:text-[72px]"
            >
              Fix first. Then pay. Like a plumber.
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[760px] text-[14px] uppercase leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              $500/month keeps us on call. After that, we only take a piece of the revenue we
              recover for you. No recovered revenue? You barely pay anything.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="liquid-glass rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-cream/75"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <TrackSelector selectedTrack={selectedTrack} onSelect={selectTrack} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <PricingCard track="product" selectedTrack={selectedTrack} onCtaClick={onCtaClick} />
            <PricingCard track="service" selectedTrack={selectedTrack} onCtaClick={onCtaClick} />
          </div>

          <section
            id="calculator"
            ref={calculatorRef}
            className="scroll-mt-28 pt-16 sm:pt-20"
            aria-labelledby="calculator-heading"
          >
            <h2 id="calculator-heading" className="sr-only">
              Revenue recovery calculator
            </h2>
            <RecoveryCalculator activeTrack={calculatorTrack} onTrackChange={setCalculatorTrack} />
          </section>

          <section
            className="pt-16 sm:pt-20"
            aria-labelledby="how-pricing-works-heading"
          >
            <div className="mx-auto max-w-[1200px]">
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                How it works
              </p>
              <h2
                id="how-pricing-works-heading"
                className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
              >
                We charge like digital plumbers
              </h2>
              <ol className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: 'We set up',
                    body: 'Install SentientWeb on your site in minutes. No code changes or engineering lift required.',
                  },
                  {
                    title: 'We fix the leaks',
                    body: 'AI-guided paths recover abandoning visitors, carts, bookings, and high-intent requests in 24-48 hours.',
                  },
                  {
                    title: 'You pay for results',
                    body: '$500 covers the first batch. After that, we take a small piece of what we brought back.',
                  },
                ].map((step, index) => (
                  <li key={step.title} className="liquid-glass rounded-[22px] p-6 sm:p-7">
                    <span
                      className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-neon font-grotesk text-[15px] text-background"
                      aria-hidden
                    >
                      {index + 1}
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
            ref={tierRef}
            className="pt-16 sm:pt-20"
            aria-labelledby="tier-table-heading"
          >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  Tier comparison
                </p>
                <h2
                  id="tier-table-heading"
                  className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
                >
                  {TRACKS[comparisonTrack].label}
                </h2>
              </div>
              <div className="flex gap-2">
                {(['product', 'service'] as const).map((track) => (
                  <button
                    key={track}
                    type="button"
                    className={`rounded-full px-4 py-2 font-grotesk text-[11px] uppercase tracking-wide transition ${
                      comparisonTrack === track
                        ? 'bg-neon text-background'
                        : 'liquid-glass text-cream hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setCalculatorTrack(track)
                      setSelectedTrack(track)
                      trackPricingEvent('track_selected', { track, source: 'tier_table' })
                    }}
                  >
                    {TRACKS[track].label}
                  </button>
                ))}
              </div>
            </div>
            <TierTable track={comparisonTrack} onEnterpriseClick={onEnterpriseClick} />
          </section>

          <section
            className="pt-16 sm:pt-20"
            aria-labelledby="pricing-faq-heading"
          >
            <div className="mx-auto max-w-[980px]">
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                FAQ
              </p>
              <h2
                id="pricing-faq-heading"
                className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
              >
                Common questions
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  {
                    q: 'What counts as a recovery instance?',
                    a: 'Any time SentientWeb reopens a visitor path that was about to leave and brings them back to complete a purchase or booking. We track this with first-party data.',
                  },
                  {
                    q: 'What if we recover less than $500 in revenue?',
                    a: 'Then you only pay the $500 base retainer. We carry the cost of underperforming, which keeps our incentives aligned with yours.',
                  },
                  {
                    q: 'What if we have a slow month?',
                    a: 'Your base retainer stays the same, and the performance fee adjusts to actual recovered revenue. Seasonality does not create penalties.',
                  },
                  {
                    q: 'Can we switch tracks?',
                    a: 'Yes. Product and Service tracks can be changed when your primary revenue source changes.',
                  },
                  {
                    q: 'How does the auto-upgrade work?',
                    a: 'We look at your 3-month average and warn you when you approach 80% of your tier limit. Sustained growth moves you to the tier that keeps service fair.',
                  },
                  {
                    q: 'What is the catch?',
                    a: 'There is not one. We are betting on our own performance. If we do not recover revenue, we do not earn the results fee.',
                  },
                ].map((item) => (
                  <details key={item.q} className="liquid-glass group rounded-[18px] p-5">
                    <summary className="cursor-pointer list-none font-grotesk text-[15px] uppercase tracking-wide text-cream [&::-webkit-details-marker]:hidden">
                      {item.q}
                    </summary>
                    <p className="font-mono mt-3 text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[14px]">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section
            id="enterprise"
            ref={enterpriseRef}
            className="scroll-mt-28 pt-16 sm:pt-20"
            aria-labelledby="enterprise-heading"
          >
            <div className="liquid-glass mx-auto max-w-[980px] rounded-[28px] p-7 text-center sm:p-10">
              <Wrench className="mx-auto mb-5 h-9 w-9 text-neon" aria-hidden />
              <h2
                id="enterprise-heading"
                className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
              >
                Stop letting revenue leak.
              </h2>
              <p className="font-mono mx-auto mt-5 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                30-day free pilot. No credit card. No onboarding charge. Results typically visible
                within 48 hours.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  onClick={() => onCtaClick()}
                >
                  Start Free Pilot
                </a>
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
                  onClick={onEnterpriseClick}
                >
                  Talk to Sales
                </a>
                <Link
                  to="/"
                  className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
