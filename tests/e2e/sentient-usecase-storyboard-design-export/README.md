# SentientWeb Use Case Storyboard Export

This package contains the approved storyboard redesign for the four use case sections on the SentientWeb homepage.

## Files

- `DESIGN_DOC.md` - design rationale and QA checklist.
- `CODEX_IMPLEMENTATION_PROMPT.md` - paste-ready prompt for OpenAI Codex.
- `usecase-storyboard-preview.html` - standalone visual preview for review.
- `sentient-usecase-storyboard.patch` - apply-ready implementation patch.

## Apply

From the frontend repo:

```bash
cd "/Users/tingsongdai/Claude Cowork/FrontendV5.1"
git apply "/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-usecase-storyboard-design-export/sentient-usecase-storyboard.patch"
npm run lint
npm run build
```

## Preview

Open `usecase-storyboard-preview.html` to review the visual direction before applying the patch.

The patch was validated with `git apply --check` against `FrontendV5.1` at export time.
