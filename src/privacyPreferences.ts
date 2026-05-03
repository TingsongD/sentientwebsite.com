import { CONSENT_VERSION } from './constants'

export type ConsentState = {
  preferences: boolean
  assistant: boolean
  analytics: boolean
  ageConfirmed: boolean
  updatedAt: string
}

export const PRIVACY_PREFERENCES_EVENT = 'sentient:open-privacy-preferences'
export const CONSENT_STORAGE_KEY = `sentientweb:privacy-consent:${CONSENT_VERSION}`
export const CONSENT_CHANGED_EVENT = 'sentientweb:privacy-consent-changed'

let inMemoryConsentSnapshot = ''

export function openPrivacyPreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PRIVACY_PREFERENCES_EVENT))
}

export function readGlobalPrivacyControl(): boolean {
  if (typeof navigator === 'undefined') return false
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl)
}

export function defaultConsent(): ConsentState {
  return {
    preferences: false,
    assistant: false,
    analytics: false,
    ageConfirmed: false,
    updatedAt: new Date(0).toISOString(),
  }
}

export function parseStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>
    return {
      preferences: Boolean(parsed.preferences),
      assistant: Boolean(parsed.assistant),
      analytics: Boolean(parsed.analytics),
      ageConfirmed: Boolean(parsed.ageConfirmed),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function readConsentSnapshot() {
  if (typeof window === 'undefined') return inMemoryConsentSnapshot

  try {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (storedConsent === null) {
      inMemoryConsentSnapshot = ''
      return ''
    }
    return storedConsent
  } catch {
    return inMemoryConsentSnapshot
  }
}

export function getConsentSnapshot() {
  return readConsentSnapshot()
}

export function getServerConsentSnapshot() {
  return ''
}

export function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    return parseStoredConsent(readConsentSnapshot())
  } catch {
    return null
  }
}

export function writeStoredConsent(consent: ConsentState) {
  inMemoryConsentSnapshot = JSON.stringify(consent)
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, inMemoryConsentSnapshot)
  } catch {
    // Storage can be unavailable in hardened privacy modes; keep the current tab usable.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
}

export function subscribeToConsentChanges(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined

  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function hasOptionalAnalyticsConsent() {
  const consent = readStoredConsent()
  return Boolean(consent?.analytics && !readGlobalPrivacyControl())
}
