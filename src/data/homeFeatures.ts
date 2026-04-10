/** Home page features grid — shared with nav Product dropdown anchor ids. */
export const FEATURES = [
  {
    title: 'Lead qualification',
    bullets: [
      'Asks the right questions — company size, use case, timeline.',
      'Deterministic BANT-lite scoring ensures high-quality meetings.',
      'Routes enterprise leads to sales and SMBs to automation.',
    ],
  },
  {
    title: 'Demo booking',
    bullets: [
      'Books meetings directly on the sales team’s calendar.',
      'Native Calendly integration with UUID validation.',
      'Zero friction: no forms, just a natural conversation.',
    ],
  },
  {
    title: 'Product Q&A',
    bullets: [
      'Answers technical questions from your docs and knowledge base.',
      'Hybrid search (vector + FTS) ensures high-fidelity results.',
      'Sub-1.2s TTFT provides a “sentient” response feel.',
    ],
  },
  {
    title: 'Proactive engagement',
    bullets: [
      'Detects high intent (pricing page, return visits).',
      'Engages at the right moment based on behavioral scores.',
      'Reduces bounce rate and increases conversion directly.',
    ],
  },
  {
    title: 'CRM integration (Phase 2)',
    bullets: [
      'Creates records in HubSpot or Salesforce automatically.',
      'Full conversation context synced to the lead record.',
      'Queue-based retry mechanism ensures zero data loss.',
    ],
  },
  {
    title: 'Content flywheel',
    bullets: [
      'Phase 2: Remotion-powered video generation from your docs.',
      'Auto-posts hooks to X and LinkedIn to drive traffic.',
      'Feedback loop: top questions generate new videos.',
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
