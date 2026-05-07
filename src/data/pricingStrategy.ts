export type PricingPlan = 'pilot' | 'starter' | 'growth' | 'scale'
export type PricingTrack = PricingPlan
export type PricingTier = PricingPlan | 'annual'

export type DemoRecoveryCalculatorInput = {
  highIntentVisitors: number
  currentDemoConversionRate: number
  recoveredDemoLiftRate: number
  averageContractValue: number
  demoToOpportunityRate: number
}

export type DemoRecoveryEstimate = {
  currentDemos: number
  recoveredDemos: number
  qualifiedBookedDemos: number
  pipelineInfluenced: number
  estimatedFee: number
}

export const QUALIFIED_BOOKED_DEMO_DEFINITION =
  'A qualified booked demo means the visitor matched your agreed ICP, shared a relevant use case, provided business email or company domain, indicated role or buying involvement, met the stack-fit rules, and booked through the approved calendar path.'

export const PRICING_ROUTE_PATHS = [
  '/pricing/product',
  '/pricing/service',
  '/pricing/calculator',
  '/pricing/enterprise',
] as const

export const PRICING_META = {
  '/pricing': {
    title: 'SentientWeb Pricing | 30-Day Recovery Pilot',
    description:
      'Start with a 30-day recovery pilot for B2B SaaS demo recovery, measured by qualified booked demos and HubSpot-visible context.',
    canonicalPath: '/pricing',
    absoluteTitle: true,
  },
  '/pricing/product': {
    title: 'Demo Recovery Pilot Pricing',
    description:
      'Legacy pricing path for the 30-day B2B SaaS demo recovery pilot measured by qualified booked demos.',
    canonicalPath: '/pricing/product',
  },
  '/pricing/service': {
    title: 'Demo Recovery Monthly Pricing',
    description:
      'Monthly B2B SaaS demo recovery pricing for teams turning high-intent pages into qualified booked demos.',
    canonicalPath: '/pricing/service',
  },
  '/pricing/calculator': {
    title: 'Recovery ROI Calculator',
    description:
      'Estimate recovered demos, qualified booked demos, pipeline influenced, and modeled SentientWeb fees.',
    canonicalPath: '/pricing/calculator',
  },
  '/pricing/enterprise': {
    title: 'Scale Demo Recovery Pricing',
    description:
      'Scale pricing for high-volume B2B SaaS demo recovery teams that need custom volume and CRM reporting.',
    canonicalPath: '/pricing/enterprise',
  },
} as const

export const PRICING_PLAN_ORDER = ['pilot', 'starter', 'growth', 'scale'] as const

export const TRACKS: Record<
  PricingPlan,
  {
    label: string
    selectorLabel: string
    audience: string
    price: string
    priceDetail: string
    included: string
    kicker: string
    features: string[]
    cta: string
  }
> = {
  pilot: {
    label: 'First 10 Pilot',
    selectorLabel: 'Pilot',
    audience: 'For B2B SaaS teams proving demo recovery before adding another revenue tool',
    price: '30-Day Rescue Pilot',
    priceDetail: '$0 setup for design partners',
    included: 'Pricing, demo, comparison, and integration page setup',
    kicker: '$100-$150 per qualified booked demo',
    features: [
      'Calendly or Chili Piper booking path',
      'HubSpot contact and note sync',
      'Qualified booked demo definition agreed before launch',
      'Pilot proof packet with sales-accepted outcomes',
    ],
    cta: 'Book a demo recovery pilot',
  },
  starter: {
    label: 'After Pilot Proof',
    selectorLabel: 'Monthly',
    audience: 'For SaaS teams expanding after the pilot proves HubSpot-visible context and demo recovery',
    price: '$999',
    priceDetail: '/month includes 5 qualified booked demos',
    included: 'Monthly Recovery Plan',
    kicker: '$100 per additional qualified booked demo',
    features: [
      'Ongoing visitor-to-demo recovery loop',
      'Page-specific recovery playbooks',
      'Qualified booking gate',
      'HubSpot context handoff',
    ],
    cta: 'Discuss monthly plan',
  },
  growth: {
    label: 'Growth',
    selectorLabel: 'Growth',
    audience: 'For sales-led teams with meaningful traffic on pricing, demo, and comparison pages',
    price: '$1,500',
    priceDetail: '/month includes 15 qualified booked demos',
    included: '15 qualified booked demos',
    kicker: '$75 per additional qualified booked demo',
    features: [
      'Everything in Starter',
      'Expanded high-intent page coverage',
      'Sales-accepted demo reporting',
      'Monthly proof and objection review',
    ],
    cta: 'Book a demo recovery pilot',
  },
  scale: {
    label: 'Scale',
    selectorLabel: 'Scale',
    audience: 'For high-volume teams that need custom reporting and sales operations review',
    price: '$3,000',
    priceDetail: '/month includes 40 qualified booked demos',
    included: '40 qualified booked demos',
    kicker: 'Custom success fee after included volume',
    features: [
      'Everything in Growth',
      'Custom qualification thresholds',
      'RevOps-ready CRM field mapping',
      'Annual pricing review after a successful pilot',
    ],
    cta: 'Talk to Sales',
  },
}

