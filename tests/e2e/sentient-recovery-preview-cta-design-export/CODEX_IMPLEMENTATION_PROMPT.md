# Codex Implementation Prompt

Implement the approved Recovery Preview CTA design from:

`recovery-preview-cta-design.html`

Target repo:

`/Users/tingsongdai/Claude Cowork/FrontendV5.1`

## Task

Replace the current Recovery Preview CTA section with the merged full-width diagnostic cockpit design.

Preserve:

- The existing URL input behavior.
- The existing route/booking destination behavior.
- Accessibility labels and helper text.
- Responsive behavior.

Required visual details:

- Light editorial outer section.
- One full-width dark diagnostic cockpit.
- Script label text: `Scan your URL`.
- `Detected` styled with the red warning accent.
- Integrated sample output inside the same cockpit, not as a separate card.
- Primary button text: `Scan my page`.
- Supported-page chips below the input row.

Use scoped CSS classes in `src/index.css` or the existing global style file. Avoid broad selectors that could affect unrelated sections.

After implementation, run:

```bash
npm run lint
npm run build
```

Then inspect the homepage at desktop and mobile widths.

