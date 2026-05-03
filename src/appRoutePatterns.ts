export const APP_ROUTE_PATHS = {
  home: '/',
  status: '/status',
  blog: '/blog',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  billingTerms: '/billing-terms',
  aiDisclosure: '/ai-disclosure',
  dataRequest: '/data-request',
  doNotSell: '/do-not-sell',
  accessibility: '/accessibility',
  dmca: '/dmca',
  securityResponse: '/security-response',
  unsubscribe: '/unsubscribe',
  legal: '/legal',
  pricing: '/pricing',
  pricingProduct: '/pricing/product',
  pricingService: '/pricing/service',
  pricingCalculator: '/pricing/calculator',
  pricingEnterprise: '/pricing/enterprise',
  revenueLeakCalculator: '/revenue-leak-calculator',
  knowledgeBase: '/knowledge-base',
  apisSdks: '/apis-sdks',
  documentation: '/documentation',
  changelog: '/changelog',
  trust: '/trust',
  about: '/about',
  careers: '/careers',
} as const

export const APP_STATIC_ROUTE_PATHS = Object.values(APP_ROUTE_PATHS)

export const APP_DYNAMIC_ROUTE_PATTERNS = {
  blogPost: '/blog/:slug',
  integration: '/integrations/:slug',
  solution: '/solutions/:slug',
} as const

export const APP_DYNAMIC_ROUTE_PATTERN_LIST = Object.values(APP_DYNAMIC_ROUTE_PATTERNS)
