import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { CONSENT_VERSION } from '../constants'
import { loadSentientWidget, removeSentientWidget } from '../loadSentientWidget'
import { PRIVACY_PREFERENCES_EVENT } from '../privacyPreferences'

type ConsentState = {
  preferences: boolean
  assistant: boolean
  analytics: boolean
  ageConfirmed: boolean
  updatedAt: string
}

type ConsentEventType = 'accept_all' | 'reject_optional' | 'save_choices' | 'withdraw'

const CONSENT_STORAGE_KEY = `sentientweb:privacy-consent:${CONSENT_VERSION}`
const CONSENT_CHANGED_EVENT = 'sentientweb:privacy-consent-changed'

function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === 'undefined') return false
  return Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl)
}

function defaultConsent(): ConsentState {
  return {
    preferences: false,
    assistant: false,
    analytics: false,
    ageConfirmed: false,
    updatedAt: new Date(0).toISOString(),
  }
}

function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY))
  } catch {
    return null
  }
}

function parseStoredConsent(raw: string | null): ConsentState | null {
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

function writeStoredConsent(consent: ConsentState) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
}

function recordConsentEvent(
  eventType: ConsentEventType,
  consent: ConsentState,
  globalPrivacyControl: boolean,
) {
  if (typeof window === 'undefined') return

  const body = JSON.stringify({
    eventType,
    consentVersion: CONSENT_VERSION,
    preferences: consent.preferences,
    assistant: consent.assistant,
    analytics: consent.analytics,
    ageConfirmed: consent.ageConfirmed,
    globalPrivacyControl,
    sourcePath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  })

  void fetch('/consent-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined)
}

function hasWithdrawnOptionalConsent(previous: ConsentState | null, next: ConsentState) {
  if (!previous) return false

  return (
    (previous.preferences && !next.preferences) ||
    (previous.assistant && !next.assistant) ||
    (previous.analytics && !next.analytics)
  )
}

function subscribeToConsentChanges(onStoreChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getConsentSnapshot() {
  return window.localStorage.getItem(CONSENT_STORAGE_KEY) || ''
}

function getServerConsentSnapshot() {
  return ''
}

function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <label className="flex gap-3 rounded-lg border border-white/10 p-3">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-neon"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
      />
      <span>
        <span className="block font-grotesk text-[13px] uppercase tracking-wide text-cream">
          {label}
        </span>
        <span className="mt-1 block font-mono text-[12px] normal-case leading-relaxed text-cream/65">
          {description}
        </span>
      </span>
    </label>
  )
}

