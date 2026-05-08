import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CinematicFunnelSection } from '../components/CinematicFunnelSection'
import { IntegrationLogoStrip } from '../components/IntegrationLogoStrip'
import { MarketingHeader } from '../components/MarketingHeader'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { SiteFooter } from '../components/SiteFooter'
import { TrustStrip } from '../components/TrustStrip'
import { BOOK_DEMO_URL } from '../constants'

const CTA_MEDIA = '/media/home-cta.svg'
const HERO_BACKGROUND_VIDEO_URL =
  'https://cdn.shopify.com/videos/c/o/v/9fe664570f2b4284a76f522f11fcf58a.mp4'

function withPreviewUrl(url: string, previewUrl: string) {
  const trimmed = previewUrl.trim()
  if (!trimmed) return url

  try {
    const target = new URL(url)
    target.searchParams.set('preview_url', trimmed)
    return target.toString()
  } catch {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}preview_url=${encodeURIComponent(trimmed)}`
  }
}

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
    body: 'Show revenue-ready moments detected, qualified visitors or customers, recovered actions, and stack-visible context.',
  },
] as const

const REVENUE_RECOVERY_USE_CASES = [
  {
    id: 'demo-recovery',
    theme: 'purple',
    status: 'Core workflow',
    title: 'Demo Recovery',
    headline: 'Recover demo-ready visitors and route the next action.',
    sectionHeadline: 'Give high-intent visitors a demo trailer before they leave.',
    body: 'High-intent visitors get approved-source answers, qualification, the right next step, and stack-visible context.',
    bullets: [
      'Pricing, demo, comparison, security, docs, and stack-fit pages.',
      'Approved-source answers and qualification before calendar handoff.',
      'Recovered actions measured across the stack.',
    ],
    cta: 'Open walkthrough',
    to: '#demo-recovery',
    caseStudyTitle: 'Use case: SEO subscription recovery',
    caseStudy:
      'An SEO subscription company gets steady traffic to pricing, comparison, and security pages, but too many ready buyers leave before the next step. SentientWeb recognizes the revenue-ready path, answers the final buying questions, confirms fit, opens the right workflow, and sends the team the page path, answers, and suggested opener before the handoff.',
    outcome: 'The visitor books while the buying context is still fresh.',
    flow: [
      { label: 'Intent page', detail: 'Pricing, demo, security, or comparison behavior is detected.' },
      { label: 'Demo preview', detail: 'The visitor gets a tailored product walkthrough from approved content.' },
      { label: 'Qualification', detail: 'Role, company domain, use case, timeline, and stack fit are captured.' },
      { label: 'Booked handoff', detail: 'The meeting opens and the CRM receives the full context packet.' },
    ],
  },
  {
    id: 'failed-payment-recovery',
    theme: 'blue',
    status: 'Payment recovery',
    title: 'Failed Payment Recovery',
    headline: 'Stop failed payments and cancellation risk from becoming silent churn.',
    sectionHeadline: 'Recover payment and cancellation risk before revenue walks away.',
    body: 'Payment failures and cancellation signals are classified by reason, routed by risk, handled with approved fixes, retried when appropriate, and logged in CRM.',
    bullets: [
      'Auto-send approved fixes for low-risk failures.',
      'Owner task for high-value or ambiguous accounts.',
      'Save, retry, cancellation, and write-off outcome logging.',
    ],
    cta: 'Discuss pilot',
    to: '#failed-payment-recovery',
    caseStudyTitle: 'Use case: SEO SaaS subscription recovery',
    caseStudy:
      'An SEO SaaS team sees customers cancel after billing friction, card failures, and unclear plan value. SentientWeb classifies the reason, sends the approved fix or value reminder, escalates high-value accounts to an owner, triggers the right retry or save path, and records the save, cancellation, retry, or write-off outcome.',
    outcome: 'The team acts before payment friction becomes avoidable churn.',
    flow: [
      { label: 'Risk signal', detail: 'A failed charge, renewal issue, or cancellation request enters recovery.' },
      { label: 'Reason route', detail: 'Rules separate billing friction, plan confusion, low-value accounts, and urgent saves.' },
      { label: 'Approved action', detail: 'The right message, retry, task, save path, or owner escalation is triggered.' },
      { label: 'Outcome sync', detail: 'Save, retry, cancellation, and write-off outcomes are written back to CRM.' },
    ],
  },
  {
    id: 'no-show-recovery',
    theme: 'yellow',
    status: 'Meeting recovery',
    title: 'No-Show Recovery',
    headline: 'Keep booked demos from going quiet.',
    sectionHeadline: 'Recover no-shows while the buying context is still usable.',
    body: 'Use demo-preview context, reminders, and reschedule paths to reduce no-shows without sending generic follow-up.',
    bullets: [
      'Contextual reminders from the original buyer conversation.',
      'Reschedule path for prospects who miss the first slot.',
      'Owner escalation for high-intent accounts.',
    ],
    cta: 'Discuss pilot',
    to: '#no-show-recovery',
    caseStudyTitle: 'Use case: demo no-show recovery',
    caseStudy:
      'A sales-led SaaS team books qualified demos from pricing traffic, but some buyers miss the meeting after comparing vendors. SentientWeb uses the original buying context to send a relevant reminder, offers a reschedule path, and alerts the owner when the account still shows high intent.',
    outcome: 'The missed meeting becomes a recoverable handoff instead of a dead lead.',
    flow: [
      { label: 'Booked demo', detail: 'The meeting is tied to the visitor conversation and page history.' },
      { label: 'Context reminder', detail: 'Follow-up references the reason they booked and the next step.' },
      { label: 'Reschedule path', detail: 'The visitor gets a low-friction route back to the calendar.' },
      { label: 'Owner alert', detail: 'High-intent no-shows reach a person with the full context preserved.' },
    ],
  },
  {
    id: 'buyer-insights',
    theme: 'pink',
    status: 'Revenue insights',
    title: 'Buyer Insights',
    headline: 'Turn quiet buyer moments into weekly revenue insight.',
    sectionHeadline: 'Turn buyer hesitation into weekly revenue repair work.',
    body: 'Conversation and recovery data becomes objections, pricing friction, ICP signals, feature requests, and page-level repair work.',
    bullets: [
      'Objections and friction by page.',
      'ICP, role, use-case, and urgency patterns.',
      'Weekly recovery report for founder, sales, and RevOps review.',
    ],
    cta: 'Discuss pilot',
    to: '#buyer-insights',
    caseStudyTitle: 'Use case: buyer objection intelligence',
    caseStudy:
      'A subscription business hears scattered objections about pricing, implementation, security, renewals, and cancellation risk, but the patterns are buried in chat logs, missed meetings, and disconnected systems. SentientWeb groups the friction, highlights which page or workflow created the hesitation, and turns the pattern into sales follow-up, lifecycle updates, and weekly RevOps review.',
    outcome: 'The team sees why qualified buyers hesitate and what to repair next.',
    flow: [
      { label: 'Buyer signal', detail: 'Questions, exits, bookings, and no-shows are captured across high-intent pages.' },
      { label: 'Pattern grouping', detail: 'Objections are grouped by page, role, use case, urgency, and stack fit.' },
      { label: 'Weekly insight', detail: 'Sales, founder, and RevOps review the highest-value friction.' },
      { label: 'Repair loop', detail: 'Pages, playbooks, and handoff rules are updated from the evidence.' },
    ],
  },
] as const

type RevenueRecoveryUseCase = (typeof REVENUE_RECOVERY_USE_CASES)[number]

const USE_CASE_THEME_CLASS: Record<RevenueRecoveryUseCase['theme'], string> = {
  purple: 'use-case-theme--purple',
  blue: 'use-case-theme--blue',
  yellow: 'use-case-theme--yellow',
  pink: 'use-case-theme--pink',
}

function getUseCaseThemeClass(useCase: RevenueRecoveryUseCase) {
  return USE_CASE_THEME_CLASS[useCase.theme]
}

type UseCaseStoryboardContext = {
  url: string
  previewUrl: string
  persona: string
  buyerQuestion: string
  aiAnswer: string
  role: string
  useCase: string
  timeline: string
  stack: string
  score: string
  ctaLabel: string
  outcomeSurface: string
  outcomeTitle: string
  crmRows: ReadonlyArray<{ label: string; value: string }>
}

const USE_CASE_STORYBOARD_CONTEXT = {
  'demo-recovery': {
    url: 'yourcompany.com/pricing',
    previewUrl: 'yourcompany.com/recovery-preview',
    persona: 'Subscription buyer',
    buyerQuestion: 'Does this fit our CRM and reporting stack?',
    aiAnswer:
      'Yes. Here is the approved integration path and the workflow your revenue team already uses.',
    role: 'VP Marketing',
    useCase: 'Recover revenue-ready pricing traffic',
    timeline: 'This quarter',
    stack: 'CRM, website, scheduler',
    score: '82',
    ctaLabel: 'Estimate recoverable demo revenue in the last 30 days',
    outcomeSurface: 'Scheduler',
    outcomeTitle: 'Meeting path opened',
    crmRows: [
      { label: 'Pages', value: 'Pricing, comparison, security' },
      { label: 'Need', value: 'Recover revenue-ready traffic' },
      { label: 'Objection', value: 'CRM and reporting stack' },
      { label: 'Opener', value: 'Lead with approved workflow context' },
    ],
  },
  'failed-payment-recovery': {
    url: 'yourcompany.com/billing/retry',
    previewUrl: 'yourcompany.com/save-path',
    persona: 'At-risk customer',
    buyerQuestion: 'Can I fix billing without losing my workspace?',
    aiAnswer:
      'Yes. Here is the approved retry path, plan reminder, and owner escalation rule for this account.',
    role: 'Account owner',
    useCase: 'Resolve payment friction before churn',
    timeline: 'Before renewal closes',
    stack: 'Billing, CRM, email',
    score: '76',
    ctaLabel: 'Estimate recoverable failed-payment revenue in the last 30 days',
    outcomeSurface: 'Billing',
    outcomeTitle: 'Save path opened',
    crmRows: [
      { label: 'Signal', value: 'Failed charge and cancel intent' },
      { label: 'Reason', value: 'Billing friction, not product rejection' },
      { label: 'Action', value: 'Retry path plus owner task' },
      { label: 'Outcome', value: 'Save, retry, or write-off synced' },
    ],
  },
  'no-show-recovery': {
    url: 'yourcompany.com/calendar/demo',
    previewUrl: 'yourcompany.com/reschedule',
    persona: 'No-show prospect',
    buyerQuestion: 'Can we pick this back up without starting over?',
    aiAnswer:
      'Yes. Here is the original buying context, the reason you booked, and a low-friction reschedule path.',
    role: 'Marketing leader',
    useCase: 'Recover missed demo from high intent',
    timeline: 'Same week',
    stack: 'Scheduler, CRM, email',
    score: '79',
    ctaLabel: 'Estimate recoverable no-show revenue in the last 30 days',
    outcomeSurface: 'Scheduler',
    outcomeTitle: 'Meeting rescheduled',
    crmRows: [
      { label: 'Context', value: 'Original page path and reason booked' },
      { label: 'Reminder', value: 'References comparison-page concern' },
      { label: 'Route', value: 'Reschedule plus owner alert' },
      { label: 'Next', value: 'Sales opens with preserved context' },
    ],
  },
  'buyer-insights': {
    url: 'yourcompany.com/security',
    previewUrl: 'yourcompany.com/revops-review',
    persona: 'Revenue team',
    buyerQuestion: 'Why do qualified buyers hesitate before booking?',
    aiAnswer:
      'The pattern is implementation risk on security and pricing pages, concentrated among mid-market buyers.',
    role: 'Founder / RevOps',
    useCase: 'Find recurring buyer hesitation',
    timeline: 'Weekly review',
    stack: 'CRM, analytics, website',
    score: '91',
    ctaLabel: 'Discover hidden buyer-intent revenue in the last 30 days',
    outcomeSurface: 'RevOps',
    outcomeTitle: 'Repair work queued',
    crmRows: [
      { label: 'Pattern', value: 'Security and implementation objections' },
      { label: 'Segment', value: 'Mid-market buyers comparing vendors' },
      { label: 'Repair', value: 'Page copy and playbook update' },
      { label: 'Review', value: 'Weekly founder and RevOps agenda' },
    ],
  },
} as const satisfies Record<RevenueRecoveryUseCase['id'], UseCaseStoryboardContext>

type LeakClockEstimate = {
  usAnnualLeakUsd: number
  typicalAnnualLeakUsd: number
  sourceLabel: string
  methodology: string
}

const LEAK_CLOCK_ESTIMATES = {
  saas: {
    usAnnualLeakUsd: 35_000_000_000,
    typicalAnnualLeakUsd: 180_000,
    sourceLabel: 'Modeled from US SaaS revenue and speed-to-lead decay research.',
    methodology:
      'Uses US SaaS revenue benchmarks and a conservative modeled share of inbound demo pipeline lost to slow routing, weak response loops, and delayed handoff.',
  },
} as const satisfies Record<'saas', LeakClockEstimate>

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

function HeroBackgroundVideo({ reducedMotion }: { reducedMotion: boolean }) {
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

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <div className="ambient-video-fallback absolute inset-0 h-full w-full" />
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            canPlay ? 'opacity-70' : 'opacity-0'
          }`}
          src={HERO_BACKGROUND_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          data-hero-background-video
          onCanPlay={() => setCanPlay(true)}
          onError={() => setHasError(true)}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_42%,rgba(0,0,0,0.08),rgba(1,3,13,0.62)_58%,rgba(1,3,13,0.9)_100%)]" />
    </div>
  )
}

