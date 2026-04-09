import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

export default function AboutPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company · About
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          How we empower the sentient web age
        </h1>
        <p className="font-mono mt-6 text-[14px] uppercase leading-relaxed text-cream/55 sm:text-[15px]">
          Our mission statement
        </p>

        <div className="mt-12 space-y-8 font-mono text-[15px] normal-case leading-[1.75] text-cream/85 sm:text-[16px]">
          <p className="text-[17px] font-medium leading-snug text-cream sm:text-[18px]">
            The web was built for pages. The next era belongs to{' '}
            <span className="text-neon">presence</span>—systems that perceive intent, respond with
            judgment, and take action on your behalf. We call that the{' '}
            <strong className="font-semibold text-cream">sentient web</strong>: not science fiction,
            but a practical layer of intelligence sitting on top of the sites and stacks you already
            own.
          </p>

          <p>
            For too long, meaningful automation was gated behind enterprise price tags and
            quarter-long implementations, while everyone else got decorative chat bubbles that could
            not book a meeting, update a CRM, or cite a real document. That split left millions of
            businesses stuck between “too expensive to qualify” and “too shallow to trust.”
            SentientWeb exists to close that gap.
          </p>

          <p>
            Our mission is to{' '}
            <strong className="font-medium text-cream">
              empower every serious B2B team with an autonomous website agent
            </strong>
            —one that qualifies visitors with structure, books time on real calendars, answers
            product questions from knowledge you control, and engages when behavioral signals show
            someone is ready to move. We believe those capabilities should be available on a sensible
            monthly footprint, live in days not quarters, and integrate with the tools revenue teams
            already run on.
          </p>

          <p>
            “Sentient” here does not mean pretending to be human or replacing your judgment. It
            means the surface you present to the world is{' '}
            <strong className="font-medium text-cream">continuously attentive</strong>: watching for
            intent, routing enterprise opportunities differently from self-serve paths, and
            preserving full context when a conversation escalates to your people. The website stops
            being a brochure and becomes part of your go-to-market engine.
          </p>

          <p>
            We are building toward a platform-agnostic core—one engine, many adapters—so the same
            ideas apply whether you sell software, professional services, hospitality, or
            commerce. The sentient web age is not about any single channel; it is about{' '}
            <strong className="font-medium text-cream">
              reliable, accountable automation wherever your customers find you
            </strong>
            .
          </p>

          <p>
            If that resonates, we would love to show you what live qualification and booking feel
            like on your own site—and to work with you as we extend the product toward richer
            content, attribution, and distribution. The sentient web is not a destination on a
            roadmap; it is the standard we believe buyers will expect. Our job is to put it within
            reach.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Book a demo
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
