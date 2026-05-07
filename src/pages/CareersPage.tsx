import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

const APPLY_EMAIL =
  'mailto:songday@sentientwebsite.com?subject=Application%20%E2%80%93%20B2B%20Sales%20%28Account%20Executive%29'

export default function CareersPage() {
  return (
    <MarketingPageLayout>
      <div className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company / Careers
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Careers
        </h1>
        <p className="font-mono mt-6 max-w-2xl text-[14px] normal-case leading-relaxed text-cream/75 sm:text-[15px]">
          SentientWeb is building revenue recovery orchestration for subscription businesses:
          detect revenue intent, qualify the moment, trigger the right action, and sync context into
          the tools the business already uses. Early hires shape the market motion and the culture.
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
                  B2B Sales / Account Executive
                </h3>
                <p className="font-mono mt-2 text-[12px] uppercase tracking-wide text-cream/50 sm:text-[13px]">
                  Full-time / Remote (US) / Individual contributor
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
                  You will own outbound and inbound pipeline for SentientWeb&apos;s revenue recovery
                  offer. Our buyers are founders, revenue leaders, and operators who feel the gap
                  between high-intent website or customer behavior and completed revenue actions.
                </p>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  What you will do
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>Run disciplined outbound into a defined subscription-business ICP.</li>
                  <li>Capture inbound revenue recovery opportunities from the site, events, and partners.</li>
                  <li>
                    Own discovery that maps demo-page, pricing-page, and comparison-page intent to
                    qualified recovered actions.
                  </li>
                  <li>Manage pipeline in HubSpot or similar tools with clean stage hygiene.</li>
                  <li>Feed the team market signals, objections, and revenue recovery copy needs.</li>
                  <li>Contribute to messaging, one-pagers, and sales narratives as we scale.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  What we are looking for
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>2+ years closing or mixed software sales, SMB or mid-market.</li>
                  <li>Comfort selling technical products to non-technical buyers.</li>
                  <li>Excellent written communication and credible discovery habits.</li>
                  <li>Self-directed operator in a remote environment.</li>
                  <li>Curiosity about AI go-to-market, conversion, and website-led growth.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  Nice to have
                </h4>
                <ul className="list-inside list-disc space-y-2 marker:text-neon">
                  <li>Experience selling martech, sales-assist, or CX tools.</li>
                  <li>Exposure to PLG plus sales-assist motions or seed-stage startups.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  Compensation
                </h4>
                <p>
                  Competitive base plus commission aligned to ARR targets; early-stage equity is
                  available. Exact package depends on experience and is transparent in process.
                </p>
              </div>

              <div>
                <h4 className="font-grotesk mb-3 text-[13px] uppercase tracking-wide text-neon sm:text-[14px]">
                  How to apply
                </h4>
                <p>
                  Send your resume and a short note on why revenue recovery orchestration interests you
                  to{' '}
                  <a
                    href={APPLY_EMAIL}
                    className="text-neon underline underline-offset-2 transition hover:brightness-125"
                  >
                    songday@sentientwebsite.com
                  </a>{' '}
                  with the subject line{' '}
                  <span className="text-cream/90">
                    Application / B2B Sales (Account Executive)
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
                See revenue recovery
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
          Back to home
        </Link>
      </div>
    </MarketingPageLayout>
  )
}
