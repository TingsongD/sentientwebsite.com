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
    marketLabel: 'B2B SaaS',
    accentColor: '#6366f1',
    metaTitle: 'Instant Demo Recovery for B2B SaaS',
    metaDescription:
      'SentientWeb fixes demo pipeline leaks with instant access, calendar-ready next steps, human handoff, encryption, and zero data retention.',
    plumberMetaphor: 'We fix the pipeline leaks between your website and your calendar.',
    hero: {
      eyebrow: 'Solutions / B2B SaaS',
      title: 'We fix the leaks in your demo pipeline',
      subtitle:
        'Replace your request form with an instant demo path that captures revenue opportunities and schedules the next step in 60 seconds.',
      primaryCta: 'See Instant Demo',
      secondaryCta: 'Watch How It Works',
    },
    proofStat: '55% of demo requests die from slow response.',
    features: [
      {
        title: 'Stop slow demo leaks',
        body: 'Hot prospects research after business hours. SentientWeb meets them while they are still evaluating and moves them to the next step before a competitor responds.',
      },
      {
        title: 'Instant demo path',
        body: 'Visitors choose an instant demo and get a guided walkthrough immediately, instead of waiting for a form reply.',
      },
      {
        title: 'Capture buyer context',
        body: 'The system reads site signals, feature interest, and intent so your team enters each call with useful context.',
      },
      {
        title: 'Calendar-ready pipeline',
        body: 'Meetings are scheduled automatically with the account brief your revenue team needs to prepare.',
      },
    ],
    steps: [
      {
        title: 'Visitor chooses instant demo',
        body: 'They share basic context and the walkthrough begins immediately.',
      },
      {
        title: 'AI delivers next steps',
        body: 'Approved proof, objection handling, and product guidance are served from your source material.',
      },
      {
        title: 'Meeting lands on calendar',
        body: 'Your team receives a warm opportunity with context, timeline, and requested next step.',
      },
    ],
    caseStudy: {
      eyebrow: 'Pipeline recovery',
      title: 'Turn request-form leakage into booked revenue moments.',
      body: 'For SaaS teams, the biggest leak is the gap between buyer intent and seller response. SentientWeb keeps that moment alive and routes the visitor to a human when needed.',
    },
    disclosure:
      'Visitors interact with AI for instant next steps, with human support available whenever they ask.',
    bottomCta: 'Start demo recovery',
  },

  'home-services': {
    slug: 'home-services',
    navLabel: 'Home Services',
    marketLabel: 'HVAC, Plumbing, Electrical',
    accentColor: '#059669',
    metaTitle: 'Instant Estimate Recovery for Home Services',
    metaDescription:
      'SentientWeb helps home service teams recover emergency calls with instant estimates, zero-miss coverage, and dispatch-ready context.',
    plumberMetaphor: 'We are the emergency dispatcher that never sleeps.',
    hero: {
      eyebrow: 'Solutions / Home Services',
      title: 'Stop losing emergency calls to competitors',
      subtitle:
        'When a homeowner needs help after hours, we capture the request, deliver an instant estimate path, and schedule service before they call the next company.',
      primaryCta: 'Get Instant Estimate',
      secondaryCta: 'See How It Works',
    },
    proofStat: '15-20 emergency calls lost per night can mean $1.5M+ annually.',
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
    navLabel: 'Insurance',
    marketLabel: 'Brokers and Agencies',
    accentColor: '#2563eb',
    metaTitle: 'Instant Quote Recovery for Insurance',
    metaDescription:
      'SentientWeb helps insurance teams become the first responder with instant quote paths, pre-call context, secure handling, and human handoff.',
    plumberMetaphor: 'We seal the response-time leaks that send buyers to faster brokers.',
    hero: {
      eyebrow: 'Solutions / Insurance',
      title: 'Be the first broker to respond, every time',
      subtitle:
        'When a business owner shops for coverage, the fastest useful response wins. SentientWeb makes that response instant and routes the right next step.',
      primaryCta: 'Get Instant Quote',
      secondaryCta: 'See How It Works',
    },
    proofStat: '50% of inquiries walk to the faster responder.',
    features: [
      {
        title: 'Open enrollment coverage',
        body: 'During peak season, overflow demand still gets a useful first step, coverage-fit context, and a path to your team.',
      },
      {
        title: 'Instant quote path',
        body: 'Business owners get a fast coverage estimate path while they are still comparing options on your site.',
      },
      {
        title: 'Prepared consultations',
        body: 'Employee count, industry, timeline, current carrier, and budget context are captured before the meeting.',
      },
      {
        title: 'Seasonal scale',
        body: 'Inquiry spikes are handled without temporary hiring or missed revenue opportunities.',
      },
    ],
    steps: [
      {
        title: 'Buyer requests a quote',
        body: 'They share company basics and coverage needs.',
      },
      {
        title: 'Fit is captured',
        body: 'Industry, employee count, timeline, and carrier context are prepared.',
      },
      {
        title: 'Consultation is scheduled',
        body: 'Your producer receives the brief and the buyer gets a confirmed next step.',
      },
    ],
    caseStudy: {
      eyebrow: 'Speed-to-response',
      title: 'Win the window before a faster broker does.',
      body: 'Insurance buyers compare several options at once. SentientWeb helps you meet them first with useful context and a clear path to a licensed human.',
    },
    disclosure:
      'AI provides intake and general next steps; licensed humans handle coverage advice and binding.',
    bottomCta: 'Recover quote demand',
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
    proofStat: '72% of shoppers abandon carts before purchase.',
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
        body: 'Product drops and holiday surges get zero-miss coverage while humans handle the complex cases.',
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
    marketLabel: 'Clinics and Practices',
    accentColor: '#0891b2',
    metaTitle: 'Instant Booking Recovery for Healthcare',
    metaDescription:
      'SentientWeb supports healthcare access with instant booking paths, privacy-minded intake, encryption, zero data retention, and human handoff.',
    plumberMetaphor: 'We fix patient access leaks before uncertainty becomes delay.',
    hero: {
      eyebrow: 'Solutions / Healthcare',
      title: 'No patient should wait because your phone was busy',
      subtitle:
        'Patients abandon care paths when coverage, location, or scheduling questions go unanswered. SentientWeb gives them instant next steps and routes sensitive needs to people.',
      primaryCta: 'Get Instant Booking',
      secondaryCta: 'See How It Works',
    },
    proofStat: '25% booking abandonment can mean 40+ lost patients per day per clinic.',
    features: [
      {
        title: 'Coverage questions answered',
        body: 'Patients get real-time response from approved intake and insurance content instead of waiting for the front desk.',
      },
      {
        title: 'After-hours access',
        body: 'Late-night searches can become appointment requests rather than voicemail or competitor leakage.',
      },
      {
        title: 'Privacy-minded intake',
        body: 'Zero data retention, end-to-end encryption, and secure handling are built into the patient access path.',
      },
      {
        title: 'Provider matching',
        body: 'Location, visit type, and provider preference help route the patient to the appropriate next step.',
      },
    ],
    steps: [
      {
        title: 'Patient starts booking',
        body: 'They share visit type, coverage question, and preferred timing.',
      },
      {
        title: 'Fit and route are checked',
        body: 'Approved content and routing rules identify the next step.',
      },
      {
        title: 'Appointment path opens',
        body: 'The patient gets confirmation or a human handoff for sensitive needs.',
      },
    ],
    caseStudy: {
      eyebrow: 'Patient access',
      title: 'Reduce avoidable access delays without overclaiming compliance.',
      body: 'Healthcare pages should be careful and clear. SentientWeb can support secure intake flows and BAA planning, while clinical decisions and regulated advice stay with humans.',
    },
    disclosure:
      'AI supports intake and general access steps; humans handle clinical, billing, and sensitive issues.',
    bottomCta: 'Recover patient access',
  },

  edtech: {
    slug: 'edtech',
    navLabel: 'EdTech',
    marketLabel: 'Education Technology',
    accentColor: '#ea580c',
    metaTitle: 'Enrollment Recovery for EdTech',
    metaDescription:
      'SentientWeb helps education teams recover enrollment leaks with guided applications, advisor handoff, secure handling, and instant next steps.',
    plumberMetaphor: 'We fix the enrollment leaks between interest and application completion.',
    hero: {
      eyebrow: 'Solutions / EdTech',
      title: 'Stop losing enrollments to form abandonment',
      subtitle:
        'When prospective students hesitate, SentientWeb removes friction, guides the next step, and routes advisor calls when human help matters.',
      primaryCta: 'Start Instant Application',
      secondaryCta: 'See How It Works',
    },
    proofStat: '68% enrollment form abandonment is a major revenue leak.',
    features: [
      {
        title: 'Recover started applications',
        body: 'A paused form often signals uncertainty, not disinterest. SentientWeb delivers the exact next step needed to continue.',
      },
      {
        title: 'Guided application path',
        body: 'Students answer naturally, see progress, and receive real-time response on requirements and deadlines.',
      },
      {
        title: 'Advisor-ready context',
        body: 'When an advisor call is needed, the student journey, program interest, and hesitation point are already captured.',
      },
      {
        title: 'Peak season coverage',
        body: 'Enrollment spikes are handled with zero-miss coverage for repeated cost, schedule, and program questions.',
      },
    ],
    steps: [
      {
        title: 'Student starts application',
        body: 'The long form becomes a guided path with visible progress.',
      },
      {
        title: 'Questions get resolved',
        body: 'Program details, costs, scheduling, and aid content are delivered instantly.',
      },
      {
        title: 'Completion or advisor call',
        body: 'The student finishes the step or schedules time with full context attached.',
      },
    ],
    caseStudy: {
      eyebrow: 'Enrollment recovery',
      title: 'Keep student intent moving when forms create friction.',
      body: 'EdTech revenue leaks happen when motivated students hit uncertainty alone. SentientWeb keeps the path clear and brings humans in at the right moment.',
    },
    disclosure:
      'AI guides application next steps, with human advisors available for complex decisions.',
    bottomCta: 'Recover enrollments',
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
    proofStat: '23% of abandoned bookings can come from unanswered traveler questions.',
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
    proofStat: '60+ agent inquiries per day with a 4-hour response average means lost deals.',
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
    proofStat: '40% of after-hours legal inquiries lost can mean 100+ missed clients monthly.',
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
        body: 'End-to-end encryption, zero data retention, and secure handling support a careful intake process.',
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
    navLabel: 'Financial Services',
    marketLabel: 'Lenders and RIAs',
    accentColor: '#059669',
    metaTitle: 'Rate Response Recovery for Lenders',
    metaDescription:
      'SentientWeb helps financial teams recover rate-response leaks with instant estimate paths, secure handling, and human handoff.',
    plumberMetaphor: 'We patch the response leaks between rate shopping and advisory calls.',
    hero: {
      eyebrow: 'Solutions / Financial Services',
      title: 'The first lender to respond gets the deal',
      subtitle:
        'Borrowers and investors compare options quickly. SentientWeb delivers an instant estimate path and schedules the pre-approval or advisory next step while they are still on your site.',
      primaryCta: 'Get Instant Rate Estimate',
      secondaryCta: 'See How It Works',
    },
    proofStat: '70% of borrowers choose the first responder; 35% abandon partial applications.',
    features: [
      {
        title: 'Rate shoppers move fast',
        body: 'Visitors comparing several lenders get a useful estimate path in seconds, not hours.',
      },
      {
        title: 'Applications resume',
        body: 'Missing documents and unclear requirements become guided next steps instead of abandoned applications.',
      },
      {
        title: 'Prepared calls only',
        body: 'Loan amount, credit range, property type, and timeline are captured before the human call.',
      },
      {
        title: 'Compliance-aware path',
        body: 'Secure handling, audit-friendly records, and clear human escalation support regulated workflows.',
      },
    ],
    steps: [
      {
        title: 'Borrower requests estimate',
        body: 'They share basic financial and property context.',
      },
      {
        title: 'Estimate path appears',
        body: 'Program fit, document needs, and next steps are clarified.',
      },
      {
        title: 'Human call is scheduled',
        body: 'The lender or advisor receives the brief before the call.',
      },
    ],
    caseStudy: {
      eyebrow: 'Rate response recovery',
      title: 'Win the decision window while intent is still high.',
      body: 'Financial services revenue leaks when rate shoppers wait too long for a useful answer. SentientWeb keeps that window open and routes advice to humans.',
    },
    disclosure:
      'AI supports intake and general next steps; licensed professionals handle advice and decisions.',
    bottomCta: 'Recover rate demand',
  },
} as const satisfies Record<string, SolutionPageContent>

export type SolutionSlug = keyof typeof SOLUTION_PAGES

export const SOLUTION_NAV_LIST = (
  Object.keys(SOLUTION_PAGES) as SolutionSlug[]
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
