# Project High-Lvl website

The cinematic, conversion-focused website for Project High-Lvl. The experience uses the “First Light” ascent concept, authentic PHL event photography, clear participant/sponsor/mentor paths, flexible Stripe giving links, a dedicated founder story, and a post-donation page.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

## Validate

```bash
npm test
npm run lint
```

`npm test` creates the production build and verifies the rendered homepage, thank-you route, and required assets.

## Content updates

- Organization metrics live in `app/data/stats.json`.
- Primary page copy and giving destinations live in `app/page.tsx`.
- Brand photography lives under `public/`.
- The paste-ready partner intake backend and deployment instructions live in `google-apps-script/`.

Metrics without verified data intentionally render as an em dash beside a description of what each report will include.
