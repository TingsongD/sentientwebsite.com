import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FUNNEL_FEATURE_GROUPS,
  funnelFeatureId,
  funnelGroupId,
  type FunnelFeature,
  type FunnelFeatureGroup,
} from '../data/homeFeatures'
import { SAAS_RECOVERY_TARGETS } from '../data/saasRecoveryTargets'

type FunnelSectionKey = 'top' | 'mid' | 'bottom'

type CinematicMeta = {
  chip: string
  signals: readonly [string, string, string]
  word: string
}

type CinematicStep = {
  body: string
  chip: string
  featureId: string
  globalIndex: number
  section: FunnelSectionKey
  sectionFeatureIndex: number
  signals: readonly [string, string, string]
  stage: string
  title: string
  word: string
}

type Particle = {
  id: string
  isGreen: boolean
}

const FEATURE_META: Record<string, CinematicMeta> = {
  'High-intent page detection': {
    chip: 'Intent detected',
    signals: ['Pricing', 'Demo', 'Security'],
    word: 'Detect',
  },
  'Recovery Preview': {
    chip: 'Preview requested',
    signals: ['Public URL', 'Recovery map', 'Website scan'],
    word: 'Preview',
  },
  'Page recovery surfaces': {
    chip: 'Surface matched',
    signals: ['Comparison', 'Stack fit', 'Customer story'],
    word: 'Surface',
  },
  'Business-goal orchestration': {
    chip: 'Goal routed',
    signals: ['Website', 'Billing', 'CRM'],
    word: 'Focus',
  },
  'Page-specific AI engagement': {
    chip: 'AI engaged',
    signals: ['Plan fit', 'ROI', 'Stack fit'],
    word: 'Engage',
  },
  'Approved-source answers': {
    chip: 'Source approved',
    signals: ['Trust', 'Security', 'Buyer question'],
    word: 'Answer',
  },
  'Qualification questions': {
    chip: 'Fit qualified',
    signals: ['Role', 'Use case', 'Timeline'],
    word: 'Qualify',
  },
  'Human handoff': {
    chip: 'Human routed',
    signals: ['High value', 'Sensitive', 'Full context'],
    word: 'Handoff',
  },
  'Stack context': {
    chip: 'Stack connected',
    signals: ['CRM', 'Scheduler', 'Install path'],
    word: 'Context',
  },
  'Scheduler and workflow actions': {
    chip: 'Action opened',
    signals: ['Scheduler', 'Workflow', 'Handoff path'],
    word: 'Book',
  },
  'CRM context sync': {
    chip: 'CRM synced',
    signals: ['Behavior', 'Answers', 'Booking'],
    word: 'Sync',
  },
  'Text and email reminders': {
    chip: 'Reminder sent',
    signals: ['Text', 'Email', 'Meeting link'],
    word: 'Nudge',
  },
  'Recovered demo reporting': {
    chip: 'Demo recovered',
    signals: ['Detected', 'Qualified', 'Booked'],
    word: 'Report',
  },
  'ROI calculator': {
    chip: 'ROI modeled',
    signals: ['Recovered demos', 'Pipeline', 'Traffic'],
    word: 'Model',
  },
  'Voice feedback add-on': {
    chip: 'Voice captured',
    signals: ['No-book', 'No-show', 'Churn risk'],
    word: 'Listen',
  },
}

const PARTICLES: readonly Particle[] = [
  ...Array.from({ length: 30 }, (_, index): Particle => ({ id: `top-${index}`, isGreen: false })),
  ...Array.from({ length: 24 }, (_, index): Particle => ({ id: `green-${index}`, isGreen: true })),
]

function sectionKeyForGroup(group: FunnelFeatureGroup, index: number): FunnelSectionKey {
  if (group.stage.toLowerCase().startsWith('top')) return 'top'
  if (group.stage.toLowerCase().startsWith('mid')) return 'mid'
  if (group.stage.toLowerCase().startsWith('bottom')) return 'bottom'
  return index === 0 ? 'top' : index === 1 ? 'mid' : 'bottom'
}

