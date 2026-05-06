# SentientWeb Blackhole Leak Card Design Doc

## Objective

Redesign the B2B SaaS profit leak card so it reads as a black hole at the center of the card, visually "sucking in" profit. The card should feel urgent and cinematic, but the core sales information must remain readable:

- Segment: `B2B SaaS`
- Live modeled leak counter
- Context line: `US B2B SaaS profit leaked since you arrived`
- Rate line: `Modeled US leak rate: $4M/hour`

This is a visual enhancement to the existing card, not a content rewrite.

## Approved Direction

Use the latest approved preview:

`blackhole-leak-card-preview.html`

The design combines three layers:

1. **Looping blackhole video**
   - Use the provided MP4 as the background visual source:
     `https://cdn.shopify.com/videos/c/o/v/521a58b4518548b7ba7e3c5ac8c76075.mp4`
   - It replaces the CSS-generated event horizon, center object, rotating bars, and conic disk.
   - The video must autoplay, loop, stay muted, and use `playsInline`.
   - Fit the video to the card with `object-fit: cover`.

2. **Profit particles**
   - Add `.blackhole-profit-suck` with `18` dollar-sign particles.
   - Particles begin near the card edges and collapse toward the event horizon.
   - Animation duration: `0.48s`.
   - Use staggered negative delays so the motion feels continuous.

3. **Readable content layer**
   - Existing card content stays above the blackhole layers.
   - Decorative video and particle spans must be excluded from the existing z-index/content selector.
   - The leak counter remains salmon and continues using `leak-rate-flash`.

## Visual Tokens

Keep the existing SentientWeb palette and type system:

- Background: near-black navy / black
- Text: `cream`
- Profit leak accent: `#FF8A8A`
- Sentient accent: `#6FFF00`
- Supporting glow: cyan at low opacity
- Display font: existing `font-grotesk` / Anton-style uppercase
- Metadata font: existing mono uppercase

Do not introduce a new palette or a new typeface.

## Implementation Target

Apply the included patch from the frontend repo root:

```bash
cd "/Users/tingsongdai/Claude Cowork/FrontendV5.1"
git apply "/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-blackhole-leak-card-design-export/sentient-blackhole-leak-card.patch"
```

Expected touched files:

- `src/pages/HomePage.tsx`
- `src/index.css`

## DOM Requirements

Inside the `a.blackhole-leak-card`, add two decorative spans before the visible content:

```tsx
<span className="blackhole-video-bg" aria-hidden="true">
  <video
    src="https://cdn.shopify.com/videos/c/o/v/521a58b4518548b7ba7e3c5ac8c76075.mp4"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
  />
</span>
<span className="blackhole-profit-suck" aria-hidden="true">
  {Array.from({ length: 18 }).map((_, index) => (
    <span key={index}>$</span>
  ))}
</span>
```

These spans are purely decorative and must use `aria-hidden="true"`.

## CSS Requirements

Key implementation details:

- `.blackhole-leak-card` must be `position: relative`, `isolation: isolate`, and `overflow: hidden`.
- The visual blackhole source is `.blackhole-video-bg video`.
- Do not keep `.blackhole-accretion-bars`, `.blackhole-leak-card::before`, `.blackhole-leak-card::after`, `blackhole-accretion-spin`, or `blackhole-bar-spin`.
- Use a subtle `.blackhole-video-bg::after` vignette only to preserve text contrast.
- The 18 profit particles use `.blackhole-profit-suck span:nth-child(...)`.
- Content must sit above decorative layers with:

```css
.blackhole-leak-card > span:not(.blackhole-video-bg):not(.blackhole-profit-suck) {
  position: relative;
  z-index: 2;
}
```

## Motion Spec

Blackhole video:

- `<video autoplay muted loop playsInline preload="auto">`
- `object-fit: cover`
- `opacity: 0.82`
- `filter: saturate(1.08) contrast(1.08)`

Profit particles:

- Animation: `blackhole-profit-suck 0.48s cubic-bezier(0.74, 0, 0.18, 1) infinite`
- Motion path: edge position to `50% / 54%`
- End state: small, blurred, transparent

Accessibility:

- Keep decorative layers hidden from assistive tech.
- Respect existing reduced-motion behavior if the project has a global reduced-motion rule. If not, add one for these animations before production.

## QA Checklist

Before shipping:

- The card still links to `/solutions/saas`.
- The live counter still updates.
- Text remains readable over the blackhole effect at desktop and mobile card sizes.
- The blackhole sits visually in the middle of the card.
- The background is the looping MP4, not CSS-generated rotating bars.
- There are no `.blackhole-accretion-bars` elements.
- There are exactly `18` dollar particles.
- The implementation passes:

```bash
npm run lint
npm run build
```

## Files In This Export

- `DESIGN_DOC.md` - this design and implementation spec
- `README.md` - quick start handoff
- `CODEX_IMPLEMENTATION_PROMPT.md` - paste-ready implementation prompt
- `blackhole-leak-card-preview.html` - approved standalone visual reference
- `sentient-blackhole-leak-card.patch` - apply-ready frontend patch
