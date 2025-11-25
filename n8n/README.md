# n8n Automation Portfolio

This workspace keeps every n8n-related project in one place so deployments, tooling, and research stay organized. Use this file as your hub before jumping into a specific repository.

## Directory Map

```
n8n/
├── deployments/            # Production-ready infrastructure stacks
│   ├── gcp-terraform/      # Terraform + Python pipeline for GCP e2-micro
│   └── local-docker/       # Averivendell local Docker environment
├── knowledge/
│   └── n8n-on-gcp/         # R&D knowledge base + upstream fork of n8n-gcp
├── research/               # Learning labs and workflow experiments
│   ├── learning-lab/       # Guided curriculum + sample workflows
│   └── workflow-research/  # RAG-style documentation and workflow studies
└── tools/                  # Developer/ops utilities
    ├── vscode-connector/   # VSCode extension for remote n8n management
    └── workflows-backup/   # Metadata/backups + exporter scripts
```

## Deployments
- **deployments/local-docker** — Opinionated Docker Compose setup (Averivendell n8n) with helper scripts for start/restart/ngrok updates. Great for offline development and fast iterations.
- **deployments/gcp-terraform** — Automated end-to-end provisioning on Google Cloud (Python setup + Terraform + shell scripts). Includes Cloudflare tunnel automation and FastAPI sidecar.

## Research & Learning
- **research/learning-lab** — Primary learning playground that references the deployments and tools above. Contains structured docs, workflow templates, and onboarding scripts.
- **research/workflow-research** — Knowledge-heavy repo modeled like a LangChain RAG index. Use it when you need architectural notes, RFCs, or task templates for future workflow projects.

## Tools & Utilities
- **tools/vscode-connector** — VSCode extension (TypeScript) for browsing, executing, and backing up workflows directly from the editor.
- **tools/workflows-backup** — Lightweight backup snapshots (`*_metadata.json`) and the associated Node script for full exports/push-to-git automation.

## Knowledge Base
- **knowledge/n8n-on-gcp** — Houses the Claude configuration rules plus a fork of danielraffel/n8n-gcp for reference. Treat it as a documentation and research space rather than a deployable project.

> Each sub-project now ships a `docs/PROJECT_STATUS.md` that captures ownership, runbooks, and next actions. Start there if you need the TL;DR for a given folder.
