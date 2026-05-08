export type OrchestrateSection = {
  id: string
  label: string
  eyebrow: string
  title: string
  body: readonly string[]
  bullets?: readonly string[]
  toolStory?: {
    scenario: string
    decision: string
    toolAction: string
    result: string
  }
}

export const ORCHESTRATE_PATH = '/orchestrate'

export const ORCHESTRATE_SECTIONS: readonly OrchestrateSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    eyebrow: 'Overview',
    title: 'SentientWeb is the orchestration layer above the stack your team already has.',
    body: [
      'SentientWeb sits one level above your website, CRM, scheduling, routing, messaging, and sales tools as the decision layer for revenue recovery.',
      'It decides which system should act, what that system should do, when it should do it, and which visitor, contact, company, subscription, or deal it should apply to.',
    ],
    bullets: [
      'Detect high-intent website behavior before the visitor leaves.',
      'Qualify the visitor before opening the next step.',
      'Call the existing tools your revenue team already trusts to complete the business action.',
    ],
  },
  {
    id: 'how-orchestration-works',
    label: 'How orchestration works',
    eyebrow: 'Operating model',
    title: 'The AI chooses the next business action, then calls the right tool to execute it.',
    body: [
      'A pricing-page visitor, a returning comparison-page visitor, and a security-page evaluator should not all get the same path. SentientWeb reads the page context, qualification state, stack fit, and urgency before choosing the next action.',
      'Sometimes that means asking one more qualification question. Sometimes it means opening the calendar. Sometimes it means writing context into HubSpot, preparing a sales opener, or routing the visitor to a human.',
    ],
    bullets: [
      'Intent signal: what the visitor is doing right now.',
      'Business rule: what your team agreed should happen next.',
      'Execution surface: the existing tool SentientWeb calls to complete the task.',
    ],
  },
  {
    id: 'self-improving-layer',
    label: 'Self-improving layer',
    eyebrow: 'Learning loop',
    title: 'The orchestration layer improves from every recovered outcome.',
    body: [
      'SentientWeb does not treat each visitor, payment event, no-show, or objection as a one-off interaction. It uses outcome feedback to refine which recovery path should run next.',
      'When a save path works, a meeting is recovered, a CRM handoff is accepted, or a buyer objection repeats, the orchestration layer can adjust routing, playbooks, qualification, and reporting rules for the next similar moment.',
    ],
    bullets: [
      'Outcome feedback improves future routing.',
      'Repeated objections become repair work.',
      'Human-approved rules keep the learning loop controlled.',
    ],
  },
  {
    id: 'hubspot-use-case',
    label: 'HubSpot use case',
    eyebrow: 'Use case',
    title: 'HubSpot use case',
    body: [
      'HubSpot becomes the system SentientWeb instructs, not another destination to manage.',
      'The SentientWeb AI backend can use HubSpot to accomplish business tasks: create or update records, attach context, and prepare sales actions.',
      'When a visitor qualifies, SentientWeb can decide what HubSpot should do, when HubSpot should do it, and which contact, company, or deal HubSpot should act on.',
      'The result is simple: sales does not receive a cold calendar event. They receive page history, qualification answers, use case, booking details, and a suggested opener in the CRM workflow they already use.',
    ],
    bullets: [
      'Create or update contact and company context.',
      'Attach pages viewed, qualification answers, and summary notes.',
      'Prepare the salesperson with a suggested first question.',
    ],
  },
  {
    id: 'hubspot',
    label: 'HubSpot',
    eyebrow: 'Use case story / CRM',
    title: 'HubSpot story: turn a pricing-page evaluator into a sales-ready record.',
    body: [
      'A returning visitor from a target account spends time on pricing, integrations, and security. SentientWeb qualifies the buyer moment before anything touches the CRM.',
      'HubSpot remains the source of truth. SentientWeb supplies the timing, qualification context, and suggested next step.',
    ],
    toolStory: {
      scenario:
        'A RevOps director returns to pricing after reading the HubSpot integration page and asks whether their current workflow can stay intact.',
      decision:
        'SentientWeb confirms company domain, role, use case, timeline, and HubSpot fit before treating the visitor as sales-ready.',
      toolAction:
        'HubSpot receives or updates the contact and company, attaches pages viewed, qualification answers, summary notes, booking details, and a suggested opener.',
      result:
        'The salesperson opens HubSpot and sees why the prospect booked, what they evaluated, and what to ask first.',
    },
  },
  {
    id: 'calendly',
    label: 'Calendly',
    eyebrow: 'Use case story / Scheduling',
    title: 'Scheduler story: open the right path after the visitor earns it.',
    body: [
      'A demo-page visitor is ready to talk, but only if the product fits their stack and timeline. SentientWeb qualifies before it exposes the agreed booking path.',
      'The scheduler stays simple: it is the scheduling surface after SentientWeb confirms the meeting is worth protecting.',
    ],
    toolStory: {
      scenario:
        'A VP of Sales compares plan fit, asks about security review timing, and says they need a solution this quarter.',
      decision:
        'SentientWeb determines the visitor is in ICP, has a relevant use case, and has enough urgency to book.',
      toolAction:
        'The scheduler opens the approved path with the qualification context preserved for the stack and the owner.',
      result:
        'The meeting lands with role, use case, timeline, and stack context attached instead of becoming a cold calendar event.',
    },
  },
  {
    id: 'warmly',
    label: 'Warmly',
    eyebrow: 'Use case story / Visitor identification',
    title: 'Warmly story: use account identification as one signal in the buyer-moment decision.',
    body: [
      'Account identification can help, but it should not become the whole motion. SentientWeb treats identification as one input alongside page intent, behavior, and qualification answers.',
      'SentientWeb uses approved rules to choose whether to engage, ask, book, sync, route, or wait.',
    ],
    toolStory: {
      scenario:
        'A named target account visits the comparison page twice, then opens pricing and pauses near the enterprise tier.',
      decision:
        'SentientWeb combines account-level identification with return visits, page sequence, and active hesitation before choosing the next step.',
      toolAction:
        'A Warmly-style account signal can inform which company context appears in the workflow or which account owner should be alerted.',
      result:
        'Sales gets an account-aware moment without pretending identification alone equals qualification.',
    },
  },
  {
    id: 'podium',
    label: 'Podium',
    eyebrow: 'Use case story / Messaging',
    title: 'Podium story: use messaging as the reminder channel after the meeting is real.',
    body: [
      'Messaging tools are useful when there is a real business moment to protect. SentientWeb uses intent, qualification state, and booking status to choose whether a message is needed.',
      'The buyer moment defines the channel, not the other way around.',
    ],
    toolStory: {
      scenario:
        'A qualified prospect books a demo from a security page but tends to miss calendar invites because their team is moving fast.',
      decision:
        'SentientWeb applies the reminder rule because the buyer is qualified and the slot is valuable.',
      toolAction:
        'A Podium-style messaging surface can send the approved reminder, meeting link, and reason they booked through the connected channel.',
      result:
        'The prospect has the meeting details close at hand, and the salesperson has a better chance of an attended demo.',
    },
  },
  {
    id: 'highlevel',
    label: 'HighLevel',
    eyebrow: 'Use case story / Automation suite',
    title: 'HighLevel story: run the workflow only after SentientWeb chooses the playbook.',
    body: [
      'Automation suites work best when the trigger is clean and the next action is clear. SentientWeb improves the trigger by qualifying the visitor before any playbook runs.',
      'HighLevel-style workflows become execution paths, not the intelligence layer.',
    ],
    toolStory: {
      scenario:
        'A visitor asks three implementation questions but is not ready to book because the technical buyer still needs a checklist.',
      decision:
        'SentientWeb routes this to a nurture-and-return path, not a calendar path, because urgency and stakeholder readiness are incomplete.',
      toolAction:
        'A HighLevel-style workflow can send the approved checklist, tag the use case, and schedule a later sales task if the buyer returns.',
      result:
        'The team avoids forcing an unqualified meeting while still keeping a real buying motion alive.',
    },
  },
  {
    id: 'drift',
    label: 'Drift',
    eyebrow: 'Use case story / Conversational marketing',
    title: 'Drift story: use the front-door surface when SentientWeb detects revenue recovery intent.',
    body: [
      'A conversational surface can be useful, but it should appear for the right buyer or customer moment. SentientWeb uses approved rules to identify revenue recovery intent.',
      'If a team already owns a broader engagement platform, SentientWeb can coordinate when that surface should be used.',
    ],
    toolStory: {
      scenario:
        'A comparison-page visitor scrolls through competitor objections, opens pricing in another tab, then hesitates before the demo CTA.',
      decision:
        'SentientWeb treats this as a recovery moment around plan fit and competitive risk, not generic engagement.',
      toolAction:
        'A Drift-style surface can present the approved objection-handling path while SentientWeb controls the qualification and booking logic behind it.',
      result:
        'The visitor gets help in the surface they recognize, while the recovered demo still lands with clean context.',
    },
  },
  {
    id: 'chili-piper',
    label: 'Chili Piper',
    eyebrow: 'Use case story / Routing',
    title: 'Chili Piper story: route only after SentientWeb confirms the visitor belongs in sales motion.',
    body: [
      'Routing matters after there is a qualified buyer to route. SentientWeb focuses on the earlier decision: whether the visitor deserves a protected sales slot.',
      'Once fit is confirmed, routing can become a clean execution layer.',
    ],
    toolStory: {
      scenario:
        'A strategic-account visitor qualifies on company size, stack, urgency, and buying role, then asks to meet this week.',
      decision:
        'SentientWeb confirms the visitor belongs in sales motion and should not be sent to a generic calendar path.',
      toolAction:
        'A Chili Piper-style router can assign the right rep, territory, or meeting type after SentientWeb has already qualified the buyer.',
      result:
        'The right salesperson receives the meeting with the context needed to start from the buyer moment.',
    },
  },
  {
    id: 'qualified',
    label: 'Qualified',
    eyebrow: 'Use case story / Pipeline generation',
    title: 'Qualified story: keep the broad platform focused on moments SentientWeb has already judged.',
    body: [
      'Broad pipeline platforms can cover many enterprise motions. SentientWeb gives that surface an orchestration layer for revenue-ready moments on high-intent pages and workflows.',
      'For teams with a broader platform, SentientWeb can focus that surface on the precise recovery moment that needs action.',
    ],
    toolStory: {
      scenario:
        'An enterprise visitor moves between customer stories, security, and pricing, then returns from a sales email link.',
      decision:
        'SentientWeb identifies a high-intent return pattern and starts a qualification path tied to the visitor use case.',
      toolAction:
        'A Qualified-style platform can be used as the engagement surface while SentientWeb supplies the timing, qualification criteria, and handoff package.',
      result:
        'The broad platform becomes a coordinated surface for revenue recovery instead of a separate parallel motion.',
    },
  },
  {
    id: 'manychat',
    label: 'ManyChat',
    eyebrow: 'Use case story / Messaging automation',
    title: 'ManyChat story: run the message flow after SentientWeb confirms the channel matters.',
    body: [
      'Messaging automation can execute a flow, but it should not decide the whole revenue motion by itself. SentientWeb uses approved rules to choose when messaging is the right next step.',
      'The intelligence lives in the buyer-moment decision; the flow becomes the execution surface.',
    ],
    toolStory: {
      scenario:
        'A qualified visitor books a demo, then asks to receive the meeting details and prep link through a messaging channel their team already uses.',
      decision:
        'SentientWeb selects messaging because the meeting is booked, the visitor is qualified, and reminder context will increase attendance.',
      toolAction:
        'A ManyChat-style flow can send the approved confirmation, reminder, prep link, and meeting reason after SentientWeb triggers the path.',
      result:
        'The visitor receives useful reminders while HubSpot and sales keep the authoritative demo context.',
    },
  },
] as const
