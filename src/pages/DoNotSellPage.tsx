import { LegalLink, LegalPage } from '../components/LegalPage'

export default function DoNotSellPage() {
  return (
    <LegalPage
      eyebrow="Legal · Privacy Choices"
      title="Do not sell or share"
      intro="This page supports opt-out rights under California and similar U.S. state privacy laws."
      sections={[
        {
          id: 'dnss-position',
          title: 'Our position',
          body: (
            <p>
              We do not sell personal information for money. If our use of advertising, analytics,
              partner pixels, or similar technology is considered a “sale,” “sharing,” targeted
              advertising, or profiling under applicable law, you can opt out.
            </p>
          ),
        },
        {
          id: 'dnss-submit',
          title: 'Submit an opt-out',
          body: (
            <p>
              Email{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com?subject=Do%20Not%20Sell%20or%20Share%20Request">
                songday@sentientwebsite.com
              </LegalLink>{' '}
              with “Do Not Sell or Share Request” in the subject. You may also use the Privacy
              choices button in the footer to decline optional browser storage in this browser.
            </p>
          ),
        },
        {
          id: 'dnss-gpc',
          title: 'Global Privacy Control',
          body: (
            <p>
              Where required, we treat Global Privacy Control signals as an opt-out for the browser
              sending the signal. Because browser signals are device-specific, you may need to set
              them on each browser or device you use.
            </p>
          ),
        },
      ]}
    />
  )
}
