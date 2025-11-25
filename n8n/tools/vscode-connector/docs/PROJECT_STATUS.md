# Project Status · n8n VSCode Connector

## Purpose & Scope
VSCode extension that connects to remote n8n instances (Hugging Face Spaces, self-hosted) to browse, execute, and back up workflows without leaving the editor. Built with TypeScript + VSCode extension APIs.

## Current Layout
- `src/` — extension source (commands for connect/list/execute/backup).
- `docs/` — feature guides and UI walkthroughs.
- `tasks/` — automation + backlog (if using Claude workflows).
- `quick-backup.js`, `backup-workflows.js`, and `test-connection.js` provide Node-based helpers for manual runs.
- `n8n-vscode-connector-1.0.0.vsix` — packaged release ready to install.

## Runbook
```bash
npm install
npm run compile             # builds into /out
code --install-extension n8n-vscode-connector-1.0.0.vsix
# or press F5 in VSCode to run the Extension Development Host

./setup-env.sh              # populate .env with base URL + token
# inside VSCode command palette:
"n8n: Connect to Instance"
"n8n: List Workflows"
"n8n: Execute Workflow"
```

## Outstanding Follow-ups
1. Tests under `test/` are sparse; add integration coverage (mock HTTP) so breakages are caught before publishing.
2. There is no CI release pipeline — document how to regenerate the `.vsix` and publish updates.
3. Evaluate whether `backup-workflows.js` duplicates functionality with `n8n/tools/workflows-backup`; if so, share logic.
