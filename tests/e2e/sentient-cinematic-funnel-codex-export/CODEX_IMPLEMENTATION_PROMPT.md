# Codex Implementation Prompt

You are working in this React/Vite frontend repo:

```text
/Users/tingsongdai/Claude Cowork/FrontendV5.1
```

Implement the approved cinematic funnel scroll section from this exported design reference:

```text
/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-cinematic-funnel-codex-export/sentient-funnel-cinematic-scroll-preview.html
```

## Goal

Replace the current homepage funnel section headed:

```text
One scroll from top-of-funnel intent to a booked demo.
```

with a cinematic Apple-style pinned scroll section inspired by the provided preview, while keeping the SentientWeb brand system and existing product copy.

## Target Files

Start with:

```text
src/pages/HomePage.tsx
src/index.css
src/data/homeFeatures.ts
```

Prefer editing only `HomePage.tsx` and `index.css`. You may create a small `CinematicFunnelSection.tsx` component if that keeps the page clean.

## Current Code Context

The existing section is in `src/pages/HomePage.tsx` around the heading:

```tsx
One scroll from top-of-funnel intent to a booked demo.
```

It currently renders `FUNNEL_FEATURE_GROUPS.map(...)` as stacked funnel cards and uses CSS classes like:

```text
funnel-scroll-stack
funnel-scroll-stage
funnel-scroll-stage__inner
funnel-scroll-feature-grid
funnel-scroll-feature
funnel-scroll-marker
```

Replace that card-based treatment with the cinematic section. Reuse `FUNNEL_FEATURE_GROUPS` for the real top/mid/bottom funnel content.

## Required Design Behavior

Implement the preview's approved behavior:

- A full-height pinned scroll section.
- A static centered translucent funnel object.
- The funnel shape should be stacked translucent elliptical slices, not wireframe ribs.
- No spinning funnel.
- A scroll-driven scan line/glow travels from the wide top toward the narrow bottom.
- A stable label slot updates as the user scrolls through each capability.
- Left-side copy updates from the active capability.
- Right-side outcome/status panel updates from the active capability or stage.
- 54 falling particles inside the funnel:
  - 30 top-zone particles with 12-color variation.
  - 24 mid/bottom particles in Sentient green.
  - particles visually converge downward into the funnel.
- Keep the same hero font style as the existing homepage hero.
- Keep the section concise and visual. Do not reintroduce a dense card wall.

## Implementation Notes

- Use `requestAnimationFrame` for scroll updates.
- Store progress on CSS custom properties, similar to the preview:

```css
--progress
--scan-y
--top-fill
--mid-fill
--bottom-fill
```

- Do not use `scrollIntoView`.
- Add `prefers-reduced-motion` handling:
  - no particle animation or drastically reduced particle motion
  - no sticky/pinned trap if it creates awkward mobile behavior
  - content remains readable in normal document flow
- On mobile, avoid complex pinned behavior if cramped. Let the section stack naturally with the funnel above/below copy.
- Keep labels readable; they should not rotate with the object.
- Preserve existing anchor behavior where reasonable so footer/product links do not break. If replacing anchors, make sure stage IDs or equivalent anchors remain available.

## Visual Reference Details To Preserve

Use the exported preview as the source of truth for:

- dark SentientWeb background
- neon green accent
- static centered funnel
- translucent glass slices
- centered halo/sphere
- scan line/glow
- particle density and color behavior
- hero-like typography proportions

Do not bring back the rejected wireframe/ribbed funnel treatment.
Do not bring back the older Option A card grid.
Do not clip text inside funnel shapes.

## Validation

Run:

```bash
npm run lint
npm run build
```

If tests are practical:

```bash
npm test
```

Then manually check:

- desktop homepage scroll behavior
- mobile layout
- reduced motion
- no text cutoff
- no console errors
- old funnel section is fully replaced

