import type { ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import { GITHUB_REPO_URL } from '../constants'
import { FUNNEL_FEATURE_GROUPS, funnelFeatureId, funnelGroupId } from '../data/homeFeatures'
import { openPrivacyPreferences } from '../privacyPreferences'
import { SocialIconStack } from './SocialIconStack'

type FooterProductItem = { label: string; to: To; kind: 'stage' | 'feature' }

const FOOTER_PRODUCT: FooterProductItem[] = FUNNEL_FEATURE_GROUPS.flatMap((group) => [
  {
    label: group.stage,
    to: { pathname: '/', hash: funnelGroupId(group.stage) },
    kind: 'stage' as const,
  },
  ...group.features.map((feature) => ({
    label: feature.title,
    to: { pathname: '/', hash: funnelFeatureId(feature.title) },
    kind: 'feature' as const,
  })),
])

const FOOTER_COMPANY: { label: string; to: To }[] = [
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Trust & security', to: '/trust' },
  { label: 'Legal notice', to: '/legal' },
]

const FOOTER_USE_CASES: { label: string; to: To }[] = [
  { label: 'Demo Recovery', to: { pathname: '/', hash: 'demo-recovery' } },
  { label: 'Failed Payment Recovery', to: { pathname: '/', hash: 'failed-payment-recovery' } },
  { label: 'No-Show Recovery', to: { pathname: '/', hash: 'no-show-recovery' } },
  { label: 'Buyer Insights', to: { pathname: '/', hash: 'buyer-insights' } },
]

type FooterDevItem =
  | { label: string; to: To }
  | { label: string; href: string; external?: boolean }

const FOOTER_DEV: FooterDevItem[] = [
  { label: 'Blog', to: '/blog' },
  { label: 'GitHub', href: GITHUB_REPO_URL, external: true },
  { label: 'Status', to: '/status' },
]

function LinkColumn({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <h2 className="font-grotesk mb-4 text-[13px] uppercase tracking-wide text-cream/80">
        {title}
      </h2>
      <ul className="space-y-2 font-mono text-[13px] uppercase text-cream/60">{children}</ul>
    </div>
  )
}

export function SiteFooter({ anchorId }: { anchorId?: string }) {
  return (
    <footer
      id={anchorId}
      className="border-t border-white/10 bg-background px-4 py-16 sm:px-6 md:px-8 lg:px-10"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-[1831px] gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <LinkColumn title="Product">
          {FOOTER_PRODUCT.map((item) => (
            <li key={item.label} className={item.kind === 'stage' ? 'pt-3 first:pt-0' : ''}>
              <Link
                to={item.to}
                className={
                  item.kind === 'stage'
                    ? 'text-cream/80 transition hover:text-neon'
                    : 'transition hover:text-neon'
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Use cases">
          {FOOTER_USE_CASES.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="transition hover:text-neon">
                {item.label}
              </Link>
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Company">
          {FOOTER_COMPANY.map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="transition hover:text-neon">
                {item.label}
              </Link>
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Developers">
          {FOOTER_DEV.map((item) => (
            <li key={item.label}>
              {'to' in item ? (
                <Link to={item.to} className="transition hover:text-neon">
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className="transition hover:text-neon"
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </LinkColumn>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1831px] flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between lg:gap-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          <Link to="/" className="font-grotesk text-[18px] uppercase tracking-wide text-cream">
            SentientWeb
          </Link>
          <p className="font-mono max-w-[280px] text-[11px] uppercase leading-relaxed text-cream/50">
            Revenue recovery orchestration for modern subscription businesses.
          </p>
          <SocialIconStack />
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-[12px] uppercase text-cream/50">
          <Link to="/privacy" className="transition hover:text-neon">
            Privacy policy
          </Link>
          <Link to="/terms" className="transition hover:text-neon">
            Terms of service
          </Link>
          <Link to="/cookies" className="transition hover:text-neon">
            Cookie policy
          </Link>
          <Link to="/billing-terms" className="transition hover:text-neon">
            Billing terms
          </Link>
          <Link to="/ai-disclosure" className="transition hover:text-neon">
            Automation notice
          </Link>
          <Link to="/data-request" className="transition hover:text-neon">
            Data request
          </Link>
          <Link to="/do-not-sell" className="transition hover:text-neon">
            Do not sell/share
          </Link>
          <Link to="/accessibility" className="transition hover:text-neon">
            Accessibility
          </Link>
          <Link to="/dmca" className="transition hover:text-neon">
            DMCA
          </Link>
          <Link to="/security-response" className="transition hover:text-neon">
            Security response
          </Link>
          <Link to="/unsubscribe" className="transition hover:text-neon">
            Unsubscribe
          </Link>
          <button
            type="button"
            className="uppercase transition hover:text-neon"
            onClick={openPrivacyPreferences}
          >
            Privacy choices
          </button>
        </div>
      </div>
    </footer>
  )
}
