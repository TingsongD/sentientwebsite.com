/** Home page feature grid, shared with the Product dropdown anchor ids. */
export const FEATURES = [
  {
    title: 'Revenue leak detection',
    bullets: [
      'Reads high-intent site signals before visitors disappear.',
      'Surfaces the exact next step for each buyer path.',
      'Turns stalled sessions into recoverable revenue moments.',
    ],
  },
  {
    title: 'Instant access paths',
    bullets: [
      'Guides visitors to estimates, demos, quotes, or bookings.',
      'Keeps momentum without long forms or delayed replies.',
      'Routes complex needs to a human with context attached.',
    ],
  },
  {
    title: 'Approved-source responses',
    bullets: [
      'Uses your docs, policies, and product material as source content.',
      'Delivers personalized next steps without unsupported claims.',
      'Keeps teams aligned on what visitors see before handoff.',
    ],
  },
  {
    title: 'Zero-miss coverage',
    bullets: [
      'Covers after-hours demand, seasonal spikes, and return visits.',
      'Protects peak traffic without adding another intake shift.',
      'Keeps humans focused on the highest-value moments.',
    ],
  },
  {
    title: 'Secure handoff',
    bullets: [
      'Human support stays available when a visitor asks for it.',
      'Encryption in transit protects sensitive request paths.',
      'Published retention controls keep the recovery flow accountable.',
    ],
  },
  {
    title: 'Vertical playbooks',
    bullets: [
      'Tailored paths for SaaS, services, insurance, commerce, and more.',
      'Market-specific CTAs match how each buyer wants to move.',
      'One revenue recovery system adapts across your site.',
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
