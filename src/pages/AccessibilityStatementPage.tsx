import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'

export default function AccessibilityStatementPage() {
  return (
    <LegalPage
      eyebrow="Legal · Accessibility"
      title="Accessibility statement"
      intro="SentientWeb aims to make the website usable for people with disabilities."
      sections={[
        {
          id: 'as-standard',
          title: 'Our standard',
          body: (
            <p>
              We aim to conform to WCAG 2.2 Level AA where practical for the public website,
              including keyboard navigation, readable contrast, semantic structure, responsive
              layouts, reduced-motion support, and accessible notices for the automated assistant.
            </p>
          ),
        },
        {
          id: 'as-known',
          title: 'Known limitations',
          body: (
            <p>
              Some third-party embeds, scheduling flows, or live assistant interfaces may have
              accessibility limits outside our direct control. We review vendors and will provide a
              reasonable alternative when a third-party experience blocks access.
            </p>
          ),
        },
        {
          id: 'as-feedback',
          title: 'Feedback',
          body: (
            <>
              <p>If you encounter an accessibility barrier, contact us with:</p>
              <LegalList>
                <li>The page URL or feature involved.</li>
                <li>Your browser, device, and assistive technology if relevant.</li>
                <li>The issue and the format or accommodation you need.</li>
              </LegalList>
              <p className="mt-4">
                Email:{' '}
                <LegalLink href="mailto:songday@sentientwebsite.com?subject=Accessibility%20Feedback">
                  songday@sentientwebsite.com
                </LegalLink>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  )
}
