# SentientWeb Cinematic Funnel Export

This folder contains the approved design handoff for replacing the current text/card-heavy homepage funnel section with the cinematic scroll funnel prototype.

## Files

- `sentient-funnel-cinematic-scroll-preview.html`  
  Standalone visual reference. This is the source of truth for the approved design.

- `CODEX_IMPLEMENTATION_PROMPT.md`  
  Paste this into OpenAI Codex while opened in the SentientWeb frontend repo.

- `IMPLEMENTATION_CHECKLIST.md`  
  Verification checklist for the implementation.

## Target Repo

```bash
/Users/tingsongdai/Claude Cowork/FrontendV5.1
```

## Target Files

Codex should primarily edit:

```text
src/pages/HomePage.tsx
src/index.css
```

It may also add a small component under `src/components/` if it wants to keep `HomePage.tsx` cleaner, but the behavior should remain local to the homepage funnel section.

## What To Build

Replace the existing section headed:

```text
One scroll from top-of-funnel intent to a booked demo.
```

with the cinematic scroll design in the preview.

The final production section should preserve:

- Existing SentientWeb hero typography and visual language.
- Static centered translucent funnel object.
- 54 falling particles.
- Top particles cycling through 12 colors.
- Middle/bottom particles converging to Sentient green.
- Scroll-driven scan line/glow moving through the funnel.
- Stable, readable labels that do not rotate.
- Existing funnel data from `FUNNEL_FEATURE_GROUPS`; do not hard-code duplicate business copy unless unavoidable.
- Accessibility and reduced-motion fallback.

## Suggested Implementation Flow

1. Open the frontend repo.
2. Read the current homepage funnel section in `src/pages/HomePage.tsx`.
3. Read the current funnel CSS in `src/index.css`.
4. Open `sentient-funnel-cinematic-scroll-preview.html` from this export folder.
5. Port the HTML structure into React/TSX.
6. Port CSS into `src/index.css`, adapted to the existing Tailwind/global CSS conventions.
7. Use `FUNNEL_FEATURE_GROUPS` to generate the stage/step content.
8. Add scroll progress handling with `requestAnimationFrame`.
9. Run lint/build.

## Commands

From the frontend repo:

```bash
npm run lint
npm run build
```

If tests are practical in your environment:

```bash
npm test
```

