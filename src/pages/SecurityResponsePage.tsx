import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

export default function SecurityResponsePage() {
  return (
    <LegalPage
      eyebrow="Legal · Security"
      title="Security and breach response"
      intro="This page summarizes public security reporting and incident response practices."
      sections={[
        {
          id: 'sr-report',
          title: 'Report a vulnerability',
          body: (
            <p>
              If you believe you found a vulnerability, email{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com?subject=Security%20Report">
                songday@sentientwebsite.com
              </LegalLink>{' '}
              with enough detail for us to reproduce the issue. Do not access, modify, delete, or
              exfiltrate data that is not yours.
            </p>
          ),
        },
        {
          id: 'sr-rules',
          title: 'Testing rules',
          body: (
            <LegalList>
              <li>Use only your own accounts and data.</li>
              <li>Do not degrade, disrupt, or overload systems.</li>
              <li>Do not social engineer employees, contractors, customers, or vendors.</li>
              <li>Do not test physical security or third-party systems without permission.</li>
              <li>Give us a reasonable opportunity to investigate before public disclosure.</li>
            </LegalList>
          ),
        },
        {
          id: 'sr-response',
          title: 'Incident response',
          body: (
            <p>
              We triage security reports, preserve relevant logs, contain confirmed incidents,
              investigate scope, remediate root causes, and notify affected parties and regulators where
              legally required. We maintain vendor contacts and escalation paths for providers involved
              in hosting, scheduling, email, <strong>HubSpot</strong> (CRM data), Robanka operations,{' '}
              <strong>Google</strong> (Gemini Live AI technology), ancillary analytics tooling, Stripe
              when payments run, and infrastructure partners coordinating incident response with{' '}
              <strong>songday@sentientwebsite.com</strong>.
            </p>
          ),
        },
        {
          id: 'sr-backoffice',
          title: 'Private controls',
          body: (
            <p>
              Public notices are not a substitute for internal security operations. SentientWeb should
              maintain a private breach response runbook, data map, retention schedule, processor
              register, access review process, backup and recovery plan, and evidence of vendor
              security review.
            </p>
          ),
        },
      ]}
    />
  )
}
