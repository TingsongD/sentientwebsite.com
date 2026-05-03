import { Link } from 'react-router-dom'
import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'
import { SITE_HOSTNAME } from '../constants'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · Privacy"
      title="Privacy policy"
      intro="This policy is written for SentientWeb’s public website and live automated assistant experience."
      sections={[
        {
          id: 'pp-controller',
          title: 'Who we are',
          body: (
            <p>
              SentientWeb is operated by Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5,
              Canada (“SentientWeb,” “we,” “us,” or “our”). We operate {SITE_HOSTNAME} and
              related product experiences. Contact us at{' '}
              <LegalLink href="mailto:hello@sentientwebsite.com">hello@sentientwebsite.com</LegalLink>.
              We have determined that a Data Protection Officer and EU/UK representative are not
              required at this time. You may use the contact above for privacy rights and regulator
              inquiries.
            </p>
          ),
        },
        {
          id: 'pp-collect',
          title: 'Information we collect',
          body: (
            <>
              <p>We collect only what is reasonably needed to run, protect, and improve the site:</p>
              <LegalList>
                <li>
                  Contact details, company details, and messages you submit—not stored in SentientWeb
                  or Robanka systems. They are retained in <strong>HubSpot</strong>, our CRM, under
                  HubSpot’s policies and controls.
                </li>
                <li>Calendar booking details if you schedule time through Calendly.</li>
                <li>Usage data such as pages viewed, approximate location from IP, browser, device, and logs.</li>
                <li>
                  Live assistant inputs, including text, page context you interact with, microphone audio
                  while the assistant is active, transcripts, generated responses, and interaction metadata.
                </li>
                <li>
                  Cookies, local storage, and similar technologies described in our{' '}
                  <Link to="/cookies" className="text-neon underline-offset-4 transition hover:underline">
                    Cookie Policy
                  </Link>.
                </li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'pp-ai-voice',
          title: 'Live assistant, audio, and page context',
          body: (
            <>
              <p>
                The live assistant is automated. <strong>Google</strong> is our AI technology
                provider—it supplies <strong>Gemini Live</strong> to process requests. Robanka Inc.
                operates this site and configures the assistant experience. The assistant is not a
                human operator. If you enable voice interaction, your browser and the assistant process
                your microphone audio so the system can understand and respond. The assistant may also
                process the page you are viewing, interaction events, and conversation context to
                provide an interactive browsing experience.
              </p>
              <p className="mt-4">
                Do not provide sensitive personal data, payment card numbers, government identifiers,
                health information, precise biometric identifiers, children’s information, or
                confidential information unless we have specifically requested it through a secure
                workflow. You can use the site without enabling microphone access.
              </p>
            </>
          ),
        },
        {
          id: 'pp-use',
          title: 'How we use information',
          body: (
            <>
              <p>We use information to:</p>
              <LegalList>
                <li>Operate the website and live assistant, including voice and browsing assistance.</li>
                <li>Respond to inquiries, provide demos, manage accounts, and deliver requested services.</li>
                <li>Secure, debug, monitor, and improve the website and product experience.</li>
                <li>Send service messages and marketing where permitted, with unsubscribe options.</li>
                <li>Comply with law, enforce terms, prevent misuse, and protect rights and safety.</li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'pp-legal-bases',
          title: 'Legal bases for Europe and the UK',
          body: (
            <p>
              Where GDPR or UK GDPR applies, we rely on consent for microphone access, non-essential
              cookies, and marketing; contract or pre-contract steps for demos, account setup, and
              requested services; legitimate interests for security, fraud prevention, service
              improvement, and business communications; and legal obligation where we must retain or
              disclose information by law. You may withdraw consent at any time without affecting
              prior lawful processing.
            </p>
          ),
        },
        {
          id: 'pp-share',
          title: 'Service providers and disclosures',
          body: (
            <>
              <p>
                We share information with vendors that help us provide the site and services. Persistent
                business and marketing records—including contact and pipeline fields—are retained only
                in <strong>HubSpot</strong> under HubSpot&apos;s agreements and settings (not on
                SentientWeb- or Robanka-operated databases). Our live assistant relies on{' '}
                <strong>Google</strong> (Gemini Live and related Google services) as the{' '}
                <strong>AI technology provider</strong>, and assistant-related persistence is governed
                by Google&apos;s terms. We also use providers for hosting, security, scheduling
                (Calendly), email, optional analytics beyond HubSpot if enabled, Robanka Inc.
                operational delivery, and professional advisers. Providers must protect information and
                use it only as permitted.
              </p>
              <p className="mt-4">
                We may disclose information if required by law, to protect users and systems, during
                a corporate transaction, or with your direction. We do not sell personal information
                for money. If any activity is considered a “sale,” “sharing,” or targeted advertising
                under applicable U.S. state privacy law, you can opt out through our{' '}
                <Link to="/do-not-sell" className="text-neon underline-offset-4 transition hover:underline">
                  Do Not Sell or Share
                </Link>{' '}
                page.
              </p>
            </>
          ),
        },
        {
          id: 'pp-retention',
          title: 'Retention',
          body: (
            <p>
              <strong>Persistent retention lives only with HubSpot and Google.</strong> SentientWeb
              and Robanka Inc. do <strong>not</strong> persist visitor personal information (including
              CRM or assistant session contents) on SentientWeb- or Robanka-operated databases. CRM
              and marketing data you provide is retained by <strong>HubSpot</strong> pursuant to its
              product terms and your portal settings. The live assistant is powered by{' '}
              <strong>Google</strong>; related audio where applicable, transcripts, activity logs,
              page context forwarded for assistance, prompts, outputs, and similar metadata{' '}
              <strong>may be retained by Google</strong> (Gemini Apps / Gemini Live and related notices)
              as updated from time to time—for illustration, Google publicly describes Gemini Apps activity
              that can be kept for periods such as{' '}
              <strong>eighteen months</strong>, that Gemini Live recordings are not used to improve Google
              services by default depending on configuration, and that transcript/activity handling depends
              on Gemini activity controls. Locally, your browser may keep preference choices described in our{' '}
              <Link to="/cookies" className="text-neon underline-offset-4 transition hover:underline">
                Cookie Policy
              </Link>
              . Hosting and infrastructure vendors may retain transient logs needed to deliver the website;
              retention there follows provider terms and lawful minimisation practices.
            </p>
          ),
        },
        {
          id: 'pp-rights',
          title: 'Your privacy rights',
          body: (
            <>
              <p>
                Depending on your location, you may have rights to access, correct, delete, port, or
                restrict personal information; object to or opt out of certain processing; withdraw
                consent; appeal a privacy decision; limit use of sensitive information; or complain
                to a regulator. California and other U.S. state residents may also request details
                about categories of information collected, disclosed, sold, or shared.
              </p>
              <p className="mt-4">
                Submit requests through our{' '}
                <Link to="/data-request" className="text-neon underline-offset-4 transition hover:underline">
                  Data Request page
                </Link>{' '}
                or by email. We may need to verify your identity and may ask authorized agents for
                proof of authority.
              </p>
            </>
          ),
        },
        {
          id: 'pp-international',
          title: 'International transfers',
          body: (
            <p>
              Our vendors may process information in the United States, Canada, the European Union,
              Australia, New Zealand, and other countries where they operate. Where required, we rely on
              transfer mechanisms such as adequacy decisions, standard contractual clauses, data
              processing agreements, and comparable safeguards.
            </p>
          ),
        },
        {
          id: 'pp-children',
          title: 'Children and teens',
          body: (
            <p>
              The website and live assistant are not directed to children under 18, and Google’s
              Gemini API terms restrict API clients directed toward or likely to be accessed by
              individuals under 18. Do not use the assistant if you are under 18. We do not knowingly
              collect children’s personal information. Contact us if you believe a child provided us
              personal information.
            </p>
          ),
        },
        {
          id: 'pp-security',
          title: 'Security',
          body: (
            <p>
              We use technical and organizational safeguards designed to protect information,
              including access controls, transport security, security headers, vendor review, and
              incident response procedures. No online service can guarantee absolute security.
            </p>
          ),
        },
        {
          id: 'pp-contact',
          title: 'Contact',
          body: (
            <p>
              Privacy requests and questions:{' '}
              <LegalLink href="mailto:hello@sentientwebsite.com">hello@sentientwebsite.com</LegalLink>.
            </p>
          ),
        },
      ]}
    />
  )
}
