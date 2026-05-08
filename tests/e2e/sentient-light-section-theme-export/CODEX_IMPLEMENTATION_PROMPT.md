# Codex Implementation Prompt

Implement the SentientWeb light editorial section theme from this export.

Scope:

- Add reusable light-section theme tokens/classes from `light-section-theme.css`, or translate them into Tailwind utilities if that fits the existing codebase better.
- Apply the light editorial theme only to explanation/proof sections:
  - hero/opening clarity section if requested
  - use-case storyboard sections
  - integration logo strip
  - proof/case-study sections
- Keep dark backgrounds for:
  - blackhole/profit leak sections
  - cinematic funnel sections
  - orchestration/system sections
  - final CTA/footer

Theme values:

```css
--sentient-paper: #f7faf4;
--sentient-paper-warm: #fffdf8;
--sentient-paper-ink: #10213c;
--sentient-paper-muted: rgba(16, 33, 60, 0.68);
--sentient-paper-line: rgba(16, 33, 60, 0.14);
--sentient-paper-green: #0b6a31;
```

Rules:

- The light theme should look editorial/magazine-like, not SaaS-card-heavy.
- Keep colorful logos unboxed on light backgrounds.
- Avoid neon body copy on light backgrounds.
- Use `#0b6a31` for mono labels and restrained accents.
- Preserve accessibility contrast.
- Do not change copy or routes unless needed for class names.

Validation:

- Run the repo lint/build commands.
- Check desktop and mobile.
- Confirm section rhythm alternates intentionally: light explanation/proof, dark engine/action.
