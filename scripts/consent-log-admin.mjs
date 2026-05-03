import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

const helpText = `Usage:
  npm run consent-log:admin -- --file <path> --list [filters]
  npm run consent-log:admin -- --file <path> --delete-event-id <id> [--commit]
  npm run consent-log:admin -- --file <path> --prune-before <iso-date> [--commit]
  npm run consent-log:admin -- --file <path> --retention-days <days> [--commit]

Filters:
  --event-id <id>
  --event-type <accept_all|reject_optional|save_choices|withdraw|gpc_detected>
  --source-path <path>
  --from <iso-date>
  --to <iso-date>
  --gpc <true|false>
  --category <necessary|preferences|assistant|analytics|ageConfirmed>
  --category-value <true|false>
  --request-ip-hash <hash>
  --user-agent-hash <hash>
  --session-id-hash <hash>
  --user-identifier-hash <hash>

Write operations are dry runs unless --commit is provided.`

const booleanFilterFields = new Set([
  'necessary',
  'preferences',
  'assistant',
  'analytics',
  'ageConfirmed',
])

const stringFilterMap = new Map([
  ['eventId', 'eventId'],
  ['eventType', 'eventType'],
  ['sourcePath', 'sourcePath'],
  ['requestIpHash', 'requestIpHash'],
  ['userAgentHash', 'userAgentHash'],
  ['sessionIdHash', 'sessionIdHash'],
  ['userIdentifierHash', 'userIdentifierHash'],
])

export function parseConsentLogJsonl(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        const parsed = JSON.parse(line)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('line must contain one JSON object')
        }
        return parsed
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'invalid JSON'
        throw new Error(`Invalid consent log JSONL at line ${index + 1}: ${detail}`)
      }
    })
}

export function serializeConsentLogJsonl(events) {
  if (events.length === 0) return ''
  return `${events.map((event) => JSON.stringify(event)).join('\n')}\n`
}

export function filterConsentEvents(events, filters = {}) {
  return events.filter((event) => {
    for (const [filterKey, eventKey] of stringFilterMap.entries()) {
      if (filters[filterKey] && event[eventKey] !== filters[filterKey]) {
        return false
      }
    }

    if (
      typeof filters.globalPrivacyControl === 'boolean' &&
      event.globalPrivacyControl !== filters.globalPrivacyControl
    ) {
      return false
    }

    if (filters.category) {
      const expectedValue =
        typeof filters.categoryValue === 'boolean' ? filters.categoryValue : true
      if (event[filters.category] !== expectedValue) return false
    }

    if (filters.from && consentEventTimestamp(event) < parseTimestamp(filters.from, '--from')) {
      return false
    }

    if (filters.to && consentEventTimestamp(event) > parseTimestamp(filters.to, '--to')) {
      return false
    }

    return true
  })
}

export function deleteConsentEvents(events, eventId) {
  const remainingEvents = []
  const removedEvents = []

  for (const event of events) {
    if (event.eventId === eventId) {
      removedEvents.push(event)
    } else {
      remainingEvents.push(event)
    }
  }

  return { remainingEvents, removedEvents }
}

export function pruneConsentEvents(events, beforeIso) {
  const cutoff = parseTimestamp(beforeIso, '--prune-before')
  const remainingEvents = []
  const removedEvents = []

  for (const event of events) {
    if (consentEventTimestamp(event) < cutoff) {
      removedEvents.push(event)
    } else {
      remainingEvents.push(event)
    }
  }

  return { remainingEvents, removedEvents }
}

export function retentionCutoffIso(retentionDays, now = new Date()) {
  const days = Number(retentionDays)
  if (!Number.isInteger(days) || days < 1) {
    throw new Error('--retention-days must be a positive integer')
  }

  const nowTimestamp = now instanceof Date ? now.getTime() : Date.parse(now)
  if (!Number.isFinite(nowTimestamp)) {
    throw new Error('now must be a valid Date or ISO date string')
  }

  return new Date(nowTimestamp - days * 24 * 60 * 60 * 1000).toISOString()
}

export function runConsentLogAdmin(argv, options = {}) {
  const command = parseConsentLogAdminArgs(argv)
  if (command.help) return helpText

  const filePath = resolveConsentLogPath(command.file, options.cwd || process.cwd())
  const events = readConsentLogFile(filePath)
  const mutationCount =
    Number(Boolean(command.deleteEventId)) +
    Number(Boolean(command.pruneBefore)) +
    Number(Boolean(command.retentionDays))

  if (command.list && mutationCount > 0) {
    throw new Error('Use --list separately from deletion or retention operations')
  }

  if (command.list) {
    return formatJson(filterConsentEvents(events, command.filters), command.pretty)
  }

  if (mutationCount === 0) {
    throw new Error('Choose --list, --delete-event-id, --prune-before, or --retention-days')
  }

  let remainingEvents = events
  const removedEvents = []
  let retentionCutoff = null

  if (command.deleteEventId) {
    const result = deleteConsentEvents(remainingEvents, command.deleteEventId)
    remainingEvents = result.remainingEvents
    removedEvents.push(...result.removedEvents)
  }

  if (command.pruneBefore || command.retentionDays) {
    retentionCutoff =
      command.pruneBefore ||
      retentionCutoffIso(command.retentionDays, options.now || new Date())
    const result = pruneConsentEvents(remainingEvents, retentionCutoff)
    remainingEvents = result.remainingEvents
    removedEvents.push(...result.removedEvents)
  }

  if (command.commit) {
    writeConsentLogFile(filePath, remainingEvents)
  }

  return formatJson(
    {
      file: filePath,
      dryRun: !command.commit,
      originalCount: events.length,
      remainingCount: remainingEvents.length,
      removedCount: removedEvents.length,
      removedEventIds: removedEvents.map((event) => event.eventId).filter(Boolean),
      retentionCutoff,
    },
    command.pretty,
  )
}

