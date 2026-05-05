import { Link } from 'react-router-dom'

export function RoiCalculatorCta() {
  return (
    <section
      className="border-t border-white/10 bg-background px-4 py-10 sm:px-6 sm:py-14 md:px-8 lg:px-10"
      aria-label="ROI calculator"
    >
      <div className="mx-auto flex max-w-[1831px] justify-center">
        <Link
          to="/revenue-leak-calculator"
          className="group inline-flex items-center justify-center rounded-full border border-[#FF8A8A]/45 bg-black px-7 py-3 text-center shadow-[0_14px_42px_rgba(255,138,138,0.12)] transition hover:-translate-y-0.5 hover:border-neon/80 hover:shadow-[0_18px_54px_rgba(111,255,0,0.16)] sm:px-8 sm:py-4"
        >
          <span className="font-grotesk whitespace-nowrap text-[12px] uppercase tracking-wide text-[#FF8A8A] transition group-hover:text-neon sm:text-[13px]">
            Estimate recovered demos
          </span>
        </Link>
      </div>
    </section>
  )
}