function UseCaseStoryboardVisual({
  useCase,
  stepIndex,
}: {
  useCase: RevenueRecoveryUseCase
  stepIndex: number
}) {
  const context = USE_CASE_STORYBOARD_CONTEXT[useCase.id]

  if (stepIndex === 0) {
    return (
      <div className="use-case-storyboard__pricing">
        <div className="use-case-storyboard__mock-copy">
          <p>{context.persona}</p>
          <strong>{useCase.title}</strong>
          <span />
          <span />
          <span />
        </div>
        <Link to="/#recovery-preview-panel" className="ai-rainbow-cta use-case-storyboard__cta-button">
          <span className="ai-rainbow-cta__label use-case-storyboard__cta-label">
            {context.ctaLabel}
          </span>
        </Link>
      </div>
    )
  }

  if (stepIndex === 1) {
    return (
      <div className="use-case-storyboard__preview">
        <div className="use-case-storyboard__play" aria-hidden />
        <div className="use-case-storyboard__chat">
          <p>{context.buyerQuestion}</p>
          <p>{context.aiAnswer}</p>
        </div>
      </div>
    )
  }

  if (stepIndex === 2) {
    return (
      <div className="use-case-storyboard__qualification">
        <div className="use-case-storyboard__fields">
          <span>
            <b>Role</b>
            {context.role}
          </span>
          <span>
            <b>Use case</b>
            {context.useCase}
          </span>
          <span>
            <b>Timeline</b>
            {context.timeline}
          </span>
          <span>
            <b>Stack</b>
            {context.stack}
          </span>
        </div>
        <div className="use-case-storyboard__score" aria-label={`Recover up to fit score ${context.score}`}>
          <span>Recover up to</span>
          <strong>{context.score}</strong>
        </div>
      </div>
    )
  }

  return (
    <div className="use-case-storyboard__handoff">
      <div className="use-case-storyboard__calendar">
        <span>{context.outcomeSurface}</span>
        <strong>{context.outcomeTitle}</strong>
        <small>Context attached</small>
      </div>
      <div className="use-case-storyboard__crm">
        {context.crmRows.map((row) => (
          <span key={row.label}>
            <b>{row.label}</b>
            {row.value}
          </span>
        ))}
      </div>
    </div>
  )
}

