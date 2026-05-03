import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  CalendarX,
  CircleDollarSign,
  CreditCard,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  MousePointerClick,
  Send,
  ShoppingCart,
  Star,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'
import {
  calculateRevenueLeaks,
  DEFAULT_REVENUE_LEAK_INPUTS,
  type RevenueLeakInputs,
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

const FUNNEL_SEGMENTS = [
  {
    label: 'Awareness / Trust',
    body: 'Social, reviews, and public response paths',
  },
  {
    label: 'Engagement',
    body: 'Site, inbox, and intent signals',
  },
  {
    label: 'Conversion',
    body: 'Cart, checkout, and booked meetings',
  },
  {
    label: 'Revenue Capture',
    body: 'The monthly leak you can plug',
  },
] as const

const FUNNEL_SEGMENT_SHAPE_CLASSES = [
  'funnel-segment--0',
  'funnel-segment--1',
  'funnel-segment--2',
  'funnel-segment--3',
] as const

const FIX_ROWS = [
  ['Social comments unanswered', 'Monitor mentions, answer common questions, route edge cases', 'Modeled response target'],
  ['Social re-engagement missing', 'Send timely second-touch offers after public replies', 'Modeled response lift'],
  ['Reviews not replied', 'Draft personalized responses for approval', 'Modeled response coverage'],
  ['Chats not replied', 'Respond quickly and route qualified requests', 'Modeled response target'],
  ['Emails not replied', 'Draft replies and keep unanswered requests moving', 'Modeled response target'],
  ['Contact forms ignored', 'Reply quickly with a multi-touch sequence', 'Modeled touch lift'],
  ['Visitors not captured', 'Engage based on behavior and capture contact details', 'Modeled lead capture lift'],
  ['Visitors not convinced', 'Answer objections while the visitor is still active', 'Modeled conversion lift'],
  ['Abandoned carts', 'Trigger recovery messages while intent is still active', 'Modeled recovery range'],
  ['Abandoned checkout', 'Offer immediate help before the buyer disappears', 'Modeled recovery range'],
  ['Demo no-shows', 'Send reminders with team alerts', 'Modeled show-rate target'],
] as const

function trackLeakEvent(event: string, payload: Record<string, unknown> = {}) {
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
  return `${formatDecimal(value)}%`
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
          } ${suffix ? 'pr-16' : 'pr-4'} text-right`}
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-cream/45">{label}</dt>
      <dd className="font-grotesk mt-1 text-[17px] uppercase leading-none text-cream">{value}</dd>
    </div>
  )
}

function LeakCard({
  code,
  title,
  description,
  icon: Icon,
  monthlyLoss,
  resultLabel = 'Leaking here',
  metrics,
  children,
}: {
  code: string
  title: string
  description: string
  icon: LucideIcon
  monthlyLoss: number
  resultLabel?: string
  metrics: Array<{ label: string; value: string }>
  children: ReactNode
}) {
  return (
    <article className="liquid-glass flex h-full flex-col rounded-[24px] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neon">{code}</p>
          <h3 className="font-grotesk mt-3 text-[19px] uppercase leading-tight text-cream sm:text-[22px]">
            {title}
          </h3>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-neon/[0.08] text-neon">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      <p className="font-mono mt-3 text-[12px] normal-case leading-relaxed text-cream/65 sm:text-[13px]">
        {description}
      </p>

      <div className="mt-6 grid gap-4">{children}</div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </dl>

      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#ff8a8a]">
          {resultLabel}
        </p>
        <p className="font-grotesk mt-1 text-[34px] leading-none text-[#ff8a8a] sm:text-[42px]">
          {formatCurrency(monthlyLoss)}
        </p>
        <p className="font-mono mt-1 text-[11px] uppercase tracking-wide text-cream/45">
          per month
        </p>
      </div>
    </article>
  )
}

function StageSection({
  id,
  eyebrow,
  title,
  body,
  subtotalLabel,
  subtotal,
  widthClass,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  body: string
  subtotalLabel: string
  subtotal: number
  widthClass: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`scroll-mt-28 px-4 pt-14 sm:px-6 md:px-8 lg:px-10 ${widthClass}`}>
      <div className="mx-auto max-w-[1831px]">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[780px]">
            <p className="font-grotesk mb-4 text-[38px] uppercase leading-none text-neon sm:text-[58px] md:text-[76px]">
              {eyebrow}
            </p>
            <h2 className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]">
              {title}
            </h2>
            <p className="font-mono mt-4 text-[13px] normal-case leading-relaxed text-cream/65 sm:text-[14px]">
              {body}
            </p>
          </div>
          <div className="border-y border-neon/30 py-4 lg:min-w-[280px] lg:text-right">
            <h2 className="font-grotesk text-[22px] uppercase leading-tight text-cream sm:text-[28px]">
              {subtotalLabel}
            </h2>
            <p className="font-grotesk mt-2 text-[32px] leading-none text-[#FF8A8A] sm:text-[40px]">
              {formatCurrency(subtotal)}/MO
            </p>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

function FunnelOverview({ totalMonthlyLeak }: { totalMonthlyLeak: number }) {
  return (
    <section className="mx-auto max-w-[1831px] px-4 pt-10 sm:px-6 md:px-8 lg:px-10">
      <div className="liquid-glass rounded-[28px] p-5 sm:p-7">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono mb-2 text-[11px] uppercase tracking-widest text-neon">
              Funnel diagnostic
            </p>
            <h2 className="font-grotesk text-[26px] uppercase leading-tight text-cream sm:text-[34px]">
              Find the holes from first touch to final sale
            </h2>
          </div>
          <h2 className="font-grotesk text-[24px] uppercase leading-tight text-cream sm:text-[30px]">
            Current leak:{' '}
            <span className="text-[#FF8A8A]">{formatCurrency(totalMonthlyLeak)}/MO</span>
          </h2>
        </div>
        <ol className="grid gap-3 lg:grid-cols-4">
          {FUNNEL_SEGMENTS.map((segment, index) => (
            <li
              key={segment.label}
              className={`mx-auto min-h-[132px] w-full border border-white/10 bg-white/[0.035] px-6 py-5 ${FUNNEL_SEGMENT_SHAPE_CLASSES[index]}`}
            >
              <div className="flex h-full flex-col justify-between pl-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neon">
                  Stage {index + 1}
                </span>
                <div>
                  <h3 className="font-grotesk text-[18px] uppercase leading-tight text-cream">
                    {segment.label}
                  </h3>
                  <p className="font-mono mt-2 text-[11px] normal-case leading-relaxed text-cream/55">
                    {segment.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function GrandTotal({
  totalMonthlyLeak,
  annualLeak,
  roiLow,
  roiHigh,
  onCtaClick,
}: {
  totalMonthlyLeak: number
  annualLeak: number
  roiLow: number
  roiHigh: number
  onCtaClick: () => void
}) {
  return (
    <section
      id="grand-total"
      className="mx-auto max-w-[1100px] scroll-mt-28 px-4 pt-16 sm:px-6 md:px-8 lg:px-10"
      aria-labelledby="grand-total-heading"
    >
      <div className="liquid-glass rounded-[28px] p-7 text-center sm:p-10">
        <CircleDollarSign className="mx-auto h-10 w-10 text-neon" aria-hidden />
        <h2
          id="grand-total-heading"
          className="font-grotesk mt-5 text-[30px] uppercase leading-tight text-cream sm:text-[42px]"
        >
          Here is what silence is costing you
        </h2>
        <p className="font-grotesk mt-3 text-[38px] uppercase leading-none text-[#FF8A8A] sm:text-[58px]">
          {formatCurrency(totalMonthlyLeak)}/month
        </p>
        <div className="mx-auto mt-8 grid max-w-[780px] gap-4 sm:grid-cols-3">
          <div className="border-y border-white/10 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
              Annual leak
            </p>
            <p className="font-grotesk mt-1 text-[24px] text-cream">{formatCurrency(annualLeak)}</p>
          </div>
          <div className="border-y border-white/10 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
              SentientWeb cost
            </p>
            <p className="font-grotesk mt-1 text-[24px] text-cream">$500-$2,500</p>
          </div>
          <div className="border-y border-white/10 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
              Potential ROI
            </p>
            <p className="font-grotesk mt-1 text-[24px] text-neon">
              {formatNumber(roiLow)}%-{formatNumber(roiHigh)}%
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
            onClick={onCtaClick}
          >
            Start Free Pilot
          </a>
          <Link
            to="/pricing"
            className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
          >
            View pricing
          </Link>
        </div>
        <p className="font-mono mx-auto mt-5 max-w-xl text-[11px] uppercase leading-relaxed text-cream/45">
          Estimates only. Actual results vary by traffic quality, offer strength, and response
          process.
        </p>
      </div>
    </section>
  )
}

function FixesTable() {
  return (
    <section className="mx-auto max-w-[1831px] px-4 py-16 sm:px-6 md:px-8 lg:px-10">
      <div className="mb-8 max-w-[900px]">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Plug the leaks
        </p>
        <h2 className="font-grotesk text-[30px] uppercase leading-tight text-cream sm:text-[42px]">
          What SentientWeb fixes after the calculator
        </h2>
      </div>
      <div className="overflow-x-auto rounded-[24px] liquid-glass">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <caption className="sr-only">Revenue leak fixes and expected improvements</caption>
          <thead>
            <tr>
              {['Leak', 'How SentientWeb plugs it', 'Expected improvement'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b border-white/15 px-5 py-4 font-grotesk text-[12px] uppercase tracking-wide text-cream/70 sm:text-[13px]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIX_ROWS.map(([leak, fix, improvement]) => (
              <tr key={leak}>
                <th
                  scope="row"
                  className="border-b border-white/10 px-5 py-4 font-mono text-[14px] font-normal uppercase tracking-wide text-[#FF8A8A] sm:text-[15px]"
                >
                  {leak}
                </th>
                <td className="border-b border-white/10 px-5 py-4 font-mono text-[12px] normal-case leading-relaxed text-cream/70">
                  {fix}
                </td>
                <td className="border-b border-white/10 px-5 py-4 font-mono text-[12px] uppercase text-neon">
                  {improvement}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function RevenueLeakCalculatorPage() {
  const [inputs, setInputs] = useState<RevenueLeakInputs>(DEFAULT_REVENUE_LEAK_INPUTS)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileTotalOpen, setMobileTotalOpen] = useState(true)
  const interactionStartedRef = useRef(false)
  const totalEventSentRef = useRef(false)

  const calculations = useMemo(() => calculateRevenueLeaks(inputs), [inputs])

  useEffect(() => {
    trackLeakEvent('leak_calc_page_view')
  }, [])

  useEffect(() => {
    if (totalEventSentRef.current) return
    totalEventSentRef.current = true
    trackLeakEvent('leak_total_calculated', {
      totalMonthlyLeak: Math.round(calculations.totalMonthlyLeak),
    })
  }, [calculations.totalMonthlyLeak])

  useEffect(() => {
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const nextProgress =
        maxScroll <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))
      setScrollProgress(nextProgress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const updateInput = (field: keyof RevenueLeakInputs, value: number) => {
    setInputs((current) => ({ ...current, [field]: value }))
    if (!interactionStartedRef.current) {
      interactionStartedRef.current = true
      trackLeakEvent('leak_calc_started')
    }
    trackLeakEvent('leak_input_changed', { field, value })
  }

  const onCtaClick = () => {
    trackLeakEvent('leak_cta_click', {
      totalMonthlyLeak: Math.round(calculations.totalMonthlyLeak),
    })
  }

  const common = {
    updateInput,
    inputs,
    calculations,
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
      <progress
        className="roi-scroll-progress fixed inset-x-0 top-0 z-[90] h-1 w-full"
        value={scrollProgress}
        max={100}
        aria-hidden
      />
      <main id="main-content" className="bg-background pb-28 md:pb-0">
        <section
          className="mx-auto max-w-[1831px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
          aria-labelledby="roi-heading"
        >
          <div className="mx-auto max-w-[1040px] text-center">
            <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              ROI Calculator / Revenue leak diagnostic
            </p>
            <h1
              id="roi-heading"
              className="font-grotesk text-[38px] uppercase leading-none text-cream sm:text-[58px] md:text-[76px]"
            >
              How much revenue are you leaking every month?
            </h1>
            <p className="font-mono mx-auto mt-6 max-w-[820px] text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[15px] md:text-[16px]">
              Answer the funnel questions below. The calculator shows what is slipping away across
              awareness, engagement, conversion, and monthly revenue capture.
            </p>
            <p className="font-mono mx-auto mt-3 max-w-[760px] text-[11px] normal-case leading-relaxed text-cream/50 sm:text-[12px]">
              Outputs are modeled estimates based on your inputs and assumptions. They are not a
              guarantee of revenue, conversion lift, response rates, or business results.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Takes 2 minutes', '11 leak checks', 'Live monthly total'].map((pill) => (
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
                href="#awareness"
                className="rounded-full bg-neon px-7 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110"
              >
                Start calculator
              </a>
              <a
                href="#grand-total"
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-7 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10"
              >
                See total
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <FunnelOverview totalMonthlyLeak={calculations.totalMonthlyLeak} />

        <StageSection
          id="awareness"
          eyebrow="Top of funnel"
          title="They are finding you. But you are ignoring them."
          body="Public signals create trust before anyone reaches your site. Missed replies, dead social threads, and unattended reviews tell prospects to move on."
          subtotalLabel="Top of funnel revenue leaks"
          subtotal={calculations.awareness.subtotal}
          widthClass="mx-auto max-w-[1831px]"
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <LeakCard
              code="Leak 4.1"
              title="Social comments unanswered"
              description="Every unanswered comment is a potential customer who reached out and got silence."
              icon={MessageCircle}
              monthlyLoss={calculations.awareness.socialComments.monthlyLoss}
              metrics={[
                {
                  label: 'Comments unanswered',
                  value: formatNumber(inputs.monthlySocialComments * (inputs.unansweredCommentRate / 100)),
                },
                {
                  label: 'Lost leads',
                  value: formatDecimal(calculations.awareness.socialComments.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-social-comments"
                label="Monthly social comments"
                value={inputs.monthlySocialComments}
                suffix="comments"
                onChange={(value) => common.updateInput('monthlySocialComments', value)}
              />
              <SliderControl
                id="unanswered-comment-rate"
                label="Comments unanswered"
                min={0}
                max={100}
                value={inputs.unansweredCommentRate}
                onChange={(value) => common.updateInput('unansweredCommentRate', value)}
              />
              <SliderControl
                id="commenter-lead-rate"
                label="Commenters who could become leads"
                min={0}
                max={50}
                value={inputs.commenterLeadRate}
                onChange={(value) => common.updateInput('commenterLeadRate', value)}
              />
              <NumberControl
                id="social-comment-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.socialCommentCustomerValue}
                onChange={(value) => common.updateInput('socialCommentCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 4.2"
              title="Social re-engagement missing"
              description="One reply is not enough. Conversations die because no one follows up."
              icon={Send}
              monthlyLoss={calculations.awareness.socialFollowup.monthlyLoss}
              metrics={[
                {
                  label: 'Missed second touches',
                  value: formatNumber(inputs.repliedSocialComments * (1 - inputs.secondTouchRate / 100)),
                },
                {
                  label: 'Lost leads',
                  value: formatDecimal(calculations.awareness.socialFollowup.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="replied-social-comments"
                label="Monthly comments you reply to"
                value={inputs.repliedSocialComments}
                suffix="comments"
                onChange={(value) => common.updateInput('repliedSocialComments', value)}
              />
              <SliderControl
                id="second-touch-rate"
                label="Second-touch response rate"
                min={0}
                max={100}
                value={inputs.secondTouchRate}
                onChange={(value) => common.updateInput('secondTouchRate', value)}
              />
              <SliderControl
                id="second-touch-lead-rate"
                label="Follow-ups that become leads"
                min={0}
                max={60}
                value={inputs.secondTouchLeadRate}
                onChange={(value) => common.updateInput('secondTouchLeadRate', value)}
              />
              <NumberControl
                id="social-followup-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.socialFollowupCustomerValue}
                onChange={(value) => common.updateInput('socialFollowupCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 4.3"
              title="Reviews not replied"
              description="Unanswered reviews tell prospects: we do not care what you think."
              icon={Star}
              monthlyLoss={calculations.awareness.reviews.monthlyLoss}
              metrics={[
                {
                  label: 'Unanswered reviews',
                  value: formatDecimal(inputs.monthlyReviews * (inputs.unansweredReviewRate / 100)),
                },
                {
                  label: 'Conversion impact',
                  value: '12%',
                },
              ]}
            >
              <NumberControl
                id="monthly-reviews"
                label="Monthly new reviews"
                value={inputs.monthlyReviews}
                suffix="reviews"
                onChange={(value) => common.updateInput('monthlyReviews', value)}
              />
              <SliderControl
                id="unanswered-review-rate"
                label="Reviews unanswered"
                min={0}
                max={100}
                value={inputs.unansweredReviewRate}
                onChange={(value) => common.updateInput('unansweredReviewRate', value)}
              />
              <SliderControl
                id="average-star-rating"
                label="Average star rating"
                min={1}
                max={5}
                step={0.1}
                value={inputs.averageStarRating}
                displayValue={`${formatDecimal(inputs.averageStarRating)} stars`}
                onChange={(value) => common.updateInput('averageStarRating', value)}
              />
              <NumberControl
                id="review-visitors"
                label="Monthly review-platform visitors"
                value={inputs.reviewVisitors}
                suffix="visitors"
                onChange={(value) => common.updateInput('reviewVisitors', value)}
              />
              <NumberControl
                id="review-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.reviewCustomerValue}
                onChange={(value) => common.updateInput('reviewCustomerValue', value)}
              />
            </LeakCard>
          </div>
        </StageSection>

        <StageSection
          id="engagement"
          eyebrow="Middle of funnel"
          title="They are interested. But no one is there to help."
          body="Inquiry paths only work when someone answers fast, captures contact details, and keeps momentum while the buyer is active."
          subtotalLabel="Middle of funnel revenue leaks"
          subtotal={calculations.engagement.subtotal}
          widthClass="mx-auto max-w-[1650px]"
        >
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <LeakCard
              code="Leak 5.1"
              title="Chat inquiries not replied"
              description="A chat that goes unanswered for 45 minutes is a chat that never happened."
              icon={MessageSquare}
              monthlyLoss={calculations.engagement.chats.monthlyLoss}
              metrics={[
                {
                  label: 'Slow-response estimate',
                  value: formatPercent(calculations.engagement.chats.slowResponseRate),
                },
                {
                  label: 'Lost leads',
                  value: formatDecimal(calculations.engagement.chats.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-chats"
                label="Monthly chat conversations"
                value={inputs.monthlyChats}
                suffix="chats"
                onChange={(value) => common.updateInput('monthlyChats', value)}
              />
              <SliderControl
                id="chat-no-response-rate"
                label="Chats with no response"
                min={0}
                max={100}
                value={inputs.chatNoResponseRate}
                onChange={(value) => common.updateInput('chatNoResponseRate', value)}
              />
              <SliderControl
                id="chat-response-time"
                label="Average response time"
                min={0}
                max={120}
                value={inputs.chatResponseTimeMinutes}
                displayValue={`${formatNumber(inputs.chatResponseTimeMinutes)} min`}
                onChange={(value) => common.updateInput('chatResponseTimeMinutes', value)}
              />
              <SliderControl
                id="chat-lead-rate"
                label="Chats that could become leads"
                min={0}
                max={60}
                value={inputs.chatLeadRate}
                onChange={(value) => common.updateInput('chatLeadRate', value)}
              />
              <NumberControl
                id="chat-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.chatCustomerValue}
                onChange={(value) => common.updateInput('chatCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 5.2"
              title="Emails not replied"
              description="Your competitor replied in 2 hours. That lead is gone forever."
              icon={Mail}
              monthlyLoss={calculations.engagement.emails.monthlyLoss}
              metrics={[
                {
                  label: 'Unanswered emails',
                  value: formatNumber(inputs.monthlyEmails * (inputs.unansweredEmailRate / 100)),
                },
                {
                  label: 'Sales-qualified lost',
                  value: formatDecimal(calculations.engagement.emails.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-emails"
                label="Monthly inbound business emails"
                value={inputs.monthlyEmails}
                suffix="emails"
                onChange={(value) => common.updateInput('monthlyEmails', value)}
              />
              <SliderControl
                id="unanswered-email-rate"
                label="Unanswered beyond 24h"
                min={0}
                max={100}
                value={inputs.unansweredEmailRate}
                onChange={(value) => common.updateInput('unansweredEmailRate', value)}
              />
              <SliderControl
                id="sales-qualified-email-rate"
                label="Sales-qualified inquiries"
                min={0}
                max={100}
                value={inputs.salesQualifiedEmailRate}
                onChange={(value) => common.updateInput('salesQualifiedEmailRate', value)}
              />
              <NumberControl
                id="email-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.emailCustomerValue}
                onChange={(value) => common.updateInput('emailCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 5.3"
              title="Contact forms ignored"
              description="They filled out your form. It went into a black hole."
              icon={FileText}
              monthlyLoss={calculations.engagement.forms.monthlyLoss}
              metrics={[
                {
                  label: 'Weighted lost leads',
                  value: formatDecimal(calculations.engagement.forms.lostUnits),
                },
                {
                  label: 'Optimal touches',
                  value: '5',
                },
              ]}
            >
              <NumberControl
                id="monthly-form-submissions"
                label="Monthly form submissions"
                value={inputs.monthlyFormSubmissions}
                suffix="submissions"
                onChange={(value) => common.updateInput('monthlyFormSubmissions', value)}
              />
              <SliderControl
                id="no-one-hour-followup-rate"
                label="No response within 1 hour"
                min={0}
                max={100}
                value={inputs.noOneHourFollowupRate}
                onChange={(value) => common.updateInput('noOneHourFollowupRate', value)}
              />
              <SliderControl
                id="never-followed-up-rate"
                label="Never followed up"
                min={0}
                max={100}
                value={inputs.neverFollowedUpRate}
                onChange={(value) => common.updateInput('neverFollowedUpRate', value)}
              />
              <SliderControl
                id="average-followup-touches"
                label="Average touches made"
                min={0}
                max={5}
                step={0.1}
                value={inputs.averageFollowupTouches}
                displayValue={`${formatDecimal(inputs.averageFollowupTouches)} touches`}
                onChange={(value) => common.updateInput('averageFollowupTouches', value)}
              />
              <NumberControl
                id="form-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.formCustomerValue}
                onChange={(value) => common.updateInput('formCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 5.4"
              title="Visitors not captured"
              description="Many visitors leave without a contact path. This model estimates what improved capture could be worth."
              icon={Users}
              monthlyLoss={calculations.engagement.visitorsNotCaptured.monthlyLoss}
              metrics={[
                {
                  label: 'Modeled lead rate',
                  value: '5%',
                },
                {
                  label: 'Lost customers',
                  value: formatDecimal(calculations.engagement.visitorsNotCaptured.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-website-visitors"
                label="Monthly website visitors"
                value={inputs.monthlyWebsiteVisitors}
                suffix="visitors"
                step={100}
                onChange={(value) => common.updateInput('monthlyWebsiteVisitors', value)}
              />
              <SliderControl
                id="visitor-lead-conversion-rate"
                label="Current visitor-to-lead rate"
                min={0}
                max={10}
                step={0.1}
                value={inputs.visitorLeadConversionRate}
                onChange={(value) => common.updateInput('visitorLeadConversionRate', value)}
              />
              <NumberControl
                id="visitor-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.visitorCustomerValue}
                onChange={(value) => common.updateInput('visitorCustomerValue', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 5.5"
              title="Visitors not convinced"
              description="When high-intent visitors still have unanswered questions, this model estimates the value of better in-session routing."
              icon={MousePointerClick}
              monthlyLoss={calculations.engagement.visitorsNotConvinced.monthlyLoss}
              metrics={[
                {
                  label: 'Modeled engagement rate',
                  value: '15%',
                },
                {
                  label: 'Missed conversions',
                  value: formatDecimal(calculations.engagement.visitorsNotConvinced.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-intent-visitors"
                label="Monthly high-intent visitors"
                value={inputs.monthlyIntentVisitors}
                suffix="visitors"
                onChange={(value) => common.updateInput('monthlyIntentVisitors', value)}
              />
              <SliderControl
                id="in-session-conversion-rate"
                label="Current in-session conversion"
                min={0}
                max={30}
                step={0.1}
                value={inputs.inSessionConversionRate}
                onChange={(value) => common.updateInput('inSessionConversionRate', value)}
              />
              <NumberControl
                id="intent-customer-value"
                label="Average customer value"
                prefix="$"
                value={inputs.intentCustomerValue}
                onChange={(value) => common.updateInput('intentCustomerValue', value)}
              />
            </LeakCard>
          </div>
        </StageSection>

        <StageSection
          id="conversion"
          eyebrow="Bottom of funnel"
          title="They are ready to buy. But you let them walk away."
          body="This is the hottest demand in the funnel: carts, checkout starts, and scheduled meetings that need immediate rescue."
          subtotalLabel="Bottom of funnel revenue leaks"
          subtotal={calculations.conversion.subtotal}
          widthClass="mx-auto max-w-[1450px]"
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <LeakCard
              code="Leak 6.1"
              title="Abandoned carts"
              description="They put items in the cart. Then they left. You never asked them to come back."
              icon={ShoppingCart}
              monthlyLoss={calculations.conversion.carts.monthlyLoss}
              metrics={[
                {
                  label: 'Cart abandonment',
                  value: formatPercent(calculations.conversion.carts.abandonmentRate),
                },
                {
                  label: 'Missed recoveries',
                  value: formatDecimal(calculations.conversion.carts.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-add-to-cart-events"
                label="Monthly add-to-cart events"
                value={inputs.monthlyAddToCartEvents}
                suffix="carts"
                onChange={(value) => common.updateInput('monthlyAddToCartEvents', value)}
              />
              <NumberControl
                id="monthly-completed-purchases"
                label="Monthly completed purchases"
                value={inputs.monthlyCompletedPurchases}
                suffix="orders"
                onChange={(value) => common.updateInput('monthlyCompletedPurchases', value)}
              />
              <NumberControl
                id="average-cart-value"
                label="Average cart value"
                prefix="$"
                value={inputs.averageCartValue}
                onChange={(value) => common.updateInput('averageCartValue', value)}
              />
              <SliderControl
                id="cart-recovery-rate"
                label="Current cart recovery rate"
                min={0}
                max={30}
                value={inputs.cartRecoveryRate}
                onChange={(value) => common.updateInput('cartRecoveryRate', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 6.2"
              title="Abandoned checkout"
              description="They entered their payment details. Hesitated. Closed the tab."
              icon={CreditCard}
              monthlyLoss={calculations.conversion.checkouts.monthlyLoss}
              metrics={[
                {
                  label: 'Checkout abandonment',
                  value: formatPercent(calculations.conversion.checkouts.abandonmentRate),
                },
                {
                  label: 'Missed recoveries',
                  value: formatDecimal(calculations.conversion.checkouts.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-checkout-starts"
                label="Monthly checkout starts"
                value={inputs.monthlyCheckoutStarts}
                suffix="checkouts"
                onChange={(value) => common.updateInput('monthlyCheckoutStarts', value)}
              />
              <NumberControl
                id="monthly-completed-checkouts"
                label="Monthly completed checkouts"
                value={inputs.monthlyCompletedCheckouts}
                suffix="orders"
                onChange={(value) => common.updateInput('monthlyCompletedCheckouts', value)}
              />
              <NumberControl
                id="average-order-value"
                label="Average order value"
                prefix="$"
                value={inputs.averageOrderValue}
                onChange={(value) => common.updateInput('averageOrderValue', value)}
              />
              <SliderControl
                id="checkout-recovery-rate"
                label="Checkout recovery rate"
                min={0}
                max={40}
                value={inputs.checkoutRecoveryRate}
                onChange={(value) => common.updateInput('checkoutRecoveryRate', value)}
              />
            </LeakCard>

            <LeakCard
              code="Leak 6.3"
              title="Demo no-shows"
              description="Booked meetings still need reminders and routing. This model estimates the value of reducing avoidable no-shows."
              icon={CalendarX}
              monthlyLoss={calculations.conversion.demoNoShows.monthlyLoss}
              metrics={[
                {
                  label: 'Modeled show-rate target',
                  value: '75%',
                },
                {
                  label: 'Additional closed deals',
                  value: formatDecimal(calculations.conversion.demoNoShows.lostUnits),
                },
              ]}
            >
              <NumberControl
                id="monthly-meetings-booked"
                label="Monthly meetings booked"
                value={inputs.monthlyMeetingsBooked}
                suffix="meetings"
                onChange={(value) => common.updateInput('monthlyMeetingsBooked', value)}
              />
              <SliderControl
                id="current-show-rate"
                label="Current show-up rate"
                min={0}
                max={100}
                value={inputs.currentShowRate}
                onChange={(value) => common.updateInput('currentShowRate', value)}
              />
              <SliderControl
                id="no-show-reschedule-rate"
                label="No-shows that could reschedule"
                min={0}
                max={100}
                value={inputs.noShowRescheduleRate}
                onChange={(value) => common.updateInput('noShowRescheduleRate', value)}
              />
              <SliderControl
                id="meeting-close-rate"
                label="Meeting-to-close rate"
                min={0}
                max={100}
                value={inputs.meetingCloseRate}
                onChange={(value) => common.updateInput('meetingCloseRate', value)}
              />
              <NumberControl
                id="average-deal-value"
                label="Average deal value"
                prefix="$"
                value={inputs.averageDealValue}
                onChange={(value) => common.updateInput('averageDealValue', value)}
              />
            </LeakCard>
          </div>
        </StageSection>

        <GrandTotal
          totalMonthlyLeak={calculations.totalMonthlyLeak}
          annualLeak={calculations.annualLeak}
          roiLow={calculations.roiLow}
          roiHigh={calculations.roiHigh}
          onCtaClick={onCtaClick}
        />

        <FixesTable />
      </main>

      {mobileTotalOpen ? (
        <div className="fixed inset-x-3 bottom-3 z-[70] rounded-[22px] border border-neon/25 bg-background/95 p-4 shadow-2xl backdrop-blur md:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cream/45">
                Monthly leak
              </p>
              <p className="font-grotesk text-[26px] leading-none text-neon">
                {formatCurrency(calculations.totalMonthlyLeak)}
              </p>
            </div>
            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neon px-4 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background"
              onClick={onCtaClick}
            >
              Start
            </a>
            <button
              type="button"
              className="rounded-full p-2 text-cream/60 transition hover:bg-white/10 hover:text-cream"
              aria-label="Hide monthly leak total"
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