export function parseConsentLogAdminArgs(argv) {
  const command = {
    commit: false,
    file: null,
    filters: {},
    help: false,
    list: false,
    pretty: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    switch (arg) {
      case '--help':
      case '-h':
        command.help = true
        break
      case '--commit':
        command.commit = true
        break
      case '--pretty':
        command.pretty = true
        break
      case '--file':
        command.file = nextArg(argv, (index += 1), arg)
        break
      case '--list':
        command.list = true
        break
      case '--event-id':
        command.filters.eventId = nextArg(argv, (index += 1), arg)
        break
      case '--event-type':
        command.filters.eventType = nextArg(argv, (index += 1), arg)
        break
      case '--source-path':
        command.filters.sourcePath = nextArg(argv, (index += 1), arg)
        break
      case '--from':
        command.filters.from = parseIsoArg(nextArg(argv, (index += 1), arg), arg)
        break
      case '--to':
        command.filters.to = parseIsoArg(nextArg(argv, (index += 1), arg), arg)
        break
      case '--gpc':
        command.filters.globalPrivacyControl = parseBooleanArg(
          nextArg(argv, (index += 1), arg),
          arg,
        )
        break
      case '--category':
        command.filters.category = parseCategoryArg(nextArg(argv, (index += 1), arg))
        break
      case '--category-value':
        command.filters.categoryValue = parseBooleanArg(
          nextArg(argv, (index += 1), arg),
          arg,
        )
        break
      case '--request-ip-hash':
        command.filters.requestIpHash = nextArg(argv, (index += 1), arg)
        break
      case '--user-agent-hash':
        command.filters.userAgentHash = nextArg(argv, (index += 1), arg)
        break
      case '--session-id-hash':
        command.filters.sessionIdHash = nextArg(argv, (index += 1), arg)
        break
      case '--user-identifier-hash':
        command.filters.userIdentifierHash = nextArg(argv, (index += 1), arg)
        break
      case '--delete-event-id':
        command.deleteEventId = nextArg(argv, (index += 1), arg)
        break
      case '--prune-before':
        command.pruneBefore = parseIsoArg(nextArg(argv, (index += 1), arg), arg)
        break
      case '--retention-days':
        command.retentionDays = nextArg(argv, (index += 1), arg)
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }

  if (!command.help && !command.file) {
    throw new Error('--file is required')
  }

  if (command.filters.categoryValue !== undefined && !command.filters.category) {
    throw new Error('--category-value requires --category')
  }

  return command
}

function nextArg(argv, index, flag) {
  const value = argv[index]
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`)
  }
  return value
}

function parseBooleanArg(value, flag) {
  if (/^(1|true|yes)$/i.test(value)) return true
  if (/^(0|false|no)$/i.test(value)) return false
  throw new Error(`${flag} must be true or false`)
}

function parseCategoryArg(value) {
  if (!booleanFilterFields.has(value)) {
    throw new Error(`--category must be one of ${Array.from(booleanFilterFields).join(', ')}`)
  }
  return value
}

function parseIsoArg(value, flag) {
  parseTimestamp(value, flag)
  return value
}

function parseTimestamp(value, label) {
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) {
    throw new Error(`${label} must be a valid ISO date`)
  }
  return timestamp
}

function consentEventTimestamp(event) {
  if (!event || typeof event.occurredAt !== 'string') {
    throw new Error('Consent log event is missing occurredAt')
  }
  return parseTimestamp(event.occurredAt, `event ${event.eventId || '<unknown>'} occurredAt`)
}

function resolveConsentLogPath(filePath, cwd) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('--file is required')
  }

  const resolvedPath = resolve(cwd, filePath)
  const publicDistPath = resolve(cwd, 'dist')
  if (resolvedPath === publicDistPath || resolvedPath.startsWith(`${publicDistPath}${sep}`)) {
    throw new Error('Consent logs must not be read from or written inside public dist')
  }
  return resolvedPath
}

function readConsentLogFile(filePath) {
  if (!existsSync(filePath)) return []
  return parseConsentLogJsonl(readFileSync(filePath, 'utf8'))
}

function writeConsentLogFile(filePath, events) {
  mkdirSync(dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.tmp-${process.pid}-${Date.now()}`
  writeFileSync(temporaryPath, serializeConsentLogJsonl(events), 'utf8')
  renameSync(temporaryPath, filePath)
}

function formatJson(value, pretty) {
  return JSON.stringify(value, null, pretty ? 2 : 0)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    console.log(runConsentLogAdmin(process.argv.slice(2)))
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
