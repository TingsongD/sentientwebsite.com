import { Link } from 'react-router-dom'
import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow="Legal · Notice"
      title="Legal notice"
      intro="This page provides contact, compliance, and operational notices for SentientWeb."
      sections={[
        {
          id: 'ln-operator',
          title: 'Website operator',
          body: (
            <p>
              SentientWeb is operated by Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5,
              Canada. Legal, privacy, security, accessibility, and copyright notices may be sent to{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com">songday@sentientwebsite.com</LegalLink>.
            </p>
          ),
        },
        {
          id: 'ln-compliance-assets',
          title: 'Compliance assets',
          body: (
            <>
              <p>The public compliance set includes:</p>
              <LegalList>
                <li>
                  <Link to="/privacy" className="text-neon underline-offset-4 transition hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-neon underline-offset-4 transition hover:underline">
                    Cookie Policy and preference center
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-neon underline-offset-4 transition hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/billing-terms" className="text-neon underline-offset-4 transition hover:underline">
                    Billing, refund, cancellation, and EU withdrawal terms
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="text-neon underline-offset-4 transition hover:underline">
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link to="/data-request" className="text-neon underline-offset-4 transition hover:underline">
                    Data Request page
                  </Link>
                </li>
                <li>
                  <Link to="/do-not-sell" className="text-neon underline-offset-4 transition hover:underline">
                    Do Not Sell or Share page
                  </Link>
                </li>
                <li>
                  <Link to="/ai-disclosure" className="text-neon underline-offset-4 transition hover:underline">
                    Automated assistant disclosure
                  </Link>
                </li>
                <li>
                  <Link to="/dmca" className="text-neon underline-offset-4 transition hover:underline">
                    DMCA Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security-response"
                    className="text-neon underline-offset-4 transition hover:underline"
                  >
                    Security and breach response
                  </Link>
                </li>
                <li>
                  <Link to="/unsubscribe" className="text-neon underline-offset-4 transition hover:underline">
                    Unsubscribe and marketing opt-out
                  </Link>
                </li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'ln-required-backoffice',
          title: 'Back-office requirements',
          body: (
            <p>
              Public website notices do not by themselves complete compliance. Robanka Inc. should
              maintain its arrangements with Google for AI services (Gemini Live) used by the
              assistant, HubSpot for CRM and stored business/contact data,
              Stripe PCI evidence for payment flows; hosting, analytics, scheduling, and email vendor
              terms; a security and breach response plan; records of consent; data maps; retention
              rules; subprocessors list; DPIA or transfer impact assessments where required; and
              human review for high-risk decisions.
            </p>
          ),
        },
      ]}
    />
  )
}
