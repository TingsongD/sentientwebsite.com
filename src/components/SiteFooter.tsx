import type { ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import { BOOK_DEMO_URL } from '../constants'
import { SOLUTION_NAV_LIST } from '../data/solutionPagesContent'
import { SocialIconStack } from './SocialIconStack'

type FooterProductItem =
  | { label: string; calendly: true }
  | { label: string; to: To }

const FOOTER_PRODUCT: FooterProductItem[] = [
  { label: 'Demo booking', calendly: true },
  { label: 'Knowledge base', to: '/knowledge-base' },
  { label: 'APIs & SDKs', to: '/apis-sdks' },
  { label: 'Documentation', to: '/documentation' },
  { label: 'Changelog', to: '/changelog' },
  { label: 'Pricing', to: '/pricing' },
]

type FooterCompanyItem = { label: string; to?: To; placeholder?: true }

const FOOTER_COMPANY: FooterCompanyItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Careers', placeholder: true },
  { label: 'Trust & security', to: '/trust' },
]

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
          {FOOTER_PRODUCT.map((item) => (
            <li key={item.label}>
              {'calendly' in item ? (
                <a
                  href={BOOK_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-neon"
                >
                  {item.label}
                </a>
              ) : (
                <Link to={item.to} className="transition hover:text-neon">
                  {item.label}
                </Link>
              )}
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
          {FOOTER_COMPANY.map((item) => (
            <li key={item.label}>
              {item.placeholder ? (
                <a href="#" className="transition hover:text-neon">
                  {item.label}
                </a>
              ) : item.to ? (
                <Link to={item.to} className="transition hover:text-neon">
                  {item.label}
                </Link>
              ) : null}
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
      <div className="mx-auto mt-14 flex max-w-[1831px] flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between lg:gap-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
          <Link to="/" className="font-grotesk text-[18px] uppercase tracking-wide text-cream">
            SentientWeb
          </Link>
          <SocialIconStack />
        </div>
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
