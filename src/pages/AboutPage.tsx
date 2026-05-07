import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

export default function AboutPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company / About
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Revenue recovery orchestration for modern subscription businesses.
        </h1>
        <p className="font-mono mt-6 text-[14px] uppercase leading-relaxed text-cream/55 sm:text-[15px]">
          The orchestration layer that turns revenue intent into the next business action
        </p>

        <div className="mt-12 space-y-8 font-mono text-[15px] normal-case leading-[1.75] text-cream/85 sm:text-[16px]">
          <p className="text-[17px] font-medium leading-snug text-cream sm:text-[18px]">
            SentientWeb finds revenue leaks across your website, billing, CRM, scheduler, and
            messaging stack, then calls the right tool to recover the moment.
          </p>

          <p>
            SentientWeb works across the moments where revenue intent can disappear: demo intent,
            payment friction, no-shows, renewal hesitation, cancellation risk, buyer objections, and
            follow-up gaps across the stack.
          </p>

          <p>
            We build AI-guided recovery paths that meet visitors with approved-source next steps and
            a clear route to human support. The goal is not to replace judgment. The goal is to keep
            valuable demo intent alive until the right person can take over.
          </p>

          <p>
            Trust matters because these moments include business context, buying intent, and
            sometimes sensitive requirements. SentientWeb uses approved source content, keeps human
            handoff available, and publishes clear AI and retention notices.
          </p>

          <p>
            If your business already attracts demand, our job is to help more of that intent reach
            the right next step with the right context attached.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Book a revenue recovery pilot
          </a>
          <Link
            to="/pricing"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            View pricing
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
