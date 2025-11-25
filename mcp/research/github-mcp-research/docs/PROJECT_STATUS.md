# Project Status · GitHub MCP Research

## Purpose & Scope
Node.js research lab exploring the Model Context Protocol (MCP): prototypes, reference implementations, and documentation for building MCP servers/clients (with a GitHub focus).

## Current Layout
- `src/` — core MCP experiments and utilities.
- `examples/` — runnable demonstrations.
- `tests/` — Jest suite verifying behavior.
- `logs/` — captures from previous runs (consider rotating).
- `docs/` — guides, changelog references, this status file.
- `tasks/` — planning/backlog.

## Runbook
```bash
npm install
npm test
npm run dev                # or equivalent script per package.json
node examples/<name>.js
```

## Outstanding Follow-ups
1. Document compatibility matrix (MCP spec version vs implementation features).
2. Rotate/clean `logs/` (currently stored in repo).
3. Publish research findings into `docs/` summaries or blog-style notes.
