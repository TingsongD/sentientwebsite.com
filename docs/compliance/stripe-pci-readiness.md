# Stripe PCI Readiness Checklist

Last updated: April 28, 2026

Status: **Completed for intended architecture** April 2026. Complete live-payment launch only after Stripe Dashboard PCI workflow is executed for the production account and webhook secrets/MFA checkpoints are reverified.

## Payment processor

Stripe is the designated processor for SentientWeb payment flows (`/billing-terms`). Primary operations contact: `songday@sentientwebsite.com`.

## PCI position

SentientWeb does **not** store full payment card numbers, CVV, or raw magnetic stripe/chip data in SentientWeb first-party runtime codepaths. Payments are designed for **Stripe Checkout** (hosted card entry).

## Completed decisions

- [x] Integration type chosen: Stripe Checkout unless product later migrates—update this file and `/billing-terms` if the integration changes.
- [x] Card data enters Stripe-hosted Stripe Checkout fields only; SentientWeb servers do not handle raw PAN/CVV.
- [x] Stripe PCI evidence path documented: complete SAQ A (or Stripe-directed equivalent) in Stripe Dashboard and retain attestation/export off-repository prior to accepting live payments.
- [x] Webhook signing secret handling: secrets live only in server-side environment/config; rotate on suspicion of exposure (`docs/compliance/placeholder-evidence-register.md`).
- [x] Stripe Dashboard MFA enforced for authorized finance/operations users with least-privilege roles.
- [x] Refund/cancellation posture aligned with `/billing-terms`; owner accountability `songday@sentientwebsite.com`.

## Operational controls (ongoing)

- Restrict Stripe Dashboard access to authorized finance/operations users.
- Enable MFA on Stripe accounts.
- Use least-privilege API keys on any future Connect/custom flows.
- Keep Stripe secret keys out of frontend code and public repositories.
- Rotate exposed keys immediately.
- Log payment events without storing sensitive card data.

## Evidence to attach (off-repository)

Keep with finance/security records:

- Stripe account legal entity and services agreement acceptance
- Completed PCI questionnaire / Stripe compliance export
- Architecture note showing hosted Checkout fields only
- Webhook verification and rotation procedures
- Refund/dispute playbook reference

Approver / owner: SentientWeb operations (`songday@sentientwebsite.com`)

Date finalized: April 28, 2026
