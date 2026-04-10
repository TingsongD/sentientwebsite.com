import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { GITHUB_REPO_URL } from '../constants'

const SYSTEMS: { name: string; detail: string; status: 'operational' }[] = [
  {
    name: 'Marketing site',
    detail: 'sentientwebsite.com',
    status: 'operational',
  },
  {
    name: 'Operator dashboard',
    detail: 'app.sentientwebsite.com',
    status: 'operational',
  },
  {
    name: 'Agent API & widget delivery',
    detail: 'Core conversational services',
    status: 'operational',
  },
]

export default function StatusPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Developers · Status
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          System status
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[14px]">
          Current health of SentientWeb public surfaces. This page is informational; subscribe to
          updates via{' '}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon underline-offset-4 transition hover:underline"
          >
            GitHub
          </a>{' '}
          or contact us for incident notices.
        </p>

        <div
          className="liquid-glass mt-10 rounded-[24px] border border-neon/20 p-6 sm:p-8"
          role="status"
          aria-live="polite"
        >
          <p className="font-grotesk text-[18px] uppercase tracking-wide text-neon sm:text-[20px]">
            All systems operational
          </p>
          <p className="font-mono mt-2 text-[13px] normal-case leading-relaxed text-cream/70 sm:text-[14px]">
            No known incidents affecting customer-facing services.
          </p>
        </div>

        <h2 className="font-grotesk mt-12 mb-6 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]">
          Components
        </h2>
        <ul className="space-y-4">
          {SYSTEMS.map((s) => (
            <li
              key={s.name}
              className="liquid-glass flex flex-col gap-1 rounded-[16px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-grotesk text-[14px] uppercase tracking-wide text-cream sm:text-[15px]">
                  {s.name}
                </p>
                <p className="font-mono text-[12px] normal-case text-cream/55 sm:text-[13px]">
                  {s.detail}
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-neon sm:shrink-0">
                {s.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-4 font-mono text-[14px] normal-case leading-relaxed text-cream/75 sm:text-[15px]">
          <p>
            For production incidents or SLA questions, email{' '}
            <a
              href="mailto:hello@sentientwebsite.com"
              className="text-neon underline-offset-4 transition hover:underline"
            >
              hello@sentientwebsite.com
            </a>
            .
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
