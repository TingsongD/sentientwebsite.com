import { Link } from 'react-router-dom'

export function RoiCalculatorCta() {
  return (
    <section
      className="border-t border-white/10 bg-background px-4 py-10 sm:px-6 sm:py-14 md:px-8 lg:px-10"
      aria-label="ROI calculator"
    >
      <div className="mx-auto max-w-[1831px]">
        <Link
          to="/revenue-leak-calculator"
          className="group flex min-h-[92px] w-full items-center justify-center rounded-[24px] border border-[#FF8A8A]/45 bg-black px-3 py-5 text-center shadow-[0_24px_90px_rgba(255,138,138,0.12)] transition hover:-translate-y-1 hover:border-neon/80 hover:shadow-[0_30px_110px_rgba(111,255,0,0.16)] min-[375px]:min-h-[104px] sm:min-h-[132px] sm:rounded-[28px] sm:px-8 sm:py-6 md:min-h-[154px] lg:min-h-[170px]"
        >
          <span className="font-grotesk max-w-full whitespace-nowrap text-[26px] uppercase leading-none text-[#FF8A8A] transition group-hover:text-neon min-[375px]:text-[30px] min-[430px]:text-[34px] sm:text-[64px] md:text-[86px] lg:text-[108px]">
            Calculate your ROI
          </span>
        </Link>
      </div>
    </section>
  )
}
