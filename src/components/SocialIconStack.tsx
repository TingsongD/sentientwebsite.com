import { Github, Mail, Twitter } from 'lucide-react'

export function SocialIconStack({ className = '' }: { className?: string }) {
  const iconClass = 'h-5 w-5 text-cream'
  const btnClass =
    'liquid-glass flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] text-cream transition hover:bg-white/10'
  return (
    <nav className={`flex flex-col gap-3 ${className}`} aria-label="Social links">
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
    </nav>
  )
}
