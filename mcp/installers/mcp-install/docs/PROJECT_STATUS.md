# Project Status · MCP Install Toolkit

## Purpose & Scope
Shell-based installer toolkit for quickly setting up MCP stacks (Cline CLI, Claude, Chrome DevTools MCP, etc.) across Linux environments. Includes troubleshooting guides, comparison docs, and ready-to-run scripts.

## Current Layout
- `setup-*.sh` scripts — primary installers (`setup-mcp-linux.sh`, `setup-cline-cli-mcp.sh`, `complete-installation.sh`, `fix-and-install.sh`).
- `docs/` — deep-dive guides referenced by README + this status file.
- `tasks/` — planning/backlog for new fixes or platform support.
- Additional Markdown guides at repo root cover quick starts, configuration, and issue resolutions.

## Runbook
```bash
cp .env.example .env (if applicable)
chmod +x setup-mcp-linux.sh
./setup-mcp-linux.sh

# or combined flow
./complete-installation.sh
```

## Outstanding Follow-ups
1. Consolidate overlapping guides (many Markdown files describe similar steps).
2. Add verification script that confirms MCP servers are reachable post install.
3. Consider packaging installers (e.g., as Homebrew tap or Debian package) for easier distribution.
