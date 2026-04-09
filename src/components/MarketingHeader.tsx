import { Link, type To } from 'react-router-dom'
import { Github, Mail, Twitter } from 'lucide-react'
import { BOOK_DEMO_URL } from '../constants'

const NAV: { label: string; to: To }[] = [
  { label: 'Product', to: { pathname: '/', hash: 'features' } },
  { label: 'Solutions', to: { pathname: '/', hash: 'solutions' } },
  { label: 'Pricing', to: '/pricing' },
]

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

export function MarketingHeader({ layout }: { layout: 'hero' | 'page' }) {
  const navInner = (
    <ul className="flex items-center gap-5 xl:gap-8">
      {NAV.map(({ label, to }) => (
        <li key={label}>
          <Link
            to={to}
            className="font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )

  const nav =
    layout === 'hero' ? (
      <nav
        className="liquid-glass absolute left-1/2 top-8 hidden -translate-x-1/2 rounded-[28px] px-8 py-5 xl:px-[52px] xl:py-[24px] lg:block"
        aria-label="Primary"
      >
        {navInner}
      </nav>
    ) : (
      <nav
        className="liquid-glass rounded-[28px] px-6 py-4 xl:px-8 xl:py-5"
        aria-label="Primary"
      >
        {navInner}
      </nav>
    )

  const actions = (
    <div className="hidden items-center gap-3 lg:flex">
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
        href={BOOK_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-neon px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 xl:px-5 xl:text-[13px]"
      >
        Get a demo
      </a>
    </div>
  )

  if (layout === 'hero') {
    return (
      <header className="relative mx-auto flex w-full max-w-[1831px] items-start justify-between gap-4 px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10">
        <Link to="/" className="font-grotesk text-[16px] uppercase tracking-wide text-cream">
          SentientWeb
        </Link>
        {nav}
        <div className="ml-auto flex items-center gap-3">
          {actions}
          <SocialIconStack className="hidden xl:flex" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-[1831px] items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 md:px-8 lg:px-10">
        <Link to="/" className="font-grotesk text-[16px] uppercase tracking-wide text-cream">
          SentientWeb
        </Link>
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="pointer-events-auto">{nav}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {actions}
          <SocialIconStack className="hidden xl:flex" />
        </div>
      </div>
    </header>
  )
}
