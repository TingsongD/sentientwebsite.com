import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CircleDollarSign, Wrench } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import {
  pricingPlanFromPath,
  PRICING_PLAN_ORDER,
  QUALIFIED_BOOKED_DEMO_DEFINITION,
  TIER_TABLES,
  TRACKS,
  type PricingPlan,
} from '../data/pricingStrategy'
import {
  calculateRecoveryRoi,
  DEFAULT_RECOVERY_ROI_INPUTS,
  DEFAULT_RECOVERY_USE_CASE_KEY,
  getRecoveryUseCaseConfig,
  RECOVERY_USE_CASES,
  type RecoveryRoiCalculatorInputs,
  type RecoveryUseCaseKey,
} from '../data/revenueLeakCalculator'
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

const decimal = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const TRUST_PILLS = [
  '30-day pilot',
  'Qualified recovered actions',
  'Stack-visible proof',
  'Outcome-based pricing',
] as const

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

function formatDecimal(value: number) {
  return decimal.format(value)
}

function formatPercent(value: number) {
  return `${formatNumber(value)}%`
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
          Final pilot rules are confirmed before launch. Published proof rights are optional.
        </p>
      </div>
    </article>
  )
}

function NumberControl({
  id,
  label,
  value,
  min = 0,
  step = 1,
  prefix,
  suffix,
  onChange,
}: {
  id: string
  label: string
  value: number
  min?: number
  step?: number
  prefix?: string
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-grotesk mb-2 block text-[12px] uppercase tracking-wide text-cream/80">
        {label}
      </span>
      <span className="relative block">
        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[13px] text-cream/45">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          min={min}
          step={step}
          value={value}
          className={`min-h-12 w-full rounded-[16px] border border-white/10 bg-background py-3 font-mono text-[13px] uppercase text-cream outline-none transition focus:border-neon ${
            prefix ? 'pl-8' : 'pl-4'
          } ${suffix ? 'pr-20' : 'pr-4'} text-right`}
          onChange={(event) => onChange(Number(event.target.value) || 0)}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] uppercase text-cream/45">
            {suffix}
          </span>
        ) : null}
      </span>
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
  displayValue = `${formatDecimal(value)}%`,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  displayValue?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-grotesk mb-2 flex items-center justify-between gap-3 text-[12px] uppercase tracking-wide text-cream/80">
        <span>{label}</span>
        <span className="shrink-0 text-neon">{displayValue}</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={displayValue}
        className="w-full accent-[#b5fc41]"
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}

function ResultStat({
  label,
  value,
  tone = 'cream',
  testId,
}: {
  label: string
  value: string
  tone?: 'cream' | 'neon'
  testId?: string
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-cream/45">{label}</dt>
      <dd
        className={`font-grotesk mt-2 text-[26px] uppercase leading-none sm:text-[34px] ${
          tone === 'neon' ? 'text-neon' : 'text-cream'
        }`}
        data-testid={testId}
      >
        {value}
      </dd>
    </div>
  )
}

