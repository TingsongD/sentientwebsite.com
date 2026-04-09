export type SolutionPageContent = {
  slug: string
  navLabel: string
  hero: {
    eyebrow: string
    title: string
    deckHook: string
    paragraphs: string[]
  }
  challenges: { title: string; body: string }[]
  howWeFit: { title: string; body: string }[]
  playbook: { title: string; body: string }[]
  pullQuote: string
  ctaLine: string
}

export const SOLUTION_PAGES = {
  'legal-services': {
    slug: 'legal-services',
    navLabel: 'Legal services',
    hero: {
      eyebrow: 'Solutions · Legal',
      title: 'Turn website visitors into qualified consults — without another intake paralegal.',
      deckHook:
        'Same autonomous engine as our B2B core: qualify, book, answer from your knowledge base — priced against labor, not enterprise chat contracts.',
      paragraphs: [
        'Law firms and legal service brands live in a narrow window: high-stakes inquiries, strict positioning, and calendars that fill faster than your team can triage web leads. Most sites either dump visitors into a generic form or leave them to read static FAQs that never distinguish “right fit” from “wrong jurisdiction.”',
        'SentientWeb is built for the gap between $25 reactive chatbots and $20K+/year enterprise suites: an agent that asks the right questions, books consultations on your calendar, and grounds answers in the materials you approve — so partners see fewer junk calls and more matters that match how you practice.',
      ],
    },
    challenges: [
      {
        title: 'Intake noise drowns out real cases',
        body: 'Practice-area pages attract everyone from tire-kickers to viable retainers. Without structured qualification, your best lawyers spend billable time filtering email.',
      },
      {
        title: 'Consultation booking is still manual',
        body: 'Calendly links buried three clicks deep lose momentum. You need the same “no forms, natural conversation” flow the rest of your pipeline promises.',
      },
      {
        title: 'Explainers don’t scale with headcount',
        body: 'Fee structures, timelines, and “what to bring” questions repeat endlessly. Your knowledge base already exists — it needs retrieval that feels human, not a search box bolt-on.',
      },
    ],
    howWeFit: [
      {
        title: 'BANT-style qualification, firm-tuned',
        body: 'Configure the agent to capture matter type, urgency, geography, and budget band — then route enterprise-style engagements to partners and smaller matters to the right workflow.',
      },
      {
        title: 'Native Calendly booking',
        body: 'Visitors book directly on the team’s calendar once thresholds are met, mirroring the deck’s Phase 1 promise: demos — here, consults — without form friction.',
      },
      {
        title: 'Knowledge-grounded answers',
        body: 'Point the agent at practice guides, intake PDFs, and approved FAQs. Hybrid retrieval keeps answers aligned with what you’ve published — not generic legal advice.',
      },
      {
        title: 'Proactive engagement on intent',
        body: 'Return visits to fees, team bios, or results pages signal serious interest. Behavioral triggers let the agent engage when intent is highest, not only when someone clicks chat.',
      },
    ],
    playbook: [
      {
        title: 'Paste the snippet',
        body: 'Deploy like analytics or Intercom — one script, live in minutes on your marketing site or landing pages.',
      },
      {
        title: 'Connect CRM + calendar',
        body: 'Sync HubSpot or Salesforce for lead records with full conversation context, and wire Calendly for consultation slots.',
      },
      {
        title: 'Publish your playbook',
        body: 'Upload or link the docs visitors already read. Set routing rules: e.g., cross-border matters to a dedicated intake queue.',
      },
      {
        title: 'Go live with rules you trust',
        body: 'Enterprise matters to named partners; standard consults to pooled calendars — deterministic routing, not black-box guessing.',
      },
    ],
    pullQuote:
      'Your intake team costs thousands a month and works business hours. SentientWeb is built to sit in the labor-cost gap the deck targets — $500–2,000/month — and work 24/7.',
    ctaLine: 'See how firms qualify and book without adding headcount.',
  },

  'car-dealerships': {
    slug: 'car-dealerships',
    navLabel: 'Car dealerships',
    hero: {
      eyebrow: 'Solutions · Automotive retail',
      title: 'Qualify buyers and book test drives while your floor team closes deals.',
      deckHook:
        'One engine, many adapters: the same core that powers B2B SaaS — behavior tracking, proactive triggers, and real calendar actions — tuned for VDPs and service lanes.',
      paragraphs: [
        'Automotive retail sites get traffic that spans tire-kickers, serious shoppers, and service customers who all need different next steps. Static forms split the difference badly: either you over-collect and slow people down, or you under-collect and waste desk time.',
        'SentientWeb treats your website like a always-on digital greeter: it answers inventory-adjacent questions from your approved content, qualifies budget and timeline, books test drives or sales calls on Calendly, and nudges high-intent visitors when they return to the same VIN or payment page.',
      ],
    },
    challenges: [
      {
        title: 'High intent hides in repeat sessions',
        body: 'Someone who views the same truck three times is not “just browsing.” Most chat tools wait passively; you need intent-based engagement from the product story in the deck.',
      },
      {
        title: 'Internet and floor teams get duplicate leads',
        body: 'Without CRM-native handoff, the same shopper creates two records. HubSpot or Salesforce integration keeps one thread with full context.',
      },
      {
        title: 'F&I and trim questions don’t need a human every time',
        body: 'Program docs, warranty summaries, and delivery policies belong in a knowledge base the agent can search — vector + full-text — instead of burning manager cycles.',
      },
    ],
    howWeFit: [
      {
        title: 'Lead qualification before the desk',
        body: 'Capture cash vs finance, trade-in, and timeline so your BDC routes hot leads to the right closer.',
      },
      {
        title: 'Book the drive, not “someone will call you”',
        body: 'Calendly-backed booking removes friction the deck calls out as Phase 1 table stakes.',
      },
      {
        title: 'Product Q&A from your docs',
        body: 'Ground responses in OEM bulletins, store policies, and service menus you control.',
      },
      {
        title: 'Proactive on pricing and payment pages',
        body: 'Match the deck’s “pricing page, return visits” signals — engage when shoppers are closest to a decision.',
      },
    ],
    playbook: [
      {
        title: 'Wire your knowledge sources',
        body: 'Point at incentives pages, service specials, and FAQ content — the agent cites what you publish.',
      },
      {
        title: 'Set routing by deal type',
        body: 'Fleet or commercial inquiries to a dedicated queue; retail to floor rotations.',
      },
      {
        title: 'Connect CRM + calendar',
        body: 'Every conversation lands in the CRM with structured fields your team already reports on.',
      },
      {
        title: 'Launch in under a day',
        body: 'The deck’s “15 minutes to live” positioning is the bar: snippet, tools, rules, go.',
      },
    ],
    pullQuote:
      'Same autonomous qualification enterprise chat promises — without the 15-week implementation tax the deck contrasts against.',
    ctaLine: 'Put an agent on your lot’s digital front door.',
  },

  'hotel-hospitality': {
    slug: 'hotel-hospitality',
    navLabel: 'Hotel & hospitality',
    hero: {
      eyebrow: 'Solutions · Hospitality',
      title: 'Capture group sales, events, and VIP inquiries before they bounce to OTAs.',
      deckHook:
        'Built for high-touch B2B-style selling inside hospitality: qualify RFPs, book catering calls, answer policy questions from one knowledge base.',
      paragraphs: [
        'Hotels and venue brands compete on experience, but their websites often stall at “submit an RFP” black holes. Planners comparing three cities need fast answers on capacity, AV, and catering — not a promise that sales will reply “within 48 hours.”',
        'SentientWeb gives you an agent that qualifies event size, dates, and budget band, books discovery calls on your sales team’s calendars, and answers repeatable questions from your brand standards and package sheets — the same “qualify, book, answer” loop the pitch deck centers for B2B SaaS, applied to hospitality revenue.',
      ],
    },
    challenges: [
      {
        title: 'RFP volume spikes are seasonal',
        body: 'You cannot scale temporary headcount for conference season. Automation has to preserve tone and accuracy.',
      },
      {
        title: 'OTA shoppers need a reason to book direct',
        body: 'Proactive engagement when someone lingers on packages or wedding pages recovers margin that would otherwise leave the site.',
      },
      {
        title: 'Brand voice is non-negotiable',
        body: 'Generic bots break luxury positioning. Answers must come from your approved copy and policies.',
      },
    ],
    howWeFit: [
      {
        title: 'Structured qualification for events and groups',
        body: 'Capture headcount, date flexibility, and F&B needs before a human ever opens the thread.',
      },
      {
        title: 'Calendar-backed sales conversations',
        body: 'Book site inspections or proposal calls via Calendly with the same UUID-safe integration the product roadmap describes.',
      },
      {
        title: 'Knowledge search across property docs',
        body: 'Floor plans, package tiers, and FAQ content — hybrid retrieval for accurate, on-brand replies.',
      },
      {
        title: 'CRM records for sales follow-up',
        body: 'HubSpot or Salesforce entries carry the full conversation so group sales picks up mid-story.',
      },
    ],
    playbook: [
      {
        title: 'Import property and brand content',
        body: 'Link PDFs, microsites, and internal sell sheets the agent is allowed to reference.',
      },
      {
        title: 'Define “enterprise vs SMB” routing',
        body: 'Large programs to director-level calendars; social events to shared pools.',
      },
      {
        title: 'Turn on proactive triggers',
        body: 'Re-engage visitors who return to high-value pages — the deck’s behavioral scoring story, applied to banquets and suites.',
      },
      {
        title: 'Measure meetings booked, not just chats',
        body: 'Aligns with the GTM milestones: booking rate and setup time, not vanity message counts.',
      },
    ],
    pullQuote:
      'Phase 2’s content flywheel can later turn top planner questions into social hooks — same engine, hospitality adapter.',
    ctaLine: 'Give planners an on-brand concierge that actually books.',
  },

  'insurance-agencies': {
    slug: 'insurance-agencies',
    navLabel: 'Insurance agencies',
    hero: {
      eyebrow: 'Solutions · Insurance',
      title: 'Pre-qualify shoppers and route to licensed producers with context intact.',
      deckHook:
        'Autonomous actions, not reactive scripts: capture coverage needs, book reviews, and sync CRM — the deck’s “takes real actions” bar.',
      paragraphs: [
        'Insurance sites walk a tightrope: visitors want fast clarity on coverage types and next steps, while carriers and regulators expect careful boundaries around advice. Most teams default to “call us” or brittle forms that duplicate data already in your CRM.',
        'SentientWeb qualifies lines of business, life events, and urgency, books policy reviews on producer calendars, and answers general questions from your carrier-approved FAQs and glossaries — then hands complex or regulated topics to humans with a structured summary.',
      ],
    },
    challenges: [
      {
        title: 'Lead quality varies wildly',
        body: 'Quote requests from out-of-state or wrong lines waste producer time. You need deterministic scoring, not a generic chat transcript.',
      },
      {
        title: 'Speed wins renewals and switches',
        body: 'When someone compares agencies, the first meaningful conversation often wins. Calendar booking beats voicemail.',
      },
      {
        title: 'Knowledge changes with carrier updates',
        body: 'Your agent should pull from the docs you refresh — endorsements, bundles, and compliance notices — not stale macros.',
      },
    ],
    howWeFit: [
      {
        title: 'Coverage-intent qualification',
        body: 'Structured questions map to personal, commercial, or benefits paths before routing.',
      },
      {
        title: 'Calendly for producer meetings',
        body: 'Let shoppers lock time with the right licensed team member once fit is established.',
      },
      {
        title: 'KB-grounded explanations',
        body: 'Vector + full-text search over materials you control keeps answers aligned with carrier positioning.',
      },
      {
        title: 'CRM-native handoff',
        body: 'HubSpot or Salesforce records preserve conversation context for compliance and follow-up.',
      },
    ],
    playbook: [
      {
        title: 'Upload approved language',
        body: 'Start from glossaries, state notices, and product one-pagers your compliance team already maintains.',
      },
      {
        title: 'Set escalation rules',
        body: 'Bind quotes, claims disputes, and PHI-adjacent topics route straight to humans — the agent triages, it doesn’t pretend to be a producer.',
      },
      {
        title: 'Connect calendars by desk',
        body: 'Personal lines vs commercial producers get different booking pools.',
      },
      {
        title: 'Launch quickly, iterate weekly',
        body: 'Matches the deck’s “live in 15 minutes” wedge vs. multi-quarter enterprise installs.',
      },
    ],
    pullQuote:
      'Sit in the gap between $25/mo bots with no actions and six-figure enterprise suites — the market the deck calls “$1–10M ARR, $2K/mo labor spend.”',
    ctaLine: 'Book more policy conversations with less phone tag.',
  },

  'b2b-saas': {
    slug: 'b2b-saas',
    navLabel: 'B2B SaaS companies',
    hero: {
      eyebrow: 'Solutions · B2B SaaS',
      title: 'The wedge the company was built for: qualify PLG and sales-led traffic on one site.',
      deckHook:
        'Primary GTM in the deck — replace expensive SDR hours with an agent that qualifies, books demos, answers technical Q&A, and syncs CRM for $499–1,999/mo.',
      paragraphs: [
        'B2B SaaS marketing sites have a repeatable job: separate researchers from buyers, get meetings on AE calendars, and answer product questions from docs without waking engineering. Enterprise chat tools solve pieces of this at enterprise prices; cheap widgets answer strings but don’t book or score.',
        'SentientWeb targets the explicit gap in the pitch: companies between roughly $1M and $10M ARR that already spend thousands monthly on customer-facing labor and need autonomous qualification plus Calendly booking plus knowledge-grounded answers — live fast, priced against headcount, not shelf-software.',
      ],
    },
    challenges: [
      {
        title: 'Pipeline pretends to be “product-led”',
        body: 'Trials hide weak ICP fit. You still need questions on company size, use case, and timeline — the BANT-lite story in the deck.',
      },
      {
        title: 'AE calendars are the real bottleneck',
        body: 'MQLs without meetings are just emails. Booking has to be native, not a mailto link.',
      },
      {
        title: 'Docs scale faster than sales engineers',
        body: 'Hybrid search over your knowledge base is how you keep “sub-second feel” answers without ballooning SE headcount.',
      },
    ],
    howWeFit: [
      {
        title: 'Enterprise vs SMB routing',
        body: 'Mirror the deck: enterprise to sales, SMB to automated demo or PLG paths.',
      },
      {
        title: 'Demo booking on sales calendars',
        body: 'Phase 1 table stakes — Calendly with validation — shipped as product, not services.',
      },
      {
        title: 'Technical Q&A from your KB',
        body: 'Vector + FTS over docs, help center, and release notes.',
      },
      {
        title: 'Proactive on pricing and return visits',
        body: 'Intent scoring triggers outreach when motivation peaks.',
      },
    ],
    playbook: [
      {
        title: 'Paste snippet + connect stack',
        body: 'HubSpot or Salesforce + Calendly, the integrations named in the roadmap.',
      },
      {
        title: 'Point at canonical docs',
        body: 'URL crawl or upload; the agent answers from what product marketing owns.',
      },
      {
        title: 'Codify routing rules',
        body: 'Deterministic thresholds beat “model vibes” for revenue teams.',
      },
      {
        title: 'Optional Phase 2 flywheel',
        body: 'When you graduate tiers, add Remotion video + social distribution — same engine, richer GTM.',
      },
    ],
    pullQuote:
      '“1 qualified lead/week at $499/mo is a no-brainer if ACV is $10K+” — straight from the market math slide.',
    ctaLine: 'Run the inbound motion the seed story assumes.',
  },

  'real-estate': {
    slug: 'real-estate',
    navLabel: 'Real estate brokers',
    hero: {
      eyebrow: 'Solutions · Real estate',
      title: 'Book showings and buyer consults while you’re at closing — not stuck in live chat.',
      deckHook:
        'Behavioral triggers for repeat listing views, Calendly for tours, CRM handoff with context — the same autonomous loop, adapted to brokerage.',
      paragraphs: [
        'Brokerages compete on responsiveness, but top agents cannot live inside website chat. Portals and IDX feeds drive anonymous traffic; the break point is whether your site converts curiosity into a calendar event with enough context to prep a CMA or showing route.',
        'SentientWeb qualifies buy vs sell side, price band, and timeline, books intro calls or showings on team Calendars, answers neighborhood and process questions from your approved guides, and flags high-intent return visitors — the “pricing page / return visit” logic from the deck, mapped to saved searches and listing revisits.',
      ],
    },
    challenges: [
      {
        title: 'Speed-to-lead is brutal',
        body: 'Minutes matter when buyers are comparing three brokerages. Forms add delay; silence loses deals.',
      },
      {
        title: 'Junior agents drown in unqualified tours',
        body: 'You need structure: mortgage status, areas, and move timeline before someone blocks two hours.',
      },
      {
        title: 'Compliance varies by market',
        body: 'Fair housing and advertising rules mean answers should come from vetted copy, not improvisation.',
      },
    ],
    howWeFit: [
      {
        title: 'Side and stage qualification',
        body: 'Route sellers to listing specialists and buyers to the right territory team.',
      },
      {
        title: 'Calendar-native showings and consults',
        body: 'Calendly slots tied to the right agent pool once fit checks pass.',
      },
      {
        title: 'Neighborhood and process FAQs',
        body: 'Search over market reports, buyer/seller checklists, and brokerage policies you publish.',
      },
      {
        title: 'Proactive nudges on saved homes',
        body: 'Return visits signal intent; engage before they bounce back to aggregators.',
      },
    ],
    playbook: [
      {
        title: 'Connect IDX-adjacent content',
        body: 'Link area guides, onboarding docs, and onboarding videos the team already markets.',
      },
      {
        title: 'CRM every thread',
        body: 'HubSpot or Salesforce keeps deal stages honest with conversation context attached.',
      },
      {
        title: 'Escalate offers and negotiations',
        body: 'The agent books and educates; contract work stays human — clean handoffs.',
      },
      {
        title: 'Go live in one afternoon',
        body: 'Matches the implementation story: snippet, tools, docs, rules.',
      },
    ],
    pullQuote:
      'Same “90% less than enterprise chat” positioning — built for brokerages that outgrow Tidio but refuse Drift invoices.',
    ctaLine: 'Stop losing tours to slower teams.',
  },

  'healthcare-clinics': {
    slug: 'healthcare-clinics',
    navLabel: 'Healthcare & clinics',
    hero: {
      eyebrow: 'Solutions · Healthcare',
      title: 'Triage scheduling questions and education — then route clinical work to your staff.',
      deckHook:
        'Support triage and routing from the deck: category, priority, summary — with conservative scopes for regulated environments.',
      paragraphs: [
        'Clinic and health-system marketing sites field the same repeating questions: hours, accepted plans, preparation instructions, and how to become a patient. Phone lines back up, and live chat staffed by billing interns creates compliance anxiety.',
        'SentientWeb books intake or informational calls on your schedulers’ Calendly links, answers general questions from HIPAA-aligned materials you supply, and escalates symptoms, medication, or billing disputes to humans with structured notes. It is an operational layer for access and education — not a clinician.',
      ],
    },
    challenges: [
      {
        title: 'Access centers are expensive',
        body: 'Labor is the cost driver the deck prices against; automating repeatable education preserves nurse and MA time for care.',
      },
      {
        title: 'Visitors need certainty, not chat theater',
        body: 'Responses should cite your patient guides and policy pages, not generic wellness text.',
      },
      {
        title: 'Intent signals differ from retail',
        body: 'Repeat visits to insurance or locations pages mean something; proactive engagement should respect sensitivity.',
      },
    ],
    howWeFit: [
      {
        title: 'Scheduling-focused qualification',
        body: 'Capture visit type, new vs returning, and location preference before offering slots.',
      },
      {
        title: 'Calendly or central scheduling hooks',
        body: 'Book within the pools each department exposes — same calendar story as the core product.',
      },
      {
        title: 'KB search over approved content',
        body: 'Hours, directions, prep checklists, and insurance FAQs grounded in documents you control.',
      },
      {
        title: 'Human routing for clinical topics',
        body: 'Deterministic rules send red-flag conversations straight to staff — triage, not diagnosis.',
      },
    ],
    playbook: [
      {
        title: 'Start with public-facing docs only',
        body: 'No PHI in the knowledge base; keep scope to what marketing already publishes.',
      },
      {
        title: 'Define escalation keywords',
        body: 'Chest pain, controlled substances, billing disputes — immediate handoff paths.',
      },
      {
        title: 'CRM optional but powerful',
        body: 'For groups already on HubSpot/Salesforce, attach conversation context to patient acquisition funnels.',
      },
      {
        title: 'Review copy with compliance',
        body: 'Iterate prompts and sources the way you would any patient-facing collateral.',
      },
    ],
    pullQuote:
      'Automation should shrink phone volume, not expand medico-legal risk — structured routing is the product discipline the deck emphasizes.',
    ctaLine: 'Give patients faster answers and cleaner handoffs.',
  },

  'home-services': {
    slug: 'home-services',
    navLabel: 'Home services',
    hero: {
      eyebrow: 'Solutions · Home services',
      title: 'Dispatch-ready leads: know the job, zip, and urgency before the truck rolls.',
      deckHook:
        'Emergency vs scheduled service, service-area checks, and booking estimates — autonomous actions, not passive chat.',
      paragraphs: [
        'HVAC, plumbing, electrical, and property-care brands lose margin when dispatchers spend mornings decoding “AC making noise” emails. Customers want to know if you serve their neighborhood, how soon you can arrive, and what to expect on price bands — before they commit to a two-hour arrival window.',
        'SentientWeb qualifies equipment type, symptom severity, rental vs owner, and ZIP, offers self-serve answers from your troubleshooting and policy docs, and books estimate or service calls on the calendars your territories actually run — CRM records keep CSRs from re-asking everything on the phone.',
      ],
    },
    challenges: [
      {
        title: 'After-hours volume spikes',
        body: 'Emergency calls don’t respect shifts. An agent that books and triages keeps revenue from leaking to whoever answers Google first.',
      },
      {
        title: 'Territory rules are complex',
        body: 'You need routing that respects counties, franchises, or partner networks — rule engine thinking from the platform story.',
      },
      {
        title: 'DIY vs “send a tech”',
        body: 'Many tickets are filter resets; others need trucks. Qualification prevents misprioritized dispatches.',
      },
    ],
    howWeFit: [
      {
        title: 'Job-type and urgency scoring',
        body: 'Structured data fields map to dispatch tiers the same way BANT maps to sales.',
      },
      {
        title: 'Calendar booking per territory',
        body: 'Calendly pools for each market or franchisee once eligibility checks pass.',
      },
      {
        title: 'Knowledge from manuals and SOPs',
        body: 'Upload maintenance tips, warranty statements, and pricing explainer pages.',
      },
      {
        title: 'Proactive on service pages',
        body: 'High-intent visitors comparing maintenance plans get nudges while motivation is hot.',
      },
    ],
    playbook: [
      {
        title: 'Encode service areas',
        body: 'ZIP or city lists gate which calendar and crew see the job.',
      },
      {
        title: 'Sync CRM for CSR continuity',
        body: 'HubSpot/Salesforce shows the full chat when dispatch calls back.',
      },
      {
        title: 'Publish seasonal playbooks',
        body: 'Heat waves and freeze events spike the same questions — refresh KB articles, agent follows automatically.',
      },
      {
        title: 'Measure booked jobs, not chats',
        body: 'Aligns metrics with the deck’s meeting-booking emphasis.',
      },
    ],
    pullQuote:
      'Priced like software that replaces labor — not another line item that needs six months of services to launch.',
    ctaLine: 'Fill the board with jobs that fit your trucks.',
  },

  'education-edtech': {
    slug: 'education-edtech',
    navLabel: 'Education & EdTech',
    hero: {
      eyebrow: 'Solutions · Education',
      title: 'Qualify learners, institutions, and partners — then book the right demo or advisor call.',
      deckHook:
        'Perfect fit for hybrid search over syllabi, product docs, and accreditation FAQs — plus CRM for long-cycle deals.',
      paragraphs: [
        'EdTech and training companies sell to parents, students, district admins, and enterprise L&D teams — often from the same homepage. Without branching qualification, demos go to the wrong AE and trials start with mismatched expectations.',
        'SentientWeb asks role, organization size, use case, and timeline, routes enterprise conversations to strategic AEs and self-serve paths to PLG flows, books Calendly sessions for evaluations, and answers curriculum or integration questions from your knowledge base — the same “qualify, book, answer” spine the deck describes for B2B SaaS.',
      ],
    },
    challenges: [
      {
        title: 'Buying committees hide behind forms',
        body: 'You need to know if the visitor is a teacher, principal, or parent before proposing next steps.',
      },
      {
        title: 'Technical questions stall small teams',
        body: 'LMS integrations and data privacy topics belong in searchable docs, not scattered Notion pages.',
      },
      {
        title: 'Seasonality is extreme',
        body: 'Back-to-school and fiscal-year ends create spikes; automation absorbs repetition without hiring seasonal BDRs.',
      },
    ],
    howWeFit: [
      {
        title: 'Segment-aware qualification',
        body: 'K-12, higher ed, and corporate L&D follow different scoring and routing tables.',
      },
      {
        title: 'Demo booking for complex deals',
        body: 'Calendly ensures solutions engineers join when the thread warrants it.',
      },
      {
        title: 'Docs-first answers',
        body: 'Rostering, SCIM, FERPA language — grounded in the PDFs and help articles you maintain.',
      },
      {
        title: 'Proactive on pricing and pilot pages',
        body: 'Intent triggers catch committees comparing vendors late at night.',
      },
    ],
    playbook: [
      {
        title: 'Import curriculum + security docs',
        body: 'Buyers diligence you with the same files — make them first-class KB sources.',
      },
      {
        title: 'Map CRM stages',
        body: 'HubSpot/Salesforce fields reflect education verticals your reps already track.',
      },
      {
        title: 'Offer self-serve where possible',
        body: 'SMB trials and teacher upgrades shouldn’t wait for a calendar invite.',
      },
      {
        title: 'Layer Phase 2 when ready',
        body: 'Remotion + social distribution from the deck turns top questions into awareness content.',
      },
    ],
    pullQuote:
      'The SAM/SOM story in the deck — B2B SaaS plus Shopify ecosystem labor — includes the billions spent convincing learners and admins online.',
    ctaLine: 'Shorten evaluation cycles with smarter first touches.',
  },

  'luxury-ecommerce': {
    slug: 'luxury-ecommerce',
    navLabel: 'Luxury e-commerce',
    hero: {
      eyebrow: 'Solutions · Luxury commerce',
      title: 'Concierge-grade conversations for high-AOV carts — without cloning your clienteling team.',
      deckHook:
        'Commerce abstraction + Shopify adapter roadmap: same core engine, with proactive triggers tuned for premium journeys.',
      paragraphs: [
        'Luxury shoppers expect white-glove service online: sizing guidance, material care, authenticity, and delivery white-glove details. Static FAQ pages feel off-brand; outsourcing to a generic bot erodes trust.',
        'SentientWeb combines knowledge-grounded answers from your lookbooks and policy docs, proactive engagement when visitors linger on high-ticket SKUs or return sessions, and (where appropriate) human routing for bespoke orders — aligning with the deck’s Phase 3 story that re-attaches Shopify as an adapter on top of the platform-agnostic core.',
      ],
    },
    challenges: [
      {
        title: 'High AOV requires high context',
        body: 'You cannot treat a five-figure basket like a discount sneaker sale; qualification must capture occasion, timeline, and service expectations.',
      },
      {
        title: 'Clienteling doesn’t scale linearly',
        body: 'The deck prices against labor — here, that’s stylists and CX leads answering the same care questions nightly.',
      },
      {
        title: 'Brand voice is the product',
        body: 'Every message should sound like your house copy, pulled from materials you approve.',
      },
    ],
    howWeFit: [
      {
        title: 'Intent scoring on premium pages',
        body: 'Return visits and time-on-SKU trigger outreach without feeling spammy.',
      },
      {
        title: 'KB answers on craft and care',
        body: 'Leather, gemstones, tailoring — retrieved from guides, not generic LLM fluff.',
      },
      {
        title: 'CRM for VIP follow-up',
        body: 'HubSpot/Salesforce captures wish lists and consultation requests with transcripts.',
      },
      {
        title: 'Shopify path in the roadmap',
        body: 'Free + Pro tiers in the deck become distribution; enterprise luxury stays on custom stacks with the same agent core.',
      },
    ],
    playbook: [
      {
        title: 'Feed brand-approved copy',
        body: 'Seasonal narratives, craftsmanship stories, and service-level promises live in the KB.',
      },
      {
        title: 'Route bespoke requests to stylists',
        body: 'Made-to-order flows jump to humans with structured intake already filled.',
      },
      {
        title: 'Connect calendars for virtual appointments',
        body: 'Calendly for remote styling or showroom visits when shoppers need eyes on product.',
      },
      {
        title: 'Prepare for Phase 2 storytelling',
        body: 'Video hooks generated from top product questions extend the brand without a full creative team on retainer.',
      },
    ],
    pullQuote:
      '“One engine, many adapters” — luxury DTC today, Shopify scale tomorrow — is the strategic shift the deck commits to.',
    ctaLine: 'Elevate digital clienteling without cloning headcount.',
  },
} as const satisfies Record<string, SolutionPageContent>

export type SolutionSlug = keyof typeof SOLUTION_PAGES

export const SOLUTION_NAV_LIST = (
  Object.keys(SOLUTION_PAGES) as SolutionSlug[]
).map((slug) => ({
  slug,
  navLabel: SOLUTION_PAGES[slug].navLabel,
}))
