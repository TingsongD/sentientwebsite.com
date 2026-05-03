# Legal and Vendor Source Register

Last updated: April 28, 2026

This register records the public official or primary sources used to shape the SentientWeb legal pages and compliance operations docs. It is not legal advice and does not replace counsel review.

## AI Transparency and Deceptive Claims

| Source | URL | Used For |
| --- | --- | --- |
| FTC Operation AI Comply | https://www.ftc.gov/news-events/news/press-releases/2024/09/ftc-announces-crackdown-deceptive-ai-claims-schemes | AI claims must not be deceptive, unsupported, or framed as professional advice without substantiation. |
| FTC AI topic page | https://www.ftc.gov/industry/technology/artificial-intelligence | General U.S. AI consumer protection posture and enforcement context. |
| EU AI Act Article 50 | https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50 | Users should be informed when directly interacting with an AI system; AI transparency notices should be clear and accessible. |

## Privacy Notices and Rights

| Source | URL | Used For |
| --- | --- | --- |
| GDPR Article 13 | https://eur-lex.europa.eu/eli/reg/2016/679/art_13/oj/eng | Privacy notice fields: controller, purposes, legal basis, recipients, transfers, retention, rights, complaints, and automated decision-making. |
| California CCPA overview | https://oag.ca.gov/privacy/ccpa | Notice at collection, privacy rights, Do Not Sell or Share, and California opt-out framing. |
| Canada PIPEDA meaningful consent | https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/ | Meaningful consent, purpose specificity, and user understanding. |
| Australia OAIC consent guidance | https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/consent-to-the-handling-of-personal-information | Consent should be informed, voluntary, current, specific, and revocable. |
| Australia OAIC personal information guidance | https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/what-is-personal-information | Voice and biometric information can be personal/sensitive information depending on use. |
| New Zealand Privacy Commissioner collection guidance | https://www.privacy.org.nz/responsibilities/your-obligations/collecting/ | Collection notices should explain what is collected, why, who can access it, choices, consequences, access/correction rights, and contact details. |

## HubSpot CRM notices

| Source | URL | Used For |
| --- | --- | --- |
| HubSpot customer privacy overview | https://legal.hubspot.com/privacy-policy | CRM data processing disclosures, lawful bases reminders, subprocessors posture. |

## Google Gemini / Google Cloud

| Source | URL | Used For |
| --- | --- | --- |
| Google Gemini Apps Privacy Hub | https://support.google.com/gemini/answer/13594961 | Gemini Live may process recordings/transcripts; activity retention can be 18 months by default; Gemini Live recordings are not used to improve Google services by default, depending on settings. |
| Google Gemini API Additional Terms | https://ai.google.dev/gemini-api/terms_preview | Gemini API age restrictions, paid/unpaid data-use distinctions, and restrictions on sensitive/professional use cases. |
| Google Cloud Data Processing Addendum | https://cloud.google.com/terms/data-processing-addendum | Google Cloud customer data processing, security, subprocessors, data locations, deletion, and data subject rights framework. |

## Payments and PCI

| Source | URL | Used For |
| --- | --- | --- |
| Stripe PCI compliance guide | https://stripe.com/guides/pci-compliance | Stripe can reduce PCI scope, but the merchant must know integration type, complete applicable SAQ documentation, and maintain PCI controls. |

## Source-to-Artifact Map

| Compliance Topic | Public Artifact | Operations Artifact |
| --- | --- | --- |
| AI transparency | `/ai-disclosure`, `/terms`, consent banner | `docs/compliance/ai-dpia.md` |
| Voice/audio notice | `/privacy`, `/ai-disclosure`, consent banner | `docs/compliance/retention-schedule.md` |
| Privacy rights | `/privacy`, `/data-request`, `/do-not-sell` | `docs/compliance/prompt-to-artifact-audit.md` |
| Cookies and GPC | `/cookies`, consent banner | `tests/e2e/production.spec.ts` |
| EU/UK representative and DPO | `/privacy`, `/legal` | `docs/compliance/eu-uk-representative-dpo-assessment.md` |
| Vendor processing | `/privacy`, `/legal` | `docs/compliance/vendor-processor-register.md` |
| Payments and PCI | `/billing-terms` | `docs/compliance/stripe-pci-readiness.md` |

## Review Rule

Re-check these sources before launch, after a material vendor change, or at least annually. If a source changes, update the public legal pages and operations docs before relying on them.
