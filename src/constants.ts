export const BOOK_DEMO_URL = 'https://calendly.com/tingsong-dai/30min'

export const OPERATOR_LOGIN_URL = 'https://app.sentientwebsite.com/admin/login'

export const GITHUB_REPO_URL = 'https://github.com/TingsongD/sentientweblanding2'

export const SITE_NAME = 'SentientWeb'

export const CONSENT_VERSION = 'v1'

export const LEGAL_POLICY_VERSION = '2026-05-02'

export const LEGAL_LAST_UPDATED_LABEL = 'May 2, 2026'

export const LEGAL_VERSIONS = {
  consentVersion: CONSENT_VERSION,
  privacyPolicyVersion: LEGAL_POLICY_VERSION,
  cookiePolicyVersion: LEGAL_POLICY_VERSION,
  aiDisclosureVersion: LEGAL_POLICY_VERSION,
  lastUpdatedLabel: LEGAL_LAST_UPDATED_LABEL,
} as const

const DEFAULT_SITE_URL = 'https://sentientwebsite.com/'

type PublicProcessEnv = {
  process?: {
    env?: Partial<Record<keyof ImportMetaEnv, string | undefined>>
  }
}

function readPublicEnv(name: keyof ImportMetaEnv) {
  return (
    import.meta.env[name] ||
    (globalThis as PublicProcessEnv).process?.env?.[name]
  )
}

export function normalizeSiteUrl(value = DEFAULT_SITE_URL) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('Site URL must use http or https')
    }
    return `${url.origin}/`
  } catch (error) {
    throw new Error(`Invalid VITE_SITE_URL: ${value}`, { cause: error })
  }
}

export const SITE_URL = normalizeSiteUrl(
  readPublicEnv('VITE_SITE_URL') || readPublicEnv('NEXT_PUBLIC_SITE_URL') || DEFAULT_SITE_URL,
)

export const SITE_HOSTNAME = new URL(SITE_URL).hostname

export const DEFAULT_META_TITLE = 'SentientWeb | Digital Plumbers for Your Revenue Leaks'

export const DEFAULT_META_DESCRIPTION =
  'SentientWeb fixes website revenue leaks with instant access paths, secure AI-guided next steps, human handoff, and disclosed retention controls.'

export const DEFAULT_OG_IMAGE_URL = new URL('/favicon.svg', SITE_URL).toString()
