# Codex Implementation Prompt

Implement the approved SentientWeb blackhole leak card design in the frontend repo.

Repo:

`/Users/tingsongdai/Claude Cowork/FrontendV5.1`

Design export:

`/Users/tingsongdai/OPEN_DESIGN/open-design/.od/projects/77e472b0-935e-4ade-bbb7-440f0f72edaf/sentient-blackhole-leak-card-design-export`

Follow `DESIGN_DOC.md` as the source of truth. Use `blackhole-leak-card-preview.html` as the visual reference.

Preferred implementation:

1. Apply `sentient-blackhole-leak-card.patch` from the repo root.
2. Review the changed files:
   - `src/pages/HomePage.tsx`
   - `src/index.css`
3. Confirm the B2B SaaS card still links to `/solutions/saas`.
4. Confirm decorative layers use `aria-hidden="true"`.
5. Confirm the CSS-generated accretion bars and center pseudo-object are removed.
6. Confirm the looping MP4 background video is installed and there are 18 dollar particles.
7. Run:

```bash
npm run lint
npm run build
```

Do not rewrite the homepage section or change the copy. This is a targeted visual upgrade for the existing blackhole leak card only.
