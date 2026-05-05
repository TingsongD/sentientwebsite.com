import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  CircleDollarSign,
  Database,
  MousePointerClick,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import {
  calculateDemoRoi,
  DEFAULT_DEMO_ROI_INPUTS,
  type DemoRoiCalculatorInputs,
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

const RECOVERY_STAGES = [
  {
    title: 'Detect',
    body: 'Identify demo-ready behavior on pricing, demo, comparison, integration, security, docs, and customer-story pages.',
    icon: MousePointerClick,
  },
  {
    title: 'Qualify',
    body: 'Confirm role, company domain, use case, stack, timing, urgency, and fit before opening the booking path.',
    icon: Users,
  },
  {
    title: 'Book',
    body: 'Route qualified visitors to the agreed Calendly or demo path with the buying context preserved.',
    icon: CalendarCheck,
  },
  {
    title: 'Sync to HubSpot',
    body: 'Send pages viewed, qualification answers, summary, booking details, and a suggested opener to HubSpot.',
    icon: Database,
  },
  {
    title: 'Remind',
    body: 'Send text and email reminders before the meeting so the prospect shows up and sales starts prepared.',
    icon: BellRing,
  },
] as const

function trackLeakEvent(event: string, payload: Record<string, unknown> = {}) {
  if (
    typeof window === 'undefined' ||
    !Array.isArray(window.dataLayer) ||
    !hasOptionalAnalyticsConsent()
  ) {
    return
  }
  window.dataLayer.push({ event, model: 'b2b_saas_demo_recovery', ...payload })
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

function StageCard({
  title,
  body,
  icon: Icon,
}: {
  title: string
  body: string
  icon: LucideIcon
}) {
  return (
    <article className="liquid-glass rounded-[24px] p-5 sm:p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-neon/[0.08] text-neon">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="font-grotesk mt-5 text-[19px] uppercase leading-tight text-cream sm:text-[22px]">
        {title}
      </h3>
      <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
        {body}
      </p>
    </article>
  )
}

function CalculatorShell({ children }: { children: ReactNode }) {
  return (
    <section
      id="calculator"
      className="mx-auto max-w-[1220px] scroll-mt-28 px-4 pt-12 sm:px-6 md:px-8 lg:px-10"
      aria-labelledby="calculator-heading"
    >
      <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              B2B SaaS inputs
            </p>
            <h2
              id="calculator-heading"
              className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
            >
              Model recovered demos from high-intent website traffic.
            </h2>
            <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/65 sm:text-[14px]">
              Use this to estimate demo-ready visitors recovered from pricing, demo, comparison,
              integration, security, docs, and customer-story pages.
            </p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

export default function RevenueLeakCalculatorPage() {
  const [inputs, setInputs] = useState<DemoRoiCalculatorInputs>(DEFAULT_DEMO_ROI_INPUTS)
  const [mobileTotalOpen, setMobileTotalOpen] = useState(true)
  const interactionStartedRef = useRef(false)
  const totalEventSentRef = useRef(false)

  const calculations = useMemo(() => calculateDemoRoi(inputs), [inputs])

  useEffect(() => {
    trackLeakEvent('leak_calc_page_view')
  }, [])

  useEffect(() => {
    if (totalEventSentRef.current) return
    totalEventSentRef.current = true
    trackLeakEvent('leak_total_calculated', {
      recoveredDemos: Math.round(calculations.recoveredDemos),
      pipelineInfluenced: Math.round(calculations.pipelineInfluenced),
    })
  }, [calculations.pipelineInfluenced, calculations.recoveredDemos])

  const updateInput = (field: keyof DemoRoiCalculatorInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }))
    if (!interactionStartedRef.current) {
      interactionStartedRef.current = true
      trackLeakEvent('leak_calc_started')
    }
    trackLeakEvent('leak_input_changed', { field, value })
  }

  const onCtaClick = () => {
    trackLeakEvent('leak_cta_click', {
      recoveredDemos: Math.round(calculations.recoveredDemos),
      pipelineInfluenced: Math.round(calculations.pipelineInfluenced),
    })
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
      <main id="main-content" className="bg-background pb-28 md:pb-0">
        <section
          className="mx-auto max-w-[1831px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
          aria-labelledby="roi-heading"
        >
          <div className="mx-auto max-w-[1040px] text-center">
            <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Demo ROI / B2B SaaS demo recovery
            </p>
            <h1
              id="roi-heading"
              className="font-grotesk text-[38px] uppercase leading-none text-cream sm:text-[58px] md:text-[76px]"
            >
              Estimate the ROI of recovering demo-ready website visitors.
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[820px] text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              This calculator focuses only on B2B SaaS demo recovery: high-intent website visitors,
              recovered demos, qualified booked demos, pipeline influenced, and modeled
              SentientWeb fees.
            </p>
            <p className="font-mono mx-auto mt-3 max-w-[760px] text-[11px] normal-case leading-relaxed text-cream/50 sm:text-[12px]">
              Outputs are modeled estimates based on your inputs and assumptions. They are not a
              guarantee of revenue, conversion lift, pipeline, or business results.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['B2B SaaS only', 'High-intent pages', 'HubSpot-ready context'].map((pill) => (
                <span
                  key={pill}
                  className="liquid-glass rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-cream/75"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="#calculator"
                className="rounded-full bg-neon px-7 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110"
              >
                Start calculator
              </a>
              <a
                href="#results"
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-7 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10"
              >
                See ROI model
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <CalculatorShell>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr]">
            <div className="grid gap-5">
              <NumberControl
                id="high-intent-visitors"
                label="Monthly high-intent page visitors"
                value={inputs.highIntentVisitors}
                suffix="visitors"
                step={100}
                onChange={(value) => updateInput('highIntentVisitors', value)}
              />
              <SliderControl
                id="current-demo-conversion-rate"
                label="Current demo conversion rate"
                min={0}
                max={10}
                step={0.1}
                value={inputs.currentDemoConversionRate}
                onChange={(value) => updateInput('currentDemoConversionRate', value)}
              />
              <SliderControl
                id="recovered-demo-lift-rate"
                label="Recovered demo lift"
                min={0}
                max={5}
                step={0.1}
                value={inputs.recoveredDemoLiftRate}
                onChange={(value) => updateInput('recoveredDemoLiftRate', value)}
              />
              <NumberControl
                id="average-contract-value"
                label="Average contract value"
                prefix="$"
                value={inputs.averageContractValue}
                step={1000}
                onChange={(value) => updateInput('averageContractValue', value)}
              />
              <SliderControl
                id="demo-to-opportunity-rate"
                label="Demo-to-opportunity rate"
                min={0}
                max={80}
                step={5}
                value={inputs.demoToOpportunityRate}
                onChange={(value) => updateInput('demoToOpportunityRate', value)}
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
                    Demo recovery ROI
                  </h2>
                </div>
              </div>
              <dl className="grid gap-5">
                <ResultStat
                  label="Current demos from high-intent pages"
                  value={formatNumber(calculations.currentDemos)}
                />
                <ResultStat
                  label="Estimated recovered demos"
                  value={formatNumber(calculations.recoveredDemos)}
                  tone="neon"
                  testId="roi-recovered-demos"
                />
                <ResultStat
                  label="Estimated qualified booked demos"
                  value={formatNumber(calculations.qualifiedBookedDemos)}
                />
                <ResultStat
                  label="Estimated pipeline influenced"
                  value={formatCurrency(calculations.pipelineInfluenced)}
                  tone="neon"
                  testId="roi-pipeline-influenced"
                />
                <ResultStat
                  label="Estimated SentientWeb fee"
                  value={formatCurrency(calculations.estimatedFee)}
                  testId="roi-estimated-fee"
                />
                <ResultStat
                  label="Modeled ROI"
                  value={formatPercent(calculations.modeledRoi)}
                  tone="neon"
                  testId="roi-modeled-roi"
                />
              </dl>
            </div>
          </div>
        </CalculatorShell>

        <section
          className="mx-auto max-w-[1220px] px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10"
          aria-labelledby="recovery-loop-heading"
        >
          <div className="mb-8 max-w-[880px]">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              What the model represents
            </p>
            <h2
              id="recovery-loop-heading"
              className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
            >
              One B2B SaaS recovery loop from intent to attended demo.
            </h2>
            <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/65 sm:text-[14px]">
              The calculation is intentionally narrow. It models the wedge SentientWeb is selling:
              recover demo-ready visitors, qualify them, book them, sync the context, and keep the
              meeting visible.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {RECOVERY_STAGES.map((stage) => (
              <StageCard
                key={stage.title}
                title={stage.title}
                body={stage.body}
                icon={stage.icon}
              />
            ))}
          </div>
        </section>

        <section
          className="mx-auto max-w-[980px] px-4 pb-16 sm:px-6 md:px-8 md:pb-20 lg:px-10"
          aria-labelledby="roi-cta-heading"
        >
          <div className="liquid-glass rounded-[28px] p-7 text-center sm:p-10">
            <CheckCircle2 className="mx-auto h-10 w-10 text-neon" aria-hidden />
            <h2
              id="roi-cta-heading"
              className="font-grotesk mt-5 text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
            >
              Use the estimate to scope a 30-day pilot.
            </h2>
            <p className="font-mono mx-auto mt-5 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              The first pilot should prove qualified booked demos, HubSpot-visible context, and
              sales-ready meetings from the high-intent traffic you already have.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={BOOK_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                onClick={onCtaClick}
              >
                Book a 30-day pilot
              </a>
              <Link
                to="/pricing"
                className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      {mobileTotalOpen ? (
        <div className="fixed inset-x-3 bottom-3 z-[70] rounded-[22px] border border-neon/25 bg-background/95 p-4 shadow-2xl backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
                Pipeline influenced
              </p>
              <p className="font-grotesk text-[26px] leading-none text-neon">
                {formatCurrency(calculations.pipelineInfluenced)}
              </p>
            </div>
            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neon px-4 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background"
              onClick={onCtaClick}
            >
              Pilot
            </a>
            <button
              type="button"
              className="rounded-full p-2 text-cream/60 transition hover:bg-white/10 hover:text-cream"
              aria-label="Hide pipeline estimate"
              onClick={() => setMobileTotalOpen(false)}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <SiteFooter anchorId="roi-calculator-footer" />
    </>
  )
}