export const TIER_TABLES: Array<{
  tier: PricingTier
  monthlyBase: string
  included: string
  kicker: string
  additionalRecoveries: string
  upgradeTrigger: string
}> = [
  {
    tier: 'pilot',
    monthlyBase: '30-day pilot',
    included: 'CRM fit check and pilot pages',
    kicker: '$100-$150 per qualified booked demo',
    additionalRecoveries: 'Measured during pilot',
    upgradeTrigger: 'Move to monthly plan after pilot proof',
  },
  {
    tier: 'starter',
    monthlyBase: '$999',
    included: '5 qualified booked demos',
    kicker: '$100 per additional qualified booked demo',
    additionalRecoveries: 'Soft review above 7',
    upgradeTrigger: '3-month average above 7',
  },
  {
    tier: 'growth',
    monthlyBase: '$1,500',
    included: '15 qualified booked demos',
    kicker: '$75 per additional qualified booked demo',
    additionalRecoveries: 'Soft review above 20',
    upgradeTrigger: '3-month average above 20',
  },
  {
    tier: 'scale',
    monthlyBase: '$3,000',
    included: '40 qualified booked demos',
    kicker: 'Custom success fee',
    additionalRecoveries: 'Manual review',
    upgradeTrigger: 'Sales-led only',
  },
  {
    tier: 'annual',
    monthlyBase: '$12k-$18k/year',
    included: 'Starter or Growth annual commitment',
    kicker: 'Pilot credit and optional proof-rights discount',
    additionalRecoveries: 'Same included volume as chosen tier',
    upgradeTrigger: 'After pilot proves 3-month economics',
  },
]

function nonNegativeFinite(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function percentageRate(value: number) {
  return Math.min(nonNegativeFinite(value), 100)
}

export function calculateDemoRecoveryEstimate({
  highIntentVisitors,
  currentDemoConversionRate,
  recoveredDemoLiftRate,
  averageContractValue,
  demoToOpportunityRate,
}: DemoRecoveryCalculatorInput): DemoRecoveryEstimate {
  const safeHighIntentVisitors = nonNegativeFinite(highIntentVisitors)
  const safeCurrentDemoConversionRate = percentageRate(currentDemoConversionRate)
  const safeRecoveredDemoLiftRate = percentageRate(recoveredDemoLiftRate)
  const safeAverageContractValue = nonNegativeFinite(averageContractValue)
  const safeDemoToOpportunityRate = percentageRate(demoToOpportunityRate)

  const currentDemos = safeHighIntentVisitors * (safeCurrentDemoConversionRate / 100)
  const recoveredDemos = safeHighIntentVisitors * (safeRecoveredDemoLiftRate / 100)
  const qualifiedBookedDemos = recoveredDemos
  const pipelineInfluenced =
    qualifiedBookedDemos * safeAverageContractValue * (safeDemoToOpportunityRate / 100)
  const estimatedFee = Math.max(500, qualifiedBookedDemos * 100)

  return {
    currentDemos,
    recoveredDemos,
    qualifiedBookedDemos,
    pipelineInfluenced,
    estimatedFee,
  }
}

export function pricingPlanFromPath(pathname: string): PricingPlan | null {
  if (pathname === '/pricing/product') return 'pilot'
  if (pathname === '/pricing/service') return 'starter'
  if (pathname === '/pricing/enterprise') return 'scale'
  return null
}

export const pricingTrackFromPath = pricingPlanFromPath
