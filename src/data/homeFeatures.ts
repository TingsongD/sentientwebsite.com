/** Home page feature grid, shared with the Product dropdown anchor ids. */
export const FEATURES = [
  {
    title: 'Demo-ready detection',
    bullets: [
      'Scores visitors on pricing, demo, comparison, integration, security, and docs pages.',
      'Separates casual traffic from buyers showing real sales intent.',
      'Triggers the recovery path only when page behavior warrants it.',
    ],
  },
  {
    title: 'Page-specific concierge',
    bullets: [
      'Pricing pages get ROI and plan-fit guidance.',
      'Comparison pages get approved differentiation.',
      'Integration pages get stack-fit questions and next steps.',
    ],
  },
  {
    title: 'Qualified demo booking',
    bullets: [
      'Collects company domain, use case, role, and timeline before opening the calendar.',
      'Books only visitors who meet the agreed qualification rules.',
      'Keeps sales calendars clear of low-fit meetings.',
    ],
  },
  {
    title: 'CRM context sync',
    bullets: [
      'Maps the CRM handoff before launch.',
      'Adds pages viewed, summary, qualification answers, and booking context.',
      'Gives sales the opener before the call starts.',
    ],
  },
  {
    title: 'Recovered demo reporting',
    bullets: [
      'Tracks demo-ready visitors detected, qualified, booked, and sales-accepted.',
      'Shows which pages create the most recovered demo opportunities.',
      'Keeps the pilot measured around qualified booked demos, not message volume.',
    ],
  },
  {
    title: 'Human handoff',
    bullets: [
      'Lets a human join or take over when the buyer needs a person.',
      'Routes complex or sensitive questions out of automation.',
      'Preserves the full context for the handoff.',
    ],
  },
] as const

export function featureSectionId(title: string): string {
  return (
    'feature-' +
    title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  )
}
