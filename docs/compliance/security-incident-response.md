# Security and Privacy Incident Response Plan

Last updated: April 28, 2026

Status: operative plan. Incident routing and vendor escalation go through **`songday@sentientwebsite.com`** as primary operations/privacy commander; nominate backups in restricted HR records instead of publishing personal names here.

## Incident Contacts

| Role | Primary contact | Notes |
| --- | --- | --- |
| Incident commander / privacy/legal triage | `songday@sentientwebsite.com` | Mobilizes engineering, vendors, counsel; assigns severity |
| SentientWeb engineering | Routed via `songday@sentientwebsite.com` until dedicated security DL exists | Responsible for patching, rollout, containment |
| Robanka assistant / Gemini issues | Routed via `songday@sentientwebsite.com` with Robanka support channels | Covers assistant misconfiguration or suspected voice/transcript mishandling |
| Google/Gemini account admin | Google admin of record evidenced off-repository April 2026 | Contact path coordinated through commander |
| Hosting / infrastructure | Routed via commander + hosting vendor console contacts | Maintain vendor-specific numbers in restricted runbook |
| Stripe / payments | Stripe Dashboard admins (MFA enforced) coordinated through commander | For payment anomalies or suspected key exposure |

## Severity Levels

| Severity | Examples | Target Response |
| --- | --- | --- |
| SEV-1 | Confirmed unauthorized access to personal data, active exploitation, exposed assistant transcripts/audio, payment data exposure | Immediate triage, executive/legal notice, containment, regulator assessment |
| SEV-2 | High-risk vulnerability, suspected vendor breach, unauthorized admin access attempt | Same business day triage and containment plan |
| SEV-3 | Low-risk vulnerability, isolated misconfiguration, spam, non-sensitive issue | Triage within 5 business days |

## Response Phases

1. **Triage** — Capture reporter channel, timestamps, suspected data categories; assign commander.
2. **Containment** — Disable keys/widget routes, revoke sessions, escalate Robanka/Google/hosting/Stripe/email vendors as warranted.
3. **Investigation** — Document timelines, jurisdictions, minors/sensitive indicators; preserve artifacts per counsel.
4. **Notification assessment** — Counsel-led evaluation of GDPR 72-hour, U.S. state, PIPEDA, AU NDB, NZ duties.
5. **Remediation** — Patch, redeploy, update configs; add regressions/tests if applicable.
6. **Post-incident review** — Written memo; track corrective actions.

## Immediate Kill Switches

- Remove or unset `VITE_SENTIENT_WIDGET_ORIGIN`.
- Remove or unset `VITE_SENTIENT_INSTALL_KEY`.
- Disable Robanka/Gemini assistant from provider console.
- Rebuild/redeploy assistant-disabled build if frontend changes needed.
- Revoke compromised Stripe/API keys immediately.

## Evidence to Preserve

- Server and CDN logs, consent snapshots (if deployed), dashboard exports, ticketing IDs, notified parties.

## Ownership

Maintain detailed phone trees inside restricted SOC documentation. Regulatory notifications remain counsel-led after commander intake.
