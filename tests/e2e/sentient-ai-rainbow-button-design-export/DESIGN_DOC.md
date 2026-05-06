# SentientWeb AI Rainbow Magic Button

## Scope

Redesign the existing ROI calculator CTA:

`Estimate recoverable demos in the last 30 days.`

The href and copy stay unchanged. This export only changes the visual treatment for the button in `src/components/RoiCalculatorCta.tsx` and its supporting CSS in `src/index.css`.

## Design Direction

Make the CTA feel like an AI-powered, high-energy action without drifting away from SentientWeb's dark, neon, conversion-recovery brand system.

Visual ingredients:
- Animated rainbow border using a conic gradient.
- Dark inner button surface so it still belongs on the current site.
- Moving prismatic sheen across the button.
- Tiny sparkle particles behind the label.
- Anton-style uppercase label treatment matching the current hero/button typography.
- Hover shifts the text toward Sentient neon green.

## Motion

- Border rotation: `4.8s linear infinite`.
- Sheen sweep: `2.8s cubic-bezier(.72, 0, .18, 1) infinite`.
- Sparkles: staggered `1.9s ease-in-out infinite`.
- Reduced motion: all decorative animations stop under `prefers-reduced-motion: reduce`.

## Implementation Notes

The patch adds:
- `ai-rainbow-cta`
- `ai-rainbow-cta__sparkles`
- `ai-rainbow-cta__label`
- `@property --ai-rainbow-spin`
- three keyframes for border, sheen, and sparkle motion

The patch preserves:
- CTA route: `/revenue-leak-calculator`
- CTA copy
- semantic anchor behavior
- mobile wrapping behavior
- reduced-motion support

## QA Criteria

- Button text remains readable on dark background.
- Button does not exceed viewport width on mobile.
- Hover state changes text toward neon green.
- Animation stops when reduced motion is enabled.
- `npm run lint` and `npm run build` pass after applying.
