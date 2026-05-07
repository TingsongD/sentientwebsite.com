# SentientWeb Use Case Storyboard Design

## Objective

Replace the dense walkthrough diagram in each of the four use case sections with a visual storyboard treatment. The goal is to explain each workflow through image-led moments instead of more feature cards.

## Approved Direction

Use a reusable four-panel storyboard for every use case:

1. Signal or trigger appears.
2. SentientWeb responds with a tailored preview, save path, recovery path, or insight.
3. Qualification or context is captured.
4. A recovered outcome is handed off with CRM-visible context.

The existing capability cards can remain below the storyboard as supporting detail. The storyboard should do the first-pass explanation; the cards should act as proof.

## Visual System

- Keep the existing SentientWeb dark background, neon green accent, salmon warning accent, and Anton-style uppercase display type.
- Use browser/device-style mock panels so the workflow feels like a product story, not a generic diagram.
- Avoid stock images and emoji icons.
- Use four cinematic panels per use case with:
  - small browser chrome
  - simulated app/page content
  - numbered caption
  - concise title and one-sentence explanation
- Use subtle hover lift on panels only; no heavy scroll animation across all four sections.

## Production Choice

The patch implements the production-safe version, not the heavy pinned-scroll prototype. Four pinned sections on the same homepage would be too much motion and page weight. The shipped design uses static storyboards with rich visual panels, which works on desktop and mobile.

## Use Cases Covered

- Demo Recovery
- Failed Payment Recovery
- No-Show Recovery
- Buyer Insights

## Implementation Scope

Patch file:

```text
sentient-usecase-storyboard.patch
```

Target repo:

```text
/Users/tingsongdai/Claude Cowork/FrontendV5.1
```

Expected changed files:

```text
src/pages/HomePage.tsx
src/index.css
```

## QA Checklist

- All four use cases render a four-panel storyboard.
- Existing headings, anchors, and route behavior remain intact.
- Storyboard panels do not replace the downstream feature/proof cards unless intentionally edited later.
- Desktop layout shows four panels in a row where space allows.
- Tablet layout wraps cleanly to two columns.
- Mobile layout stacks panels with readable captions.
- Text remains specific to each workflow; no generic filler copy.
- Reduced-motion behavior remains acceptable because the storyboard uses light hover transitions only.
