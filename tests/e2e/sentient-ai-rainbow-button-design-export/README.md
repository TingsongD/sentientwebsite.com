# SentientWeb AI Rainbow Button Export

This package contains only the AI rainbow magic CTA button design.

## Files

- `ai-rainbow-button-preview.html` - standalone visual preview.
- `sentient-ai-rainbow-button.patch` - apply-ready patch for `FrontendV5.1`.
- `DESIGN_DOC.md` - design and motion spec.
- `CODEX_IMPLEMENTATION_PROMPT.md` - prompt to paste into OpenAI Codex.

## Apply

From the frontend repo:

```bash
cd "/Users/tingsongdai/Claude Cowork/FrontendV5.1"
git apply "/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-ai-rainbow-button-design-export/sentient-ai-rainbow-button.patch"
npm run lint
npm run build
```

## Target Files

- `src/components/RoiCalculatorCta.tsx`
- `src/index.css`
