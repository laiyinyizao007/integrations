# Project Status · n8n on GCP Knowledge Base

## Purpose & Scope
Acts as an AI-assistant-first knowledge repo for everything around n8n cloud deployments (Chrome DevTools MCP rules, task templates, RAG-style doc index) plus an upstream fork of `danielraffel/n8n-gcp`. Use it to research patterns before touching the active deployment repos.

## Current Layout
- `CLAUDE.md` + `.claude/` — rule loaders for Claude Code workflows (plan/implement/debug/etc.).
- `docs/INDEX.md` — search-style entry point linking to PRDs, architecture, technical specs, lessons learned, and RFC templates.
- `tasks/` — planning artifacts (`tasks_plan.md`, `active_context.md`, templates) describing ongoing experiments.
- `n8n-gcp/` — vendor fork that still points to the original README/setup; treat it as reference when local Terraform project diverges.

## Usage Notes
- This repository is documentation-heavy and intentionally lacks a root README; always start from `docs/INDEX.md`.
- When you need canonical task status, open `tasks/active_context.md`.
- For live infrastructure, switch to `n8n/deployments/gcp-terraform` — this folder should not contain terraform state or secrets.

## Outstanding Follow-ups
1. Add a lightweight `README.md` that explains the relationship between the knowledge base and the actual deployment repos.
2. Mirror any critical fixes from `n8n/deployments/gcp-terraform` back into the `n8n-gcp` fork or delete the fork to avoid confusion.
3. Wire up an automated doc index generator so `docs/INDEX.md` stays in sync when new files land.
