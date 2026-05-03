# Remaining Production Items

Last updated: May 3, 2026

Status: working tracker for **open** launch gates only. Closed items are marked complete in `docs/compliance/production-launch-gates.md`. This file must list every **unchecked** checklist line from that file (see `scripts/compliance-audit.mjs`).

## Gate 2: Consent and Assistant Activation

| Item | Owner | Notes | Actual evidence link or note | Status |
| --- | --- | --- | --- | --- |
| Confirm whether consent logs must be stored server-side for EU/UK/ePrivacy evidence. | Privacy / counsel | EU/UK counsel decision on server-side consent artifact. | Open — record decision and link memo when issued. | Open |
| If server-side consent logs are required, implement and test consent-event storage, retention, retrieval, and deletion using `docs/compliance/consent-log-spec.md`. | Engineering | `POST /consent-events` validates sanitized consent events and appends JSONL when `SENTIENT_CONSENT_LOG_PATH` is configured; `scripts/consent-log-admin.mjs` supports tested retrieval, dry-run retention pruning, and event deletion. Counsel requirement decision, restricted storage owner, and production retention operating procedure remain open. | Open — activate the operational pieces only if counsel requires server-side logs. | Open |
| Confirm production cookie, analytics, advertising, scheduling, and assistant tags match the Cookie Policy categories using `docs/compliance/cookie-tag-inventory.md`. | Marketing ops / engineering | Finalize inventory when analytics/ads/embeds go live. | Open — align inventory with live tags (see cookie-tag-inventory.md). | Open |

## Gate 6: Security, Incident, and Rights Operations

| Item | Owner | Notes | Actual evidence link or note | Status |
| --- | --- | --- | --- | --- |
| Test data access, deletion, correction, opt-out, appeal, and consent-withdrawal handling using `docs/compliance/privacy-request-operations.md`. | Operations / privacy | Dry run with fictional data. | Open — schedule and document exercising the runbook. | Open |
| Store evidence of incidents, privacy requests, and breach decisions in a restricted location. | Operations / security | Non-repo restricted store (drive, ticketing, SOC tool). | Open — nominate system and retention rule. | Open |
| Confirm accessibility feedback owner and remediation workflow. | Product / engineering | Public statement already at `/accessibility`. | Open — assign internal owner for intake and ticketing. | Open |
