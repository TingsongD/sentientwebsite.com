import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

export default function DmcaPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · Copyright"
      title="DMCA policy"
      intro="This policy explains how to send copyright notices for material on SentientWeb services."
      sections={[
        {
          id: 'dmca-scope',
          title: 'Scope',
          body: (
            <p>
              The public website does not host user content at scale. If a future SentientWeb
              service hosts customer or user content, we may remove allegedly infringing material and
              terminate repeat infringers where required by law.
            </p>
          ),
        },
        {
          id: 'dmca-notice',
          title: 'Copyright notice',
          body: (
            <>
              <p>Send notices to our copyright contact with:</p>
              <LegalList>
                <li>Your physical or electronic signature.</li>
                <li>Identification of the copyrighted work you claim was infringed.</li>
                <li>Identification and location of the allegedly infringing material.</li>
                <li>Your name, mailing address, phone number, and email address.</li>
                <li>A good-faith statement that the disputed use is not authorized.</li>
                <li>A statement under penalty of perjury that your notice is accurate and authorized.</li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'dmca-counter',
          title: 'Counter-notices',
          body: (
            <p>
              If material you provided was removed and you believe it was removed by mistake or
              misidentification, email us with a counter-notice containing the information required by
              the DMCA or other applicable copyright law. We may restore material where legally
              appropriate.
            </p>
          ),
        },
        {
          id: 'dmca-contact',
          title: 'Copyright contact',
          body: (
            <p>
              Email:{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com?subject=Copyright%20Notice">
                songday@sentientwebsite.com
              </LegalLink>
              . Because SentientWeb does not host user content at scale, a formal DMCA agent
              registration is not currently used. If user-content hosting changes materially,
              SentientWeb should revisit DMCA agent registration.
            </p>
          ),
        },
      ]}
    />
  )
}
