# Project Status · n8n Workflows Backup

## Purpose & Scope
Snapshot repository for workflow metadata exported from hosted n8n instances (currently `starlightavery8-n8n-free.hf.space`). Stores JSON metadata plus helper scripts to perform full backups and push updates to Git.

## Current Layout
- `workflows-list.json` — global index of workflows.
- `*_metadata.json` files — sampled metadata bodies for individual flows.
- `backup-workflows.js` — Node script that hits the n8n REST API and writes full backups locally.
- `push-to-github.sh` — automation helper for committing + syncing new backups.
- `docs/` — this status file plus any future guides.

## Runbook
```bash
cp .env.example .env         # if/when added; currently configure URL/token inline
node backup-workflows.js     # exports workflows to ./backups (see script output)
./push-to-github.sh          # optional helper to commit/push
```

## Outstanding Follow-ups
1. Store API credentials in `.env` (script currently expects inline edits).
2. Expand backups beyond metadata by saving the full workflow JSON for every ID.
3. Add retention/rotation strategy (timestamped directories) so historical snapshots remain accessible.
