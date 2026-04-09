import type { ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import { SOLUTION_NAV_LIST } from '../data/solutionPagesContent'

const FOOTER_PRODUCT: { label: string; to?: To; href?: string }[] = [
  { label: 'Lead qualification', to: { pathname: '/', hash: 'features' } },
  { label: 'Demo booking', to: { pathname: '/', hash: 'features' } },
  { label: 'Knowledge base', to: { pathname: '/', hash: 'features' } },
  { label: 'APIs & SDKs', href: '#' },
  { label: 'Documentation', href: '#' },
  { label: 'Changelog', href: '#' },
  { label: 'Pricing', to: '/pricing' },
]

const FOOTER_COMPANY = ['About', 'Careers', 'Trust & security'] as const

const FOOTER_DEV = ['Blog', 'GitHub', 'Status'] as const

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
          {FOOTER_PRODUCT.map(({ label, to, href }) => (
            <li key={label}>
              {href === '#' ? (
                <a href="#" className="transition hover:text-neon">
                  {label}
                </a>
              ) : to ? (
                <Link to={to} className="transition hover:text-neon">
                  {label}
                </Link>
              ) : null}
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Solutions">
          {SOLUTION_NAV_LIST.map(({ slug, navLabel }) => (
            <li key={slug}>
              <Link to={`/solutions/${slug}`} className="transition hover:text-neon">
                {navLabel}
              </Link>
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Company">
          {FOOTER_COMPANY.map((label) => (
            <li key={label}>
              <a href="#" className="transition hover:text-neon">
                {label}
              </a>
            </li>
          ))}
        </LinkColumn>
        <LinkColumn title="Developers">
          {FOOTER_DEV.map((label) => (
            <li key={label}>
              <a href="#" className="transition hover:text-neon">
                {label}
              </a>
            </li>
          ))}
        </LinkColumn>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1831px] flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-grotesk text-[18px] uppercase tracking-wide text-cream">
          SentientWeb
        </Link>
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
  )
}
