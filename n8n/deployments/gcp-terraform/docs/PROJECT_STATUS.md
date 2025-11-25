# Project Status · n8n GCP Terraform

## Purpose & Scope
Automates provisioning of an n8n + FastAPI stack on a free-tier GCP e2-micro VM. Python `setup.py` orchestrates prerequisite checks, service account creation, IP reservation, and Terraform config generation. Terraform plus shell scripts then build Docker, Cloudflare Tunnel, and supporting services on the VM.

## Current Layout
- `setup.py` — entry point for CLI flags (`--check`, `--no-upload`, etc.).
- `config/` — Dockerfile, docker-compose.yml, entrypoint, and systemd unit template used on the VM.
- `scripts/` — server-side installers (`setup_server.sh`, `setup_cloudflare.sh`, `updater.sh`).
- `terraform/` — optional modules if you need to extend beyond the generated `setup.tf`.
- `docs/*.md` — Quick Start, troubleshooting, and architecture notes referenced by this status file.

## Runbook
```bash
python3 setup.py --check        # ensure gcloud, terraform, ssh key exist
python3 setup.py                # generate setup.tf + upload scripts
terraform init && terraform plan
terraform apply                 # provision VM + static IP
# when output displays SSH command:
ssh -i ~/.ssh/gcp user@STATIC_IP
sudo sh /opt/setup_server.sh    # installs docker + builds custom image
sudo sh /opt/setup_cloudflare.sh
sudo systemctl status docker-compose.service
```

## Outstanding Follow-ups
1. There is no central `.env.example` for Docker Compose even though README references one — add back so secrets aren’t hard-coded.
2. Capture Cloudflare Tunnel credentials (token/tunnel UUID) inside `config/` or `docs/` so they can be rotated consistently.
3. Publish a teardown guide (terraform destroy + Cloudflare cleanup) to avoid dangling resources on the free tier.
