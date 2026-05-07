import { LegalLink, LegalList, LegalPage } from '../components/LegalPage'
import { SITE_HOSTNAME } from '../constants'

export default function BillingTermsPage() {
  return (
    <LegalPage
      eyebrow="Legal · Commerce"
      title="Billing, refunds, and withdrawal"
      intro="These terms apply if SentientWeb offers a paid pilot, subscription, or checkout flow."
      sections={[
        {
          id: 'bt-current',
          title: 'Current purchase flow',
          body: (
            <p>
              SentientWeb’s website currently schedules demos and access discussions. It does
              not currently process self-serve checkout payments on {SITE_HOSTNAME}. If we offer
              paid services, the applicable order form, checkout page, invoice, or written agreement
              will state the price, taxes, renewal terms, usage limits, cancellation terms, and any
              service-specific refund terms before you buy.
            </p>
          ),
        },
        {
          id: 'bt-payment',
          title: 'Payment terms',
          body: (
            <p>
              Unless a written agreement says otherwise, fees are due as stated on the invoice or
              order form and are exclusive of taxes. You are responsible for taxes, duties, payment
              processor charges, and bank fees that apply to your purchase. If online card payments
              are offered, SentientWeb expects to use Stripe as its payment processor and not store
              full payment card numbers on SentientWeb systems. We may suspend paid services for
              overdue amounts after reasonable notice where permitted by law.
            </p>
          ),
        },
        {
          id: 'bt-refunds',
          title: 'Refunds and cancellations',
          body: (
            <>
              <p>
                Refund and cancellation rights depend on the product, customer type, location, and
                written agreement. Unless mandatory law or a written agreement provides otherwise:
              </p>
              <LegalList>
                <li>Setup, implementation, and professional service fees are non-refundable once work begins.</li>
                <li>Subscription fees are non-refundable for periods already started.</li>
                <li>You may cancel future renewals using the method stated in your order form or by emailing us.</li>
                <li>Nothing in this policy limits non-waivable consumer guarantees or statutory cancellation rights.</li>
              </LegalList>
            </>
          ),
        },
        {
          id: 'bt-eu-withdrawal',
          title: 'EU, UK, and consumer withdrawal rights',
          body: (
            <p>
              If you are a consumer in the EU, UK, or another jurisdiction with mandatory withdrawal
              rights, you may have a statutory cooling-off period for certain online purchases. If you
              request immediate digital access or services during that period, you may be asked for
              express consent and acknowledgement that statutory withdrawal rights may be lost or
              reduced once performance begins, to the extent allowed by law.
            </p>
          ),
        },
        {
          id: 'bt-contact',
          title: 'Billing contact',
          body: (
            <p>
              Billing, cancellation, and refund questions:{' '}
              <LegalLink href="mailto:songday@sentientwebsite.com?subject=Billing%20or%20Refund%20Question">
                songday@sentientwebsite.com
              </LegalLink>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
