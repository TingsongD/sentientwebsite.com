Implement the exported SentientWeb AI rainbow magic button treatment.

Use this patch as the source of truth:

```text
/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-ai-rainbow-button-design-export/sentient-ai-rainbow-button.patch
```

Apply it from:

```text
/Users/tingsongdai/Claude Cowork/FrontendV5.1
```

Then validate:

```bash
npm run lint
npm run build
```

The change should only affect the ROI calculator CTA button. Preserve the existing href `/revenue-leak-calculator` and the button copy `Estimate recoverable demos in the last 30 days.`

Design intent:
- dark SentientWeb-compatible button surface
- animated rainbow conic border
- prismatic sheen
- small sparkle particles
- uppercase Anton/grotesk label treatment
- reduced-motion support

Do not implement unrelated page or section changes.
