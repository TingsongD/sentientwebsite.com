import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

export default function UnsubscribePage() {
  return (
    <LegalPage
      eyebrow="Legal · Communications"
      title="Unsubscribe"
      intro="Use this page to opt out of SentientWeb marketing communications."
      sections={[
        {
          id: 'unsub-email',
          title: 'Email marketing',
          body: (
            <p>
              Marketing emails from SentientWeb should include an unsubscribe link. You can also
              email{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com?subject=Unsubscribe%20Request">
                songday@sentientwebsite.com
              </LegalLink>{' '}
              with “Unsubscribe Request” in the subject and the email address you want removed from
              marketing lists.
            </p>
          ),
        },
        {
          id: 'unsub-sms',
          title: 'SMS and phone communications',
          body: (
            <p>
              If SentientWeb sends SMS messages in the future, each campaign must provide legally
              required opt-out instructions, such as replying STOP where supported. Until an SMS
              provider is configured, send opt-out requests to the same email address.
            </p>
          ),
        },
        {
          id: 'unsub-scope',
          title: 'What remains after opt-out',
          body: (
            <>
              <p>Opting out of marketing does not stop:</p>
              <LegalList>
                <li>Transactional or service messages about an active account, demo, invoice, or security issue.</li>
                <li>Legally required notices.</li>
                <li>Suppression-list processing needed to honor your opt-out.</li>
              </LegalList>
            </>
          ),
        },
      ]}
    />
  )
}
