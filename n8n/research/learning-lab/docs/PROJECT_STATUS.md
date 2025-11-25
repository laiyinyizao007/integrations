# Project Status · n8n Learning Lab

## Purpose & Scope
Comprehensive learning curriculum for n8n that ties together local Docker, cloud deployments, VSCode integration, and workflow templates. Primary audience is anyone onboarding to the automation stack.

## Current Layout
- `workflows/` subdivided into `basics/`, `integrations/`, `automation/`, `advanced/`.
- `examples/` for code-heavy demos (API integration, data processing, Telegram bots, VSCode extension usage).
- `docs/` contains getting-started, workflow guide, best practices, and troubleshooting handbooks.
- `scripts/` orchestrate setup/import/test tasks; `scripts/import-workflows.sh` is referenced throughout the README.

## Runbook
```bash
# prepare environment (usually after cloning the workspace)
./scripts/setup.sh

# import curated workflows into the currently running n8n instance
./scripts/import-workflows.sh

# deploy demo automations (if applicable)
./scripts/deploy.sh

# run smoke tests against workflows
./scripts/test-workflows.sh
```

Requires a running n8n instance (see `../deployments/local-docker`) and the VSCode connector when exploring extension features. Follow the README learning path (Basics → VSCode → Real-world cases → Advanced).

## Outstanding Follow-ups
1. `PROJECT_STATUS.md` now exists; update the README to link back here.
2. Automate synchronization between `workflows/` and the metadata stored in `../tools/workflows-backup`.
3. Consider adding unit tests (e.g., via `n8n-node-dev` or JSON schema validation) so `scripts/test-workflows.sh` has actual assertions.
