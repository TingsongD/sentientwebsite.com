import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Legal · Privacy
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Privacy policy
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[14px]">
          Last updated: April 10, 2026. This is a general template for SentientWeb’s marketing site.
          Replace with counsel-reviewed language before relying on it commercially.
        </p>

        <div className="mt-12 space-y-10 font-mono text-[15px] normal-case leading-[1.7] text-cream/85 sm:text-[16px]">
          <section aria-labelledby="pp-intro">
            <h2
              id="pp-intro"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Introduction
            </h2>
            <p>
              SentientWeb (“we,” “us,” or “our”) respects your privacy. This policy describes how we
              collect, use, store, and share information when you visit our website, use our
              services, or communicate with us.
            </p>
          </section>

          <section aria-labelledby="pp-collect">
            <h2
              id="pp-collect"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Information we collect
            </h2>
            <p>We may collect:</p>
            <ul className="mt-4 list-inside list-disc space-y-2 marker:text-neon">
              <li>
                <strong className="font-medium text-cream">Contact and account data</strong> — such
                as name, email, company, and messages you send when you request a demo or contact us.
              </li>
              <li>
                <strong className="font-medium text-cream">Usage and technical data</strong> — such
                as IP address, device type, browser, pages viewed, and approximate location derived
                from IP.
              </li>
              <li>
                <strong className="font-medium text-cream">Cookies and similar technologies</strong>{' '}
                — as described in your browser settings and any cookie banner we provide.
              </li>
            </ul>
          </section>

          <section aria-labelledby="pp-use">
            <h2
              id="pp-use"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              How we use information
            </h2>
            <p>We use information to:</p>
            <ul className="mt-4 list-inside list-disc space-y-2 marker:text-neon">
              <li>Provide, operate, and improve our website and services;</li>
              <li>Respond to inquiries and schedule demos;</li>
              <li>Analyze usage and performance in aggregate;</li>
              <li>Comply with law and protect our rights and users’ safety.</li>
            </ul>
          </section>

          <section aria-labelledby="pp-share">
            <h2
              id="pp-share"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Sharing
            </h2>
            <p>
              We may share information with service providers who assist us (e.g., hosting,
              analytics, email) under contractual obligations. We may disclose information if
              required by law or to protect SentientWeb and others. We do not sell your personal
              information as a standalone product.
            </p>
          </section>

          <section aria-labelledby="pp-retention">
            <h2
              id="pp-retention"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Retention
            </h2>
            <p>
              We retain information only as long as needed for the purposes above, unless a longer
              period is required or permitted by law.
            </p>
          </section>

          <section aria-labelledby="pp-rights">
            <h2
              id="pp-rights"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Your choices and rights
            </h2>
            <p>
              Depending on where you live, you may have rights to access, correct, delete, or
              restrict processing of your personal data, or to object to certain processing. Contact
              us to make a request. You may also unsubscribe from marketing emails via the link in
              those messages.
            </p>
          </section>

          <section aria-labelledby="pp-security">
            <h2
              id="pp-security"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to protect information. No
              method of transmission or storage is completely secure.
            </p>
          </section>

          <section aria-labelledby="pp-international">
            <h2
              id="pp-international"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              International transfers
            </h2>
            <p>
              If you access our site from outside the country where we operate, your information may
              be processed in other countries with different data protection laws.
            </p>
          </section>

          <section aria-labelledby="pp-children">
            <h2
              id="pp-children"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Children
            </h2>
            <p>
              Our services are not directed to children under 16. We do not knowingly collect their
              personal information.
            </p>
          </section>

          <section aria-labelledby="pp-changes">
            <h2
              id="pp-changes"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Changes
            </h2>
            <p>
              We may update this policy from time to time. We will post the revised version on this
              page and update the “Last updated” date.
            </p>
          </section>

          <section aria-labelledby="pp-contact">
            <h2
              id="pp-contact"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Contact
            </h2>
            <p>
              Questions about this policy:{' '}
              <a
                href="mailto:hello@sentientwebsite.com"
                className="text-neon underline-offset-4 transition hover:underline"
              >
                hello@sentientwebsite.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/terms"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Terms of service
          </Link>
          <Link
            to="/"
            className="font-mono text-[12px] uppercase tracking-wide text-cream/50 underline-offset-4 transition hover:text-neon hover:underline sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
