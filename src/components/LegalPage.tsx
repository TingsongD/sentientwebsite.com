import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LEGAL_LAST_UPDATED_LABEL } from '../constants'
import { MarketingPageLayout } from './MarketingPageLayout'

type LegalSection = {
  id: string
  title: string
  body: ReactNode
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}) {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[860px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          {eyebrow}
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          {title}
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[14px]">
          Last updated: {LEGAL_LAST_UPDATED_LABEL}. {intro}
        </p>

        <div className="mt-12 space-y-10 font-mono text-[15px] normal-case leading-[1.7] text-cream/85 sm:text-[16px]">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
              >
                {section.title}
              </h2>
              {section.body}
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/privacy"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Privacy policy
          </Link>
          <Link
            to="/terms"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Terms of service
          </Link>
          <Link
            to="/"
            className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="mt-4 list-inside list-disc space-y-2 marker:text-neon">{children}</ul>
}

export function LegalLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a href={href} className="text-neon underline-offset-4 transition hover:underline">
      {children}
    </a>
  )
}
