import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CONSENT_STORAGE_KEY,
  hasOptionalAnalyticsConsent,
  readStoredConsent,
  writeStoredConsent,
  type ConsentState,
} from './privacyPreferences'

const analyticsConsent: ConsentState = {
  preferences: true,
  assistant: false,
  analytics: true,
  ageConfirmed: false,
  updatedAt: '2026-05-02T00:00:00.000Z',
}

function installBrowserGlobals(localStorage: Storage) {
  vi.stubGlobal('window', {
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    localStorage,
    removeEventListener: vi.fn(),
  })
  vi.stubGlobal('navigator', {})
}

function createMemoryStorage() {
  const store = new Map<string, string>()
  return {
    clear: vi.fn(() => store.clear()),
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    removeItem: vi.fn((key: string) => store.delete(key)),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    get length() {
      return store.size
    },
  } as Storage
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('privacy preference storage helpers', () => {
  it('uses in-memory consent only when localStorage is unavailable', () => {
    const blockedStorage = {
      getItem: vi.fn(() => {
        throw new Error('blocked')
      }),
      setItem: vi.fn(() => {
        throw new Error('blocked')
      }),
    } as unknown as Storage
    installBrowserGlobals(blockedStorage)

    writeStoredConsent(analyticsConsent)

    expect(readStoredConsent()).toEqual(analyticsConsent)
    expect(hasOptionalAnalyticsConsent()).toBe(true)
  })

  it('clears stale in-memory consent when localStorage is available and empty', () => {
    const storage = createMemoryStorage()
    installBrowserGlobals(storage)

    writeStoredConsent(analyticsConsent)
    expect(readStoredConsent()).toEqual(analyticsConsent)

    storage.removeItem(CONSENT_STORAGE_KEY)

    expect(readStoredConsent()).toBeNull()
    expect(hasOptionalAnalyticsConsent()).toBe(false)
  })

  it('requires stored analytics consent and inactive GPC for optional analytics', () => {
    const storage = createMemoryStorage()
    installBrowserGlobals(storage)
    writeStoredConsent(analyticsConsent)

    expect(hasOptionalAnalyticsConsent()).toBe(true)

    vi.stubGlobal('navigator', { globalPrivacyControl: true })

    expect(hasOptionalAnalyticsConsent()).toBe(false)
  })
})
