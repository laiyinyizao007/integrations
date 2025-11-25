# Notion Project Workspace

All Notion-related repositories now live in this `notion/` workspace so they can share documentation, automation, and archival standards. Use this file as the entry point when you need to decide which project to work on.

## Directory Map

```
notion/
├── active/                # Projects that are still maintained
│   ├── api-research/      # Sandbox for the core Notion API client and demos
│   └── second-brain/      # Production-ready Second Brain automation suite
└── archive/
    └── second-brain-ar/   # Older AR-focused prototype kept for reference
```

### Active projects
- **active/api-research** — Exploration playground for the official Notion API, reusable client utilities (`src/client`, `src/utils`), and runnable examples under `examples/`. Good starting point when you need raw API workflows or SDK helpers.
- **active/second-brain** — Full-featured Notion Second Brain automation with CLI scripts, cron helpers, AI workflows, and extensive docs (`README.md`, `QUICKSTART.md`). This is the system to run day-to-day.

### Archived projects
- **archive/second-brain-ar** — A lightweight AR/visualization prototype that currently lacks package metadata and reliable scripts. Kept here for design ideas; pull artifacts out on demand rather than trying to run it as-is.

## Working Guidelines
1. Pick the appropriate folder (`active/` vs `archive/`) before adding a new Notion experiment.
2. For any new active project, include a `docs/STRUCTURE.md` file plus a short status block in this README.
3. When a project becomes stale, move it under `archive/` and drop a quick note (why it was archived, last known working state).

> Tip: Each project now includes a `docs/PROJECT_STATUS.md` file that summarizes its responsibilities, entry points, and immediate follow-up tasks.
