import { useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Network, Workflow } from 'lucide-react'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { RoiCalculatorCta } from '../components/RoiCalculatorCta'
import { BOOK_DEMO_URL } from '../constants'
import {
  ORCHESTRATE_NAV_LINKS,
  ORCHESTRATE_PATH,
  ORCHESTRATE_SECTIONS,
  type OrchestrateSection,
} from '../data/orchestratePageContent'

const OVERVIEW_SECTION = ORCHESTRATE_SECTIONS[0]
const STORY_SECTIONS = ORCHESTRATE_SECTIONS.slice(1, 3)
const TOOL_SECTIONS = ORCHESTRATE_SECTIONS.slice(3)

function SectionBullets({ bullets }: { bullets?: readonly string[] }) {
  if (!bullets?.length) return null

  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4 font-mono text-[12px] uppercase leading-relaxed text-cream/78"
        >
          {bullet}
        </li>
      ))}
    </ul>
  )
}

function ToolStorySection({
  section,
  index,
}: {
  section: OrchestrateSection
  index: number
}) {
  if (!section.toolStory) return null

  const storyItems = [
    ['Scenario', section.toolStory.scenario],
    ['SentientWeb decision', section.toolStory.decision],
    ['Tool action', section.toolStory.toolAction],
    ['Sales result', section.toolStory.result],
  ] as const

  return (
    <section
      id={section.id}
      data-testid="tool-story-section"
      className="scroll-mt-28 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] lg:grid lg:grid-cols-[0.42fr_0.58fr]"
      aria-labelledby={`${section.id}-heading`}
    >
      <div className="p-6 sm:p-8 lg:p-9">
        <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
          Story {String(index + 1).padStart(2, '0')} / {section.eyebrow}
        </p>
        <h3
          id={`${section.id}-heading`}
          className="font-grotesk mt-4 text-[26px] uppercase leading-tight text-cream sm:text-[34px] lg:text-[40px]"
        >
          {section.title}
        </h3>
        <div className="mt-5 space-y-4 font-mono text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[14px]">
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 lg:border-l lg:border-t-0">
        <div className="grid h-full sm:grid-cols-2 xl:grid-cols-4">
          {storyItems.map(([label, body], itemIndex) => (
            <div
              key={label}
              className={`min-h-[190px] p-5 sm:p-6 ${
                itemIndex > 0 ? 'border-t border-white/10 sm:border-t-0 sm:border-l' : ''
              } ${
                itemIndex === 2 ? 'sm:border-l-0 sm:border-t xl:border-l xl:border-t-0' : ''
              } ${
                itemIndex === 3 ? 'sm:border-t xl:border-t-0' : ''
              } border-white/10`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-neon">
                {label}
              </p>
              <p className="font-mono mt-4 text-[12px] normal-case leading-relaxed text-cream/74 sm:text-[13px]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function OrchestratePage() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (pathname !== ORCHESTRATE_PATH || !hash) return
    const id = hash.replace(/^#/, '')
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <MarketingPageLayout>
      <article>
        <header
          id="overview"
          className="scroll-mt-28 border-b border-white/10 px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
        >
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.02fr_0.78fr] lg:items-end">
            <div>
              <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                Orchestration layer
              </p>
              <h1 className="font-grotesk max-w-[850px] text-[38px] uppercase leading-[1.02] text-cream sm:text-[54px] md:text-[68px]">
                Orchestrate your existing tech.
              </h1>
              <p className="font-mono mt-7 max-w-[820px] border-l-2 border-neon/60 pl-4 text-[13px] uppercase leading-relaxed text-cream/72 sm:text-[14px] md:text-[15px]">
                SentientWeb is the accelerator for the stack your team already has. It decides
                what to do, when to do it, and whom to do it to, then uses the right tool to
                complete the business task.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
                >
                  Book a pilot
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <Link
                  to={`${ORCHESTRATE_PATH}#how-orchestration-works`}
                  className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
                >
                  See the operating model
                </Link>
              </div>
            </div>

            <div className="liquid-glass rounded-[28px] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neon text-background">
                  <Network className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
                    {OVERVIEW_SECTION.eyebrow}
                  </p>
                  <p className="font-grotesk mt-1 text-[18px] uppercase leading-tight text-cream">
                    Decision layer above the stack
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4 font-mono text-[13px] normal-case leading-relaxed text-cream/74">
                {OVERVIEW_SECTION.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <SectionBullets bullets={OVERVIEW_SECTION.bullets} />
            </div>
          </div>
        </header>

        <nav
          className="border-b border-white/10 bg-[#020a2e]/55 px-4 py-5 sm:px-6 md:px-8 lg:px-10"
          aria-label="Orchestrate page sections"
        >
          <div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto pb-1">
            {ORCHESTRATE_NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-cream/72 transition hover:border-neon/50 hover:text-neon"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10">
          <div className="grid gap-5">
            {STORY_SECTIONS.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="liquid-glass scroll-mt-28 rounded-[28px] p-6 sm:p-8"
                aria-labelledby={`${section.id}-heading`}
              >
                <div className="grid gap-7 lg:grid-cols-[0.82fr_1fr] lg:items-start">
                  <div>
                    <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                      {section.eyebrow}
                    </p>
                    <h2
                      id={`${section.id}-heading`}
                      className="font-grotesk text-[28px] uppercase leading-tight text-cream sm:text-[38px]"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div>
                    <div className="space-y-4 font-mono text-[13px] normal-case leading-relaxed text-cream/76 sm:text-[14px]">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <SectionBullets bullets={section.bullets} />
                  </div>
                </div>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-neon/50 text-neon">
                    <Workflow className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-cream/52">
                    Step {index + 1} of the orchestration story
                  </p>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section
          className="border-y border-white/10 bg-[#020a2e]/50 px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:px-10"
          aria-labelledby="tools-heading"
        >
          <div className="mx-auto max-w-[1831px]">
            <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
              Use-case stories
            </p>
            <h2
              id="tools-heading"
              className="font-grotesk max-w-[1040px] text-[30px] uppercase leading-tight text-cream sm:text-[44px]"
            >
              How SentientWeb coordinates each tool inside one buyer journey.
            </h2>
            <p className="font-mono mt-5 max-w-4xl text-[13px] uppercase leading-relaxed text-cream/70 sm:text-[14px]">
              Each horizontal story shows the same position in practice: SentientWeb decides the
              buyer moment first, then uses the right connected system as the execution surface.
            </p>

            <div className="mt-10 space-y-6">
              {TOOL_SECTIONS.map((section, index) => (
                <ToolStorySection key={section.id} section={section} index={index} />
              ))}
            </div>
          </div>
        </section>

      </article>
      <RoiCalculatorCta />
    </MarketingPageLayout>
  )
}
