import { ChevronRight, Github, Mail, Twitter } from 'lucide-react'

const HERO_VIDEO =
  'https://cdn.shopify.com/videos/c/o/v/9c76561bb05d4ed9941cb20637732cc0.mp4'
const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4'
const CTA_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4'

const FEATURES = [
  {
    title: 'Lead qualification',
    bullets: [
      'Asks the right questions — company size, use case, timeline.',
      'Deterministic BANT-lite scoring ensures high-quality meetings.',
      'Routes enterprise leads to sales and SMBs to automation.',
    ],
  },
  {
    title: 'Demo booking',
    bullets: [
      'Books meetings directly on the sales team’s calendar.',
      'Native Calendly integration with UUID validation.',
      'Zero friction: no forms, just a natural conversation.',
    ],
  },
  {
    title: 'Product Q&A',
    bullets: [
      'Answers technical questions from your docs and knowledge base.',
      'Hybrid search (vector + FTS) ensures high-fidelity results.',
      'Sub-1.2s TTFT provides a “sentient” response feel.',
    ],
  },
  {
    title: 'Proactive engagement',
    bullets: [
      'Detects high intent (pricing page, return visits).',
      'Engages at the right moment based on behavioral scores.',
      'Reduces bounce rate and increases conversion directly.',
    ],
  },
  {
    title: 'CRM integration (Phase 2)',
    bullets: [
      'Creates records in HubSpot or Salesforce automatically.',
      'Full conversation context synced to the lead record.',
      'Queue-based retry mechanism ensures zero data loss.',
    ],
  },
  {
    title: 'Content flywheel',
    bullets: [
      'Phase 2: Remotion-powered video generation from your docs.',
      'Auto-posts hooks to X and LinkedIn to drive traffic.',
      'Feedback loop: top questions generate new videos.',
    ],
  },
] as const

const FOOTER_PRODUCT = [
  'Lead qualification',
  'Demo booking',
  'Knowledge base',
  'APIs & SDKs',
  'Documentation',
  'Changelog',
  'Pricing',
] as const

const FOOTER_SOLUTIONS = [
  'Legal services',
  'Car dealerships',
  'Hotel & hospitality',
  'Insurance agencies',
  'B2B SaaS companies',
  'Real estate brokers',
  'Healthcare & clinics',
  'Home services',
  'Education & EdTech',
  'Luxury e-commerce',
] as const

const FOOTER_COMPANY = ['About', 'Careers', 'Trust & security'] as const

const FOOTER_DEV = ['Blog', 'GitHub', 'Status'] as const

function SocialIconStack({ className = '' }: { className?: string }) {
  const iconClass = 'h-5 w-5 text-cream'
  const btnClass =
    'liquid-glass flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] text-cream transition hover:bg-white/10'
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <a href="mailto:hello@sentientwebsite.com" className={btnClass} aria-label="Email SentientWeb">
        <Mail className={iconClass} strokeWidth={1.75} />
      </a>
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        aria-label="SentientWeb on X"
      >
        <Twitter className={iconClass} strokeWidth={1.75} />
      </a>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        aria-label="SentientWeb on GitHub"
      >
        <Github className={iconClass} strokeWidth={1.75} />
      </a>
    </div>
  )
}

