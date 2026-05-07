import { Link } from 'react-router-dom'
import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'
import { SITE_HOSTNAME } from '../constants'

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal · Terms"
      title="Terms of service"
      intro="These terms govern access to SentientWeb’s website, live automated assistant, and related services."
      sections={[
        {
          id: 'tos-accept',
          title: 'Agreement',
          body: (
            <p>
              By accessing {SITE_HOSTNAME}, using the live automated assistant, scheduling a
              demo, or using our services, you agree to these Terms. If you use SentientWeb for a
              company, you represent that you have authority to bind that company. SentientWeb is
              operated by Robanka Inc., 505 Burrard Street, Vancouver, BC V7X 1M5, Canada. If you do
              not agree, do not use the site or services.
            </p>
          ),
        },
        {
          id: 'tos-service',
          title: 'Services and separate agreements',
          body: (
            <p>
              SentientWeb provides website revenue recovery software, implementation services, and a
              live automated assistant experience. Paid pilots, subscriptions, managed services,
              usage limits, service levels, data processing terms, and commercial commitments require
              a signed order form or written agreement. If a separate agreement conflicts with these
              Terms, that agreement controls for the covered services.
            </p>
          ),
        },
        {
          id: 'tos-ai',
          title: 'Automated assistant disclosure',
          body: (
            <>
              <p>
                The live assistant is automated. <strong>Google</strong> supplies the AI technology
                (<strong>Gemini Live</strong>); Robanka Inc. operates this site and the assistant
                experience. Its responses can be incomplete, inaccurate, or outdated. Do not rely on
                assistant output as legal, medical, financial, tax, safety, or other professional
                advice. Confirm important information with a qualified person.
              </p>
              <p className="mt-4">
                If you choose voice mode, your microphone audio is captured and processed while the
                feature is active so the assistant can respond. You are responsible for ensuring that
                people near your device know before you transmit their voice or personal information.
                <strong>Persistent retention lives only with HubSpot and Google.</strong>{' '}
                SentientWeb and Robanka do not persist those assistant payloads on SentientWeb- or
                Robanka-operated databases. Any persistence beyond your device follows HubSpot CRM
                settings (when you exchange business information routed there) or Google Gemini Apps /
                Gemini Live terms—for example Google has publicly disclosed activity durations such as{' '}
                <strong>eighteen months</strong> depending on settings, Gemini Live recordings not being
                used to improve Google services by default depending on controls, and similar updates in
                their help documentation.
              </p>
            </>
          ),
        },
        {
          id: 'tos-eligibility',
          title: 'Eligibility and minors',
          body: (
            <p>
              You must be at least 18 years old and legally able to enter these Terms. The site and
              assistant are not directed to children or teens under 18. You may not use the services
              if law or platform terms prohibit your use.
            </p>
          ),
        },
        {
          id: 'tos-acceptable',
          title: 'Acceptable use',
          body: (
            <>
              <p>You agree not to:</p>
              <LegalList>
                <li>Violate law, privacy rights, intellectual property rights, or platform rules.</li>
                <li>Record or submit another person’s voice, image, or data without required notice or consent.</li>
                <li>Submit sensitive personal data, payment card data, secrets, or children’s data unless requested through a secure workflow.</li>
                <li>Use the assistant for unlawful surveillance, biometric identification, deception, deepfakes, harassment, or discriminatory decisions.</li>
                <li>Reverse engineer, scrape, overload, bypass safeguards, or interfere with the site, assistant, or underlying models.</li>
                <li>Use outputs to make high-impact eligibility, employment, credit, housing, insurance, legal, medical, or similar decisions without lawful human review.</li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'tos-customer-content',
          title: 'Your content and permissions',
          body: (
            <p>
              You retain rights to content you submit. You grant SentientWeb and its providers a
              limited license to process that content to operate, secure, support, and improve the
              services as described in our Privacy Policy and any applicable data processing terms.
              You represent that you have all rights and notices needed to submit the content.
            </p>
          ),
        },
        {
          id: 'tos-ip',
          title: 'Intellectual property',
          body: (
            <p>
              SentientWeb and its licensors own the website, software, workflows, branding, designs,
              documentation, and related technology. Subject to these Terms, we grant you a limited,
              revocable, non-exclusive, non-transferable right to use the public site and any services
              we make available to you for their intended purposes.
            </p>
          ),
        },
        {
          id: 'tos-sale',
          title: 'Payments, cancellations, and refunds',
          body: (
            <p>
              The public website does not currently process checkout payments. Any fees, taxes,
              cancellation rights, renewal terms, refunds, service credits, consumer withdrawal
              rights, or return policies must be stated in the applicable order form or checkout
              terms before purchase. EU, UK, Canadian, Australian, New Zealand, and U.S. consumer
              rights that cannot legally be waived remain unaffected.
            </p>
          ),
        },
        {
          id: 'tos-dmca',
          title: 'User content and copyright notices',
          body: (
            <p>
              If future services host user-posted content, we may remove allegedly infringing
              material and terminate repeat infringers where required. Copyright concerns can be sent
              to{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com">songday@sentientwebsite.com</LegalLink>
              . Include the work, the allegedly infringing material, your contact information, and a
              statement that your notice is accurate and authorized.
            </p>
          ),
        },
        {
          id: 'tos-disclaimer',
          title: 'Disclaimers',
          body: (
            <p>
              The site, assistant, and services are provided “as is” and “as available.” To the
              fullest extent permitted by law, SentientWeb disclaims warranties of merchantability,
              fitness for a particular purpose, non-infringement, accuracy, availability, and that
              outputs will meet your requirements. We do not guarantee revenue results.
            </p>
          ),
        },
        {
          id: 'tos-liability',
          title: 'Limitation of liability',
          body: (
            <p>
              To the maximum extent permitted by law, SentientWeb and its suppliers will not be
              liable for indirect, incidental, special, consequential, exemplary, or punitive
              damages, or lost profits, revenue, goodwill, data, or business opportunities. Our
              aggregate liability for claims relating to the site or services is limited to the
              greater of amounts you paid us for the relevant services in the twelve months before the
              claim or one hundred U.S. dollars, unless a separate agreement states otherwise.
            </p>
          ),
        },
        {
          id: 'tos-law',
          title: 'Governing law',
          body: (
            <p>
              These Terms are governed by Delaware law, excluding conflict-of-law rules, unless a
              separate agreement states otherwise or mandatory consumer law requires another forum or
              governing law. Courts in Delaware have exclusive venue for permitted disputes, subject
              to mandatory rights in your country, province, state, or territory.
            </p>
          ),
        },
        {
          id: 'tos-legal-links',
          title: 'Related policies',
          body: (
            <p>
              These Terms incorporate our{' '}
              <Link to="/privacy" className="text-neon underline-offset-4 transition hover:underline">
                Privacy Policy
              </Link>
              ,{' '}
              <Link to="/cookies" className="text-neon underline-offset-4 transition hover:underline">
                Cookie Policy
              </Link>
              , and any written service terms we provide for paid services.
            </p>
          ),
        },
      ]}
    />
  )
}
