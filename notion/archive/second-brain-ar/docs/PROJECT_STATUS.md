# Project Status · Second Brain AR (Archived)

## Position in Portfolio
Early prototype for an AR-enhanced visualization layer that would sit on top of the main Second Brain workspace. It shipped sketch-level templates and task outlines but never received a runnable Node project, so it now lives under `notion/archive/`.

## Snapshot
- `src/templates/` + `src/utils/` are placeholders; no executable JavaScript files, and `package.json` is missing even though `node_modules/` exists.
- `tasks/templates/` describes intended workflows (bug fix / research / feature templates) and is the most valuable artifact if you want to revive the concept.
- Documentation lives in `docs/INDEX.md` only; there is no README or setup script.

## Why Archived
1. Missing package metadata prevents dependency installs or script execution.
2. No code entry point — nothing imports or renders the template assets.
3. Requirements diverged from the production Second Brain, so keeping it active caused duplication and confusion.

## How to Revive
1. Recreate a `package.json` (probably mirroring the stack from `notion/active/second-brain`) and reinstall dependencies from scratch.
2. Port over concrete template renderers from the active project so `src/templates/` holds actual modules.
3. Move the most useful task workflow docs into `notion/active/second-brain/docs/` once they are validated, then reassess whether this folder should remain archived.
