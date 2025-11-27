# Integrations Workspace

Third-party service integrations, MCP tooling, and automation bridges. This workspace organizes all external API clients, automation platform deployments, and protocol implementations in one place.

## 🎯 What's Inside

This repository contains three major integration categories:

1. **Notion** — Official Notion API clients and Second Brain automation
2. **n8n** — Workflow automation platform deployments and tools
3. **MCP** — Model Context Protocol utilities and extensions

All projects share a unified security model using system environment variables (`~/.bashrc`) instead of `.env` files. See [SECURITY.md](./SECURITY.md) for the complete guide.

## 📁 Directory Structure

```
integrations/
├── notion/                 # Notion API workspace
│   ├── active/
│   │   ├── api-research/   # Notion API sandbox + reusable client
│   │   └── second-brain/   # Production Second Brain automation
│   └── archive/
│       └── second-brain-ar/  # Archived AR prototype
├── n8n/                    # n8n automation portfolio
│   ├── deployments/
│   │   ├── local-docker/   # Local Docker development stack
│   │   └── gcp-terraform/  # GCP production deployment
│   ├── tools/
│   │   ├── vscode-connector/   # VSCode extension for n8n
│   │   └── workflows-backup/   # Backup automation
│   ├── research/
│   │   ├── learning-lab/       # Guided learning curriculum
│   │   └── workflow-research/  # RAG knowledge base
│   └── knowledge/
│       └── n8n-on-gcp/     # Documentation + upstream fork
├── mcp/                    # Model Context Protocol tooling
│   ├── codex-integration/  # Zen MCP integration for Claude Code
│   ├── research/
│   │   └── github-mcp-research/  # Protocol experiments
│   ├── installers/
│   │   └── mcp-install/    # Setup automation scripts
│   └── extensions/
│       └── vscode-mcp-server-tabs/  # VSCode MCP server tabs
└── SECURITY.md             # Security guidelines for all projects
```

## 🚀 Quick Start

### Prerequisites

All integrations require environment variables configured in `~/.bashrc`:

```bash
# Notion
export NOTION_API_KEY="ntn_..."
export NOTION_DATABASE_ID="..."
export NOTION_PAGE_ID="..."

# n8n
export N8N_API_KEY="eyJ..."
export N8N_BASE_URL="http://localhost:5678/"
export N8N_ENCRYPTION_KEY="$(openssl rand -hex 32)"
export N8N_USER_MANAGEMENT_JWT_SECRET="$(openssl rand -hex 32)"

# Verify
source ~/.bashrc
```

See [SECURITY.md](./SECURITY.md) for complete setup instructions.

### Starting Points

**Working with Notion API:**
```bash
cd notion/active/api-research
npm install
node examples/list-databases.js
```

**Running n8n locally:**
```bash
cd n8n/deployments/local-docker
./run.sh start
```

**Installing MCP servers:**
```bash
cd mcp/installers/mcp-install
./install.sh
```

**Using Zen MCP with Claude Code:**
```bash
cd mcp/codex-integration
cat QUICK_START.md  # Complete integration guide
```

## 📚 Notion Integration

### Active Projects

**notion/active/api-research** — Notion API sandbox
- Core API client utilities (`src/client`, `src/utils`)
- Runnable examples (`examples/`)
- Testing playground for new API features
- Reusable modules for other projects

**notion/active/second-brain** — Production automation
- Full-featured Second Brain system
- CLI scripts and cron automation
- AI-powered workflows
- Comprehensive documentation

### Usage

```bash
# API Research
cd notion/active/api-research
npm install
node examples/create-database.js

# Second Brain
cd notion/active/second-brain
npm install
npm run sync  # Sync Notion workspace
```

**Documentation**: [notion/README.md](./notion/README.md)

## 🔄 n8n Automation

### Deployments

**n8n/deployments/local-docker** — Local development
- Docker Compose stack
- Averivendell configuration
- Helper scripts (start/stop/restart)
- ngrok tunnel automation

**n8n/deployments/gcp-terraform** — Cloud production
- Terraform infrastructure as code
- GCP e2-micro deployment
- Cloudflare tunnel integration
- FastAPI sidecar service

### Tools