function stageLabel(section: FunnelSectionKey): string {
  if (section === 'top') return 'Top of funnel'
  if (section === 'mid') return 'Middle funnel'
  return 'Bottom funnel'
}

function fallbackMeta(feature: FunnelFeature): CinematicMeta {
  return {
    chip: 'Signal active',
    signals: ['Intent', 'Fit', 'Context'],
    word: feature.title.split(/\s+/)[0] || 'Signal',
  }
}

function buildSteps(): CinematicStep[] {
  const sectionCounts: Record<FunnelSectionKey, number> = { bottom: 0, mid: 0, top: 0 }
  let globalIndex = 0

  return FUNNEL_FEATURE_GROUPS.flatMap((group, groupIndex) => {
    const section = sectionKeyForGroup(group, groupIndex)

    return group.features.map((feature) => {
      const meta = FEATURE_META[feature.title] || fallbackMeta(feature)
      const step: CinematicStep = {
        body: feature.body,
        chip: meta.chip,
        featureId: funnelFeatureId(feature.title),
        globalIndex,
        section,
        sectionFeatureIndex: sectionCounts[section],
        signals: meta.signals,
        stage: group.stage,
        title: feature.title,
        word: meta.word,
      }

      globalIndex += 1
      sectionCounts[section] += 1
      return step
    })
  })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function CinematicFunnelSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const steps = useMemo(() => buildSteps(), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStep = steps[activeIndex] || steps[0]

  useEffect(() => {
    const section = sectionRef.current
    if (!section || steps.length === 0) return

    let frame = 0

    const render = () => {
      frame = 0

      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = clamp(-rect.top / scrollable, 0, 1)
      const nextIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length))
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex))
    }

    const requestRender = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render)
      }
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
    }
  }, [steps])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="cinematic-funnel scroll-mt-28"
      aria-labelledby="features-heading"
      data-active-step={activeIndex}
      data-active-section={activeStep.section}
    >
      <div className="cinematic-funnel-anchors" aria-hidden>
        {FUNNEL_FEATURE_GROUPS.map((group, groupIndex) => (
          <span
            key={group.stage}
            id={funnelGroupId(group.stage)}
            className={`cinematic-funnel-anchor cinematic-funnel-anchor-group-${groupIndex}`}
          />
        ))}
        {steps.map((step) => (
          <span
            key={step.featureId}
            id={step.featureId}
            className={`cinematic-funnel-anchor cinematic-funnel-anchor-step-${step.globalIndex}`}
          />
        ))}
      </div>

      <div className="cinematic-funnel-intro section-light-editorial">
        <div className="mx-auto max-w-[1120px]">
          <p className="section-kicker font-mono mb-3 text-[11px] uppercase tracking-widest sm:text-[12px]">
            Product
          </p>
          <h2
            id="features-heading"
            className="section-heading font-grotesk max-w-[1040px] text-[32px] uppercase leading-tight sm:text-[42px] md:text-[52px] lg:text-[60px]"
          >
            One operating layer from revenue intent to recovered action.
          </h2>
          <section
            className="relative left-1/2 mt-8 w-screen -translate-x-1/2 border-t border-[#10213c]/15 bg-white/30 px-4 py-10 sm:px-6 md:px-8 md:py-12 lg:px-10"
            aria-labelledby="homepage-recovery-targets-heading"
          >
            <div className="mx-auto max-w-[1120px]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker font-mono mb-3 text-[11px] uppercase tracking-widest sm:text-[12px]">
                    Modeled recovery targets
                  </p>
                  <h3
                    id="homepage-recovery-targets-heading"
                    className="section-heading font-grotesk max-w-[760px] text-[28px] uppercase leading-tight sm:text-[36px]"
                  >
                    What better recovery can move.
                  </h3>
                </div>
                <p className="editorial-soft font-mono max-w-[440px] text-[11px] uppercase leading-relaxed sm:text-[12px] md:text-right">
                  Modeled targets. Actual results depend on traffic quality, current conversion
                  rate, sales process, and implementation scope.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SAAS_RECOVERY_TARGETS.map((target) => (
                  <article
                    key={target.label}
                    className={`recovery-target-card recovery-target-card--${target.tone} liquid-glass rounded-[22px] p-5`}
                  >
                    <p className="recovery-target-card__stat font-grotesk uppercase leading-none">
                      <span>{target.stat}</span>{' '}
                      <span>{target.label}</span>
                    </p>
                    <p className="editorial-muted font-mono mt-3 text-[12px] normal-case leading-relaxed">
                      {target.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="cinematic-funnel-pin">
        <div className="cinematic-funnel-scene">
          <div className="cinematic-funnel-copy">
            <p className="cinematic-funnel-index">
              {String(activeStep.globalIndex + 1).padStart(2, '0')} / {stageLabel(activeStep.section)}
            </p>
            <h3 className="cinematic-funnel-word">{activeStep.word}</h3>
            <p className="cinematic-funnel-caption">
              <strong>{activeStep.title}.</strong> {activeStep.body}
            </p>
            <div className="cinematic-funnel-pills" aria-label="Current funnel signals">
              {activeStep.signals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>

          <div className="cinematic-funnel-stage" aria-hidden="true">
            <div className="cinematic-funnel-object">
              <div className="cinematic-funnel-halo" />
              <div className="cinematic-funnel-core">
                <div className="cinematic-funnel-ring cinematic-funnel-ring-top cinematic-funnel-ring-lip" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-top cinematic-funnel-ring-shoulder" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-top cinematic-funnel-ring-upper" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-mid cinematic-funnel-ring-waist" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-mid cinematic-funnel-ring-lower" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-bottom cinematic-funnel-ring-neck" />
                <div className="cinematic-funnel-ring cinematic-funnel-ring-bottom cinematic-funnel-ring-exit" />
              </div>

              {FUNNEL_FEATURE_GROUPS.map((group, groupIndex) => {
                const section = sectionKeyForGroup(group, groupIndex)

                return (
                  <div
                    key={group.stage}
                    className={`cinematic-funnel-labels cinematic-funnel-labels-${section}${
                      activeStep.section === section ? ' is-current' : ''
                    }`}
                  >
                    {steps
                      .filter((step) => step.section === section)
                      .map((step) => (
                        <span
                          key={step.title}
                          className={`cinematic-funnel-step${
                            activeStep.title === step.title ? ' is-active' : ''
                          }`}
                          data-num={String(step.globalIndex + 1).padStart(2, '0')}
                        >
                          {step.title}
                        </span>
                      ))}
                  </div>
                )
              })}

              <div className="cinematic-funnel-stream" data-testid="cinematic-funnel-particles">
                {PARTICLES.map((particle) => (
                  <span
                    key={particle.id}
                    className={`cinematic-funnel-dot${particle.isGreen ? ' is-green' : ''}`}
                  />
                ))}
              </div>

              <div className="cinematic-funnel-chip">
                <span>{activeStep.chip}</span>
                <span />
              </div>
            </div>
          </div>

          <aside className="cinematic-funnel-side" aria-label="Funnel state">
            <div className="cinematic-funnel-outcome">
              <small>
                Step {String(activeStep.globalIndex + 1).padStart(2, '0')} /{' '}
                {stageLabel(activeStep.section)}
              </small>
              <strong>{activeStep.title}</strong>
              <p>{activeStep.body}</p>
            </div>
            <div className="cinematic-funnel-rail" aria-label="Scroll chapters">
              <div>01 Top: intent capture</div>
              <div>02 Middle: fit qualified</div>
              <div>03 Bottom: demo booked</div>
            </div>
          </aside>
        </div>

        <div className="cinematic-funnel-scroll-hint">Scroll</div>
      </div>

      <div className="cinematic-funnel-mobile-list">
        {FUNNEL_FEATURE_GROUPS.map((group) => (
          <section key={group.stage} aria-label={group.stage}>
            <h3>{group.stage}</h3>
            <p>{group.summary}</p>
            <div>
              {group.features.map((feature) => (
                <article key={feature.title}>
                  <h4>{feature.title}</h4>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
