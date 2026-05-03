import { useState, type FormEvent } from 'react'
import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

const requestMailto =
  'mailto:hello@sentientwebsite.com?subject=Privacy%20or%20Data%20Request%20-%20SentientWeb'

const REQUEST_TYPES = [
  'Access',
  'Correction',
  'Deletion',
  'Portability',
  'Opt out',
  'Consent withdrawal',
  'Appeal',
]

export default function DataRequestPage() {
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [requestTypes, setRequestTypes] = useState<string[]>([])
  const [details, setDetails] = useState('')

  const toggleRequestType = (type: string) => {
    setRequestTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    )
  }

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const body = [
      'Privacy request for SentientWeb',
      '',
      `Email or contact identifier: ${email}`,
      `Country/state/province/territory: ${region || 'Not provided'}`,
      `Request type(s): ${requestTypes.length ? requestTypes.join(', ') : 'Not selected'}`,
      '',
      'Details:',
      details || 'Not provided',
      '',
      'I understand SentientWeb may need to verify my identity before acting on this request.',
    ].join('\n')

    window.location.href = `${requestMailto}&body=${encodeURIComponent(body)}`
  }

  return (
    <LegalPage
      eyebrow="Legal · Requests"
      title="Data request"
      intro="Use this page to request access, deletion, correction, opt-out, or consent withdrawal."
      sections={[
        {
          id: 'dr-how',
          title: 'How to submit',
          body: (
            <p>
              Email{' '}
              <LegalLink href={requestMailto}>hello@sentientwebsite.com</LegalLink>{' '}
              with your request type, the email address or contact details you used with us, your
              country, state, province, or territory, and enough detail for us to locate relevant
              records. Do not send government IDs or sensitive documents unless we specifically ask
              for verification through a secure channel.
            </p>
          ),
        },
        {
          id: 'dr-form',
          title: 'Request form',
          body: (
            <form className="mt-4 space-y-4" onSubmit={submitRequest}>
              <label className="block">
                <span className="block font-grotesk text-[13px] uppercase tracking-wide text-cream">
                  Email or contact identifier
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[14px] text-cream outline-none transition focus:border-neon"
                />
              </label>

              <label className="block">
                <span className="block font-grotesk text-[13px] uppercase tracking-wide text-cream">
                  Country, state, province, or territory
                </span>
                <input
                  type="text"
                  value={region}
                  onChange={(event) => setRegion(event.currentTarget.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[14px] text-cream outline-none transition focus:border-neon"
                />
              </label>

              <fieldset className="rounded-lg border border-white/10 p-3">
                <legend className="px-1 font-grotesk text-[13px] uppercase tracking-wide text-cream">
                  Request type
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {REQUEST_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 font-mono text-[13px] text-cream/80">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-neon"
                        checked={requestTypes.includes(type)}
                        onChange={() => toggleRequestType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="block font-grotesk text-[13px] uppercase tracking-wide text-cream">
                  Details
                </span>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.currentTarget.value)}
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[14px] text-cream outline-none transition focus:border-neon"
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-neon px-5 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background"
              >
                Prepare request email
              </button>
            </form>
          ),
        },
        {
          id: 'dr-types',
          title: 'Request types',
          body: (
            <LegalList>
              <li>Access or copy of personal information.</li>
              <li>Correction of inaccurate information.</li>
              <li>Deletion or erasure where legally available.</li>
              <li>Restriction, objection, portability, or consent withdrawal.</li>
              <li>Opt out of sale, sharing, targeted advertising, profiling, or marketing.</li>
              <li>Appeal a privacy decision or authorize an agent.</li>
            </LegalList>
          ),
        },
        {
          id: 'dr-response',
          title: 'Verification and response',
          body: (
            <p>
              We will verify requests as required by law and respond within the legally applicable
              period. We may deny or limit a request where law allows, including when we cannot
              verify identity, must retain records for security or legal reasons, or the request is
              excessive or conflicts with another person’s rights.
            </p>
          ),
        },
      ]}
    />
  )
}