**n8n/tools/vscode-connector** — VSCode extension
- Browse workflows from editor
- Execute workflows remotely
- Backup automation
- TypeScript implementation

**n8n/tools/workflows-backup** — Backup system
- Automated metadata exports
- Git integration
- Workflow versioning

### Research & Learning

**n8n/research/learning-lab** — Guided curriculum
- Structured learning path
- Sample workflows
- Onboarding scripts

**n8n/research/workflow-research** — Knowledge base
- RAG-style documentation
- Architectural notes
- Task templates

### Usage

```bash
# Start local n8n
cd n8n/deployments/local-docker
./run.sh start
# Access at http://localhost:5678

# Deploy to GCP
cd n8n/deployments/gcp-terraform
python setup.py  # Interactive deployment

# Backup workflows
cd n8n/tools/workflows-backup
node export-workflows.js
```

**Documentation**: [n8n/README.md](./n8n/README.md)

## 🔌 MCP (Model Context Protocol)

### Zen MCP Integration

**mcp/codex-integration** — Advanced AI capabilities for Claude Code
- 5-dimensional code review (Codex CLI)
- P1-P4 multi-stage planning workflow
- Multi-model consensus decisions
- Deep technical analysis (Gemini CLI)
- Automated documentation generation

**Quick Enable:**
```bash
# From Claude Code chat
@zen-mcp 请用 5维标准审查这段代码
@zen-mcp 用 P1-P4 工作流规划新功能
@zen-mcp consensus 架构方案决策
```

**Complete Documentation:**
- Quick Index: `~/.claude/CLAUDE-ZEN-INDEX.md`
- Full Guide: `mcp/codex-integration/FUSION_SUMMARY.md`
- Integration Status: `mcp/codex-integration/INSTALLATION_STATUS.md`

### MCP Tools & Research

**mcp/research/github-mcp-research** — Protocol experiments
- MCP server/client patterns
- Node.js implementation examples
- Test suites and documentation

**mcp/installers/mcp-install** — Setup automation
- Shell/Python installation scripts
- Cline CLI setup guides
- Linux compatibility fixes

**mcp/extensions/vscode-mcp-server-tabs** — VSCode extension
- MCP server tab management
- TypeScript implementation
- Packaged `.vsix` distribution

### Usage

```bash
# Install MCP servers
cd mcp/installers/mcp-install
./install.sh

# VSCode extension
cd mcp/extensions/vscode-mcp-server-tabs
code --install-extension *.vsix

# Research playground
cd mcp/research/github-mcp-research
npm install
npm test
```

**Documentation**: [mcp/README.md](./mcp/README.md)

## 🔒 Security

This workspace uses **system-level environment variables** for all sensitive configuration.

### Core Principles

✅ **Single Source of Truth** — All credentials in `~/.bashrc`
✅ **No .env Files** — Project `.env` files are documentation-only
✅ **Auto-Available** — Variables loaded in every terminal session
✅ **Git-Safe** — Never commit credentials

### Quick Check

```bash
# Verify all required variables
env | grep -E "^(NOTION_|N8N_|GITHUB_TOKEN)"

# Add new variable
echo 'export NEW_SERVICE_TOKEN="xxx"' >> ~/.bashrc
source ~/.bashrc
```

### Detailed Guide

See [SECURITY.md](./SECURITY.md) for:
- Complete setup instructions
- Variable naming conventions
- Rotation procedures
- Troubleshooting guide
- Recovery procedures

## 📖 Project Status Documentation

Each sub-project includes `docs/PROJECT_STATUS.md` documenting:
- Project responsibilities
- Current state and health
- Entry points and runbooks
- Outstanding tasks
- Known issues

Quick navigation:
```bash
# Notion projects
cat notion/active/api-research/docs/PROJECT_STATUS.md
cat notion/active/second-brain/docs/PROJECT_STATUS.md

# n8n projects
cat n8n/deployments/local-docker/docs/PROJECT_STATUS.md
cat n8n/deployments/gcp-terraform/docs/PROJECT_STATUS.md
cat n8n/tools/vscode-connector/docs/PROJECT_STATUS.md

# MCP projects
cat mcp/codex-integration/PROJECT_STATUS.md
cat mcp/installers/mcp-install/docs/PROJECT_STATUS.md
```

## 🛠️ Development Workflow

