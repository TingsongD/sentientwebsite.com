export const PRIVACY_PREFERENCES_EVENT = 'sentient:open-privacy-preferences'

export function openPrivacyPreferences() {
  window.dispatchEvent(new Event(PRIVACY_PREFERENCES_EVENT))
}