export function ConsentManager() {
  const consentSnapshot = useSyncExternalStore(
    subscribeToConsentChanges,
    getConsentSnapshot,
    getServerConsentSnapshot,
  )
  const stored = useMemo(() => parseStoredConsent(consentSnapshot), [consentSnapshot])
  const [draft, setDraft] = useState<ConsentState>(() => defaultConsent())
  const [open, setOpen] = useState(false)
  const globalPrivacyControl = hasGlobalPrivacyControl()

  useEffect(() => {
    const onOpenPreferences = () => {
      setDraft(stored || readStoredConsent() || defaultConsent())
      setOpen(true)
    }

    window.addEventListener(PRIVACY_PREFERENCES_EVENT, onOpenPreferences)
    return () => window.removeEventListener(PRIVACY_PREFERENCES_EVENT, onOpenPreferences)
  }, [stored])

  useEffect(() => {
    if (stored?.assistant && stored.ageConfirmed) {
      loadSentientWidget()
    } else {
      removeSentientWidget()
    }
  }, [stored?.ageConfirmed, stored?.assistant])

  const save = useCallback(
    (next: ConsentState, eventType: ConsentEventType) => {
      const consent = {
        ...next,
        assistant: next.ageConfirmed ? next.assistant : false,
        analytics: globalPrivacyControl ? false : next.analytics,
        updatedAt: new Date().toISOString(),
      }
      writeStoredConsent(consent)
      recordConsentEvent(
        hasWithdrawnOptionalConsent(stored, consent) ? 'withdraw' : eventType,
        consent,
        globalPrivacyControl,
      )
      setDraft(consent)
      setOpen(false)
    },
    [globalPrivacyControl, stored],
  )

  const rejectOptional = useCallback(() => {
    save(
      {
        preferences: false,
        assistant: false,
        analytics: false,
        ageConfirmed: false,
        updatedAt: new Date().toISOString(),
      },
      'reject_optional',
    )
  }, [save])

  const acceptAll = useCallback(() => {
    save(
      {
        preferences: true,
        assistant: true,
        analytics: !globalPrivacyControl,
        ageConfirmed: true,
        updatedAt: new Date().toISOString(),
      },
      'accept_all',
    )
  }, [globalPrivacyControl, save])

  const bannerVisible = stored === null
  const panelVisible = bannerVisible || open
  const showDetails = open

  const title = useMemo(
    () => (bannerVisible ? 'Privacy choices' : 'Manage privacy choices'),
    [bannerVisible],
  )

  if (!panelVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-6 sm:pb-6">
      <section
        aria-labelledby="privacy-choices-title"
        className="mx-auto max-w-[860px] rounded-lg border border-white/10 bg-background/95 p-4 shadow-2xl backdrop-blur md:p-5"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h2
              id="privacy-choices-title"
              className="font-grotesk text-[16px] uppercase tracking-wide text-cream"
            >
              {title}
            </h2>
            <p className="mt-2 font-mono text-[12px] normal-case leading-relaxed text-cream/70 sm:text-[13px]">
              We use necessary storage for the site. The live assistant uses Google (Gemini Live) as our
              AI technology provider, with Robanka operating the experience; it loads only after you
              consent. You can use the site without enabling microphone access. Enabling the assistant
              confirms you are at least 18.
              {globalPrivacyControl
                ? ' Your browser is sending Global Privacy Control, so analytics stays off.'
                : ''}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-cream/55">
              <Link to="/privacy" className="transition hover:text-neon">
                Privacy
              </Link>
              <Link to="/cookies" className="transition hover:text-neon">
                Cookies
              </Link>
              <Link to="/ai-disclosure" className="transition hover:text-neon">
                Automation notice
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
            <button
              type="button"
              className="rounded-full bg-neon px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-background"
              onClick={acceptAll}
            >
              Accept all
            </button>
            <button
              type="button"
              className="liquid-glass rounded-full px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-cream"
              onClick={rejectOptional}
            >
              Reject optional
            </button>
            <button
              type="button"
              className="font-mono text-[12px] uppercase tracking-wide text-cream/55 transition hover:text-neon"
              onClick={() => setOpen(true)}
            >
              Customize
            </button>
          </div>
        </div>

        {showDetails ? (
          <div className="mt-4 grid gap-3">
            <Toggle
              label="Necessary"
              description="Required for routing, security, and consent records."
              checked
              disabled
            />
            <Toggle
              label="Preferences"
              description="Remember site and privacy choices in this browser."
              checked={draft.preferences}
              onChange={(checked) => setDraft((current) => ({ ...current, preferences: checked }))}
            />
            <Toggle
              label="Live assistant"
              description="Load the live assistant (Google Gemini Live AI with Robanka-operated configuration) and permit text, page context, and voice processing when you use it."
              checked={draft.assistant}
              onChange={(checked) =>
                setDraft((current) => ({
                  ...current,
                  assistant: checked,
                  ageConfirmed: checked ? current.ageConfirmed : false,
                }))
              }
            />
            <Toggle
              label="I am 18 or older"
              description="Required before the live assistant can load because this site and assistant are not directed to minors."
              checked={draft.ageConfirmed}
              onChange={(checked) =>
                setDraft((current) => ({
                  ...current,
                  ageConfirmed: checked,
                  assistant: checked ? current.assistant : false,
                }))
              }
            />
            <Toggle
              label="Analytics"
              description={
                globalPrivacyControl
                  ? 'Disabled because this browser is sending Global Privacy Control.'
                  : 'Allow optional measurement tools if we enable them.'
              }
              checked={draft.analytics}
              disabled={globalPrivacyControl}
              onChange={(checked) => setDraft((current) => ({ ...current, analytics: checked }))}
            />
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="font-mono text-[12px] uppercase tracking-wide text-cream/55 transition hover:text-neon"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-neon px-4 py-2 font-grotesk text-[12px] uppercase tracking-wide text-background"
                onClick={() => save(draft, 'save_choices')}
              >
                Save choices
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
