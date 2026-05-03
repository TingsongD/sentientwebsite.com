# Consent Evidence Log Specification

Last updated: May 3, 2026

Status: implementation and operations specification. The current frontend stores consent locally and gates the live assistant before it loads. The owner confirmed on May 3, 2026 that server-side consent evidence is required for production operations; production must configure the restricted log path and salt before relying on consent evidence.

## Current Frontend Consent State

`src/components/ConsentManager.tsx` stores browser-local consent under:

```text
sentientweb:privacy-consent:v1
```

Current fields:

| Field | Meaning |
| --- | --- |
| `preferences` | User allowed preference storage beyond strictly necessary storage |
| `assistant` | User allowed the live assistant (**Google Gemini Live** AI loading after consent / age confirmation) |
| `analytics` | User allowed optional analytics, unless Global Privacy Control is enabled |
| `ageConfirmed` | User confirmed they are 18 or older before assistant activation |
| `updatedAt` | ISO timestamp when the local preference was saved |

The frontend also disables analytics when `navigator.globalPrivacyControl` is present and prevents the assistant from loading unless both `assistant` and `ageConfirmed` are true.

The frontend posts sanitized consent choices to `POST /consent-events` whenever a visitor accepts all, rejects optional categories, saves custom choices, or withdraws previously granted optional consent. The production server validates the event shape, rejects sensitive payload keys such as transcripts, prompts, page content, audio, and assistant output, and returns `204` with `Cache-Control: no-store`.

Server-side persistence is runtime-configured through `SENTIENT_CONSENT_LOG_PATH`. When that path is set, the server appends normalized JSONL events to that location and hashes IP/user-agent values only if `SENTIENT_CONSENT_LOG_SALT` is configured. The configured path must not be inside the publicly served `dist` directory. Store production artefacts in restricted Google Workspace/Drive or an equivalent access-controlled operations location. `scripts/consent-log-admin.mjs` provides a local, dry-run-by-default operator tool for retrieval, deletion, and retention pruning of that JSONL file.

## Server-Side Log Event

Send one event whenever a user saves, rejects, accepts all, or withdraws consent.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `eventId` | string | yes | Server-generated UUID |
| `eventType` | enum | yes | `accept_all`, `reject_optional`, `save_choices`, `withdraw`, `gpc_detected` |
| `occurredAt` | ISO timestamp | yes | Server receipt time |
| `site` | string | yes | `sentientwebsite.com` |
| `consentVersion` | string | yes | Match frontend storage version, currently `v1` |
| `privacyPolicyVersion` | string | yes | Use publication date or release hash for `/privacy` |
| `cookiePolicyVersion` | string | yes | Use publication date or release hash for `/cookies` |
| `aiDisclosureVersion` | string | yes | Use publication date or release hash for `/ai-disclosure` |
| `necessary` | boolean | yes | Always true for required site operation |
| `preferences` | boolean | yes | User choice |
| `assistant` | boolean | yes | User choice after age gate enforcement |
| `analytics` | boolean | yes | Must be false when GPC is true |
| `ageConfirmed` | boolean | yes | Required before assistant can load |
| `globalPrivacyControl` | boolean | yes | Browser GPC signal at save time |
| `regionHint` | string | no | Derived from user selection, locale, or coarse GeoIP if used |
| `requestIpHash` | string | recommended | Salted hash only; avoid retaining raw IP unless counsel approves |
| `userAgentHash` | string | recommended | Salted hash only |
| `sessionIdHash` | string | recommended | Salted hash of anonymous session identifier |
| `userIdentifierHash` | string | optional | Only if logged-in users exist |
| `sourcePath` | string | yes | Page path where consent action occurred |
| `proofText` | object | recommended | Short version labels for banner, toggles, and policy links shown |
| `withdrawnAt` | ISO timestamp | conditional | Set when a prior consent is withdrawn |
| `metadata` | object | no | Avoid storing sensitive page content, prompts, audio, or transcript data |