function DemoRecoveryCalculator() {
  const [selectedUseCaseKey, setSelectedUseCaseKey] =
    useState<RecoveryUseCaseKey>(DEFAULT_RECOVERY_USE_CASE_KEY)
  const [inputs, setInputs] = useState<RecoveryRoiCalculatorInputs>(DEFAULT_RECOVERY_ROI_INPUTS)
  const estimateViewedRef = useRef<string | null>(null)

  const selectedUseCase = useMemo(
    () => getRecoveryUseCaseConfig(selectedUseCaseKey),
    [selectedUseCaseKey],
  )
  const estimate = useMemo(() => calculateRecoveryRoi(inputs), [inputs])

  useEffect(() => {
    const signature = [
      selectedUseCaseKey,
      inputs.monthlyMoments,
      inputs.currentRecoveryRate,
      inputs.recoveredLiftRate,
      inputs.averageValue,
      inputs.actionToRevenueRate,
    ].join(':')

    if (estimateViewedRef.current === signature) return
    estimateViewedRef.current = signature
    trackPricingEvent('estimate_viewed', {
      model: 'revenue_recovery_orchestration',
      useCase: selectedUseCaseKey,
    })
  }, [inputs, selectedUseCaseKey])

  const updateInput = (field: keyof RecoveryRoiCalculatorInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }))
    trackPricingEvent('calculator_used', {
      field,
      model: 'revenue_recovery_orchestration',
      useCase: selectedUseCaseKey,
    })
  }

  const selectUseCase = (useCaseKey: RecoveryUseCaseKey) => {
    const nextUseCase = getRecoveryUseCaseConfig(useCaseKey)
    setSelectedUseCaseKey(useCaseKey)
    setInputs(nextUseCase.defaults)
    trackPricingEvent('calculator_use_case_selected', {
      model: 'revenue_recovery_orchestration',
      useCase: useCaseKey,
    })
  }

  return (
    <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[760px]">
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
            Revenue recovery inputs
          </p>
          <h2
            id="calculator-heading"
            className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
          >
            Model recovered outcomes across your revenue stack.
          </h2>
          <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/65 sm:text-[14px]">
            Use this to estimate revenue-ready visitors and customers recovered from pricing,
            demo, checkout, billing, account, comparison, integration, security, docs, and
            customer-story pages.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr]">
        <div className="grid gap-5">
          <div>
            <p className="font-grotesk mb-3 text-[12px] uppercase tracking-wide text-cream/80">
              Recovery use case
            </p>
            <div
              className="grid gap-2 sm:grid-cols-2"
              role="radiogroup"
              aria-label="Recovery use case"
            >
              {RECOVERY_USE_CASES.map((useCase) => {
                const selected = selectedUseCaseKey === useCase.key
                return (
                  <button
                    key={useCase.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`rounded-[16px] border px-4 py-3 text-left transition ${
                      selected
                        ? 'border-neon bg-neon/[0.1] text-cream'
                        : 'border-white/10 bg-white/[0.02] text-cream/70 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                    onClick={() => selectUseCase(useCase.key)}
                  >
                    <span className="font-grotesk block text-[13px] uppercase tracking-wide">
                      {useCase.label}
                    </span>
                    <span className="font-mono mt-1 block text-[10px] uppercase leading-relaxed text-cream/45">
                      {useCase.eyebrow}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/60">
              {selectedUseCase.description}
            </p>
          </div>
          <NumberControl
            id="monthly-moments"
            label={selectedUseCase.inputLabels.monthlyMoments}
            value={inputs.monthlyMoments}
            suffix="moments"
            step={100}
            onChange={(value) => updateInput('monthlyMoments', value)}
          />
          <SliderControl
            id="current-recovery-rate"
            label={selectedUseCase.inputLabels.currentRecoveryRate}
            min={0}
            max={50}
            step={0.1}
            value={inputs.currentRecoveryRate}
            onChange={(value) => updateInput('currentRecoveryRate', value)}
          />
          <SliderControl
            id="recovered-lift-rate"
            label={selectedUseCase.inputLabels.recoveredLiftRate}
            min={0}
            max={30}
            step={0.1}
            value={inputs.recoveredLiftRate}
            onChange={(value) => updateInput('recoveredLiftRate', value)}
          />
          <NumberControl
            id="average-value"
            label={selectedUseCase.inputLabels.averageValue}
            prefix="$"
            value={inputs.averageValue}
            step={1000}
            onChange={(value) => updateInput('averageValue', value)}
          />
          <SliderControl
            id="action-to-revenue-rate"
            label={selectedUseCase.inputLabels.actionToRevenueRate}
            min={0}
            max={100}
            step={5}
            value={inputs.actionToRevenueRate}
            onChange={(value) => updateInput('actionToRevenueRate', value)}
          />
        </div>

        <div
          id="results"
          className="scroll-mt-28 rounded-[24px] border border-neon/25 bg-neon/[0.04] p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <CircleDollarSign className="h-8 w-8 text-neon" aria-hidden />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
                Modeled output
              </p>
              <h2 className="font-grotesk mt-1 text-[22px] uppercase leading-tight text-cream">
                {selectedUseCase.shortLabel} recovery ROI
              </h2>
            </div>
          </div>
          <dl className="grid gap-5">
            <ResultStat
              label={selectedUseCase.resultLabels.currentActions}
              value={formatNumber(estimate.currentActions)}
            />
            <ResultStat
              label={selectedUseCase.resultLabels.recoveredActions}
              value={formatNumber(estimate.recoveredActions)}
              tone="neon"
              testId="calculator-recovered-demos"
            />
            <ResultStat
              label={selectedUseCase.resultLabels.qualifiedRecoveredActions}
              value={formatNumber(estimate.qualifiedRecoveredActions)}
            />
            <ResultStat
              label={selectedUseCase.resultLabels.pipelineInfluenced}
              value={formatCurrency(estimate.pipelineInfluenced)}
              tone="neon"
              testId="calculator-pipeline-influenced"
            />
            <ResultStat
              label="Estimated SentientWeb fee"
              value={formatCurrency(estimate.estimatedFee)}
              testId="calculator-fee"
            />
            <ResultStat
              label="Modeled ROI"
              value={formatPercent(estimate.modeledRoi)}
              tone="neon"
              testId="calculator-modeled-roi"
            />
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
              Revenue recovery pricing
            </p>
            <h1
              id="pricing-heading"
              className="font-grotesk text-[40px] uppercase leading-none text-cream sm:text-[56px] md:text-[72px]"
            >
              Price around recovered revenue actions.
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[760px] text-[14px] uppercase leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              SentientWeb detects recovery moments, calls the right tool in your stack, and
              measures business-accepted outcomes instead of message volume.
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
                Qualified recovered action
              </p>
              <h2
                id="qualified-demo-heading"
                className="font-grotesk text-[24px] uppercase leading-tight text-cream sm:text-[30px]"
              >
                Define the business outcome before the workflow runs.
              </h2>
              <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/75 sm:text-[14px]">
                {QUALIFIED_BOOKED_DEMO_DEFINITION}
              </p>
              <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/55 sm:text-[13px]">
                Your team approves the ICP, stack-fit rules, recovery criteria, and what counts as
                business-accepted before any recovered action is billable.
              </p>
            </div>
          </section>

          <section
            id="calculator"
            ref={calculatorRef}
            className="mx-auto max-w-[1220px] scroll-mt-28 px-4 pt-12 sm:px-6 md:px-8 lg:px-10"
            aria-labelledby="calculator-heading"
          >
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
                Detect, qualify, trigger the action, and prove it where the business works.
              </h2>
              <ol className="mt-8 grid gap-5 md:grid-cols-3">
                {[
                  {
                    title: 'We map the recovery rules',
                    body: 'Agree on ICP, high-intent surfaces, qualification, execution tools, stack fields, and acceptance criteria.',
                  },
                  {
                    title: 'We recover revenue intent',
                    body: 'SentientWeb handles page-specific hesitation and opens the right workflow path after qualification.',
                  },
                  {
                    title: 'You measure recovered actions',
                    body: 'Reporting centers on qualified recovered actions, business acceptance, and stack-visible context.',
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
                  Recovery plans
                </p>
                <h2
                  id="tier-table-heading"
                  className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[36px]"
                >
                  Revenue recovery pricing
                </h2>
              </div>
            </div>
            <TierTable onEnterpriseClick={onEnterpriseClick} />
          </section>

          <section
            className="section-light-editorial relative left-1/2 w-screen -translate-x-1/2 px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10"
            aria-labelledby="pricing-faq-heading"
          >
            <div className="mx-auto max-w-[980px]">
              <p className="section-kicker font-mono mb-3 text-[11px] uppercase tracking-widest sm:text-[12px]">
                FAQ
              </p>
              <h2
                id="pricing-faq-heading"
                className="section-heading font-grotesk text-[28px] uppercase leading-tight sm:text-[36px]"
              >
                Common questions
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  {
                    q: 'What counts as a qualified recovered action?',
                    a: QUALIFIED_BOOKED_DEMO_DEFINITION,
                  },
                  {
                    q: 'Is the pilot priced by message volume?',
                    a: 'No. Measure qualified recovered actions and stack-visible context, not message count.',
                  },
                  {
                    q: 'What happens if traffic is too low?',
                    a: 'We will call that out during setup. If high-intent pages do not have enough traffic yet, fix traffic, offer clarity, or sales infrastructure first.',
                  },
                  {
                    q: 'Do we need a specific CRM?',
                    a: 'No. SentientWeb sits above your stack and can call the CRM, scheduler, billing tool, messaging system, API, webhook, or lightweight handoff that matches the workflow.',
                  },
                  {
                    q: 'Can this work with our scheduler or routing tools?',
                    a: 'Yes. SentientWeb can call the scheduler, router, territory path, account-owner workflow, or custom booking flow that matches the business moment.',
                  },
                  {
                    q: 'Does this replace Chili Piper, Drift, or Qualified?',
                    a: 'It replaces generic popups, static forms, and manual chasing across revenue moments. It can still use your existing sales, support, messaging, routing, and workflow tools.',
                  },
                  {
                    q: 'Are case-study rights required?',
                    a: 'No. Published proof rights are optional. SentientWeb can be evaluated without publishing your brand or conversion data.',
                  },
                  {
                    q: 'How do you prove incrementality?',
                    a: 'The proof packet includes baseline pages, detected intent, qualification answers, recovered actions, business acceptance, stack records, and pipeline assumptions.',
                  },
                  {
                    q: 'How are AI answer quality and security handled?',
                    a: 'Answers are grounded in approved source content. Sensitive security, legal, pricing, and high-risk questions route to a human.',
                  },
                  {
                    q: 'What does the annual tier include?',
                    a: 'Annual pricing can lock Starter or Growth volume and apply any agreed recovery credit.',
                  },
                  {
                    q: 'What if procurement needs SOC 2 or a BAA?',
                    a: 'SentientWeb is not currently SOC 2 certified. Regulated pilots should use approved website pages, approved non-sensitive content, human handoff, and a security review gate.',
                  },
                  {
                    q: 'Do you identify anonymous people?',
                    a: 'The v1 promise is behavior-based demo intent and self-identified qualification. Person-level identification is not the lead claim.',
                  },
                ].map((item) => (
                  <details key={item.q} className="editorial-panel group rounded-[14px] p-5">
                    <summary className="cursor-pointer list-none font-grotesk text-[15px] uppercase tracking-wide text-[#10213c] [&::-webkit-details-marker]:hidden">
                      {item.q}
                    </summary>
                    <p className="editorial-muted font-mono mt-3 text-[13px] normal-case leading-relaxed sm:text-[14px]">
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
                Run the recovery loop across your stack.
              </h2>
              <p className="font-mono mx-auto mt-5 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
                SentientWeb turns qualified recovery moments into business-accepted actions with
                stack context attached.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  onClick={() => onCtaClick()}
                >
                  Book a revenue recovery pilot
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
