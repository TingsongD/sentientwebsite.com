# Recovery Preview CTA Design Spec

## Objective

Make the main CTA section stand out and increase the chance that a visitor enters a URL. The section should feel like a product diagnostic moment, not a generic form.

## Approved Direction

Use one full-width diagnostic cockpit inside a light editorial section:

- The outer surface is warm/light to create contrast against dark sections.
- The cockpit is dark, technical, and scanner-like.
- The URL input and `Scan my page` button are the dominant action.
- The sample output is integrated into the same cockpit, so users see the value before acting.

## Visual System

Light wrapper:

- Background: `#fffdf8` to `#f7faf4`
- Ink: `#10213c`
- Editorial green: `#0b6a31`

Diagnostic cockpit:

- Deep navy/black gradient: `#020a26` to `#01030d`
- Neon scan accent: `#6fff00`
- Warning accent: `#ff8a8a`
- Cyan secondary glow: `#55d6ff`

Typography:

- Display: Anton-style uppercase
- Script accent: Condiment-style script
- Utility labels: monospace uppercase
- Body/supporting copy: system sans

## Content Details

Hero copy:

- Kicker: `Recovery Preview`
- Headline: `Find the demo-intent leak on your own site.`
- Script accent: `Scan your URL`
- Supporting copy explains the supported page types.

Cockpit:

- Console label: `URL scanner console + sample output`
- Status: `Ready to analyze`
- Input placeholder: `https://yourcompany.com/pricing`
- Primary button: `Scan my page`

Sample output:

- `Detected` should be styled in the red warning accent.
- `demo-intent leak` remains white/cream.
- Keep the output copy short and concrete.

## Implementation Notes

In the production React section, replace the current `ai-rainbow-panel` form block with the merged cockpit markup from `recovery-preview-cta-design.html`.

Keep the existing URL input behavior and booking URL wiring. The standalone preview is visual-only, so implementation should preserve current form state logic and generated Calendly URL behavior if present.

Add the CSS as scoped classes rather than broad global element selectors. Recommended production class names:

- `recovery-preview-spotlight`
- `recovery-preview-cockpit`
- `recovery-preview-primary-row`
- `recovery-preview-url-field`
- `recovery-preview-scan-button`
- `recovery-preview-output`

## QA Checklist

- URL input is the first obvious interactive element.
- CTA button is directly attached to the input row on desktop and full-width on mobile.
- The section reads as one unified element, not separate scanner and result cards.
- `Detected` is red.
- `Scan your URL` appears in the script accent.
- Mobile stacks cleanly with no text overflow.
- Motion respects `prefers-reduced-motion`.

