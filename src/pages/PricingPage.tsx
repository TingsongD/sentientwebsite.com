import { Check, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketingHeader } from '../components/MarketingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { BOOK_DEMO_URL } from '../constants'

type Cell = boolean | 'text'

const B2B_ROWS: { label: string; starter: Cell; growth: Cell; enterprise: Cell }[] = [
  { label: 'Monthly conversations', starter: 'text', growth: 'text', enterprise: 'text' },
  { label: 'CRM integration (HubSpot, Salesforce)', starter: true, growth: true, enterprise: true },
  { label: 'Knowledge base Q&A', starter: true, growth: true, enterprise: true },
  { label: 'Lead qualification', starter: true, growth: true, enterprise: true },
  { label: 'Calendly demo booking', starter: true, growth: true, enterprise: true },
  { label: 'AI video generation (Remotion)', starter: false, growth: true, enterprise: true },
  { label: 'Auto-post to X + LinkedIn', starter: false, growth: true, enterprise: true },
  { label: 'Advanced proactive triggers', starter: false, growth: true, enterprise: true },
  { label: 'Attribution (content → visit → demo)', starter: false, growth: true, enterprise: true },
  { label: 'Custom integrations', starter: false, growth: false, enterprise: true },
  { label: 'Dedicated onboarding', starter: false, growth: false, enterprise: true },
  { label: 'SLA guarantee', starter: false, growth: false, enterprise: true },
  { label: 'Phone support', starter: false, growth: false, enterprise: true },
  { label: 'Multi-site deployment', starter: false, growth: false, enterprise: true },
]

const B2B_TEXT: Record<'starter' | 'growth' | 'enterprise', Record<string, string>> = {
  starter: { 'Monthly conversations': '1,000 / mo' },
  growth: { 'Monthly conversations': 'Unlimited' },
  enterprise: { 'Monthly conversations': 'Unlimited' },
}

function PlanCell({
  value,
  columnKey,
  rowLabel,
  highlight,
}: {
  value: Cell
  columnKey: 'starter' | 'growth' | 'enterprise'
  rowLabel: string
  highlight?: boolean
}) {
  const base =
    'border-b border-white/10 px-4 py-3 sm:px-5' +
    (highlight ? ' border-neon/25 bg-neon/[0.04]' : '')

  if (value === 'text') {
    return (
      <td className={`${base} text-center font-mono text-[12px] uppercase text-cream sm:text-[13px]`}>
        {B2B_TEXT[columnKey][rowLabel]}
      </td>
    )
  }
  return (
    <td className={`${base} text-center`}>
      <span className="sr-only">{value ? 'Included' : 'Not included'}</span>
      {value ? (
        <Check className="mx-auto h-5 w-5 text-neon" strokeWidth={2.25} aria-hidden />
      ) : (
        <Minus className="mx-auto h-5 w-5 text-cream/20" strokeWidth={2} aria-hidden />
      )}
    </td>
  )
}

