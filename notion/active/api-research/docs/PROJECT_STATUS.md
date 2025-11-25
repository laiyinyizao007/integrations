# Project Status · Notion API Research

## Purpose & Scope
Hands-on playground for the official Notion API: build/test low-level client helpers, verify database/page workflows, and keep self-documented examples that other automation repos can copy.

## Current Layout
- `src/index.js` wires common auth/bootstrap logic. Subfolders (`blocks/`, `database/`, `pages/`, `utils/`) each isolate specific API surfaces.
- `examples/` holds executable scripts (`examples/query-database.js`, `examples/create-page.js`, etc.) that map one-to-one to npm scripts for quick testing.
- `lib/` and `config/` store reusable abstractions (rate-limit helpers, environment loaders) so they can be promoted to other Notion projects.
- `docs/` contains longer-form guides; this `PROJECT_STATUS.md` is linked from `notion/README.md`.

## Runbook
```bash
cp .env.example .env   # fill NOTION_API_TOKEN + database/page ids
npm install
npm run query-db       # invoke examples/query-database.js
npm run create-page    # invoke examples/create-page.js
npm test               # jest (unit tests live under tests/)
```

## Outstanding Follow-ups
1. `package.json` still points `main` to `src/notion-client.js` (file missing) — update to `src/index.js` or reintroduce the original module.
2. There is no linting/formatting story yet (`npm run lint` is a stub); pick ESLint + Prettier or remove the script.
3. Convert the ad-hoc scripts in `examples/` into documented guides under `docs/examples/` so the workflows stay in sync.
