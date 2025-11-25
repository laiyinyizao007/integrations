# MCP Tooling Workspace

This workspace hosts all Model Context Protocol (MCP) utilities, installers, and reference research repos. Start here when you need to work on MCP servers or clients.

## Directory Map

```
mcp/
├── research/
│   └── github-mcp-research/     # MCP protocol research + experiments
├── installers/
│   └── mcp-install/             # Automated installers + setup scripts
└── extensions/
    └── vscode-mcp-server-tabs/  # VSCode extension for managing MCP servers
```

## Repo Notes
- **research/github-mcp-research** — Node-based playground exploring MCP server/client patterns with docs/tests.
- **installers/mcp-install** — Shell/Python scripts plus guides for installing and fixing MCP setups (Cline CLI, Linux, etc.).
- **extensions/vscode-mcp-server-tabs** — VSCode extension (TypeScript) for displaying MCP servers in dedicated tabs, ships packaged `.vsix`.

Each repository now includes `docs/PROJECT_STATUS.md` describing responsibilities, runbooks, and outstanding work items.
