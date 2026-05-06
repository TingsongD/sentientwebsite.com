import { Link } from 'react-router-dom'

const ROI_CTA_VIDEO_URL =
  'https://cdn.shopify.com/videos/c/o/v/9fe664570f2b4284a76f522f11fcf58a.mp4'

export function RoiCalculatorCta() {
  return (
    <section
      className="relative flex min-h-[220px] items-center overflow-hidden border-t border-white/10 bg-background px-4 py-16 sm:min-h-[280px] sm:px-6 sm:py-20 md:min-h-[340px] md:px-8 md:py-24 lg:min-h-[420px] lg:px-10 lg:py-28"
      aria-label="ROI calculator"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-55"
        src={ROI_CTA_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),rgba(1,3,13,0.72)_62%,rgba(1,3,13,0.92)_100%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-[1831px] justify-center">
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
