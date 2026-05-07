export type SolutionPageContent = {
  slug: string
  navLabel: string
  marketLabel: string
  accentColor: string
  metaTitle: string
  metaDescription: string
  plumberMetaphor: string
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  proofStat: string
  features: { title: string; body: string }[]
  steps: { title: string; body: string }[]
  caseStudy: {
    eyebrow: string
    title: string
    body: string
  }
  disclosure: string
  bottomCta: string
}

export const SOLUTION_PAGES = {
  saas: {
    slug: 'saas',
    navLabel: 'B2B SaaS',
    marketLabel: 'CRM-powered B2B SaaS teams',
    accentColor: '#6366f1',
    metaTitle: 'Demo Recovery for B2B SaaS',
    metaDescription:
      'Recover demo-ready visitors from pricing, demo, comparison, and integration pages. SentientWeb qualifies, books, and syncs the context into the sales workflow.',
    plumberMetaphor: 'Recover demo-ready visitors while intent is still active.',
    hero: {
      eyebrow: 'Use cases / Demo Recovery',
      title: 'Recover demo-ready visitors before they disappear',
      subtitle:
        'SentientWeb gives high-intent SaaS visitors an instant AI demo preview, qualifies fit, opens the booking path, and syncs the full context into HubSpot.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See the recovery flow',
    },
    proofStat:
      'The highest-intent visitors are often already on pricing, demo, comparison, integration, and security pages.',
    features: [
      {
        title: 'Detect demo-ready behavior',
        body: 'Score visits to pricing, demo, comparison, integration, security, docs, and customer story pages so the team can focus on real buying intent.',
      },
      {
        title: 'Handle page-specific hesitation',
        body: 'Answer plan-fit, stack-fit, security, ROI, and competitive questions from approved source content before the visitor leaves.',
      },
      {
        title: 'Qualify before booking',
        body: 'Collect company domain, use case, role, timeline, and stack context before showing the booking path.',
      },
      {
        title: 'Sync the full story to the CRM',
        body: 'Send page path, summary, qualification answers, booking details, and suggested sales opener into the agreed sales workflow.',
      },
    ],
    steps: [
      {
        title: 'Visitor shows demo intent',
        body: 'They revisit pricing, compare alternatives, inspect integrations, or start the demo path.',
      },
      {
        title: 'Concierge qualifies the buyer',
        body: 'SentientWeb asks the minimum questions needed to confirm fit, use case, role, timing, and stack.',
      },
      {
        title: 'Qualified demo gets booked',
        body: 'The visitor books through the approved scheduler and the full context lands where sales works.',
      },
    ],
    caseStudy: {
      eyebrow: 'Demo recovery',
      title: 'Turn high-intent page visits into qualified booked demos.',
      body: 'The first pilot should be judged on qualified booked demos, sales-accepted context, and whether the CRM shows incremental opportunity from existing website traffic.',
    },
    disclosure:
      'SentientWeb uses approved customer content for answers and routes sensitive or complex questions to humans.',
    bottomCta: 'Book a demo recovery pilot',
  },

  'home-services': {
    slug: 'home-services',
    navLabel: 'Home Services',
    marketLabel: 'HVAC, Plumbing, Electrical',
    accentColor: '#059669',
    metaTitle: 'Instant Estimate Recovery for Home Services',
    metaDescription:
      'SentientWeb helps home service teams recover emergency calls with instant estimates, expanded coverage, and dispatch-ready context.',
    plumberMetaphor: 'We are the emergency dispatcher that never sleeps.',
    hero: {
      eyebrow: 'Solutions / Home Services',
      title: 'Stop losing emergency calls to competitors',
      subtitle:
        'When a homeowner needs help after hours, we capture the request, deliver an instant estimate path, and schedule service before they call the next company.',
      primaryCta: 'Get Instant Estimate',
      secondaryCta: 'See How It Works',
    },
    proofStat: 'After-hours service requests often leak to the first company that responds.',
    features: [
      {
        title: 'Emergency calls stay yours',
        body: 'Homeowners with urgent repairs rarely wait. SentientWeb responds instantly and guides them to the right service step.',
      },
      {
        title: 'Instant estimates',
        body: 'The homeowner describes the problem, gets a fast ballpark path, and can reserve service without phone tag.',
      },
      {
        title: 'Dispatch-ready intake',
        body: 'Service type, urgency, equipment, and location are captured before your team sees the job.',
      },
      {
        title: 'Calendar and field flow',
        body: 'Job details can move into your scheduling flow so technicians and homeowners both receive clear next steps.',
      },
    ],
    steps: [
      {
        title: 'Homeowner requests estimate',
        body: 'They describe the issue, location, and urgency.',
      },
      {
        title: 'System matches the job',
        body: 'Service type and coverage area determine the right next step.',
      },
      {
        title: 'Appointment is reserved',
        body: 'The homeowner receives confirmation and your team gets the job context.',
      },
    ],
    caseStudy: {
      eyebrow: 'After-hours recovery',
      title: 'Keep emergency demand from leaking to the next search result.',
      body: 'Home service revenue often leaks in the minutes between a broken system and the first company that responds. SentientWeb keeps your door open without adding another dispatcher.',
    },
    disclosure:
      'AI handles intake and next steps; human support is available for urgent or complex requests.',
    bottomCta: 'Recover service calls',
  },

  insurance: {
    slug: 'insurance',
    navLabel: 'Insurtech SaaS',
    marketLabel: 'Insurance SaaS platforms',
    accentColor: '#2563eb',
    metaTitle: 'Insurtech SaaS Demo Recovery',
    metaDescription:
      'SentientWeb helps insurance SaaS teams recover integration, security, and demo-page buyers with approved-source answers, strict qualification, and human handoff.',
    plumberMetaphor: 'We seal the trust leaks between insurance workflow evaluation and a qualified demo.',
    hero: {
      eyebrow: 'Solutions / Insurtech SaaS',
      title: 'Recover insurance SaaS buyers who stall on risk and workflow fit',
      subtitle:
        'Carriers, MGAs, brokers, and commercial insurance teams inspect security, integration, underwriting, and implementation pages before booking. SentientWeb qualifies fit, answers from approved sources, and routes sensitive questions to humans.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See the recovery flow',
    },
    proofStat:
      'Insurtech SaaS buyers often leave when data security, underwriting workflow, implementation, or integration questions go unanswered.',
    features: [
      {
        title: 'Security questions stay controlled',
        body: 'Approved security and privacy content handles routine trust questions while procurement-sensitive issues route to a person.',
      },
      {
        title: 'Underwriting workflow fit',
        body: 'Buyers can confirm lines of business, data inputs, automation scope, and implementation fit before sales opens the calendar.',
      },
      {
        title: 'HubSpot-ready demo context',
        body: 'Role, company domain, carrier or broker segment, use case, timeline, and stack context arrive with the booked demo.',
      },
      {
        title: 'Human handoff for regulated risk',
        body: 'Coverage, legal, procurement, and regulated-data questions can be escalated with the full page path and qualification record.',
      },
    ],
    steps: [
      {
        title: 'Buyer evaluates fit',
        body: 'They compare pricing, integrations, security posture, and underwriting workflow claims.',
      },
      {
        title: 'Risk and use case are qualified',
        body: 'SentientWeb checks role, insurance segment, data sensitivity, integration needs, and timeline.',
      },
      {
        title: 'Demo path opens',
        body: 'Qualified buyers book through the agreed route while sensitive requirements reach a human with context.',
      },
    ],
    caseStudy: {
      eyebrow: 'Insurance SaaS recovery',
      title: 'Turn risk-page hesitation into prepared sales calls.',
      body: 'Insurance SaaS teams should measure recovery by sales-accepted demos from pricing, integration, security, and workflow pages that previously produced anonymous exits.',
    },
    disclosure:
      'AI supports demo qualification and approved-source guidance; humans handle coverage, legal, procurement, and regulated-data issues.',
    bottomCta: 'Recover insurtech demos',
  },

  ecommerce: {
    slug: 'ecommerce',
    navLabel: 'E-commerce',
    marketLabel: 'Online Retail',
    accentColor: '#7c3aed',
    metaTitle: 'Cart Abandonment Recovery for E-commerce',
    metaDescription:
      'SentientWeb recovers e-commerce revenue leaks with instant product matching, real-time response, secure handling, and human support.',
    plumberMetaphor: 'We patch the leaks where hesitant shoppers leave before checkout.',
    hero: {
      eyebrow: 'Solutions / E-commerce',
      title: 'Recover the sales walking out of your store',
      subtitle:
        'When shoppers hesitate, SentientWeb detects intent and delivers the product match, answer, or offer that brings them back to checkout.',
      primaryCta: 'Get Instant Product Match',
      secondaryCta: 'See Recovery Rate',
    },
    proofStat: 'Cart hesitation often starts with one unresolved product or checkout question.',
    features: [
      {
        title: 'Recover hesitation moments',
        body: 'Sizing concerns, shipping uncertainty, and comparison fatigue become instant next steps instead of abandoned carts.',
      },
      {
        title: 'Product match over popups',
        body: 'Shoppers get a personalized product, variant, or bundle recommendation based on catalog context and intent.',
      },
      {
        title: 'Peak traffic coverage',
        body: 'Product drops and holiday surges get expanded coverage while humans handle the complex cases.',
      },
      {
        title: 'Friction is visible',
        body: 'Each recovery moment shows what almost blocked the sale, helping your team repair the buying path.',
      },
    ],
    steps: [
      {
        title: 'Shopper shows hesitation',
        body: 'Cart exits, comparison loops, or repeated checks signal a revenue leak.',
      },
      {
        title: 'Match or answer appears',
        body: 'The right product, size guidance, shipping detail, or offer is delivered instantly.',
      },
      {
        title: 'Cart path resumes',
        body: 'The shopper returns to checkout or receives a clear human support path.',
      },
    ],
    caseStudy: {
      eyebrow: 'Cart recovery',
      title: 'Turn near-purchases into finished orders.',
      body: 'E-commerce revenue leaks rarely look dramatic. They appear as a shopper leaving with one unresolved question. SentientWeb catches that moment while intent is still active.',
    },
    disclosure:
      'AI delivers product guidance from approved sources, with human support available for complex needs.',
    bottomCta: 'Recover cart revenue',
  },

  healthcare: {
    slug: 'healthcare',
    navLabel: 'Healthcare',
    marketLabel: 'Healthcare SaaS',
    accentColor: '#0891b2',
    metaTitle: 'Healthcare SaaS Demo Recovery',
    metaDescription:
      'SentientWeb helps healthcare SaaS teams recover security, integration, and demo-page buyers with approved-source answers, human handoff, and compliance-aware scoping.',
    plumberMetaphor: 'We fix the trust leaks between healthcare evaluation and the demo request.',
    hero: {
      eyebrow: 'Solutions / Healthcare',
      title: 'Recover healthcare SaaS buyers who stall on trust questions',
      subtitle:
        'Healthcare operators, clinic groups, and IT teams often inspect security, HIPAA, EHR, and integration pages before booking. SentientWeb answers from approved sources, qualifies fit, and routes sensitive questions to humans.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See How It Works',
    },
    proofStat: 'Healthcare SaaS buyers often leave when HIPAA, EHR, workflow, or procurement questions go unanswered.',
    features: [
      {
        title: 'HIPAA-facing answers stay sourced',
        body: 'Visitors get responses from approved security, privacy, and product content instead of improvised compliance claims.',
      },
      {
        title: 'EHR and stack fit',
        body: 'Stack-fit page visitors can confirm implementation path and the right questions for sales before they book.',
      },
      {
        title: 'Compliance-aware pilot scope',
        body: 'Pilot setup defines non-PHI demo qualification, retention expectations, human handoff, and whether BAA review is required before production use.',
      },
      {
        title: 'Human handoff for sensitive questions',
        body: 'Security, clinical, legal, and procurement questions can be routed to a person instead of answered automatically.',
      },
    ],
    steps: [
      {
        title: 'Buyer evaluates trust',
        body: 'They read security, integration, pricing, or demo pages and look for proof that the healthcare workflow is safe.',
      },
      {
        title: 'Fit and risk are checked',
        body: 'Approved source content, stack-fit rules, and handoff thresholds decide whether the buyer should continue to booking.',
      },
      {
        title: 'Demo path opens',
        body: 'Qualified buyers book through the approved route while sensitive requirements are escalated with context.',
      },
    ],
    caseStudy: {
      eyebrow: 'Healthcare SaaS trust',
      title: 'Recover demo intent without overclaiming compliance.',
      body: 'Healthcare SaaS pilots should start with approved website pages, approved non-PHI source content, and clear human escalation. Production use involving PHI should wait for the right BAA and security review.',
    },
    disclosure:
      'AI supports demo qualification and approved-source guidance; humans handle clinical, legal, PHI, and procurement-sensitive issues.',
    bottomCta: 'Recover healthcare demos',
  },

  edtech: {
    slug: 'edtech',
    navLabel: 'Learning SaaS',
    marketLabel: 'Corporate training SaaS',
    accentColor: '#ea580c',
    metaTitle: 'Learning SaaS Demo Recovery',
    metaDescription:
      'SentientWeb helps learning and HR SaaS teams recover customer-story, integration, pricing, and demo-page buyers with CRM-ready context.',
    plumberMetaphor: 'We fix the evaluation leaks between learning-program interest and a qualified demo.',
    hero: {
      eyebrow: 'Solutions / Learning SaaS',
      title: 'Recover corporate training buyers before they leave',
      subtitle:
        'HR, enablement, and L&D leaders inspect integrations, customer stories, implementation pages, and pricing before booking. SentientWeb qualifies the account, answers from approved sources, and sends sales the buying context.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See the recovery flow',
    },
    proofStat:
      'Learning SaaS buyers often leave after reading customer stories or integration pages because the next question is specific to their workforce.',
    features: [
      {
        title: 'Customer-story recovery',
        body: 'Match proof to company size, workforce type, rollout goal, and stakeholder concern while the buyer is still reading.',
      },
      {
        title: 'Stack-fit answers',
        body: 'Answer LMS, HRIS, SSO, analytics, and implementation questions from approved product and docs content.',
      },
      {
        title: 'Qualified before calendar',
        body: 'Capture employee count, stakeholder role, program type, timeline, current stack, and urgency before opening the meeting path.',
      },
      {
        title: 'CRM-ready sales packet',
        body: 'Send page path, use case, qualification answers, buying committee clues, and a suggested opener into the agreed CRM route.',
      },
    ],
    steps: [
      {
        title: 'Buyer studies proof',
        body: 'They move between customer stories, integrations, pricing, and demo pages looking for confidence.',
      },
      {
        title: 'Fit gets qualified',
        body: 'SentientWeb checks workforce size, program need, integration requirements, timeline, and stakeholder role.',
      },
      {
        title: 'Prepared demo gets booked',
        body: 'The qualified buyer books through the approved route while sales receives the full evaluation context.',
      },
    ],
    caseStudy: {
      eyebrow: 'Learning SaaS recovery',
      title: 'Turn customer-story interest into sales-accepted demos.',
      body: 'Corporate training SaaS teams should judge recovery by demos from customer-story and integration pages that include the stakeholder, rollout need, and current stack before the meeting.',
    },
    disclosure:
      'AI supports demo qualification and approved-source guidance; humans handle procurement, legal, and implementation-sensitive questions.',
    bottomCta: 'Recover learning demos',
  },

  hospitality: {
    slug: 'hospitality',
    navLabel: 'Hospitality',
    marketLabel: 'Hotels and Resorts',
    accentColor: '#0891b2',
    metaTitle: 'Direct Booking Recovery for Hotels',
    metaDescription:
      'SentientWeb helps hotels recover direct bookings with instant availability paths, secure handling, and human support for high-value requests.',
    plumberMetaphor: 'We fix the direct-booking leaks that send travelers back to OTAs.',
    hero: {
      eyebrow: 'Solutions / Hospitality',
      title: 'Shift bookings from OTAs to your direct channel',
      subtitle:
        'When travelers hesitate, SentientWeb responds in seconds with availability, policy, or offer guidance that brings them back to book direct.',
      primaryCta: 'Get Instant Availability',
      secondaryCta: 'See How It Works',
    },
    proofStat: 'Traveler questions can interrupt direct booking when no useful answer is available.',
    features: [
      {
        title: 'Odd-hour travelers convert',
        body: 'Guests in other time zones get a useful response while your front desk sleeps.',
      },
      {
        title: 'Real-time property answers',
        body: 'Breakfast, late checkout, parking, and cancellation answers come from approved property content.',
      },
      {
        title: 'Direct margin recovery',
        body: 'Every booking recovered to your direct channel saves third-party commission.',
      },
      {
        title: 'Group demand captured',
        body: 'Event, wedding, and corporate requests are routed with guest count, dates, and budget context.',
      },
    ],
    steps: [
      {
        title: 'Traveler shows intent',
        body: 'Room search, amenity checks, or return visits signal a direct-booking opportunity.',
      },
      {
        title: 'Answer or offer appears',
        body: 'Availability, policy, rate, or package guidance is delivered instantly.',
      },
      {
        title: 'Direct path resumes',
        body: 'The traveler books on your site or reaches a human with context preserved.',
      },
    ],
    caseStudy: {
      eyebrow: 'Direct channel recovery',
      title: 'Recover margin that would otherwise leak to third parties.',
      body: 'Hospitality sites lose guests when small uncertainties interrupt booking. SentientWeb removes those delays without flattening the brand experience.',
    },
    disclosure:
      'AI delivers property-approved next steps, with human support for special requests.',
    bottomCta: 'Recover direct bookings',
  },

  'real-estate': {
    slug: 'real-estate',
    navLabel: 'Real Estate',
    marketLabel: 'Brokerages and Teams',
    accentColor: '#7c3aed',
    metaTitle: 'Lead Response Recovery for Real Estate',
    metaDescription:
      'SentientWeb helps real estate teams recover response-time leaks with instant property matching, showing paths, and human handoff.',
    plumberMetaphor: 'We fix the response leaks between a listing view and a showing.',
    hero: {
      eyebrow: 'Solutions / Real Estate',
      title: 'Be the first agent to respond, win the client',
      subtitle:
        'Buyers and sellers move quickly. SentientWeb responds in seconds, captures intent, matches properties, and opens the showing path before they move elsewhere.',
      primaryCta: 'Get Instant Property Match',
      secondaryCta: 'See How It Works',
    },
    proofStat: 'Property interest loses momentum when showing requests wait for manual response.',
    features: [
      {
        title: 'Speed wins relationships',
        body: 'A buyer contacting several agents usually remembers the first useful response. SentientWeb helps make that response yours.',
      },
      {
        title: 'Instant property match',
        body: 'Budget, beds, neighborhood, and timing become matching guidance instead of another generic search.',
      },
      {
        title: 'Buyer and seller capture',
        body: 'Valuation requests and listing interest are routed with the right context for your team.',
      },
      {
        title: 'Agents focus on closing',
        body: 'Your team spends less time chasing cold inquiries and more time with ready prospects.',
      },
    ],
    steps: [
      {
        title: 'Buyer requests a match',
        body: 'They share budget, timing, and neighborhood preferences.',
      },
      {
        title: 'System captures fit',
        body: 'Preferences are logged and routed to the right agent path.',
      },
      {
        title: 'Showing path opens',
        body: 'Buyer and agent receive the next step with context attached.',
      },
    ],
    caseStudy: {
      eyebrow: 'Showing recovery',
      title: 'Turn listing curiosity into scheduled human contact.',
      body: 'Real estate revenue leaks when property interest sits unanswered. SentientWeb keeps that moment moving until an agent can take over.',
    },
    disclosure:
      'AI supports matching and intake, with licensed humans available for representation and advice.',
    bottomCta: 'Recover property demand',
  },

  legal: {
    slug: 'legal',
    navLabel: 'Legal',
    marketLabel: 'Law Firms',
    accentColor: '#4f46e5',
    metaTitle: 'Client Intake Recovery for Law Firms',
    metaDescription:
      'SentientWeb helps law firms recover client intake leaks with instant consultation paths, secure handling, and human attorney handoff.',
    plumberMetaphor: 'We fix the intake leaks that send potential clients to the next firm.',
    hero: {
      eyebrow: 'Solutions / Legal',
      title: 'Turn website inquiries into booked consultations',
      subtitle:
        'After-hours legal requests often go unanswered. SentientWeb captures urgency, delivers initial next steps, and routes consultations before another firm responds.',
      primaryCta: 'Book Instant Consultation',
      secondaryCta: 'See How It Works',
    },
    proofStat: 'After-hours legal inquiries need a careful path to human review before urgency fades.',
    features: [
      {
        title: 'Urgent matters stay captured',
        body: 'Personal injury, DUI, and family issues need fast response. SentientWeb keeps the intake path open.',
      },
      {
        title: 'Intake without friction',
        body: 'Case type, timeline, location, and urgency are gathered in a guided path instead of a long static form.',
      },
      {
        title: 'Consultation-ready briefs',
        body: 'Every scheduled consultation includes the context paralegals or attorneys need to prepare.',
      },
      {
        title: 'Confidential by design',
        body: 'Encryption in transit, published retention controls, and secure handling support a careful intake process.',
      },
    ],
    steps: [
      {
        title: 'Client requests consultation',
        body: 'They describe matter type, urgency, and preferred next step.',
      },
      {
        title: 'Initial path is clarified',
        body: 'Approved process, fee, and timing content is delivered where appropriate.',
      },
      {
        title: 'Consultation is scheduled',
        body: 'The firm receives a brief and the client receives confirmation.',
      },
    ],
    caseStudy: {
      eyebrow: 'Intake recovery',
      title: 'Keep serious matters from leaking after hours.',
      body: 'Legal demand arrives at stressful moments. SentientWeb helps capture context and route to humans without pretending to provide legal advice.',
    },
    disclosure:
      'AI supports intake and general next steps; attorneys and staff handle legal advice.',
    bottomCta: 'Recover consultations',
  },

  'financial-services': {
    slug: 'financial-services',
    navLabel: 'Fintech SaaS',
    marketLabel: 'Fintech compliance SaaS',
    accentColor: '#059669',
    metaTitle: 'Fintech SaaS Demo Recovery',
    metaDescription:
      'SentientWeb helps fintech and compliance SaaS teams recover security, pricing, integration, and demo-page buyers with approved-source answers and human handoff.',
    plumberMetaphor: 'We patch the trust leaks between fintech evaluation and a qualified demo.',
    hero: {
      eyebrow: 'Solutions / Fintech SaaS',
      title: 'Recover fintech buyers who stall on trust and integration questions',
      subtitle:
        'Fintech, payroll API, billing, RevRec, and compliance buyers inspect security, docs, integrations, and pricing before booking. SentientWeb qualifies fit, answers from approved sources, and routes sensitive questions to humans.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See the recovery flow',
    },
    proofStat:
      'Fintech SaaS buyers often leave when SOC 2, PCI, AML/KYC, API, data residency, or implementation questions are not answered clearly.',
    features: [
      {
        title: 'Compliance answers stay sourced',
        body: 'Routine trust questions are answered from approved security, privacy, and product content instead of improvised claims.',
      },
      {
        title: 'Docs and API fit',
        body: 'Developers and operators can confirm API surface, implementation path, required fields, and stack fit before sales enters.',
      },
      {
        title: 'Strict qualification',
        body: 'Capture segment, role, regulated-data exposure, implementation timeline, current stack, and required compliance review before booking.',
      },
      {
        title: 'Human escalation for high risk',
        body: 'SOC 2, PCI, AML/KYC, legal, procurement, and data residency questions can route to a person with the full page context preserved.',
      },
    ],
    steps: [
      {
        title: 'Buyer evaluates trust',
        body: 'They read security, docs, pricing, integration, or comparison pages and look for a reason to continue or leave.',
      },
      {
        title: 'Fit and risk are checked',
        body: 'Approved-source answers and qualification rules decide whether the buyer should book, continue reading, or reach a human.',
      },
      {
        title: 'Qualified demo gets booked',
        body: 'The buyer books through the agreed route while sales receives the security, API, and use-case context.',
      },
    ],
    caseStudy: {
      eyebrow: 'Fintech SaaS recovery',
      title: 'Turn trust-page scrutiny into prepared sales calls.',
      body: 'Fintech SaaS teams should measure recovery by sales-accepted demos from security, docs, integration, pricing, and comparison pages where buyers previously left anonymously.',
    },
    disclosure:
      'AI supports demo qualification and approved-source guidance; humans handle legal, compliance, procurement, and regulated-data issues.',
    bottomCta: 'Recover fintech demos',
  },

  logistics: {
    slug: 'logistics',
    navLabel: 'Logistics SaaS',
    marketLabel: 'Logistics and supply-chain SaaS',
    accentColor: '#0f766e',
    metaTitle: 'Logistics SaaS Demo Recovery',
    metaDescription:
      'SentientWeb helps logistics SaaS teams recover pricing, integration, TMS, and demo-page buyers with approved-source answers and Pipedrive-ready context.',
    plumberMetaphor: 'We fix the workflow-fit leaks between TMS evaluation and a qualified demo.',
    hero: {
      eyebrow: 'Solutions / Logistics SaaS',
      title: 'Recover logistics buyers who stall on workflow and integration fit',
      subtitle:
        'Fleet, dispatch, operations, and IT buyers inspect TMS, route optimization, hardware, and integration pages before booking. SentientWeb qualifies the account, answers from approved sources, and sends sales the route-ready context.',
      primaryCta: 'Book a demo recovery pilot',
      secondaryCta: 'See the recovery flow',
    },
    proofStat:
      'Logistics SaaS buyers often leave integration pages when they cannot confirm TMS connectivity, route rules, carrier workflows, or implementation effort.',
    features: [
      {
        title: 'TMS and workflow answers',
        body: 'Approved-source responses handle TMS connectivity, route optimization, dispatch workflows, driver hardware, and implementation fit.',
      },
      {
        title: 'Operations-first qualification',
        body: 'Capture fleet size, shipment volume, stakeholder role, current stack, timeline, and route complexity before opening the meeting path.',
      },
      {
        title: 'Pipedrive-ready handoff',
        body: 'Send page path, qualification answers, use case, stack fit, and suggested opener into Pipedrive or the agreed workflow.',
      },
      {
        title: 'Human handoff for complex fit',
        body: 'Enterprise integrations, custom route logic, data import, and procurement questions can reach a person with the full context preserved.',
      },
    ],
    steps: [
      {
        title: 'Buyer checks integration fit',
        body: 'They move between pricing, TMS integrations, route workflows, and demo pages.',
      },
      {
        title: 'Operational need is qualified',
        body: 'SentientWeb checks fleet profile, route complexity, stakeholder role, implementation timeline, and current tools.',
      },
      {
        title: 'Prepared demo gets booked',
        body: 'The qualified buyer books through the approved route while sales receives the workflow and stack context.',
      },
    ],
    caseStudy: {
      eyebrow: 'Logistics SaaS recovery',
      title: 'Turn integration-page research into qualified demos.',
      body: 'Logistics SaaS teams should judge recovery by demos from pricing and TMS integration pages where buyers arrive with workflow requirements already captured.',
    },
    disclosure:
      'AI supports demo qualification and approved-source guidance; humans handle complex implementation, legal, and procurement issues.',
    bottomCta: 'Recover logistics demos',
  },
} as const satisfies Record<string, SolutionPageContent>

export type SolutionSlug = keyof typeof SOLUTION_PAGES

export const SOLUTION_NAV_LIST = (
  ['saas'] as SolutionSlug[]
).map((slug) => ({
  slug,
  navLabel: SOLUTION_PAGES[slug].navLabel,
  marketLabel: SOLUTION_PAGES[slug].marketLabel,
}))

export const LEGACY_SOLUTION_REDIRECTS = {
  'b2b-saas': '/solutions/saas',
  'insurance-agencies': '/solutions/insurance',
  'luxury-ecommerce': '/solutions/ecommerce',
  'healthcare-clinics': '/solutions/healthcare',
  'education-edtech': '/solutions/edtech',
  'hotel-hospitality': '/solutions/hospitality',
  'legal-services': '/solutions/legal',
  'car-dealerships': '/#solutions',
} as const satisfies Record<string, string>

export type LegacySolutionSlug = keyof typeof LEGACY_SOLUTION_REDIRECTS

export function getLegacySolutionRedirect(slug: string) {
  return Object.hasOwn(LEGACY_SOLUTION_REDIRECTS, slug)
    ? LEGACY_SOLUTION_REDIRECTS[slug as LegacySolutionSlug]
    : null
}