### Adding a New Integration

1. Choose the appropriate category (notion/n8n/mcp)
2. Create project directory under `active/` or appropriate subdirectory
3. Include required files:
   - `README.md` — Project overview and quick start
   - `docs/PROJECT_STATUS.md` — Current state and tasks
   - `.env` — Documentation of required system variables (comments only)
4. Update category README to reference new project
5. Document system variables in [SECURITY.md](./SECURITY.md)

### Working with Existing Projects

1. Check `docs/PROJECT_STATUS.md` for current state
2. Verify environment variables: `env | grep SERVICE_NAME`
3. Follow project-specific README for setup
4. Use helper scripts when available (`run.sh`, `install.sh`, etc.)

### Archiving a Project

1. Move to `archive/` subdirectory
2. Add archive note to category README
3. Include: why archived, last known working state, migration path
4. Keep documentation intact for future reference

## 🧪 Testing

Each integration has its own testing approach:

**Notion:**
```bash
cd notion/active/api-research
npm test
node examples/list-databases.js  # Integration test
```

**n8n:**
```bash
cd n8n/deployments/local-docker
./run.sh start
curl http://localhost:5678/healthz  # Health check
```

**MCP:**
```bash
cd mcp/research/github-mcp-research
npm test
```

## 📦 Dependencies

### System Requirements

- **Node.js**: 18+ (for Notion, n8n tools, MCP)
- **Docker**: 24+ (for n8n deployments)
- **Python**: 3.9+ (for GCP deployment, MCP installers)
- **Terraform**: 1.5+ (for GCP infrastructure)

### Installation

Most projects use npm/pip:

```bash
# Node projects
cd <project-directory>
npm install

# Python projects
cd <project-directory>
pip install -r requirements.txt

# Docker projects
cd <project-directory>
docker-compose up -d
```

## 🐛 Troubleshooting

### Environment Variables Not Found

```bash
# Check if variable exists
echo $VARIABLE_NAME

# Reload bashrc
source ~/.bashrc

# Verify bashrc contains variable
grep VARIABLE_NAME ~/.bashrc
```

### n8n Connection Issues

```bash
# Check n8n is running
curl http://localhost:5678/healthz

# Check environment variables
echo $N8N_API_KEY
echo $N8N_BASE_URL

# Restart n8n
cd n8n/deployments/local-docker
./run.sh restart
```

### Notion API Errors

```bash
# Verify token
echo $NOTION_API_KEY

# Test connection
cd notion/active/api-research
node examples/list-databases.js

# Check API status
curl https://status.notion.so/
```

### MCP Server Issues

```bash
# Check MCP configuration
cat ~/.config/claude-code/mcp.json

# Reinstall MCP servers
cd mcp/installers/mcp-install
./install.sh

# Verify Claude Code sees servers
# In Claude Code: Check available MCP tools
```

## 🔗 Related Resources

- **Main Projects Repo**: `/home/averyubuntu/projects/`
- **Claude Code Config**: `~/claude-config-sync/`
- **Global Config**: `~/.claude/CLAUDE.md`
- **MCP Config**: `~/.config/claude-code/mcp.json`

### External Documentation

- [Notion API Docs](https://developers.notion.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)
- [Zen MCP Guide](./mcp/codex-integration/FUSION_SUMMARY.md)

## 📋 Next Steps

Based on current project states:

1. **Notion**: Expand Second Brain automation with additional AI workflows
2. **n8n**: Complete GCP deployment automation, publish VSCode extension
3. **MCP**: Document additional Zen MCP skills, create integration examples

See individual `PROJECT_STATUS.md` files for detailed task lists.

## 🤝 Contributing

When contributing to any integration:

1. Follow the project's existing structure
2. Update `PROJECT_STATUS.md` with changes
3. Document new environment variables in [SECURITY.md](./SECURITY.md)
4. Add system variables to `~/.bashrc`, not `.env` files
5. Test locally before committing
6. Update relevant README files

## 📝 License

Each sub-project may have its own license. Check individual project directories for LICENSE files.

---

**Last Updated**: 2025-11-27
**Maintained By**: Avery Ubuntu
**Repository**: `/home/averyubuntu/projects/integrations`
**Security Model**: System Environment Variables (`~/.bashrc`)
