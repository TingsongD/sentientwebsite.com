import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CircleDollarSign, Wrench } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import {
  calculateDemoRecoveryEstimate,
  pricingPlanFromPath,
  PRICING_PLAN_ORDER,
  QUALIFIED_BOOKED_DEMO_DEFINITION,
  TIER_TABLES,
  TRACKS,
  type PricingPlan,
} from '../data/pricingStrategy'
import { hasOptionalAnalyticsConsent } from '../privacyPreferences'

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

const TRUST_PILLS = [
  '30-day pilot',
  'Qualified booked demos',
  'HubSpot proof',
  'Case-study discount',
] as const

const HIGH_INTENT_VISITOR_OPTIONS = [250, 500, 1000, 2500, 5000, 10000] as const
const ACV_OPTIONS = [6000, 12000, 18000, 30000, 60000] as const

function trackPricingEvent(event: string, payload: Record<string, unknown> = {}) {
  if (
    typeof window === 'undefined' ||
    !Array.isArray(window.dataLayer) ||
    !hasOptionalAnalyticsConsent()
  ) {
    return
  }
  window.dataLayer.push({ event, ...payload })
}

function formatCurrency(value: number) {
  return currency.format(Math.round(value))
}

function formatNumber(value: number) {
  return number.format(Math.round(value))
}

function planFromQuery(search: string): PricingPlan | null {
  const plan = new URLSearchParams(search).get('plan')
  return PRICING_PLAN_ORDER.includes(plan as PricingPlan) ? (plan as PricingPlan) : null
}

function PlanSelector({
  selectedPlan,
  onSelect,
}: {
  selectedPlan: PricingPlan | null
  onSelect: (plan: PricingPlan) => void
}) {
  return (
    <div
      className="mx-auto grid max-w-[760px] gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-2 sm:grid-cols-4"
      aria-label="Select pricing plan"
    >
      {PRICING_PLAN_ORDER.map((plan) => {
        const selected = selectedPlan === plan
        return (
          <button
            key={plan}
            type="button"
            aria-pressed={selected}
            className={`rounded-full px-5 py-3 font-grotesk text-[12px] uppercase tracking-wide transition sm:text-[13px] ${
              selected ? 'bg-neon text-background' : 'liquid-glass text-cream hover:bg-white/10'
            }`}
            onClick={() => onSelect(plan)}
          >
            {TRACKS[plan].selectorLabel}
          </button>
        )
      })}
    </div>
  )
}

