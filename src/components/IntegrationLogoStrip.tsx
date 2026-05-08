const INTEGRATION_LOGOS = [
  { name: 'HubSpot', logoUrl: '/logos/hubspot.svg', logoClassName: 'is-wide' },
  { name: 'Salesforce', logoUrl: '/logos/salesforce.svg', logoClassName: 'is-wide' },
  { name: 'Pipedrive', logoUrl: '/logos/pipedrive.svg', logoClassName: 'is-wide' },
  { name: 'API and Webhooks', logoUrl: '/logos/api-webhooks.svg', logoClassName: 'is-wide' },
  { name: 'Calendly', logoUrl: '/logos/calendly.svg', logoClassName: 'is-wide' },
  { name: 'WordPress', logoUrl: '/logos/wordpress.svg', logoClassName: 'is-tall' },
  { name: 'Webflow', logoUrl: '/logos/webflow.svg', logoClassName: 'is-wide' },
  { name: 'Shopify', logoUrl: '/logos/shopify.svg', logoClassName: 'is-wide' },
  { name: 'Wix', logoUrl: '/logos/wix.svg', logoClassName: 'is-wide' },
  { name: 'OpenAI', logoUrl: '/logos/openai.svg', logoClassName: 'is-wide' },
  { name: 'Claude', logoUrl: '/logos/claude.svg', logoClassName: 'is-wide' },
  { name: 'Gemini', logoUrl: '/logos/gemini.svg', logoClassName: 'is-wide' },
  { name: 'Warmly', logoUrl: '/logos/warmly.svg', logoClassName: 'is-wide' },
  { name: 'Podium', logoUrl: '/logos/podium.svg', logoClassName: 'is-wide' },
  { name: 'HighLevel', logoUrl: '/logos/highlevel.png', logoClassName: 'is-wide' },
  { name: 'Drift', logoUrl: '/logos/drift.svg', logoClassName: 'is-wide' },
  { name: 'Chili Piper', logoUrl: '/logos/chili-piper.svg', logoClassName: 'is-wide' },
  { name: 'Custom stack', logoUrl: '/logos/custom.svg', logoClassName: 'is-wide' },
] as const

function IntegrationLogoItem({
  name,
  logoUrl,
  logoClassName,
  hidden = false,
}: {
  name: string
  logoUrl: string
  logoClassName: string
  hidden?: boolean
}) {
  return (
    <li
      className="grid h-[66px] min-w-[126px] place-items-center px-2 py-3 sm:h-[68px] sm:min-w-[154px] sm:px-[18px]"
      aria-hidden={hidden || undefined}
    >
      <img
        src={logoUrl}
        alt={hidden ? '' : `${name} logo`}
        className={`integration-logo-image ${logoClassName}`}
        loading="eager"
        decoding="async"
      />
    </li>
  )
}

export function IntegrationLogoStrip() {
  return (
    <section
      className="integration-logo-strip overflow-hidden py-8 sm:py-10"
      aria-labelledby="integrations-strip-heading"
    >
      <div className="mx-auto max-w-[1831px] px-4 sm:px-6 md:px-8 lg:px-10">
        <h2
          id="integrations-strip-heading"
          className="font-mono mb-5 text-[11px] uppercase tracking-widest text-[#0B6A31] sm:text-[12px]"
        >
          SentientWeb uses your existing stack as the execution layer for revenue recovery
        </h2>
      </div>
      <div className="integration-logo-marquee">
        <ul className="integration-logo-track" aria-label="Existing tech stack logos">
          {INTEGRATION_LOGOS.map((logo) => (
            <IntegrationLogoItem key={logo.name} {...logo} />
          ))}
        </ul>
        <ul className="integration-logo-track" aria-hidden>
          {INTEGRATION_LOGOS.map((logo) => (
            <IntegrationLogoItem key={`duplicate-${logo.name}`} {...logo} hidden />
          ))}
        </ul>
      </div>
    </section>
  )
}
