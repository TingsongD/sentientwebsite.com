# Implementation Checklist

## Must Pass

- [ ] The old `One scroll from top-of-funnel intent to a booked demo.` card section is replaced.
- [ ] The section uses the current SentientWeb hero typography, not a generic fallback style.
- [ ] The funnel is static and centered.
- [ ] The funnel is not wireframe/ribbed.
- [ ] The funnel does not spin.
- [ ] Text is never clipped by a funnel shape.
- [ ] Labels stay readable and stable.
- [ ] Scroll progress updates the scan/glow through the funnel.
- [ ] The section uses real funnel content from `FUNNEL_FEATURE_GROUPS`.
- [ ] There are 54 particles or an equivalent density in production.
- [ ] Top particles use varied colors.
- [ ] Middle/bottom particles converge to Sentient green.
- [ ] Mobile layout remains readable.
- [ ] `prefers-reduced-motion` is respected.
- [ ] No footer/product anchors break.
- [ ] No console errors on page load or scroll.

## Commands

```bash
npm run lint
npm run build
```

Optional:

```bash
npm test
```

## Design Review Notes

The approved design direction is cinematic and visual. Avoid reverting to:

- dense feature cards
- generic rounded panels
- clipped trapezoid text blocks
- spinning funnel object
- wireframe/ribbed funnel shell
- excessive paragraph copy in the main scroll moment

