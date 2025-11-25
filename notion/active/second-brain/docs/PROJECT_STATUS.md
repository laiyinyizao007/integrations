# Project Status · Notion Second Brain

## Purpose & Scope
Production-grade Notion Second Brain automation that powers daily capture, PARA organization, AI summaries, and scheduled maintenance (backups, archives, stats). Treat this as the canonical workspace integration.

## Current Layout
- `src/api/` — thin wrappers around Notion + Gemini. `src/automation/` hosts cron-ready jobs, while `src/ai/` focuses on prompt orchestration and output shaping.
- `scripts/` — user-facing entry points mapped to npm scripts (`npm run daily-note`, `npm run ai:workflow`, etc.). Each script prints CLI prompts/progress spinners.
- `config/` — YAML/JSON defaults plus template IDs. Keep this folder source-controlled and load secrets from `.env`.
- `docs/` — product doc set (`PRD.md`, workflow analysis, setup guide) + this status page.
- `prompts/` — reusable system prompts for AI-powered routines.

## Runbook
```bash
cp .env.example .env            # fill NOTION_API_TOKEN, GEMINI_API_KEY, timezone, etc.
npm install
npm run setup                   # bootstrap PARA databases and dashboards
npm run daily-note              # create the next journal entry with templates
npm run ai:daily-summary        # run the AI mentor summary workflow
npm run automation              # execute all scheduled jobs once (use node-cron in prod)
```

## Observations & Follow-ups
1. Tests only cover a subset of APIs; add fixtures for `src/automation/*` so regressions inside cron jobs are caught.
2. Document the expected Notion database schema (properties + types) — add it either here or under `docs/setup-guide.md`.
3. `scripts/auto-archive.js`/`scripts/backup.js` assume local filesystem write access; confirm cross-platform paths and add configuration knobs inside `config/`.
