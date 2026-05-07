/** Home page Product feature section, shared by the page and footer anchors. */
export type FunnelFeature = {
  title: string
  body: string
}

export type FunnelFeatureGroup = {
  stage: string
  summary: string
  features: readonly FunnelFeature[]
}

export const FUNNEL_FEATURE_GROUPS: readonly FunnelFeatureGroup[] = [
  {
    stage: 'Top of the funnel',
    summary: 'Recover buying intent before it becomes another anonymous exit.',
    features: [
      {
        title: 'High-intent page detection',
        body: 'Scores visits to pricing, demo, comparison, integration, security, docs, and customer story pages.',
      },
      {
        title: 'Recovery Preview',
        body: 'Lets prospects request a recovery preview from a pricing or website URL.',
      },
      {
        title: 'Page recovery surfaces',
        body: 'Handles pricing, demo, comparison, integration, security, and customer-story hesitation moments.',
      },
      {
        title: 'Business-goal orchestration',
        body: 'Uses your website, CRM, billing, scheduler, messaging, and workflow tools to recover the revenue moment that matters next.',
      },
    ],
  },
  {
    stage: 'Mid-funnel',
    summary: 'Turn active hesitation into a qualified booking path.',
    features: [
      {
        title: 'Page-specific AI engagement',
        body: 'Responds with the right plan-fit, ROI, stack-fit, security, or competitive context for the page they are on.',
      },
      {
        title: 'Approved-source answers',
        body: 'Uses approved content instead of generic responses when visitors ask buying or trust questions.',
      },
      {
        title: 'Qualification questions',
        body: 'Collects role, company domain, use case, stack, timeline, urgency, and fit before the calendar opens.',
      },
      {
        title: 'Human handoff',
        body: 'Routes complex, sensitive, or high-value sessions to a person with the full context preserved.',
      },
      {
        title: 'Stack context',
        body: 'Keeps CRM, scheduler, and install context visible in the buying journey.',
      },
    ],
  },
  {
    stage: 'Bottom of the funnel',
    summary: 'Turn qualified intent into a meeting sales can prepare for.',
    features: [
      {
        title: 'Scheduler and workflow actions',
        body: 'Opens the agreed scheduler, workflow, handoff, or recovery path after the visitor shares enough context to qualify.',
      },
      {
        title: 'CRM context sync',
        body: 'Sends page behavior, qualification, summary, booking details, and opener into sales.',
      },
      {
        title: 'Text and email reminders',
        body: 'Sends reminders with the link, timing, and reason they booked.',
      },
      {
        title: 'Recovered demo reporting',
        body: 'Tracks detected revenue-ready moments, qualified visitors or customers, recovered actions, and stack-visible context.',
      },
      {
        title: 'ROI calculator',
        body: 'Models recovered demos and pipeline influence from existing high-intent website traffic.',
      },
      {
        title: 'Voice feedback add-on',
        body: 'Captures why buyers did not book, did not show, stalled after demo, or signaled churn risk.',
      },
    ],
  },
] as const

export const FEATURES: readonly FunnelFeature[] = FUNNEL_FEATURE_GROUPS.flatMap(
  (group) => group.features,
)

function anchorSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function funnelGroupId(stage: string): string {
  return `funnel-${anchorSlug(stage)}`
}

export function funnelFeatureId(title: string): string {
  return `feature-${anchorSlug(title)}`
}

export function featureSectionId(title: string): string {
  return funnelFeatureId(title)
}
