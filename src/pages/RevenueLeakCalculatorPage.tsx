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

const STAGE_ICONS = [MousePointerClick, Users, CalendarCheck, Database, BellRing] as const

function trackLeakEvent(event: string, payload: Record<string, unknown> = {}) {
  if (
    typeof window === 'undefined' ||
    !Array.isArray(window.dataLayer) ||
    !hasOptionalAnalyticsConsent()
  ) {
    return
  }
  window.dataLayer.push({ event, model: 'revenue_recovery_orchestration', ...payload })
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
        {children}
      </div>
    </section>
  )
}

export default function RevenueLeakCalculatorPage() {
  const [selectedUseCaseKey, setSelectedUseCaseKey] =
    useState<RecoveryUseCaseKey>(DEFAULT_RECOVERY_USE_CASE_KEY)
  const [inputs, setInputs] = useState<RecoveryRoiCalculatorInputs>(DEFAULT_RECOVERY_ROI_INPUTS)
  const [mobileTotalOpen, setMobileTotalOpen] = useState(true)
  const interactionStartedRef = useRef(false)
  const totalEventSentRef = useRef(false)

  const selectedUseCase = useMemo(
    () => getRecoveryUseCaseConfig(selectedUseCaseKey),
    [selectedUseCaseKey],
  )
  const calculations = useMemo(() => calculateRecoveryRoi(inputs), [inputs])

  useEffect(() => {
    trackLeakEvent('leak_calc_page_view')
  }, [])

  useEffect(() => {
    if (totalEventSentRef.current) return
    totalEventSentRef.current = true
    trackLeakEvent('leak_total_calculated', {
      recoveredActions: Math.round(calculations.recoveredActions),
      pipelineInfluenced: Math.round(calculations.pipelineInfluenced),
      useCase: selectedUseCaseKey,
    })
  }, [calculations.pipelineInfluenced, calculations.recoveredActions, selectedUseCaseKey])

  const updateInput = (field: keyof RecoveryRoiCalculatorInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }))
    if (!interactionStartedRef.current) {
      interactionStartedRef.current = true
      trackLeakEvent('leak_calc_started')
    }
    trackLeakEvent('leak_input_changed', { field, value, useCase: selectedUseCaseKey })
  }

  const selectUseCase = (useCaseKey: RecoveryUseCaseKey) => {
    const nextUseCase = getRecoveryUseCaseConfig(useCaseKey)
    setSelectedUseCaseKey(useCaseKey)
    setInputs(nextUseCase.defaults)
    totalEventSentRef.current = false
    trackLeakEvent('leak_use_case_selected', { useCase: useCaseKey })
  }

  const onCtaClick = () => {
    trackLeakEvent('leak_cta_click', {
      recoveredActions: Math.round(calculations.recoveredActions),
      pipelineInfluenced: Math.round(calculations.pipelineInfluenced),
      useCase: selectedUseCaseKey,
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
              Recovery ROI / revenue recovery orchestration
            </p>
            <h1
              id="roi-heading"
              className="font-grotesk text-[38px] uppercase leading-none text-cream sm:text-[58px] md:text-[76px]"
            >
              Estimate the ROI of recovering revenue-ready website and customer moments.
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[820px] text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              This calculator models high-intent website visitors, recovered revenue actions,
              qualified next steps, pipeline influenced, and modeled SentientWeb fees.
            </p>
            <p className="font-mono mx-auto mt-3 max-w-[760px] text-[11px] normal-case leading-relaxed text-cream/50 sm:text-[12px]">
              Outputs are modeled estimates based on your inputs and assumptions. They are not a
              guarantee of revenue, conversion lift, pipeline, or business results.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Subscription businesses', 'High-intent pages', 'Stack-ready context'].map((pill) => (
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
                  value={formatNumber(calculations.currentActions)}
                />
                <ResultStat
                  label={selectedUseCase.resultLabels.recoveredActions}
                  value={formatNumber(calculations.recoveredActions)}
                  tone="neon"
                  testId="roi-recovered-actions"
                />
                <ResultStat
                  label={selectedUseCase.resultLabels.qualifiedRecoveredActions}
                  value={formatNumber(calculations.qualifiedRecoveredActions)}
                />
                <ResultStat
                  label={selectedUseCase.resultLabels.pipelineInfluenced}
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
              {selectedUseCase.loopTitle}
            </h2>
            <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/65 sm:text-[14px]">
              {selectedUseCase.loopBody}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {selectedUseCase.stages.map((stage, index) => (
              <StageCard
                key={stage.title}
                title={stage.title}
                body={stage.body}
                icon={STAGE_ICONS[index] ?? MousePointerClick}
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
              The pilot should prove qualified recovered actions, stack-visible context, and
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
                Book a revenue recovery pilot
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