function PricingCard({
  plan,
  selectedPlan,
  onCtaClick,
}: {
  plan: PricingPlan
  selectedPlan: PricingPlan | null
  onCtaClick: (plan: PricingPlan) => void
}) {
  const content = TRACKS[plan]
  const dimmed = selectedPlan !== null && selectedPlan !== plan
  const highlighted = selectedPlan === plan || (selectedPlan === null && plan === 'growth')

  return (
    <article
      data-testid={`pricing-card-${plan}`}
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
            {content.price}
          </h2>
          <p className="font-mono mt-3 text-[12px] uppercase leading-relaxed text-cream/60 sm:text-[13px]">
            {content.priceDetail}
          </p>
        </div>
        <CircleDollarSign className="h-8 w-8 shrink-0 text-neon" aria-hidden />
      </div>

      <p className="font-mono mt-6 text-[12px] normal-case leading-relaxed text-cream/72 sm:text-[13px]">
        {content.audience}
      </p>

      <div className="my-8 rounded-[20px] border border-neon/20 bg-neon/[0.04] p-5">
        <p className="font-grotesk text-[15px] uppercase tracking-wide text-cream">
          {content.included}
        </p>
        <p className="font-mono mt-2 text-[12px] uppercase leading-relaxed text-neon">
          {content.kicker}
        </p>
      </div>

      <div className="border-t border-white/10 pt-6">
        <p className="font-grotesk text-[13px] uppercase tracking-wide text-cream">
          What is included
        </p>
        <ul className="mt-4 space-y-3 font-mono text-[12px] uppercase leading-relaxed text-cream/75 sm:text-[13px]">
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
          onClick={() => onCtaClick(plan)}
        >
          {content.cta}
        </a>
        <p className="font-mono mt-3 text-center text-[11px] uppercase leading-relaxed text-cream/45">
          Final pilot rules are confirmed before launch. Public proof rights are optional.
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
  step = 1,
  suffix = '%',
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-grotesk mb-2 flex items-center justify-between text-[12px] uppercase tracking-wide text-cream/80">
        <span>{label}</span>
        <span className="text-neon">
          {value}
          {suffix}
        </span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="w-full accent-[#b5fc41]"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function DemoRecoveryCalculator() {
  const [highIntentVisitors, setHighIntentVisitors] = useState(1000)
  const [currentDemoConversionRate, setCurrentDemoConversionRate] = useState(2)
  const [recoveredDemoLiftRate, setRecoveredDemoLiftRate] = useState(1)
  const [averageContractValue, setAverageContractValue] = useState(12000)
  const [demoToOpportunityRate, setDemoToOpportunityRate] = useState(30)
  const estimateViewedRef = useRef<string | null>(null)

  const estimate = useMemo(
    () =>
      calculateDemoRecoveryEstimate({
        highIntentVisitors,
        currentDemoConversionRate,
        recoveredDemoLiftRate,
        averageContractValue,
        demoToOpportunityRate,
      }),
    [
      averageContractValue,
      currentDemoConversionRate,
      demoToOpportunityRate,
      highIntentVisitors,
      recoveredDemoLiftRate,
    ],
  )

  useEffect(() => {
    const signature = [
      highIntentVisitors,
      currentDemoConversionRate,
      recoveredDemoLiftRate,
      averageContractValue,
      demoToOpportunityRate,
    ].join(':')

    if (estimateViewedRef.current === signature) return
    estimateViewedRef.current = signature
    trackPricingEvent('estimate_viewed', { model: 'demo_recovery' })
  }, [
    averageContractValue,
    currentDemoConversionRate,
    demoToOpportunityRate,
    highIntentVisitors,
    recoveredDemoLiftRate,
  ])

  const onCalculatorChange = (setter: (value: number) => void, value: number) => {
    setter(value)
    trackPricingEvent('calculator_used', { model: 'demo_recovery' })
  }

  return (
    <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
            Demo recovery calculator
          </p>
          <h2 className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]">
            Estimate recovered demos.
          </h2>
          <p className="font-mono mt-4 max-w-xl text-[12px] uppercase leading-relaxed text-cream/55 sm:text-[13px]">
            Modeled estimate only. This does not promise revenue or guarantee pipeline.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-5">
          <SelectControl
            id="high-intent-visitors"
            label="Monthly high-intent page visitors"
            value={highIntentVisitors}
            options={HIGH_INTENT_VISITOR_OPTIONS}
            onChange={(value) => onCalculatorChange(setHighIntentVisitors, value)}
          />
          <SliderControl
            id="current-demo-conversion-rate"
            label="Current demo conversion rate"
            min={1}
            max={10}
            value={currentDemoConversionRate}
            onChange={(value) => onCalculatorChange(setCurrentDemoConversionRate, value)}
          />
          <SliderControl
            id="recovered-demo-lift-rate"
            label="Recovered demo lift"
            min={1}
            max={5}
            value={recoveredDemoLiftRate}
            onChange={(value) => onCalculatorChange(setRecoveredDemoLiftRate, value)}
          />
          <SelectControl
            id="average-contract-value"
            label="Average contract value"
            value={averageContractValue}
            options={ACV_OPTIONS}
            prefix="$"
            onChange={(value) => onCalculatorChange(setAverageContractValue, value)}
          />
          <SliderControl
            id="demo-to-opportunity-rate"
            label="Demo-to-opportunity rate"
            min={10}
            max={60}
            step={5}
            value={demoToOpportunityRate}
            onChange={(value) => onCalculatorChange(setDemoToOpportunityRate, value)}
          />
        </div>

        <div className="rounded-[24px] border border-neon/25 bg-neon/[0.04] p-6">
          <dl className="space-y-5">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Current demos from high-intent pages
              </dt>
              <dd className="font-grotesk mt-1 text-[24px] text-cream">
                {formatNumber(estimate.currentDemos)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Estimated recovered demos
              </dt>
              <dd
                className="font-grotesk mt-1 text-[30px] leading-none text-neon sm:text-[38px]"
                data-testid="calculator-recovered-demos"
              >
                {formatNumber(estimate.recoveredDemos)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Estimated qualified booked demos
              </dt>
              <dd className="font-grotesk mt-1 text-[24px] text-cream">
                {formatNumber(estimate.qualifiedBookedDemos)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Estimated pipeline influenced
              </dt>
              <dd
                className="font-grotesk mt-1 text-[32px] leading-none text-neon sm:text-[42px]"
                data-testid="calculator-pipeline-influenced"
              >
                {formatCurrency(estimate.pipelineInfluenced)}
              </dd>
            </div>
            <div className="border-t border-white/10 pt-5">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-cream/50">
                Estimated SentientWeb fee
              </dt>
              <dd
                className="font-grotesk mt-1 text-[24px] text-cream"
                data-testid="calculator-fee"
              >
                {formatCurrency(estimate.estimatedFee)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

function TierTable({ onEnterpriseClick }: { onEnterpriseClick: () => void }) {
  return (
    <div className="liquid-glass overflow-x-auto rounded-[24px]">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <caption className="sr-only">Demo recovery tier comparison</caption>
        <thead>
          <tr>
            {[
              'Tier',
              'Monthly base',
              'Included',
              'Qualified demo fee',
              'Additional volume',
              'Trigger',
            ].map((heading) => (
              <th
                key={heading}
                scope="col"
                className="border-b border-white/15 px-4 py-4 font-grotesk text-[12px] uppercase tracking-wide text-cream/70 sm:px-5 sm:text-[13px]"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIER_TABLES.map((row) => {
            const isGrowth = row.tier === 'growth'
            const isScale = row.tier === 'scale'
            return (
              <tr key={row.tier} className={isGrowth ? 'bg-neon/[0.04]' : undefined}>
                <th
                  scope="row"
                  className="border-b border-white/10 px-4 py-4 font-grotesk text-[14px] uppercase text-cream sm:px-5"
                >
                  <span>{row.tier}</span>
                  {isGrowth ? (
                    <span className="ml-3 rounded-full bg-[#ffd700] px-2 py-1 font-mono text-[10px] uppercase text-background">
                      Most common
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
                  {isScale ? (
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
  const routePlan = pricingPlanFromPath(pathname)
  const queryPlan = planFromQuery(search)
  const initialPlan = routePlan || queryPlan
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(initialPlan)
  const calculatorRef = useRef<HTMLElement>(null)
  const enterpriseRef = useRef<HTMLElement>(null)
  const tierRef = useRef<HTMLElement>(null)
  const tierEventSentRef = useRef(false)

  useEffect(() => {
    setSelectedPlan(initialPlan)
  }, [initialPlan])

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

  const selectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    trackPricingEvent('plan_selected', { plan, source: 'selector' })
  }

  const onCtaClick = (plan?: PricingPlan) => {
    trackPricingEvent('cta_click', { plan: plan || selectedPlan || 'none' })
  }

  const onEnterpriseClick = () => {
    trackPricingEvent('enterprise_click')
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
        <section
          className="mx-auto max-w-[1831px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
          aria-labelledby="pricing-heading"
        >
          <div className="mx-auto max-w-[980px] text-center">
            <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              SentientWeb / Qualified booked demos
            </p>
            <h1
              id="pricing-heading"
              className="font-grotesk text-[40px] uppercase leading-none text-cream sm:text-[56px] md:text-[72px]"
            >
              Pricing built around qualified booked demos.
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[760px] text-[14px] uppercase leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              Start with a 30-day pilot. Measure the work by qualified booked demos and
              CRM-visible context your sales team accepts.
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
            <PlanSelector selectedPlan={selectedPlan} onSelect={selectPlan} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {PRICING_PLAN_ORDER.map((plan) => (
              <PricingCard
                key={plan}
                plan={plan}
                selectedPlan={selectedPlan}
                onCtaClick={onCtaClick}
              />
            ))}
          </div>

          <section className="pt-10 sm:pt-12" aria-labelledby="qualified-demo-heading">
            <div className="liquid-glass mx-auto max-w-[980px] rounded-[24px] p-6 sm:p-8">
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                Qualified booked demo
              </p>
              <h2
                id="qualified-demo-heading"
                className="font-grotesk text-[24px] uppercase leading-tight text-cream sm:text-[30px]"
              >
                Define the result before the pilot starts.
              </h2>
              <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/75 sm:text-[14px]">
                {QUALIFIED_BOOKED_DEMO_DEFINITION}
              </p>
              <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/55 sm:text-[13px]">
                Your team approves the ICP, stack-fit rules, disqualification reasons, and what
                counts as sales-accepted before any recovered meeting is billable.
              </p>
            </div>
          </section>

          <section
            id="calculator"
            ref={calculatorRef}
            className="scroll-mt-28 pt-16 sm:pt-20"
            aria-labelledby="calculator-heading"
          >
            <h2 id="calculator-heading" className="sr-only">
              Demo recovery calculator
            </h2>
            <DemoRecoveryCalculator />
          </section>

          <section className="pt-16 sm:pt-20" aria-labelledby="how-pricing-works-heading">
            <div className="mx-auto max-w-[1200px]">
              <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                How it works
              </p>
              <h2
                id="how-pricing-works-heading"
                className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
              >
                Detect, qualify, book, and prove it where sales works.
              </h2>
              <ol className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: 'We set the pilot rules',
                    body: 'Agree on ICP, high-intent pages, qualification questions, scheduler path, CRM fields, and proof criteria.',
                  },
                  {
                    title: 'We recover demo intent',
                    body: 'SentientWeb detects demo-ready behavior, handles the page-specific hesitation, and opens the booking path after qualification.',
                  },
                  {
                    title: 'You measure booked demos',
                    body: 'Reporting centers on demo-ready visitors, qualified visitors, booked demos, sales acceptance, and CRM-visible context.',
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
                  Demo recovery pricing
                </h2>
              </div>
            </div>
            <TierTable onEnterpriseClick={onEnterpriseClick} />
          </section>

          <section className="pt-16 sm:pt-20" aria-labelledby="pricing-faq-heading">
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
                    q: 'What counts as a qualified booked demo?',
                    a: QUALIFIED_BOOKED_DEMO_DEFINITION,
                  },
                  {
                    q: 'Do you charge for message volume?',
                    a: 'No. The pilot should be measured around qualified booked demos and CRM-visible context, not message count.',
                  },
                  {
                    q: 'What happens if traffic is too low?',
                    a: 'We will say so during setup. If pricing, demo, comparison, security, or integration pages do not have enough intent yet, the right next step may be fixing traffic, offer clarity, or sales infrastructure before buying SentientWeb.',
                  },
                  {
                    q: 'Do we need HubSpot?',
                    a: 'No. HubSpot is the fastest launch path, and HubSpot Free, Starter, Professional, and Enterprise can work after a field check. Salesforce, Pipedrive, API, webhook, and lightweight handoff requirements are reviewed before the pilot starts. If context cannot reach the system sales uses, we should not launch.',
                  },
                  {
                    q: 'Can this work with Calendly or routing tools?',
                    a: 'Yes. Calendly is the simplest booking path, and Chili Piper or another router can be the route when your sales motion needs territory, account ownership, or meeting-type logic. Setup defines the routing rule before SentientWeb opens the scheduler.',
                  },
                  {
                    q: 'Does this replace Chili Piper, Drift, or Qualified?',
                    a: 'It replaces generic pricing-page popups, static demo forms, and manual chasing of buyers who already showed demo intent. It usually orchestrates routing tools such as Chili Piper and can coexist with broader platforms such as Drift or Qualified until you decide what to sunset.',
                  },
                  {
                    q: 'Are case-study rights required?',
                    a: 'No. Public proof rights are optional. Some customers may trade public proof rights for a discount, but the pilot can be evaluated without publishing your brand or conversion data.',
                  },
                  {
                    q: 'How do you prove incrementality?',
                    a: 'The pilot proof packet includes baseline pages, detected intent, qualification answers, booked demos, sales acceptance, CRM records, and the pipeline assumptions used. If you need a holdout or page-by-page test, define it before launch.',
                  },
                  {
                    q: 'How are AI answer quality and security handled?',
                    a: 'Answers are grounded in approved source content. Security, legal, pricing, and high-risk questions can be routed to a human, and the Trust page explains provider and compliance posture before procurement review.',
                  },
                  {
                    q: 'What does the annual tier include?',
                    a: 'Annual is not the starting offer. After the pilot proves economics, annual pricing locks either Starter or Growth volume for the year, applies any agreed pilot credit, and can include an optional public-proof-rights discount if your team wants that trade.',
                  },
                  {
                    q: 'What if procurement needs SOC 2 or a BAA?',
                    a: 'SentientWeb is not currently SOC 2 certified and BAA support must be reviewed before any healthcare deployment involving PHI. Regulated pilots can be scoped around public pages, approved non-sensitive content, human handoff, and a security review gate until the required documents are in place.',
                  },
                  {
                    q: 'Do you identify anonymous people?',
                    a: 'The v1 promise is behavior-based demo intent and self-identified qualification. Person-level identification is not the lead claim.',
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
                Start with one measurable recovery loop.
              </h2>
              <p className="font-mono mx-auto mt-5 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                The 30-day pilot proves whether SentientWeb can turn existing high-intent website
                traffic into qualified booked demos with sales-accepted CRM context attached.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  onClick={() => onCtaClick()}
                >
                  Book a 30-day pilot
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
        <RoiCalculatorCta />
      </main>
      <SiteFooter />
    </>
  )
}
