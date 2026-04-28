export type PricingTrack = 'product' | 'service'
export type PricingTier = 'starter' | 'growth' | 'scale' | 'enterprise'

export type ProductCalculatorInput = {
  visitors: number
  averageOrderValue: number
  abandonmentRate: number
}

export type ServiceCalculatorInput = {
  visitors: number
  averageTicket: number
  bookingRate: number
}

export type ProductEstimate = {
  recoveries: number
  recoveredRevenue: number
  fee: number
  clientKeeps: number
}

export type ServiceEstimate = {
  bookings: number
  recoveredRevenue: number
  fee: number
  clientKeeps: number
}

export const PRICING_BASE_FEE = 500
export const PRODUCT_PERFORMANCE_RATE = 0.2
export const SERVICE_INCLUDED_BOOKINGS = 100
export const SERVICE_PERFORMANCE_FEE = 100

export const PRICING_ROUTE_PATHS = [
  '/pricing/product',
  '/pricing/service',
  '/pricing/calculator',
  '/pricing/enterprise',
] as const

export const PRICING_META = {
  '/pricing': {
    title: 'SentientWeb Pricing | Pay Only for Recovered Revenue',
    description:
      '$500/month base plus 20% of recovered revenue for products, or $100 per recovered booking for services. Start a 30-day free pilot.',
    canonicalPath: '/pricing',
    absoluteTitle: true,
  },
  '/pricing/product': {
    title: 'Product Track Pricing',
    description:
      'Product Track pricing starts at a $500/month base retainer plus 20% of recovered cart, checkout, upsell, and self-serve revenue.',
    canonicalPath: '/pricing/product',
  },
  '/pricing/service': {
    title: 'Service Track Pricing',
    description:
      'Service Track pricing starts at a $500/month base retainer plus $100 per recovered booking after the included monthly booking volume.',
    canonicalPath: '/pricing/service',
  },
  '/pricing/calculator': {
    title: 'Revenue Recovery Calculator',
    description:
      'Estimate recovered revenue, monthly fee, and retained upside for product and service businesses using SentientWeb.',
    canonicalPath: '/pricing/calculator',
  },
  '/pricing/enterprise': {
    title: 'Enterprise Pricing',
    description:
      'Custom pricing for high-volume revenue recovery teams that need unlimited volume, negotiated performance fees, and sales-led review.',
    canonicalPath: '/pricing/enterprise',
  },
} as const

export const TRACKS: Record<
  PricingTrack,
  {
    label: string
    selectorLabel: string
    audience: string
    kicker: string
    kickerDetail: string
    included: string
    features: string[]
    cta: string
  }
> = {
  product: {
    label: 'Product Track',
    selectorLabel: 'I sell products online',
    audience: 'For ecommerce, SaaS, digital products, and courses',
    kicker: '20% of recovered revenue',
    kickerDetail: 'Performance fee',
    included: '500 recovery instances/mo',
    features: [
      'Cart abandonment recovery',
      'Exit-intent recovery prompts',
      'AI-powered upsell prompts',
      'Real-time revenue dashboard',
    ],
    cta: 'Start Free Pilot',
  },
  service: {
    label: 'Service Track',
    selectorLabel: 'I book appointments',
    audience: 'For clinics, agencies, trades, lawyers, and service teams',
    kicker: '$100 per recovered booking',
    kickerDetail: 'Performance fee',
    included: '100 recovered bookings/mo',
    features: [
      'Phone and SMS booking path',
      'Rescheduling support',
      'Google and Outlook calendar integration',
      'Real-time booking dashboard',
    ],
    cta: 'Start Free Pilot',
  },
}

export const TIER_TABLES: Record<
  PricingTrack,
  Array<{
    tier: PricingTier
    monthlyBase: string
    included: string
    kicker: string
    additionalRecoveries: string
    upgradeTrigger: string
  }>
> = {
  product: [
    {
      tier: 'starter',
      monthlyBase: '$500',
      included: '500 recoveries',
      kicker: '20% of all recovered revenue',
      additionalRecoveries: 'Soft prompt above 500',
      upgradeTrigger: '3-month average above 500',
    },
    {
      tier: 'growth',
      monthlyBase: '$1,500',
      included: '2,000 recoveries',
      kicker: '20% of all recovered revenue',
      additionalRecoveries: 'Mandatory upgrade above 2,000',
      upgradeTrigger: '3-month average above 2,000',
    },
    {
      tier: 'scale',
      monthlyBase: '$4,000',
      included: '6,000 recoveries',
      kicker: '20% of all recovered revenue',
      additionalRecoveries: 'Mandatory upgrade above 6,000',
      upgradeTrigger: '3-month average above 6,000',
    },
    {
      tier: 'enterprise',
      monthlyBase: 'Custom',
      included: 'Unlimited',
      kicker: 'Negotiated performance fee',
      additionalRecoveries: 'Manual review',
      upgradeTrigger: 'Sales-led only',
    },
  ],
  service: [
    {
      tier: 'starter',
      monthlyBase: '$500',
      included: '100 bookings',
      kicker: '$100 after 100 bookings/mo',
      additionalRecoveries: 'Soft prompt above 110',
      upgradeTrigger: '3-month average above 110',
    },
    {
      tier: 'growth',
      monthlyBase: '$1,500',
      included: '300 bookings',
      kicker: '$100 after 300 bookings/mo',
      additionalRecoveries: 'Mandatory upgrade above 330',
      upgradeTrigger: '3-month average above 330',
    },
    {
      tier: 'scale',
      monthlyBase: '$4,000',
      included: '1,000 bookings',
      kicker: '$100 after 1,000 bookings/mo',
      additionalRecoveries: 'Mandatory upgrade above 1,100',
      upgradeTrigger: '3-month average above 1,100',
    },
    {
      tier: 'enterprise',
      monthlyBase: 'Custom',
      included: 'Unlimited',
      kicker: 'Negotiated booking fee',
      additionalRecoveries: 'Manual review',
      upgradeTrigger: 'Sales-led only',
    },
  ],
}

export function calculateProductEstimate({
  visitors,
  averageOrderValue,
  abandonmentRate,
}: ProductCalculatorInput): ProductEstimate {
  const recoveries = visitors * (abandonmentRate / 100) * 0.15
  const recoveredRevenue = recoveries * averageOrderValue * 0.5
  const fee = PRICING_BASE_FEE + recoveredRevenue * PRODUCT_PERFORMANCE_RATE

  return {
    recoveries,
    recoveredRevenue,
    fee,
    clientKeeps: recoveredRevenue - fee,
  }
}

export function calculateServiceEstimate({
  visitors,
  averageTicket,
  bookingRate,
}: ServiceCalculatorInput): ServiceEstimate {
  const bookings = visitors * (bookingRate / 100)
  const recoveredRevenue = bookings * averageTicket
  const fee = PRICING_BASE_FEE + Math.max(0, bookings - SERVICE_INCLUDED_BOOKINGS) * SERVICE_PERFORMANCE_FEE

  return {
    bookings,
    recoveredRevenue,
    fee,
    clientKeeps: recoveredRevenue - fee,
  }
}

export function pricingTrackFromPath(pathname: string): PricingTrack | null {
  if (pathname === '/pricing/product') return 'product'
  if (pathname === '/pricing/service') return 'service'
  return null
}
