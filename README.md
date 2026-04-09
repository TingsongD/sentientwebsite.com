# SentientWeb — marketing site

Public landing and marketing pages for **SentientWeb**: an autonomous website agent for B2B SaaS (lead qualification, demo booking, and on-site engagement).

**Live site:** [sentientwebsite.com](https://sentientwebsite.com)

## Stack

React 19, Vite, TypeScript, Tailwind CSS, React Router.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview   # optional: serve dist/
```

## Environment variables (widget script)

Production builds replace placeholders in `index.html` for the on-site agent script. Copy `.env.example` to `.env` and set real values before `npm run build`. Do not commit `.env`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN` | Base URL where `agent.js` is hosted |
| `NEXT_PUBLIC_SENTIENT_INSTALL_KEY` | Install key passed to the widget |

## GitHub (marketing)

In the repo **Settings**, add the website URL and short description. Under the repo title, add **Topics** (for example: `react`, `vite`, `tailwindcss`, `marketing`, `b2b-saas`) to improve discoverability.

## License

Private / all rights reserved unless otherwise noted.
