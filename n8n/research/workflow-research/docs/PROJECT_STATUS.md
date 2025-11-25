# Project Status · n8n Workflow Research

## Purpose & Scope
Acts as a research notebook for future n8n workflows. Structured like a documentation-first RAG system with task planning, RFCs, and knowledge base references. There is no executable code — it is meant for ideation, specs, and lessons learned before implementation elsewhere.

## Current Layout
- `.claude/` and `CLAUDE.md` — configuration hub for structured conversations/workflows.
- `docs/INDEX.md` — search UI that links to PRDs, architecture, technical notes, lessons learned, and literature.
- `tasks/` — planning artifacts (task plan, active context, RFC folder).
- `workflows/` — conceptual JSON or markdown notes about target workflows (not ready for n8n import yet).

## How to Use
1. Start at `docs/INDEX.md` to locate the relevant spec or prior art.
2. Update `tasks/active_context.md` before and after a research session to keep context synced.
3. Once designs are ready, export actionable items into `n8n/research/learning-lab` or one of the deployments/tools repos for implementation.

## Outstanding Follow-ups
1. Missing README/Quickstart/DIRECTORY-STRUCTURE files referenced in `docs/INDEX.md`; either restore them or update links.
2. Convert any validated workflow concepts into actual JSON imports stored alongside the lab or backup repos.
3. Decide whether this repo should remain a Git repository (`.git/`) or be merged into a central docs space to reduce duplication with `knowledge/n8n-on-gcp`.
