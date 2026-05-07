# Codex Implementation Prompt

Apply the use case storyboard redesign in this export package to the SentientWeb frontend.

## Context

Target repo:

```text
/Users/tingsongdai/Claude Cowork/FrontendV5.1
```

The homepage currently has four use case sections with dense text, a walkthrough diagram, and supporting feature cards. The approved design replaces the old walkthrough diagram with a visual four-panel storyboard for every use case.

## Files in this export

```text
sentient-usecase-storyboard.patch
usecase-storyboard-preview.html
DESIGN_DOC.md
README.md
```

## Tasks

1. Apply the patch:

```bash
git apply sentient-usecase-storyboard.patch
```

If applying from outside this export folder, use the absolute path to the patch.

2. Verify the changed files, expected:

```text
src/pages/HomePage.tsx
src/index.css
```

3. Run:

```bash
npm run lint
npm run build
```

4. Review the homepage visually:

- Confirm all four use cases render storyboards.
- Confirm mobile layout stacks cleanly.
- Confirm the existing capability/proof cards remain available below the storyboard.
- Confirm no route, CTA, or anchor behavior regressed.

## Design Requirements

- Keep SentientWeb’s existing dark/neon visual system.
- Use browser-style image panels to explain the workflow.
- Do not add stock imagery or generic illustrations.
- Do not replace the entire page; keep the change scoped to the use case walkthrough treatment.
- Preserve existing copy where possible and use workflow-specific storyboard copy from the patch.
