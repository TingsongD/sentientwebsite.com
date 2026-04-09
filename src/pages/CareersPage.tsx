import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

const APPLY_EMAIL = 'mailto:hello@sentientwebsite.com?subject=Application%20%E2%80%93%20B2B%20Sales%20%28Account%20Executive%29'

export default function CareersPage() {
  return (
    <MarketingPageLayout>
      <div className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company · Careers
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Careers
        </h1>
        <p className="font-mono mt-6 max-w-2xl text-[14px] normal-case leading-relaxed text-cream/75 sm:text-[15px]">
          SentientWeb is building the autonomous website agent for B2B teams—qualification, demo
          booking, and knowledge-grounded answers without enterprise bloat. We are a small,
          product-led company; early hires shape the go-to-market motion and the culture.
        </p>

        <section className="mt-14" aria-labelledby="open-roles-heading">
          <h2
            id="open-roles-heading"
            className="font-grotesk mb-8 text-[22px] uppercase tracking-wide text-cream sm:text-[24px]"
          >
            Open roles
          </h2>

          <article
            className="liquid-glass rounded-[28px] border border-white/[0.08] p-6 sm:p-10"
            aria-labelledby="job-title"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3
                  id="job-title"
                  className="font-grotesk text-[22px] uppercase leading-tight text-cream sm:text-[26px]"
                >
                  B2B Sales — Account Executive
                </h3>
                <p className="font-mono mt-2 text-[12px] uppercase tracking-wide text-cream/50 sm:text-[13px]">
                  Full-time · Remote (US) · Individual contributor
                </p>
              </div>
              <a
                href={APPLY_EMAIL}
                className="shrink-0 rounded-full bg-neon px-5 py-2.5 text-center font-grotesk text-[11px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[12px]"
              >
                Apply
              </a>
            </div>

            <div className="mt-8 space-y-8 font-mono text-[14px] normal-case leading-[1.7] text-cream/80 sm:text-[15px]">
              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  About the role
                </h4>
                <p>
                  You will own outbound and inbound pipeline for SentientWeb’s core offer: an AI
                  agent that qualifies site visitors, books demos on Calendly, and answers from the
                  customer’s knowledge base. Our buyers are founders, revenue leaders, and growth
                  teams at roughly $1–10M ARR B2B companies—teams that feel the gap between cheap
                  chat widgets and six-figure enterprise suites.
                </p>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  What you will do
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>Run a disciplined outbound motion (email, LinkedIn, calls) into defined ICPs and verticals.</li>
                  <li>Qualify inbound leads from the site, events, and partner intros; run discovery that maps pain to our Phase 1 / Phase 2 story.</li>
                  <li>Own demos in partnership with technical stakeholders—translate product capabilities into revenue outcomes.</li>
                  <li>Manage pipeline in HubSpot (or similar): stages, notes, and forecast hygiene.</li>
                  <li>Feed the team real market signal: objections, competitive mentions, and feature requests.</li>
                  <li>Contribute to messaging, one-pagers, and vertical narratives as we scale repeatability.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  What we are looking for
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>2+ years closing or mixed B2B SaaS sales (SMB or mid-market); consistent quota attainment preferred.</li>
                  <li>Comfort selling a technical product to non-technical buyers and engaging engineers or ops when needed.</li>
                  <li>Excellent written communication—you will represent a brand built on crisp, credible copy.</li>
                  <li>Self-directed operator in a remote environment; you default to logging context and following through.</li>
                  <li>Genuine curiosity about AI go-to-market, conversion, and website-led growth—not checkbox “AI hype.”</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  Nice to have
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>Experience selling martech, sales engagement, or conversational / CX tools.</li>
                  <li>Exposure to PLG + sales-assist motions or seed-stage startups.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  Compensation
                </h4>
                <p>
                  Competitive base plus commission aligned to ARR targets; early-stage equity
                  available. Exact package depends on experience—we are transparent in process.
                </p>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  How to apply
                </h4>
                <p>
                  Send your resume and a short note on why this wedge (autonomous website agents,
                  B2B, $499–1,999/mo) interests you to{' '}
                  <a
                    href={APPLY_EMAIL}
                    className="text-neon underline underline-offset-2 transition hover:brightness-125"
                  >
                    hello@sentientwebsite.com
                  </a>{' '}
                  with the subject line{' '}
                  <span className="text-cream/90">
                    Application — B2B Sales (Account Executive)
                  </span>
                  . We will reply with next steps.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-8">
              <a
                href={BOOK_DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-full px-5 py-2.5 font-grotesk text-[11px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[12px]"
              >
                Book a demo (see the product)
              </a>
              <Link
                to="/about"
                className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline"
              >
                Our mission
              </Link>
            </div>
          </article>
        </section>

        <p className="font-mono mt-12 text-[13px] normal-case leading-relaxed text-cream/45">
          SentientWeb is an equal opportunity employer. We welcome qualified applicants regardless
          of background, identity, or non-traditional paths into sales.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </MarketingPageLayout>
  )
}