export default function PricingPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cream focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:uppercase focus:text-background"
      >
        Skip to main content
      </a>
      <MarketingHeader layout="page" />
      <main id="main-content" className="bg-background">
        <section
          className="mx-auto max-w-[1831px] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10"
          aria-labelledby="pricing-heading"
        >
          <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
            SentientWeb · B2B SaaS
          </p>
          <h1
            id="pricing-heading"
            className="font-grotesk mb-4 text-[36px] uppercase leading-none text-cream sm:text-[48px] md:text-[60px]"
          >
            Pricing
          </h1>
          <p className="font-mono max-w-3xl text-[14px] uppercase leading-relaxed text-cream/75 sm:text-[15px]">
            Phase 1 agent alone — or the full Phase 2 flywheel. Both priced against labor, not
            software (per investor deck positioning vs. $20–30K/yr enterprise chat and $25–100/mo
            reactive bots).
          </p>
          <p className="font-mono mt-4 max-w-3xl text-[13px] uppercase leading-relaxed text-cream/55 sm:text-[14px]">
            Phase 1 ($499/mo): agent only. Phase 2 ($999/mo): agent + video + social — the flywheel
            compounds.
          </p>

          <div className="mt-12 overflow-x-auto rounded-[24px] liquid-glass">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                B2B SaaS plans: Starter, Growth, and Enterprise feature comparison
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-white/15 px-4 py-4 font-grotesk text-[12px] uppercase tracking-wide text-cream/60 sm:px-5 sm:text-[13px]"
                  >
                    Capability
                  </th>
                  <th
                    scope="col"
                    className="border-b border-white/15 px-4 py-4 text-center font-grotesk text-[13px] uppercase text-cream sm:px-5 sm:text-[15px]"
                  >
                    Starter
                  </th>
                  <th
                    scope="col"
                    className="border-b border-neon/40 bg-neon/5 px-4 py-4 text-center font-grotesk text-[13px] uppercase text-cream sm:px-5 sm:text-[15px]"
                  >
                    <span className="mb-1 block font-mono text-[10px] text-neon sm:text-[11px]">
                      Most popular
                    </span>
                    Growth
                  </th>
                  <th
                    scope="col"
                    className="border-b border-white/15 px-4 py-4 text-center font-grotesk text-[13px] uppercase text-cream sm:px-5 sm:text-[15px]"
                  >
                    Enterprise
                  </th>
                </tr>
                <tr>
                  <td className="border-b border-white/10 px-4 py-3 font-mono text-[11px] uppercase text-cream/50 sm:px-5 sm:text-[12px]">
                    Price (B2B)
                  </td>
                  <td className="border-b border-white/10 px-4 py-3 text-center font-grotesk text-[20px] text-cream sm:text-[22px]">
                    $499
                    <span className="block font-mono text-[11px] font-normal uppercase text-cream/50">
                      /month
                    </span>
                  </td>
                  <td className="border-b border-neon/30 bg-neon/5 px-4 py-3 text-center font-grotesk text-[20px] text-cream sm:text-[22px]">
                    $999
                    <span className="block font-mono text-[11px] font-normal uppercase text-cream/50">
                      /month
                    </span>
                  </td>
                  <td className="border-b border-white/10 px-4 py-3 text-center font-grotesk text-[20px] text-cream sm:text-[22px]">
                    $1,999
                    <span className="block font-mono text-[11px] font-normal uppercase text-cream/50">
                      /month
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-white/10 px-4 py-3 font-mono text-[11px] uppercase text-cream/50 sm:px-5 sm:text-[12px]">
                    Phase focus
                  </td>
                  <td className="border-b border-white/10 px-4 py-3 text-center font-mono text-[11px] uppercase leading-snug text-cream/70 sm:px-5 sm:text-[12px]">
                    Phase 1 — inbound agent
                  </td>
                  <td className="border-b border-neon/30 bg-neon/5 px-4 py-3 text-center font-mono text-[11px] uppercase leading-snug text-cream/70 sm:px-5 sm:text-[12px]">
                    Phase 2 — agent + video + social
                  </td>
                  <td className="border-b border-white/10 px-4 py-3 text-center font-mono text-[11px] uppercase leading-snug text-cream/70 sm:px-5 sm:text-[12px]">
                    Phase 2 + enterprise rollout
                  </td>
                </tr>
              </thead>
              <tbody>
                {B2B_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="border-b border-white/10 px-4 py-3 text-left font-mono text-[11px] uppercase leading-snug text-cream/80 sm:px-5 sm:text-[12px]"
                    >
                      {row.label}
                    </th>
                    <PlanCell value={row.starter} columnKey="starter" rowLabel={row.label} />
                    <PlanCell
                      value={row.growth}
                      columnKey="growth"
                      rowLabel={row.label}
                      highlight
                    />
                    <PlanCell value={row.enterprise} columnKey="enterprise" rowLabel={row.label} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section
            className="mt-14"
            aria-labelledby="shopify-heading"
          >
            <h2
              id="shopify-heading"
              className="font-grotesk mb-2 text-[24px] uppercase text-cream sm:text-[28px]"
            >
              Shopify App Store
            </h2>
            <p className="font-mono mb-8 max-w-2xl text-[13px] uppercase leading-relaxed text-cream/60 sm:text-[14px]">
              Phase 3 distribution channel — same core engine with a commerce adapter (from deck:
              freemium acquisition + Pro upsell).
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="liquid-glass rounded-[24px] p-6 sm:p-8">
                <h3 className="font-grotesk text-[18px] uppercase text-cream">Free</h3>
                <p className="font-grotesk mt-2 text-[28px] text-neon sm:text-[32px]">$0</p>
                <ul className="font-mono mt-6 space-y-2 text-[12px] uppercase leading-relaxed text-cream/75 sm:text-[13px]">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                    Up to 100 conversations / month
                  </li>
                </ul>
              </div>
              <div className="liquid-glass rounded-[24px] p-6 sm:p-8 ring-1 ring-neon/30">
                <h3 className="font-grotesk text-[18px] uppercase text-cream">Pro</h3>
                <p className="font-grotesk mt-2 text-[28px] text-cream sm:text-[32px]">
                  $49<span className="font-mono text-[14px] uppercase text-cream/50">/month</span>
                </p>
                <ul className="font-mono mt-6 space-y-2 text-[12px] uppercase leading-relaxed text-cream/75 sm:text-[13px]">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                    Unlimited conversations
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" aria-hidden />
                    Proactive triggers
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neon px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[14px]"
            >
              Book a demo
            </a>
            <Link
              to="/"
              className="liquid-glass rounded-full px-8 py-4 font-grotesk text-[13px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[14px]"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
