import { Bot, LockKeyhole, ShieldCheck } from 'lucide-react'

type TrustStripProps = {
  className?: string
}

const TRUST_ITEMS = [
  {
    label: 'AI orchestration layer',
    detail: 'Human handoff when needed',
    Icon: Bot,
    badgeClass: 'border-violet-300/40 bg-violet-400/15 text-violet-100',
  },
  {
    label: 'Stack-ready context',
    detail: 'Encrypted action paths',
    Icon: ShieldCheck,
    badgeClass: 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100',
  },
  {
    label: 'Retention controls',
    detail: '18-month maximum disclosed',
    Icon: LockKeyhole,
    badgeClass: 'border-neon/40 bg-neon/15 text-neon',
  },
] as const

export function TrustStrip({ className = '' }: TrustStripProps) {
  return (
    <div
      className={`liquid-glass grid gap-3 rounded-[24px] border border-white/[0.08] p-3 sm:grid-cols-3 ${className}`}
      aria-label="Trust and privacy"
    >
      {TRUST_ITEMS.map(({ label, detail, Icon, badgeClass }) => (
        <div key={label} className="flex items-center gap-3 rounded-[18px] bg-white/[0.03] p-3">
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${badgeClass}`}
            aria-hidden
          >
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="min-w-0">
            <span className="block font-grotesk text-[11px] uppercase tracking-wide text-cream sm:text-[12px]">
              {label}
            </span>
            <span className="block font-mono text-[10px] uppercase leading-snug text-cream/55 sm:text-[11px]">
              {detail}
            </span>
          </span>
        </div>
      ))}
      <p className="sr-only">
        Human handoff is available when a revenue recovery path needs a person.
      </p>
    </div>
  )
}
