import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <MarketingPageLayout>
      <section
        className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-20 md:py-24"
        aria-labelledby="cs-heading"
      >
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          SentientWeb
        </p>
        <h1
          id="cs-heading"
          className="font-grotesk text-[36px] uppercase leading-none text-cream sm:text-[48px] md:text-[56px]"
        >
          {title}
        </h1>
        <p className="font-grotesk mt-6 text-[22px] uppercase tracking-wide text-neon sm:text-[26px]">
          Coming soon
        </p>
        <p className="font-mono mt-6 text-[15px] normal-case leading-relaxed text-cream/80 sm:text-[16px]">
          We are actively building this part of the platform. Check back shortly, or book a demo
          if you would like early access or to discuss your use case with our team.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </MarketingPageLayout>
  )
}
