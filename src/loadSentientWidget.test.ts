import { describe, expect, it } from 'vitest'
import { normalizeWidgetOrigin, resolveWidgetConfig } from './loadSentientWidget'

describe('normalizeWidgetOrigin', () => {
  it('normalizes valid http and https origins', () => {
    expect(normalizeWidgetOrigin('https://cdn.example.com/agent.js')).toBe(
      'https://cdn.example.com',
    )
    expect(normalizeWidgetOrigin('http://localhost:4000/widget/')).toBe(
      'http://localhost:4000',
    )
    expect(normalizeWidgetOrigin('http://127.0.0.1:4000/widget/')).toBe(
      'http://127.0.0.1:4000',
    )
  })

  it('rejects empty, relative, insecure remote, and non-http origins', () => {
    expect(normalizeWidgetOrigin(undefined)).toBeNull()
    expect(normalizeWidgetOrigin('')).toBeNull()
    expect(normalizeWidgetOrigin('/agent.js')).toBeNull()
    expect(normalizeWidgetOrigin('http://cdn.example.com')).toBeNull()
    expect(normalizeWidgetOrigin('javascript:alert(1)')).toBeNull()
    expect(normalizeWidgetOrigin('data:text/javascript,alert(1)')).toBeNull()
  })
})

describe('resolveWidgetConfig', () => {
  it('resolves a normalized origin and trimmed install key', () => {
    expect(resolveWidgetConfig('https://cdn.example.com/path', '  install_123  ')).toEqual({
      origin: 'https://cdn.example.com',
      installKey: 'install_123',
    })
  })

  it('rejects invalid origins and blank install keys', () => {
    expect(resolveWidgetConfig('javascript:alert(1)', 'install_123')).toBeNull()
    expect(resolveWidgetConfig('http://cdn.example.com', 'install_123')).toBeNull()
    expect(resolveWidgetConfig('https://cdn.example.com', '   ')).toBeNull()
  })
})
