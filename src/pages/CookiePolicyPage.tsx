import { Link } from 'react-router-dom'
import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'
import { SITE_HOSTNAME } from '../constants'

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal · Cookies"
      title="Cookie policy"
      intro={`This policy explains the browser storage choices used on ${SITE_HOSTNAME}.`}
      sections={[
        {
          id: 'cp-overview',
          title: 'Overview',
          body: (
            <p>
              We use cookies, local storage, and similar technologies to run the site, remember your
              choices, protect the service, measure performance if enabled, and load the live
              automated assistant only after you consent.
            </p>
          ),
        },
        {
          id: 'cp-categories',
          title: 'Categories',
          body: (
            <LegalList>
              <li>
                Necessary storage: required for security, routing, consent records, and core site
                functions. This cannot be turned off through our preference center.
              </li>
              <li>
                Preference storage: remembers display and privacy choices, including whether you
                want the assistant loaded.
              </li>
              <li>
                Live assistant storage: allows <strong>Google</strong> Gemini Live (our AI technology
                provider), with Robanka operating the experience, to process interaction context, text,
                and microphone audio while the assistant is active.
              </li>
              <li>
                Analytics or marketing storage: HubSpot and similar tools may read or set storage when
                enabled and you consent where required, including to support forms, email, and CRM
                workflows tied to our HubSpot account.
              </li>
            </LegalList>
          ),
        },
        {
          id: 'cp-manage',
          title: 'Manage choices',
          body: (
            <p>
              Use the “Privacy choices” button in the footer to update consent at any time. You can
              also block or delete cookies in your browser, but some site functions may not work.
              Withdrawing live assistant consent stops future loading in that browser; it does not erase
              data already retained by <strong>HubSpot</strong> or <strong>Google</strong> under their
              policies—you may submit privacy requests as described on our{' '}
              <Link to="/privacy" className="text-neon underline-offset-4 transition hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          ),
        },
        {
          id: 'cp-do-not-track',
          title: 'Browser signals',
          body: (
            <p>
              We evaluate legally required opt-out preference signals, including Global Privacy
              Control, when applicable. Browser “Do Not Track” signals do not have a uniform industry
              standard, so we do not respond to them separately.
            </p>
          ),
        },
        {
          id: 'cp-contact',
          title: 'Contact',
          body: (
            <p>
              Cookie questions:{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com">songday@sentientwebsite.com</LegalLink>.
            </p>
          ),
        },
      ]}
    />
  )
}