function FooterLinkColumn({
  title,
  links,
  id,
}: {
  title: string
  links: readonly string[]
  id?: string
}) {
  return (
    <div id={id}>
      <h2 className="font-grotesk mb-4 text-[13px] uppercase tracking-wide text-cream/80">
        {title}
      </h2>
      <ul className="space-y-2 font-mono text-[13px] uppercase text-cream/60">
        {links.map((label) => (
          <li key={label}>
            <a href="#" className="transition hover:text-neon">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function App() {
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
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="relative z-10 flex min-h-screen flex-col">
            <header className="relative mx-auto flex w-full max-w-[1831px] items-start justify-between gap-4 px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10">
              <a
                href="/"
                className="font-grotesk text-[16px] uppercase tracking-wide text-cream"
              >
                SentientWeb
              </a>

              <nav
                className="liquid-glass absolute left-1/2 top-8 hidden -translate-x-1/2 rounded-[28px] px-8 py-5 xl:px-[52px] xl:py-[24px] lg:block"
                aria-label="Primary"
              >
                <ul className="flex items-center gap-5 xl:gap-8">
                  {(
                    [
                      ['Product', '#features'],
                      ['Solutions', '#solutions'],
                      ['Pricing', '#pricing-footer'],
                    ] as const
                  ).map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="ml-auto hidden items-center gap-3 lg:flex">
                <a
                  href="#"
                  className="font-grotesk text-[12px] uppercase tracking-wide text-cream/80 transition hover:text-neon xl:text-[13px]"
                >
                  Log in
                </a>
                <a
                  href="#"
                  className="liquid-glass rounded-full px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 xl:px-5 xl:text-[13px]"
                >
                  Sign up
                </a>
                <a
                  href="#pricing-footer"
                  className="rounded-full bg-neon px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 xl:px-5 xl:text-[13px]"
                >
                  Get a demo
                </a>
              </div>

              <SocialIconStack className="hidden xl:flex" />
            </header>

            <div className="mx-auto flex w-full max-w-[1831px] flex-1 flex-col justify-center px-4 pb-16 pt-10 sm:px-6 md:px-8 lg:px-10 lg:pb-24">
              <div className="relative max-w-[880px] lg:ml-16 xl:ml-32">
                <p className="font-mono mb-4 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
                  Sentient×B2B SaaS
                </p>
                <p className="font-mono mb-6 max-w-xl text-[13px] uppercase leading-relaxed text-cream/80 sm:text-[14px]">
                  Introducing Phase 1: inbound lead qualification & demo booking
                </p>
                <h1
                  id="hero-heading"
                  className="font-grotesk uppercase leading-[1.05] text-cream sm:leading-none text-[40px] sm:text-[56px] md:text-[72px] lg:text-[84px]"
                >
                  The autonomous website agent.
                </h1>
                <p className="font-condiment pointer-events-none absolute -right-1 top-[42%] z-10 -translate-y-1/2 -rotate-1 text-[22px] text-neon opacity-90 mix-blend-exclusion sm:text-[28px] md:top-[48%] md:text-[36px] lg:right-[-8%] lg:text-[44px] normal-case">
                  Always on
                </p>
                <p className="font-mono mt-8 max-w-[540px] text-[14px] uppercase leading-relaxed text-cream sm:text-[15px] md:text-[16px]">
                  Platform-agnostic AI that qualifies leads, books demos, answers
                  questions, and takes action — 24/7.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="#"
                    className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
                  >
                    Start pilot
                  </a>
                  <a
                    href="#pricing-footer"
                    className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
                  >
                    Book a demo
                  </a>
                </div>
                <p className="font-mono mt-4 text-[12px] uppercase text-cream/50">
                  No credit card required.
                </p>
              </div>

              <div className="mt-10 flex justify-center gap-3 lg:hidden">
                <a
                  href="mailto:hello@sentientwebsite.com"
                  aria-label="Email"
                  className="liquid-glass flex h-14 w-14 items-center justify-center rounded-[1rem] text-cream transition hover:bg-white/10"
                >
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="liquid-glass flex h-14 w-14 items-center justify-center rounded-[1rem] text-cream transition hover:bg-white/10"
                >
                  <Twitter className="h-5 w-5" strokeWidth={1.75} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="liquid-glass flex h-14 w-14 items-center justify-center rounded-[1rem] text-cream transition hover:bg-white/10"
                >
                  <Github className="h-5 w-5" strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1 / product intro */}
        <section
          className="relative min-h-screen overflow-hidden bg-background"
          aria-labelledby="phase-heading"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={ABOUT_VIDEO}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="relative z-10 mx-auto max-w-[1831px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10 lg:py-24 xl:py-32">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
              <div className="relative shrink-0">
                <h2
                  id="phase-heading"
                  className="font-grotesk uppercase leading-none text-cream text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px]"
                >
                  Phase 1
                  <br />
                  Is live
                </h2>
                <p
                  className="font-condiment pointer-events-none absolute -bottom-2 right-0 translate-x-1/4 -rotate-1 text-[32px] text-neon mix-blend-exclusion sm:text-[44px] md:text-[54px] lg:text-[64px] normal-case"
                  aria-hidden
                >
                  Inbound
                </p>
              </div>

              <p className="font-mono max-w-[min(100%,420px)] text-[14px] uppercase leading-relaxed text-cream sm:text-[15px] md:text-[16px]">
                Qualify visitors with BANT-lite scoring, book demos on your
                calendar, and answer product questions from your knowledge base —
                without adding headcount.
              </p>
            </div>

            <div className="mt-16 flex flex-row justify-between gap-8 lg:mt-24">
              <div className="flex max-w-md flex-col gap-6 font-mono text-[14px] uppercase leading-relaxed text-[#010828] lg:text-cream lg:opacity-10 sm:text-[15px] md:text-[16px]">
                <p>
                  One agent handles qualification, scheduling, and technical
                  Q&amp;A so revenue teams focus on live conversations.
                </p>
                <p>
                  Native integrations and deterministic routing keep enterprise
                  leads with sales and SMBs in automated flows.
                </p>
              </div>
              <div className="hidden max-w-md flex-col gap-6 font-mono text-[14px] uppercase leading-relaxed text-cream opacity-10 sm:text-[15px] md:text-[16px] lg:flex">
                <p>
                  Hybrid retrieval blends vector search with full-text search for
                  accurate answers from your docs.
                </p>
                <p>
                  Behavioral signals trigger outreach when intent is highest —
                  pricing pages, repeat sessions, and funnel depth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="bg-background py-16 sm:py-20 md:py-24 lg:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <h2
              id="features-heading"
              className="font-grotesk mb-10 text-[32px] uppercase leading-none text-cream sm:mb-12 sm:text-[42px] md:text-[52px] lg:mb-16 lg:text-[60px]"
            >
              Features
            </h2>

            <div
              className="liquid-glass mb-12 rounded-[24px] p-6 font-mono text-[12px] uppercase leading-relaxed text-cream sm:p-8 sm:text-[13px] lg:mb-16"
              role="region"
              aria-label="Example qualification transcript"
            >
              <p className="text-neon">Bant score: 0.98</p>
              <p className="mt-2 text-neon">Intent: high</p>
              <p className="mt-4 text-cream/70">
                &gt; Qualifying lead: Enterprise...
              </p>
              <p className="text-cream/70">
                &gt; Score threshold met (0.95+)
              </p>
              <p className="text-cream/70">
                &gt; Booking demo on sales calendar...
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="liquid-glass rounded-[32px] p-6 transition hover:bg-white/10 sm:p-8"
                >
                  <h3 className="font-grotesk mb-4 text-[20px] uppercase leading-tight text-cream sm:text-[22px]">
                    {f.title}
                  </h3>
                  <ul className="list-inside list-disc space-y-2 font-mono text-[13px] uppercase leading-relaxed text-cream/75 sm:text-[14px]">
                    {f.bullets.map((b) => (
                      <li key={b} className="marker:text-neon">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="mt-6 flex items-center gap-2 font-grotesk text-[12px] uppercase tracking-wide text-neon transition hover:brightness-125"
                    aria-label={`Learn more about ${f.title}`}
                  >
                    Learn more
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section
          id="solutions"
          className="border-t border-white/10 bg-background py-16 sm:py-20"
          aria-labelledby="solutions-heading"
        >
          <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
            <h2
              id="solutions-heading"
              className="font-grotesk mb-4 text-[28px] uppercase leading-tight text-cream sm:text-[36px] md:text-[44px]"
            >
              Solutions
            </h2>
            <p className="font-mono mb-10 max-w-2xl text-[14px] uppercase leading-relaxed text-cream/70">
              Industry adapters and playbooks so the same engine fits legal,
              hospitality, automotive, insurance, and more.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[12px] uppercase text-cream/55 sm:text-[13px]">
              {FOOTER_SOLUTIONS.map((s) => (
                <a key={s} href="#" className="transition hover:text-neon">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA video + closing */}
        <section className="relative w-full bg-background" aria-labelledby="cta-heading">
          <video
            className="block h-auto w-full"
            src={CTA_VIDEO}
            autoPlay
            loop
            muted
            playsInline
          />

          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute left-[8%] bottom-[12%] sm:bottom-[15%] lg:bottom-[20%]">
              <div className="liquid-glass flex flex-col overflow-hidden rounded-[0.5rem] sm:rounded-[0.75rem] md:rounded-[1rem] lg:rounded-[1.25rem]">
                <a
                  href="mailto:hello@sentientwebsite.com"
                  aria-label="Email"
                  className="flex h-[14vw] w-[14vw] items-center justify-center border-b border-white/10 text-cream transition hover:bg-white/10 sm:h-[14.375rem] sm:w-[14.375rem] md:h-[10.78125rem] md:w-[10.78125rem] lg:h-[16.77rem] lg:w-[16.77rem]"
                >
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-[14vw] w-[14vw] items-center justify-center border-b border-white/10 text-cream transition hover:bg-white/10 sm:h-[14.375rem] sm:w-[14.375rem] md:h-[10.78125rem] md:w-[10.78125rem] lg:h-[16.77rem] lg:w-[16.77rem]"
                >
                  <Twitter
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    strokeWidth={1.75}
                  />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-[14vw] w-[14vw] items-center justify-center text-cream transition hover:bg-white/10 sm:h-[14.375rem] sm:w-[14.375rem] md:h-[10.78125rem] md:w-[10.78125rem] lg:h-[16.77rem] lg:w-[16.77rem]"
                >
                  <Github className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </a>
              </div>
            </div>

            <div className="pointer-events-auto absolute top-1/2 right-0 w-full -translate-y-1/2 px-6 text-right sm:px-10 lg:pl-[15%] lg:pr-[20%]">
              <div className="relative ml-auto inline-block max-w-4xl">
                <p
                  className="font-condiment pointer-events-none absolute -left-2 -top-8 z-10 text-[17px] text-neon mix-blend-exclusion sm:-top-10 sm:text-[28px] md:-top-14 md:text-[44px] lg:-left-4 lg:-top-16 lg:text-[56px] xl:text-[68px] normal-case"
                  aria-hidden
                >
                  One engine
                </p>
                <h2
                  id="cta-heading"
                  className="font-grotesk uppercase leading-tight text-cream text-[18px] sm:text-[32px] md:text-[44px] lg:text-[52px] xl:text-[60px]"
                >
                  <span className="mb-4 block sm:mb-6 md:mb-8 lg:mb-10">
                    Many adapters.
                  </span>
                  <span className="mb-6 block font-mono text-[11px] normal-case text-cream/70 sm:mb-8 sm:text-[13px] md:text-[14px]">
                    Book a demo · Get started
                  </span>
                  <span className="flex flex-wrap justify-end gap-4">
                    <a
                      href="#pricing-footer"
                      className="inline-block rounded-full bg-neon px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-background transition hover:brightness-110 sm:px-8 sm:text-[13px]"
                    >
                      Book a demo
                    </a>
                    <a
                      href="#"
                      className="liquid-glass inline-block rounded-full px-6 py-3 font-grotesk text-[11px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:px-8 sm:text-[13px]"
                    >
                      Get started
                    </a>
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        <footer
          id="pricing-footer"
          className="border-t border-white/10 bg-background px-4 py-16 sm:px-6 md:px-8 lg:px-10"
          role="contentinfo"
        >
          <div className="mx-auto grid max-w-[1831px] gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <FooterLinkColumn title="Product" links={FOOTER_PRODUCT} />
            <FooterLinkColumn title="Solutions" links={FOOTER_SOLUTIONS} />
            <FooterLinkColumn title="Company" links={FOOTER_COMPANY} />
            <FooterLinkColumn title="Developers" links={FOOTER_DEV} />
          </div>
          <div className="mx-auto mt-14 flex max-w-[1831px] flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-grotesk text-[18px] uppercase tracking-wide text-cream">
              SentientWeb
            </p>
            <div className="flex flex-wrap gap-6 font-mono text-[12px] uppercase text-cream/50">
              <a href="#" className="transition hover:text-neon">
                Privacy policy
              </a>
              <a href="#" className="transition hover:text-neon">
                Terms of service
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
