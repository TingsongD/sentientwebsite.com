import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  deleteConsentEvents,
  filterConsentEvents,
  parseConsentLogJsonl,
  pruneConsentEvents,
  retentionCutoffIso,
  runConsentLogAdmin,
  serializeConsentLogJsonl,
} from './consent-log-admin.mjs'

const sampleEvents = [
  {
    eventId: 'event-old',
    eventType: 'save_choices',
    occurredAt: '2026-03-01T00:00:00.000Z',
    preferences: true,
    assistant: false,
    analytics: false,
    ageConfirmed: false,
    globalPrivacyControl: true,
    requestIpHash: 'sha256:ip-old',
    userAgentHash: 'sha256:ua-old',
    sessionIdHash: 'sha256:session-old',
    sourcePath: '/pricing',
  },
  {
    eventId: 'event-new',
    eventType: 'accept_all',
    occurredAt: '2026-05-01T00:00:00.000Z',
    preferences: true,
    assistant: true,
    analytics: true,
    ageConfirmed: true,
    globalPrivacyControl: false,
    requestIpHash: 'sha256:ip-new',
    userAgentHash: 'sha256:ua-new',
    sessionIdHash: 'sha256:session-new',
    sourcePath: '/',
  },
]

describe('consent log admin utility', () => {
  it('parses and serializes consent JSONL with blank lines ignored', () => {
    const text = `${JSON.stringify(sampleEvents[0])}\n\n${JSON.stringify(sampleEvents[1])}\n`

    expect(parseConsentLogJsonl(text)).toEqual(sampleEvents)
    expect(serializeConsentLogJsonl(sampleEvents)).toBe(
      `${JSON.stringify(sampleEvents[0])}\n${JSON.stringify(sampleEvents[1])}\n`,
    )
  })

  it('rejects invalid JSONL with a line number', () => {
    expect(() => parseConsentLogJsonl('{"eventId":"ok"}\nnot-json\n')).toThrow(
      'Invalid consent log JSONL at line 2',
    )
  })

  it('filters by date range, consent category, GPC, source path, and hashes', () => {
    const matches = filterConsentEvents(sampleEvents, {
      category: 'assistant',
      categoryValue: true,
      from: '2026-04-01T00:00:00.000Z',
      globalPrivacyControl: false,
      requestIpHash: 'sha256:ip-new',
      sourcePath: '/',
    })

    expect(matches).toEqual([sampleEvents[1]])
  })

  it('deletes and prunes events without mutating the input array', () => {
    const deleted = deleteConsentEvents(sampleEvents, 'event-old')
    expect(deleted.removedEvents).toEqual([sampleEvents[0]])
    expect(deleted.remainingEvents).toEqual([sampleEvents[1]])
    expect(sampleEvents).toHaveLength(2)

    const pruned = pruneConsentEvents(sampleEvents, '2026-04-01T00:00:00.000Z')
    expect(pruned.removedEvents).toEqual([sampleEvents[0]])
    expect(pruned.remainingEvents).toEqual([sampleEvents[1]])
  })

  it('runs retention and deletion operations as dry runs unless committed', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'sentient-consent-log-'))
    const logPath = join(tempDir, 'consent-events.jsonl')
    writeFileSync(logPath, serializeConsentLogJsonl(sampleEvents), 'utf8')

    const dryRun = JSON.parse(
      runConsentLogAdmin([
        '--file',
        logPath,
        '--retention-days',
        '30',
      ], {
        now: new Date('2026-05-02T00:00:00.000Z'),
      }),
    )

    expect(dryRun).toMatchObject({
      dryRun: true,
      originalCount: 2,
      remainingCount: 1,
      removedCount: 1,
      retentionCutoff: '2026-04-02T00:00:00.000Z',
    })
    expect(parseConsentLogJsonl(readFileSync(logPath, 'utf8'))).toEqual(sampleEvents)

    const committed = JSON.parse(
      runConsentLogAdmin([
        '--file',
        logPath,
        '--delete-event-id',
        'event-old',
        '--commit',
      ]),
    )

    expect(committed).toMatchObject({
      dryRun: false,
      originalCount: 2,
      remainingCount: 1,
      removedCount: 1,
      removedEventIds: ['event-old'],
    })
    expect(parseConsentLogJsonl(readFileSync(logPath, 'utf8'))).toEqual([sampleEvents[1]])
  })

  it('computes retention cutoffs and refuses public dist paths', () => {
    expect(retentionCutoffIso(18, new Date('2026-05-02T00:00:00.000Z'))).toBe(
      '2026-04-14T00:00:00.000Z',
    )

    expect(() =>
      runConsentLogAdmin(['--file', 'dist/consent-events.jsonl', '--list'], {
        cwd: process.cwd(),
      }),
    ).toThrow('Consent logs must not be read from or written inside public dist')
  })
})
