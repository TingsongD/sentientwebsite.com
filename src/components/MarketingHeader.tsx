import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Link, type To, useLocation } from 'react-router-dom'
import { BOOK_DEMO_URL, OPERATOR_LOGIN_URL } from '../constants'
import { FEATURES, featureSectionId } from '../data/homeFeatures'
import { INTEGRATION_NAV_LINKS } from '../data/integrationPagesContent'
import { SOLUTION_NAV_LIST } from '../data/solutionPagesContent'

const DROPDOWN_PANEL =
  'liquid-glass absolute left-1/2 top-full z-[60] mt-2 min-w-[12rem] max-h-[min(24rem,70vh)] -translate-x-1/2 overflow-y-auto rounded-[20px] border border-white/[0.08] py-2 shadow-lg'

const DROPDOWN_LINK =
  'block px-4 py-2.5 font-grotesk text-[12px] uppercase tracking-wide text-cream/90 transition hover:bg-white/[0.06] hover:text-neon'

type NavMenuId = 'product' | 'solutions' | 'integrations'

function buildProductLinks(): { id: string; label: string; to: To }[] {
  return [
    { id: 'product-overview', label: 'Overview', to: { pathname: '/', hash: 'features' } },
    ...FEATURES.map((f) => ({
      id: featureSectionId(f.title),
      label: f.title,
      to: { pathname: '/', hash: featureSectionId(f.title) },
    })),
  ]
}

function buildSolutionLinks(): { id: string; label: string; to: To }[] {
  return [
    {
      id: 'solutions-overview',
      label: 'Overview',
      to: { pathname: '/', hash: 'solutions' },
    },
    ...SOLUTION_NAV_LIST.map(({ slug, navLabel }) => ({
      id: slug,
      label: navLabel,
      to: `/solutions/${slug}`,
    })),
  ]
}

function buildIntegrationLinks(): { id: string; label: string; to: To }[] {
  return INTEGRATION_NAV_LINKS.map(({ label, slug }) => ({
    id: slug,
    label,
    to: `/integrations/${slug}`,
  }))
}

function PrimaryNavList() {
  const [openMenu, setOpenMenu] = useState<NavMenuId | null>(null)
  const navRootRef = useRef<HTMLUListElement>(null)

  const productBtnId = useId()
  const productMenuId = useId()
  const solutionsBtnId = useId()
  const solutionsMenuId = useId()
  const integrationsBtnId = useId()
  const integrationsMenuId = useId()

  const productLinks = buildProductLinks()
  const solutionLinks = buildSolutionLinks()
  const integrationLinks = buildIntegrationLinks()

  useEffect(() => {
    if (openMenu === null) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null)
    }
    const onPointerDown = (e: PointerEvent) => {
      const el = navRootRef.current
      if (el && !el.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [openMenu])

  const toggle = (id: NavMenuId) => {
    setOpenMenu((m) => (m === id ? null : id))
  }

  const close = () => setOpenMenu(null)

  return (
    <ul ref={navRootRef} className="flex items-center gap-5 xl:gap-8">
      <li className="relative">
        <button
          type="button"
          id={productBtnId}
          className="inline-flex items-center gap-1 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
          aria-expanded={openMenu === 'product'}
          aria-haspopup="true"
          aria-controls={productMenuId}
          onClick={() => toggle('product')}
        >
          Product
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${openMenu === 'product' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {openMenu === 'product' ? (
          <ul
            id={productMenuId}
            role="menu"
            aria-labelledby={productBtnId}
            className={DROPDOWN_PANEL}
          >
            {productLinks.map(({ id, label, to }) => (
              <li key={id} role="presentation">
                <Link role="menuitem" to={to} className={DROPDOWN_LINK} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </li>

      <li className="relative">
        <button
          type="button"
          id={solutionsBtnId}
          className="inline-flex items-center gap-1 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
          aria-expanded={openMenu === 'solutions'}
          aria-haspopup="true"
          aria-controls={solutionsMenuId}
          onClick={() => toggle('solutions')}
        >
          Solutions
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${openMenu === 'solutions' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {openMenu === 'solutions' ? (
          <ul
            id={solutionsMenuId}
            role="menu"
            aria-labelledby={solutionsBtnId}
            className={DROPDOWN_PANEL}
          >
            {solutionLinks.map(({ id, label, to }) => (
              <li key={id} role="presentation">
                <Link role="menuitem" to={to} className={DROPDOWN_LINK} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </li>

      <li>
        <Link
          to="/pricing"
          className="font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
        >
          Pricing
        </Link>
      </li>

      <li className="relative">
        <button
          type="button"
          id={integrationsBtnId}
          className="inline-flex items-center gap-1 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:text-neon"
          aria-expanded={openMenu === 'integrations'}
          aria-haspopup="true"
          aria-controls={integrationsMenuId}
          onClick={() => toggle('integrations')}
        >
          Integrations
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${openMenu === 'integrations' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {openMenu === 'integrations' ? (
          <ul
            id={integrationsMenuId}
            role="menu"
            aria-labelledby={integrationsBtnId}
            className={DROPDOWN_PANEL}
          >
            {integrationLinks.map(({ id, label, to }) => (
              <li key={id} role="presentation">
                <Link role="menuitem" to={to} className={DROPDOWN_LINK} onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </li>
    </ul>
  )
}

export function MarketingHeader({ layout }: { layout: 'hero' | 'page' }) {
  const { pathname } = useLocation()

  const nav = (
    <nav
      className="liquid-glass z-[55] overflow-visible rounded-[28px] px-8 py-5 xl:px-[52px] xl:py-[24px]"
      aria-label="Primary"
    >
      <PrimaryNavList key={pathname} />
    </nav>
  )

  const actions = (
    <div className="hidden items-center gap-3 lg:flex">
      <a
        href={OPERATOR_LOGIN_URL}
        className="font-grotesk text-[12px] uppercase tracking-wide text-cream/80 transition hover:text-neon xl:text-[13px]"
      >
        Log in
      </a>
      <a
        href={BOOK_DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
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

  const positionClass =
    layout === 'page' ? 'sticky top-0 z-50 bg-background' : 'relative'

  return (
    <header
      className={`${positionClass} mx-auto flex w-full max-w-[1831px] items-start justify-between gap-4 px-4 pt-[env(safe-area-inset-top)] sm:px-6 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:justify-items-stretch lg:gap-4 lg:px-10`}
    >
      <Link
        to="/"
        className="mt-4 font-condiment leading-none text-[22px] text-neon normal-case sm:text-[28px] md:text-[36px] lg:justify-self-start lg:text-[44px]"
      >
        SentientWeb
      </Link>
      <div className="hidden justify-self-center self-start overflow-visible lg:block">{nav}</div>
      <div className="flex items-start gap-3 self-start lg:justify-self-end">{actions}</div>
    </header>
  )
}
