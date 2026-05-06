import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  FUNNEL_FEATURE_GROUPS,
  funnelFeatureId,
  funnelGroupId,
  type FunnelFeature,
  type FunnelFeatureGroup,
} from '../data/homeFeatures'

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
  color?: string
  duration: string
  glow?: string
  id: string
  isGreen?: boolean
  size: string
  x: string
  y: string
}

type CssVariableProperties = CSSProperties & Record<`--${string}`, string | number | undefined>

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
    signals: ['Comparison', 'Integration', 'Customer story'],
    word: 'Surface',
  },
  'B2B SaaS-only scope': {
    chip: 'Scope focused',
    signals: ['B2B SaaS', 'Demo intent', 'Buying pages'],
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
  'Integration context': {
    chip: 'Stack connected',
    signals: ['CRM', 'Scheduler', 'Install path'],
    word: 'Context',
  },
  'Calendly demo booking': {
    chip: 'Booking opened',
    signals: ['Calendar', 'Qualified', 'Meeting path'],
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

const TOP_PARTICLE_COLORS = [
  ['#55d6ff', 'rgba(85, 214, 255, 0.72)'],
  ['#4f8cff', 'rgba(79, 140, 255, 0.68)'],
  ['#a67cff', 'rgba(166, 124, 255, 0.7)'],
  ['#c06cff', 'rgba(192, 108, 255, 0.66)'],
  ['#ff4fd8', 'rgba(255, 79, 216, 0.62)'],
  ['#ff63c8', 'rgba(255, 99, 200, 0.62)'],
  ['#ff8a8a', 'rgba(255, 138, 138, 0.64)'],
  ['#ff5964', 'rgba(255, 89, 100, 0.6)'],
  ['#ff9a3d', 'rgba(255, 154, 61, 0.62)'],
  ['#ffce5c', 'rgba(255, 206, 92, 0.66)'],
  ['#fff06a', 'rgba(255, 240, 106, 0.62)'],
  ['#37f5d0', 'rgba(55, 245, 208, 0.66)'],
] as const

const PARTICLES: readonly Particle[] = [
  ...Array.from({ length: 30 }, (_, index): Particle => {
    const [color, glow] = TOP_PARTICLE_COLORS[index % TOP_PARTICLE_COLORS.length]
    return {
      color,
      duration: `${3.1 + (index % 5) * 0.28}s`,
      glow,
      id: `top-${index}`,
      size: `clamp(${4 + (index % 3)}px, ${0.48 + (index % 4) * 0.05}vw, ${8 + (index % 4)}px)`,
      x: `${7 + ((index * 12) % 82)}%`,
      y: `${2 + Math.floor(index / 6) * 8 + (index % 3)}%`,
    }
  }),
  ...Array.from({ length: 24 }, (_, index): Particle => ({
    duration: `${3.4 + (index % 4) * 0.34}s`,
    id: `green-${index}`,
    isGreen: true,
    size: `clamp(${4 + (index % 3)}px, ${0.46 + (index % 4) * 0.04}vw, ${8 + (index % 3)}px)`,
    x: `${28 + ((index * 9) % 44)}%`,
    y: `${43 + Math.floor(index / 4) * 8 + (index % 3)}%`,
  })),
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

function smoothstep(value: number) {
  const x = clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function proximity(value: number, center: number, radius: number) {
  return clamp(1 - Math.abs(value - center) / radius, 0, 1)
}

function particleStyle(particle: Particle, index: number): CSSProperties {
  const style: CssVariableProperties = {
    '--delay': `-${(0.16 + index * 0.26).toFixed(2)}s`,
    '--duration': particle.duration,
    '--s': particle.size,
    '--x': particle.x,
    '--y': particle.y,
  }

  if (particle.color) {
    style['--dot-color'] = particle.color
  }

  if (particle.glow) {
    style['--dot-glow'] = particle.glow
  }

  return style
}

function anchorStyle(index: number, total: number): CSSProperties {
  const top = total <= 1 ? 0 : (index / (total - 1)) * 100
  return { '--anchor-top': `${top}%` } as CssVariableProperties
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
      const topWeight = 0.16 + smoothstep(proximity(progress, 0.12, 0.34)) * 0.84
      const midWeight = 0.18 + smoothstep(proximity(progress, 0.48, 0.34)) * 0.82
      const bottomWeight = 0.2 + smoothstep(proximity(progress, 0.84, 0.34)) * 0.8

      section.style.setProperty('--progress', progress.toFixed(4))
      section.style.setProperty('--depth', progress.toFixed(4))
      section.style.setProperty('--topWeight', topWeight.toFixed(4))
      section.style.setProperty('--midWeight', midWeight.toFixed(4))
      section.style.setProperty('--bottomWeight', bottomWeight.toFixed(4))
      section.style.setProperty('--topFill', clamp(progress / 0.22, 0.12, 1).toFixed(4))
      section.style.setProperty('--midFill', clamp((progress - 0.26) / 0.34, 0.05, 1).toFixed(4))
      section.style.setProperty('--bottomFill', clamp((progress - 0.58) / 0.34, 0.04, 1).toFixed(4))

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
      data-active-section={activeStep.section}
    >
      <div className="cinematic-funnel-anchors" aria-hidden>
        {FUNNEL_FEATURE_GROUPS.map((group, groupIndex) => (
          <span
            key={group.stage}
            id={funnelGroupId(group.stage)}
            className="cinematic-funnel-anchor"
            style={anchorStyle(groupIndex, FUNNEL_FEATURE_GROUPS.length)}
          />
        ))}
        {steps.map((step) => (
          <span
            key={step.featureId}
            id={step.featureId}
            className="cinematic-funnel-anchor"
            style={anchorStyle(step.globalIndex, steps.length)}
          />
        ))}
      </div>

      <div className="cinematic-funnel-pin">
        <div className="cinematic-funnel-scene">
          <div className="cinematic-funnel-copy">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Product
            </p>
            <h2
              id="features-heading"
              className="font-grotesk max-w-[1040px] text-[32px] uppercase leading-tight text-cream sm:text-[42px] md:text-[52px] lg:text-[60px]"
            >
              One scroll from top-of-funnel intent to a booked demo.
            </h2>
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
                {PARTICLES.map((particle, index) => (
                  <span
                    key={particle.id}
                    className={`cinematic-funnel-dot${particle.isGreen ? ' is-green' : ''}`}
                    style={particleStyle(particle, index)}
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
