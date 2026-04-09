import { Link } from 'react-router-dom'
import { MarketingPageLayout } from '../components/MarketingPageLayout'
import { BOOK_DEMO_URL } from '../constants'

export default function TrustSecurityPage() {
  return (
    <MarketingPageLayout>
      <article className="mx-auto max-w-[800px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="font-mono mb-3 text-[11px] uppercase tracking-widest text-neon sm:text-[12px]">
          Company · Trust &amp; security
        </p>
        <h1 className="font-grotesk text-[34px] uppercase leading-[1.08] text-cream sm:text-[44px] md:text-[52px]">
          Trust &amp; security
        </h1>
        <p className="font-mono mt-6 border-l-2 border-neon/50 pl-4 text-[13px] uppercase leading-relaxed text-cream/65 sm:text-[14px]">
          SentientWeb is designed for teams that handle sensitive business conversations and
          customer data. We treat security and compliance as product requirements, not an
          afterthought.
        </p>

        <div className="mt-12 space-y-10 font-mono text-[15px] normal-case leading-[1.7] text-cream/85 sm:text-[16px]">
          <section aria-labelledby="soc2-heading">
            <h2
              id="soc2-heading"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              SOC 2 Type II (in progress)
            </h2>
            <p>
              We are pursuing{' '}
              <strong className="font-medium text-cream">SOC 2 Type II</strong> attestation and are
              currently <strong className="font-medium text-cream">SOC 2 pending</strong>—meaning we
              are implementing the control framework, evidence collection, and operational practices
              expected for a successful examination. Our roadmap includes independent audit by a
              qualified firm; we will publish our report and trust materials for customers under NDA
              and, where appropriate, on this page as they become available.
            </p>
            <p className="mt-4">
              Until our report is issued, we operate on the principle that{' '}
              <strong className="font-medium text-cream">security is never “done”</strong>: access is
              least-privilege, changes are reviewed, and we design for confidentiality, integrity, and
              availability of the services we provide.
            </p>
          </section>

          <section aria-labelledby="data-heading">
            <h2
              id="data-heading"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Data handling &amp; infrastructure
            </h2>
            <p>
              Customer content processed through SentientWeb—including conversation transcripts,
              configuration, and knowledge sources you connect—is handled with contracts and
              technical controls appropriate to a B2B SaaS provider. We use modern encryption for data
              in transit, protect data at rest with industry-standard mechanisms, and limit internal
              access to what is required for support and operations.
            </p>
            <p className="mt-4">
              We rely on reputable cloud and AI infrastructure providers (for example, for hosting,
              databases, and model inference). We evaluate subprocessors for security posture and
              contractual commitments; a formal subprocessor list is maintained for customers and
              updated as our stack evolves.
            </p>
          </section>

          <section aria-labelledby="access-heading">
            <h2
              id="access-heading"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Access, logging &amp; incident response
            </h2>
            <p>
              Administrative access to production systems is restricted, authenticated, and logged.
              We maintain procedures for security incident identification, containment, and customer
              notification where required by law or contract. We welcome responsible disclosure of
              vulnerabilities and will work with researchers in good faith.
            </p>
          </section>

          <section aria-labelledby="your-heading">
            <h2
              id="your-heading"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Your responsibilities
            </h2>
            <p>
              Security is shared. You are responsible for safeguarding your accounts, API keys, and
              integration credentials; for configuring routing and retention in line with your
              policies; and for ensuring that content you connect to the product complies with
              applicable regulations (including privacy and industry-specific rules). We provide
              tools and documentation to help you deploy safely; your legal and compliance teams
              should review fit for your jurisdiction and use case.
            </p>
          </section>

          <section aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              className="font-grotesk mb-4 text-[20px] uppercase tracking-wide text-cream sm:text-[22px]"
            >
              Questions &amp; questionnaires
            </h2>
            <p>
              For security reviews, vendor questionnaires, or details on our SOC 2 timeline, contact
              us at{' '}
              <a
                href="mailto:hello@sentientwebsite.com"
                className="text-neon underline underline-offset-2 transition hover:brightness-125"
              >
                hello@sentientwebsite.com
              </a>
              . We are happy to engage with procurement and InfoSec teams as we move through audit
              readiness.
            </p>
          </section>

          <p className="border-t border-white/10 pt-8 text-[13px] leading-relaxed text-cream/50">
            This page describes our security posture and intentions at a high level and is not a legal
            contract or guarantee of specific certification dates. Commitments in your order form or
            MSA take precedence.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-background transition hover:brightness-110 sm:text-[13px]"
          >
            Book a demo
          </a>
          <Link
            to="/"
            className="liquid-glass rounded-full px-6 py-3 font-grotesk text-[12px] uppercase tracking-wide text-cream transition hover:bg-white/10 sm:text-[13px]"
          >
            Back to home
          </Link>
        </div>
      </article>
    </MarketingPageLayout>
  )
}