## Example Event

```json
{
  "eventId": "9fcd6dd1-62a4-4ad6-984e-5d61c445036a",
  "eventType": "save_choices",
  "occurredAt": "2026-05-02T18:00:00.000Z",
  "site": "sentientwebsite.com",
  "consentVersion": "v1",
  "privacyPolicyVersion": "2026-05-02",
  "cookiePolicyVersion": "2026-05-02",
  "aiDisclosureVersion": "2026-05-02",
  "necessary": true,
  "preferences": true,
  "assistant": true,
  "analytics": false,
  "ageConfirmed": true,
  "globalPrivacyControl": true,
  "regionHint": "EU",
  "requestIpHash": "sha256:salted-example",
  "userAgentHash": "sha256:salted-example",
  "sessionIdHash": "sha256:salted-example",
  "sourcePath": "/",
  "proofText": {
    "banner": "Google Gemini Live assistant (AI technology provider) loads only after consent",
    "assistantToggle": "Load the live assistant and permit text, page context, and voice processing (Google Gemini Live with Robanka-operated configuration).",
    "ageGate": "I am 18 or older"
  }
}
```

## Retention

- Keep consent evidence only as long as needed for legal, audit, dispute, and regulatory proof.
- Default production operating procedure: retain server-side consent artefacts for 548 days (approximately 18 months) to align with the owner-supplied Google/Gemini retention setting unless counsel sets a different period.
- Hash IP, user agent, and session identifiers with a rotating salt where possible.
- Do not store microphone audio, transcripts, prompts, page content, or assistant outputs in the consent log.
- Support deletion or anonymization when a verified privacy request requires it and legal retention no longer applies.

## Retrieval

Privacy and legal operators should be able to retrieve consent evidence by:

- event ID
- hashed user/session identifier
- approximate date range
- request path
- consent category
- Global Privacy Control signal

For JSONL logs written by `SENTIENT_CONSENT_LOG_PATH`, use the local admin utility from an access-controlled operator environment:

```sh
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --list --event-id <event-id> --pretty
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --list --from 2026-05-01 --to 2026-05-31 --source-path /pricing --pretty
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --list --category assistant --category-value true --gpc false --pretty
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --list --session-id-hash sha256:<hash> --pretty
```

Write operations are dry runs unless `--commit` is passed:

```sh
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --retention-days 548
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --retention-days 548 --commit
npm run consent-log:admin -- --file /restricted/sentientweb/consent-events.jsonl --delete-event-id <event-id> --commit
```

The utility refuses paths inside the public `dist` directory, matching the production server guard.

## Implementation Requirements

- [x] Confirm whether server-side consent evidence is required. Owner placeholder confirmation recorded May 3, 2026; replace with counsel memo if counsel sets a different rule.
- [x] Choose storage location and access control owner. Restricted Google Workspace/Drive under operations control is the current placeholder location.
- [x] Implement event submission endpoint.
- [x] Persist normalized JSONL events when `SENTIENT_CONSENT_LOG_PATH` is configured.
- [x] Reject raw sensitive data fields at the API boundary.
- [x] Test consent event API validation and configured JSONL append path.
- [x] Record withdrawal events when optional consent is revoked and stamp `withdrawnAt`.
- [x] Add local retention, retrieval, and deletion utility for JSONL logs.
- [x] Document operator retrieval workflow.
- [x] Schedule a production retention job or operating procedure. Run `npm run consent-log:admin -- --file <restricted-jsonl> --retention-days 548 --commit` on the approved retention cadence.
- [x] Run end-to-end withdrawal handling as part of the privacy-request operations drill.

## Launch Gate

Server-side consent evidence is owner-confirmed as required for production operations. The production assistant and optional analytics must remain disabled until `SENTIENT_CONSENT_LOG_PATH`, `SENTIENT_CONSENT_LOG_SALT`, restricted evidence storage, and retention/deletion procedures are configured for the live environment.
