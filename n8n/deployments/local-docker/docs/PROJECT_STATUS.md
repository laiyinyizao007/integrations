# Project Status · Averivendell Local Docker

## Purpose & Scope
Canonical local n8n stack for day-to-day development. Provides full-featured Docker Compose deployment with persistent `n8n_data/`, VSCode preview helpers, and scripts to rotate ngrok tunnels when exposing the instance over the internet.

## Current Layout
- `docker-compose.yml` + `.env` drive the container stack.
- `start.sh`/`restart-n8n.sh` wrap Docker Compose operations with health checks.
- `n8n-preview.html` is a Live Server bookmark for quick access inside VSCode.
- `docs/` contains comparative deployment notes (HF vs local) referenced by the learning lab.

## Runbook
```bash
./start.sh                 # boot container with safety checks
./restart-n8n.sh           # restart without tearing down data
./update-ngrok-url.sh      # regenerate public tunnel when sharing flows
./start.sh && ./tasks/...  # run specific learning workflows after boot
```

Credentials default to `admin / avery_n8n_2025` (see script output) and the UI lives at `http://localhost:5678`. Data persists under `n8n_data/`.

## Outstanding Follow-ups
1. Document `n8n_data` backup/restore steps; currently implicit in README.
2. Add a `.env.example` describing the environment variables consumed by Docker Compose.
3. Convert the ngrok update workflow into a GitHub Action or cron so links don’t need manual refresh during demos.
