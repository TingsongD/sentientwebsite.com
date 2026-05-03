import { Link } from 'react-router-dom'
import { LegalList, LegalPage } from '../components/LegalPage'

export default function AiDisclosurePage() {
  return (
    <LegalPage
      eyebrow="Legal · Automation"
      title="Automated assistant disclosure"
      intro="This notice explains the automated, voice-enabled experience on the website."
      sections={[
        {
          id: 'ai-identity',
          title: 'You are interacting with automation',
          body: (
            <p>
              The live assistant on this website is an automated system. <strong>Google</strong>{' '}
              provides the underlying AI technology (Gemini Live). Robanka Inc. operates the site and
              configures how that technology is presented here. It is not a human employee, lawyer,
              doctor, financial adviser, or compliance professional.
            </p>
          ),
        },
        {
          id: 'ai-audio',
          title: 'Voice capture',
          body: (
            <p>
              If you choose microphone mode, your voice is captured and processed while the feature
              is active so the assistant can understand and respond. Your browser should request
              microphone permission before audio is transmitted. You can deny or revoke microphone
              access in your browser settings and continue using the website without voice mode.
            </p>
          ),
        },
        {
          id: 'ai-limits',
          title: 'Limits and prohibited uses',
          body: (
            <>
              <p>Do not use the assistant to:</p>
              <LegalList>
                <li>Submit sensitive, confidential, children’s, payment, health, or government ID data.</li>
                <li>Seek legal, medical, financial, tax, safety, or other professional advice.</li>
                <li>Create deceptive content, impersonate people, or make high-impact eligibility decisions.</li>
                <li>Record bystanders without notice and any legally required consent.</li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'ai-rights',
          title: 'Your choices',
          body: (
            <p>
              You can decline assistant consent, avoid microphone mode, close the assistant, clear
              browser permissions, or submit privacy requests through our{' '}
              <Link to="/data-request" className="text-neon underline-offset-4 transition hover:underline">
                Data Request page
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
