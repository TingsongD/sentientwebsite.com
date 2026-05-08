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
  'A qualified recovered action means the visitor or customer matched your agreed criteria, shared a relevant use case or account context, provided the needed identifier, met the stack-fit rules, and completed the approved next step.'

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
      'Start with a 30-day revenue recovery pilot measured by qualified recovered actions and stack-visible context.',
    canonicalPath: '/pricing',
    absoluteTitle: true,
  },
  '/pricing/product': {
    title: 'Revenue Recovery Pilot Pricing',
    description:
      'Legacy pricing path for the 30-day revenue recovery pilot measured by qualified recovered actions.',
    canonicalPath: '/pricing/product',
  },
  '/pricing/service': {
    title: 'Revenue Recovery Monthly Pricing',
    description:
      'Monthly revenue recovery pricing for teams turning high-intent pages into qualified next steps.',
    canonicalPath: '/pricing/service',
  },
  '/pricing/calculator': {
    title: 'Recovery ROI Calculator',
    description:
      'Estimate recovered actions, qualified next steps, pipeline influenced, and modeled SentientWeb fees.',
    canonicalPath: '/pricing/calculator',
  },
  '/pricing/enterprise': {
    title: 'Scale Revenue Recovery Pricing',
    description:
      'Scale pricing for high-volume revenue recovery teams that need custom volume and stack reporting.',
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
    label: 'Recovery Pilot',
    selectorLabel: 'Pilot',
    audience: 'For subscription businesses proving revenue recovery without adding another disconnected tool',
    price: '30-Day Rescue Pilot',
    priceDetail: '$0 setup for design partners',
    included: 'Pricing, demo, checkout, billing, comparison, and integration page setup',
    kicker: '$100-$150 per qualified recovered action',
    features: [
      'Scheduler, router, or workflow action path',
      'CRM, billing, or messaging context sync',
      'Qualified recovered action definition agreed before launch',
      'Recovery proof packet with business-accepted outcomes',
    ],
    cta: 'Book a revenue recovery pilot',
  },
  starter: {
    label: 'Monthly Recovery',
    selectorLabel: 'Monthly',
    audience: 'For subscription businesses running revenue recovery as an ongoing operating layer',
    price: '$999',
    priceDetail: '/month includes 5 qualified recovered actions',
    included: 'Monthly Recovery Plan',
    kicker: '$100 per additional qualified recovered action',
    features: [
      'Ongoing visitor-to-revenue recovery loop',
      'Page-specific recovery playbooks',
      'Qualified recovery gates',
      'CRM, billing, scheduler, or workflow context handoff',
    ],
    cta: 'Discuss monthly plan',
  },
  growth: {
    label: 'Growth',
    selectorLabel: 'Growth',
    audience: 'For teams with meaningful traffic on pricing, demo, checkout, billing, account, and comparison pages',
    price: '$1,500',
    priceDetail: '/month includes 15 qualified recovered actions',
    included: '15 qualified recovered actions',
    kicker: '$75 per additional qualified recovered action',
    features: [
      'Everything in Starter',
      'Expanded high-intent page coverage',
      'Business-accepted recovery reporting',
      'Monthly proof and objection review',
    ],
    cta: 'Book a revenue recovery pilot',
  },
  scale: {
    label: 'Scale',
    selectorLabel: 'Scale',
    audience: 'For high-volume teams that need custom reporting and sales operations review',
    price: '$3,000',
    priceDetail: '/month includes 40 qualified recovered actions',
    included: '40 qualified recovered actions',
    kicker: 'Custom success fee after included volume',
    features: [
      'Everything in Growth',
      'Custom qualification thresholds',
      'RevOps-ready stack field mapping',
      'Annual pricing review for scaled recovery volume',
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
    kicker: '$100-$150 per qualified recovered action',
    additionalRecoveries: 'Measured during pilot',
    upgradeTrigger: 'Move to monthly plan after review',
  },
  {
    tier: 'starter',
    monthlyBase: '$999',
    included: '5 qualified recovered actions',
    kicker: '$100 per additional qualified recovered action',
    additionalRecoveries: 'Soft review above 7',
    upgradeTrigger: '3-month average above 7',
  },
  {
    tier: 'growth',
    monthlyBase: '$1,500',
    included: '15 qualified recovered actions',
    kicker: '$75 per additional qualified recovered action',
    additionalRecoveries: 'Soft review above 20',
    upgradeTrigger: '3-month average above 20',
  },
  {
    tier: 'scale',
    monthlyBase: '$3,000',
    included: '40 qualified recovered actions',
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
    upgradeTrigger: 'After 3-month economics review',
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
