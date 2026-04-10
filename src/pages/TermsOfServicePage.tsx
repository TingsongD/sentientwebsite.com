import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'

export default function TermsOfServicePage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Legal · Terms
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Terms of service
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[14px]">
          Last updated: April 10, 2026. This is a general template for SentientWeb’s marketing site.
          Replace with counsel-reviewed terms for your product agreements.
        </p>

        <div className="mt-12 space-y-10 font-mono text-[15px] normal-case leading-[1.7] text-cream/85 sm:text-[16px]">
          <section aria-labelledby="tos-accept">
            <h2
              id="tos-accept"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Agreement
            </h2>
            <p>
              By accessing or using SentientWeb’s website and services, you agree to these Terms of
              Service. If you do not agree, do not use our site or services. A separate agreement may
              govern paid or enterprise use of the product.
            </p>
          </section>

          <section aria-labelledby="tos-service">
            <h2
              id="tos-service"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Services
            </h2>
            <p>
              We provide software and related services as described on our site and in applicable
              order forms or contracts. We may modify, suspend, or discontinue features with
              reasonable notice where practicable.
            </p>
          </section>

          <section aria-labelledby="tos-accounts">
            <h2
              id="tos-accounts"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Accounts and eligibility
            </h2>
            <p>
              You must provide accurate information and keep credentials secure. You are responsible
              for activity under your account. You must be legally able to enter into these terms in
              your jurisdiction.
            </p>
          </section>

          <section aria-labelledby="tos-acceptable">
            <h2
              id="tos-acceptable"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="mt-4 list-inside list-disc space-y-2 marker:text-neon">
              <li>Violate law or others’ rights;</li>
              <li>Attempt to gain unauthorized access to our systems or other users’ data;</li>
              <li>Overload, disrupt, or reverse engineer the service except where permitted by law;</li>
              <li>Use the service to send spam, malware, or deceptive content.</li>
            </ul>
          </section>

          <section aria-labelledby="tos-ip">
            <h2
              id="tos-ip"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Intellectual property
            </h2>
            <p>
              SentientWeb and its licensors own the site, branding, and software. Subject to these
              terms and any separate agreement, we grant you a limited, non-exclusive license to use
              the services as intended. You retain rights to your own content and data.
            </p>
          </section>

          <section aria-labelledby="tos-disclaimer">
            <h2
              id="tos-disclaimer"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Disclaimers
            </h2>
            <p>
              The site and services are provided <strong className="font-medium text-cream">“as is”</strong>{' '}
              and <strong className="font-medium text-cream">“as available.”</strong> To the fullest extent
              permitted by law, we disclaim warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </section>

          <section aria-labelledby="tos-liability">
            <h2
              id="tos-liability"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, SentientWeb and its suppliers will not be liable
              for indirect, incidental, special, consequential, or punitive damages, or loss of
              profits, data, or goodwill. Our aggregate liability for claims relating to the services
              is limited to the greater of amounts you paid us in the twelve months before the claim
              or one hundred U.S. dollars, unless a separate contract states otherwise.
            </p>
          </section>

          <section aria-labelledby="tos-indemnity">
            <h2
              id="tos-indemnity"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Indemnity
            </h2>
            <p>
              You will defend and indemnify SentientWeb against claims arising from your misuse of
              the services, your content, or your violation of these terms, to the extent permitted by
              law.
            </p>
          </section>

          <section aria-labelledby="tos-termination">
            <h2
              id="tos-termination"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Termination
            </h2>
            <p>
              We may suspend or terminate access for breach or risk to the service. You may stop
              using the site at any time. Provisions that by nature should survive will survive
              termination.
            </p>
          </section>

          <section aria-labelledby="tos-law">
            <h2
              id="tos-law"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of the jurisdiction SentientWeb designates in your
              order form or, if none, the State of Delaware, USA, excluding conflict-of-law rules.
              Courts in that jurisdiction have exclusive venue, unless applicable law requires
              otherwise.
            </p>
          </section>

          <section aria-labelledby="tos-changes">
            <h2
              id="tos-changes"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Changes
            </h2>
            <p>
              We may update these terms by posting a new version on this page. Continued use after the
              effective date constitutes acceptance of the revised terms.
            </p>
          </section>

          <section aria-labelledby="tos-contact">
            <h2
              id="tos-contact"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Contact
            </h2>
            <p>
              Questions:{' '}
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
            to="/privacy"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Privacy policy
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
