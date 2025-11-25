# Project Status · VSCode MCP Server Tabs

## Purpose & Scope
VSCode extension (TypeScript) that surfaces registered MCP servers in dedicated tabs/panels for easier inspection. Targets developers using Claude/Cline + MCP setups.

## Current Layout
- `src/` — extension source (activation, tree views, commands).
- `media/` — icons/assets.
- `out/` — compiled JS after `npm run compile`.
- `docs/` — setup guide plus this status reference.
- `tasks/` — planning/backlog.
- Packaged artifact: `vscode-mcp-server-0.3.1.vsix`.

## Runbook
```bash
npm install
npm run compile
code --install-extension vscode-mcp-server-0.3.1.vsix
# or run Extension Development Host:
npm run watch && press F5 inside VSCode
npm test (if tests defined)
```

## Outstanding Follow-ups
1. Add automated tests (currently missing) for command logic.
2. Publish the extension to the VSCode Marketplace or describe manual install flow clearly.
3. Document compatibility with various MCP server versions and OS environments.