function UseCaseStoryboard({ useCase }: { useCase: RevenueRecoveryUseCase }) {
  const context = USE_CASE_STORYBOARD_CONTEXT[useCase.id]
  const isLightSection = useCase.id === 'demo-recovery' || useCase.id === 'no-show-recovery'

  return (
    <div className={`use-case-storyboard ${getUseCaseThemeClass(useCase)}`}>
      <ol className="use-case-storyboard__panels" aria-label={`${useCase.title} storyboard`}>
        {useCase.flow.map((step, index) => (
          <li key={step.label} className="use-case-storyboard__panel">
            <div className="use-case-storyboard__browser">
              <div className="use-case-storyboard__bar">
                <span />
                <span />
                <span />
                <p>{index === 0 ? context.url : index === 1 ? context.previewUrl : step.label}</p>
              </div>
              <div className="use-case-storyboard__screen">
                <UseCaseStoryboardVisual useCase={useCase} stepIndex={index} />
              </div>
            </div>
            <div className="use-case-storyboard__caption">
              <span className="use-case-storyboard__number">
                {index + 1}
              </span>
              <h4
                className={`font-grotesk text-[14px] uppercase leading-tight sm:text-[17px] ${
                  isLightSection ? 'text-[#10213c]' : 'text-cream'
                }`}
              >
                {step.label}
              </h4>
              <p
                className={`font-mono mt-2 text-[11px] normal-case leading-relaxed sm:text-[12px] ${
                  isLightSection ? 'text-[#10213c]/62' : 'text-cream/62'
                }`}
              >
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function UseCaseDetailSection({
  useCase,
  children,
}: {
  useCase: RevenueRecoveryUseCase
  children?: ReactNode
}) {
  const headingId = `${useCase.id}-heading`
  const isLightSection = useCase.id === 'demo-recovery' || useCase.id === 'no-show-recovery'

  return (
    <section
      id={useCase.id}
      className={`scroll-mt-28 py-16 sm:py-20 md:py-24 ${getUseCaseThemeClass(useCase)} ${
        isLightSection ? 'section-light-editorial use-case-section-light' : 'border-t border-white/10 bg-background'
      }`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="use-case-accent-text font-mono mb-3 text-[11px] uppercase tracking-widest sm:text-[12px]">
              {useCase.status}
            </p>
            <h2
              id={headingId}
              className="section-heading font-grotesk max-w-[960px] text-[30px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px]"
            >
              {useCase.sectionHeadline}
            </h2>
            <p className="section-copy font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              {useCase.body}
            </p>
            <ul className="editorial-soft mt-6 space-y-2 font-mono text-[12px] uppercase leading-relaxed text-cream/58">
              {useCase.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <article
            className={`${isLightSection ? 'editorial-panel-strong' : 'liquid-glass'} rounded-[26px] p-5 sm:p-6`}
          >
            <p className="use-case-accent-pill font-mono inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest">
              Use case
            </p>
            <h3
              className={`font-grotesk mt-5 text-[18px] uppercase leading-tight sm:text-[22px] ${
                isLightSection ? 'text-[#10213c]' : 'text-cream'
              }`}
            >
              {useCase.caseStudyTitle}
            </h3>
            <p
              className={`font-mono mt-4 text-[12px] normal-case leading-relaxed sm:text-[13px] ${
                isLightSection ? 'editorial-muted' : 'text-cream/70'
              }`}
            >
              {useCase.caseStudy}
            </p>
            <p
              className={`use-case-accent-text font-mono mt-4 border-t pt-4 text-[11px] uppercase leading-relaxed ${
                isLightSection ? 'editorial-rule' : 'border-white/10'
              }`}
            >
              Ideal outcome: {useCase.outcome}
            </p>
          </article>
        </div>

        <div className="mt-8">
          <UseCaseStoryboard useCase={useCase} />
        </div>

        {children}
      </div>
    </section>
  )
}

function LeakClockMethodology() {
  const estimate = LEAK_CLOCK_ESTIMATES.saas

  return (
    <details className="liquid-glass mt-8 rounded-[20px] p-5 sm:p-6">
      <summary className="cursor-pointer list-none font-grotesk text-[15px] uppercase tracking-wide text-cream [&::-webkit-details-marker]:hidden">
        How this recovery estimate is modeled
      </summary>
      <article className="mt-5 border-t border-white/10 pt-4">
        <h3 className="font-grotesk text-[13px] uppercase tracking-wide text-neon">
          Revenue recovery
        </h3>
        <p className="font-mono mt-2 text-[11px] uppercase leading-relaxed text-cream/55">
          {estimate.sourceLabel}
        </p>
        <p className="font-mono mt-2 text-[12px] normal-case leading-relaxed text-cream/70">
          {estimate.methodology}
        </p>
      </article>
      <p className="font-mono mt-5 border-t border-white/10 pt-4 text-[11px] uppercase leading-relaxed text-cream/45">
        This is a directional estimate for revenue recovery, not an audited financial claim
        or product commitment.
      </p>
    </details>
  )
}

export default function HomePage() {
  const { pathname, hash } = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [previewUrl, setPreviewUrl] = useState('')
  const previewBookingUrl = withPreviewUrl(BOOK_DEMO_URL, previewUrl)

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
          <HeroBackgroundVideo reducedMotion={prefersReducedMotion} />

          <div className="relative z-10 flex min-h-screen flex-col">
            <MarketingHeader layout="hero" />

            <div className="mx-auto flex w-full max-w-[1831px] flex-1 flex-col justify-center px-4 pb-16 pt-10 sm:px-6 md:px-8 lg:px-10 lg:pb-24">
              <div className="relative max-w-[880px] lg:ml-16 xl:ml-32">
                <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  SentientWeb
                </p>
                <h1
                  id="hero-heading"
                  className="font-grotesk uppercase leading-[1.05] text-cream sm:leading-none text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]"
                >
                  Revenue recovery orchestration for modern subscription businesses.
                </h1>
                <p className="mt-8 max-w-[540px] font-sans text-[15px] normal-case leading-relaxed text-cream sm:text-[16px] md:text-[17px]">
                  SentientWeb finds revenue leaks across your website, billing, CRM, scheduler,
                  and messaging stack, then calls the right tool to recover the moment.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={BOOK_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  >
                    Book a revenue recovery pilot
                  </a>
                  <a
                    href="#features"
                    className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
                  >
                    See the recovery flow
                  </a>
                </div>
                <TrustStrip className="mt-8 max-w-[880px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Revenue recovery use cases */}
        <section
          id="revenue-recovery-use-cases"
          className="bg-background"
          aria-labelledby="revenue-recovery-use-cases-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 lg:py-24 xl:py-32">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <div className="shrink-0">
                <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  Revenue recovery use cases
                </p>
                <h2
                  id="revenue-recovery-use-cases-heading"
                  className="font-grotesk uppercase leading-none text-cream text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
                >
                  Recover revenue when intent already exists.
                </h2>
                <p className="mt-5 max-w-3xl font-sans text-[15px] normal-case leading-relaxed text-cream/72 sm:text-[16px]">
                  Focus on buyers, prospects, and customers who already showed intent, then went
                  quiet before the next revenue step.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {REVENUE_RECOVERY_USE_CASES.map((useCase) => (
                <article
                  key={useCase.title}
                  className={`liquid-glass use-case-card rounded-[24px] p-5 sm:p-6 ${getUseCaseThemeClass(useCase)}`}
                >
                  <p className="use-case-accent-pill font-mono inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest">
                    {useCase.status}
                  </p>
                  <h3 className="font-grotesk mt-5 text-[18px] uppercase leading-tight text-cream sm:text-[20px]">
                    {useCase.title}
                  </h3>
                  <p className="font-grotesk mt-3 text-[20px] uppercase leading-tight text-cream sm:text-[24px]">
                    {useCase.headline}
                  </p>
                  <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/68 sm:text-[13px]">
                    {useCase.body}
                  </p>
                  <ul className="mt-5 space-y-2 font-mono text-[11px] uppercase leading-relaxed text-cream/62">
                    {useCase.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    to={useCase.to}
                    className="use-case-accent-link font-grotesk mt-6 inline-flex text-[12px] uppercase tracking-wide transition hover:text-cream"
                  >
                    {useCase.cta}
                  </Link>
                </article>
              ))}
            </div>
            <LeakClockMethodology />
          </div>
        </section>

        {/* Recovery preview */}
        <section
          id="instant-demo-preview"
          className="recovery-preview-spotlight section-light-editorial scroll-mt-28 py-16 sm:py-20"
          aria-labelledby="instant-demo-preview-heading"
        >
          <div className="recovery-preview-shell mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div
              className="recovery-preview-cta"
              aria-labelledby="instant-demo-preview-heading"
            >
              <div className="recovery-preview-headline-grid">
                <div>
                  <p className="recovery-preview-kicker section-kicker font-mono">
                    Recovery Preview
                  </p>
                  <h2 id="instant-demo-preview-heading" className="recovery-preview-heading">
                    Find the demo-intent leak on your own site.
                  </h2>
                  <span className="recovery-preview-script" aria-hidden="true">
                    Scan your URL
                  </span>
                </div>
                <p className="recovery-preview-deck">
                  Paste a pricing, demo, checkout, billing, account, or comparison page.
                  SentientWeb maps where ready customers and buyers go quiet before they book.
                </p>
              </div>

              <div
                id="recovery-preview-panel"
                className="recovery-preview-cockpit scroll-mt-28"
              >
                <div className="recovery-preview-cockpit-content">
                  <div className="recovery-preview-cockpit-top">
                    <span className="recovery-preview-console-label">
                      URL scanner console + sample output
                    </span>
                    <span className="recovery-preview-scanner-pulse">Ready to analyze</span>
                  </div>

                  <div className="recovery-preview-primary-row">
                    <label className="recovery-preview-url-field" htmlFor="preview-url">
                      <span className="recovery-preview-field-label">
                        Company website or pricing page URL
                      </span>
                      <input
                        id="preview-url"
                        type="url"
                        inputMode="url"
                        placeholder="https://yourcompany.com/pricing"
                        value={previewUrl}
                        onChange={(event) => setPreviewUrl(event.target.value)}
                        aria-describedby="preview-url-help"
                        className="recovery-preview-url-input"
                      />
                    </label>
                    <a
                      href={previewBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={previewUrl.trim() ? `Scan my page for ${previewUrl.trim()}` : 'Scan my page'}
                      className="recovery-preview-scan-button"
                    >
                      Scan my page
                    </a>
                  </div>

                  <div className="recovery-preview-chips" aria-label="Supported page types">
                    <span>Pricing pages</span>
                    <span>Demo pages</span>
                    <span>Comparison pages</span>
                    <span>Billing pages</span>
                    <span>Checkout pages</span>
                  </div>

                  <div className="recovery-preview-output" aria-label="Sample recovery preview output">
                    <div className="recovery-preview-output-title">
                      <p>Sample output</p>
                      <h3>
                        <span>Detected</span>
                        <span>demo-intent leak</span>
                      </h3>
                    </div>
                    <div className="recovery-preview-result-rows">
                      <div>
                        <span>Page</span>
                        <span>Pricing page with comparison-page follow-up.</span>
                      </div>
                      <div>
                        <span>Likely issue</span>
                        <span>
                          Ready buyers leave before seeing fit, security, and integration proof.
                        </span>
                      </div>
                      <div>
                        <span>Preview</span>
                        <span>Recovery path, objection pattern, and booking handoff.</span>
                      </div>
                    </div>
                    <div className="recovery-preview-proof-stack">
                      <div>
                        <strong>01</strong>
                        <span>Page path captured</span>
                      </div>
                      <div>
                        <strong>02</strong>
                        <span>Buyer objection mapped</span>
                      </div>
                      <div>
                        <strong>03</strong>
                        <span>Recovery route proposed</span>
                      </div>
                    </div>
                  </div>

                  <p id="preview-url-help" className="recovery-preview-bottom-note">
                    <span>
                      <strong>Safe by default:</strong> public pages only, no gated crawl, no
                      internal hosts.
                    </span>
                    <span>Add the URL so the recovery preview carries the right page context.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CinematicFunnelSection />

        {REVENUE_RECOVERY_USE_CASES.map((useCase) => (
          <UseCaseDetailSection key={useCase.id} useCase={useCase}>
            {useCase.id === 'demo-recovery' ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                {DEMO_RECOVERY_MODULES.map((module) => (
                  <article
                    key={module.title}
                    className="editorial-panel rounded-[18px] p-5 transition hover:bg-white/70 sm:p-6"
                  >
                    <h3 className="font-grotesk text-[17px] uppercase leading-tight text-[#10213c] sm:text-[19px]">
                      {module.title}
                    </h3>
                    <p className="editorial-muted font-mono mt-4 text-[12px] normal-case leading-relaxed sm:text-[13px]">
                      {module.body}
                    </p>
                  </article>
                ))}
              </div>
            ) : null}
          </UseCaseDetailSection>
        ))}

        <IntegrationLogoStrip />

        {/* CTA video + closing */}
        <section className="relative w-full bg-background" aria-labelledby="cta-heading">
          <AmbientVideo
            className="relative block min-h-[520px] w-full overflow-hidden sm:aspect-video sm:min-h-0"
            mediaSrc={CTA_MEDIA}
            reducedMotion={prefersReducedMotion}
          />
          <div className="absolute inset-0 z-10 bg-background/45" aria-hidden />

          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="pointer-events-auto absolute top-1/2 right-0 w-full -translate-y-1/2 px-6 text-right sm:px-10 lg:pl-[15%] lg:pr-[20%]">
              <div className="relative ml-auto inline-block max-w-4xl">
                <p
                  className="font-condiment pointer-events-none absolute -left-2 -top-8 z-10 text-[17px] text-neon mix-blend-exclusion sm:-top-10 sm:text-[28px] md:-top-14 md:text-[44px] lg:-left-[216px] lg:-top-16 lg:text-[56px] xl:text-[68px] normal-case"
                  aria-hidden
                >
                  Your Stack, Orchestrated.
                </p>
                <h2
                  id="cta-heading"
                  className="font-grotesk uppercase leading-tight text-cream text-[18px] sm:text-[32px] md:text-[44px] lg:text-[52px] xl:text-[60px]"
                >
                  <span className="mb-4 block text-[14px] sm:mb-6 sm:text-[20px] md:mb-8 md:text-[26px] lg:mb-10 lg:ml-20 lg:text-[30px] xl:ml-28 xl:text-[34px]">
                    Your stack stays. SentientWeb orchestrates it.
                  </span>
                  <span className="mb-5 block font-condiment text-[21px] normal-case leading-tight text-neon sm:mb-7 sm:text-[32px] md:text-[44px] lg:text-[52px]">
                    Backend revenue recovery service that calls your CRM, billing, scheduler, and messaging tools to complete the next business action.
                  </span>
                </h2>
                <p className="mb-6 font-mono text-[11px] normal-case text-cream/70 sm:mb-8 sm:text-[13px] md:text-[14px]">
                  Keep the SaaS tools you already use. Add the orchestration layer above them.
                </p>
                <div className="flex flex-wrap justify-end gap-4">
                  <a
                    href={BOOK_DEMO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-neon px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background transition hover:brightness-110 sm:px-8 sm:text-[13px]"
                  >
                    Book a revenue recovery review
                  </a>
                  <Link
                    to="/orchestrate"
                    className="liquid-glass inline-block rounded-full px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:px-8 sm:text-[13px]"
                  >
                    See stack orchestration
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue recovery fit */}
        <section
          className="section-light-editorial py-16 sm:py-20"
          aria-labelledby="revenue-recovery-fit-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <p className="section-kicker font-mono mb-3 text-[11px] uppercase tracking-widest sm:text-[12px]">
              Revenue recovery fit
            </p>
            <h2
              id="revenue-recovery-fit-heading"
              className="section-heading font-grotesk max-w-[900px] text-[30px] uppercase leading-tight sm:text-[42px] md:text-[52px]"
            >
              Built for subscription businesses with revenue moments to recover.
            </h2>
            <p className="section-copy font-mono mt-5 max-w-3xl text-[13px] uppercase leading-relaxed sm:text-[14px]">
              SentientWeb works across pricing, demo, checkout, billing, account, docs, security,
              comparison, and integration traffic, then uses the connected stack to complete the
              right revenue action.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Buyer pages',
                  body: 'Pricing, demo, comparison, docs, security, and integration pages already attract buyers.',
                },
                {
                  title: 'Execution paths',
                  body: 'Schedulers, routers, billing tools, workflows, and handoffs become surfaces SentientWeb can call.',
                },
                {
                  title: 'Stack context',
                  body: 'Recovered moments carry contact, account, subscription, qualification, and conversation context.',
                },
                {
                  title: 'Operational review',
                  body: 'Founder, growth, sales, support, finance, or RevOps can review recovered actions and weekly patterns.',
                },
              ].map((item) => (
                <article key={item.title} className="editorial-panel rounded-[18px] p-5 sm:p-6">
                  <h3 className="font-grotesk text-[17px] uppercase leading-tight text-[#10213c] sm:text-[19px]">
                    {item.title}
                  </h3>
                  <p className="editorial-muted font-mono mt-3 text-[12px] normal-case leading-relaxed sm:text-[13px]">
                    {item.body}
                  </p>
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
