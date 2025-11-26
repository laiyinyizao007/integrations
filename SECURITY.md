# Security Guidelines

## 🔒 Environment Variables Strategy

This project uses **system-level environment variables** configured in `~/.bashrc` for all sensitive configuration. **Never commit API keys, tokens, or passwords to git.**

### Why System Environment Variables?

✅ **Single Source of Truth**: Configure once in `~/.bashrc`, use everywhere
✅ **Automatic Availability**: All projects automatically access the same credentials
✅ **No File Management**: No need to copy/sync `.env` files across projects
✅ **Persistent**: Survives shell restarts and system reboots
✅ **Secure**: Not tracked by git, not accidentally shared

### Quick Setup

All required environment variables are already configured in `~/.bashrc`:

```bash
# Notion Configuration
export NOTION_TOKEN="ntn_..."
export NOTION_API_KEY="ntn_..."
export NOTION_DATABASE_ID="..."
export NOTION_PAGE_ID="..."

# n8n Configuration
export N8N_API_KEY="eyJ..."
export N8N_BASE_URL="http://localhost:5678/"
export N8N_ENCRYPTION_KEY="$(openssl rand -hex 32)"
export N8N_USER_MANAGEMENT_JWT_SECRET="$(openssl rand -hex 32)"
export N8N_BASIC_AUTH_USER="admin"
export N8N_BASIC_AUTH_PASSWORD="$(openssl rand -hex 16)"
```

### How It Works

1. **System Variables First**: Applications check `process.env` for variables
2. **No .env Needed**: `.env` files only contain comments documenting which system variables are used
3. **Automatic Loading**: When you open a new terminal, all variables are available

### Adding New Environment Variables

To add a new environment variable:

1. Edit `~/.bashrc`:
   ```bash
   nano ~/.bashrc
   ```

2. Add your variable at the end:
   ```bash
   export NEW_SERVICE_TOKEN="your_token_here"
   ```

3. Reload the configuration:
   ```bash
   source ~/.bashrc
   ```

4. Verify it's set:
   ```bash
   echo $NEW_SERVICE_TOKEN
   ```

### Projects Using System Variables

All projects in this repository use system environment variables:

- **Notion API Research**: `notion/active/api-research/`
  - Uses: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_PAGE_ID`

- **Notion Second Brain**: `notion/active/second-brain/`
  - Uses: `NOTION_API_TOKEN`

- **n8n Local Deployment**: `n8n/deployments/local-docker/`
  - Uses: `N8N_ENCRYPTION_KEY`, `N8N_USER_MANAGEMENT_JWT_SECRET`, `N8N_BASIC_AUTH_PASSWORD`

- **n8n VSCode Connector**: `n8n/tools/vscode-connector/`
  - Uses: `N8N_API_KEY`, `N8N_BASE_URL`, `N8N_TIMEOUT`

### Security Best Practices

1. **Protect ~/.bashrc**
   ```bash
   chmod 600 ~/.bashrc  # Only you can read/write
   ```

2. **Never commit ~/.bashrc** to git repositories

3. **Generate strong keys**
   ```bash
   # For encryption keys and JWT secrets
   openssl rand -hex 32

   # For passwords
   openssl rand -hex 16
   ```

4. **Rotate credentials regularly**
   - Update tokens in `~/.bashrc`
   - Run `source ~/.bashrc` to reload
   - Restart affected services

5. **Use different credentials per environment**
   - Development: Use test/sandbox tokens
   - Production: Use production tokens with proper permissions

### Checking Current Environment Variables

View all sensitive variables:
```bash
env | grep -E "^(NOTION_|N8N_|GITHUB_TOKEN)"
```

### What About .env Files?

`.env` files in this repository serve as **documentation only**:
- They explain which system variables the project uses
- They don't contain actual values
- They're safe to commit to git

Example `.env` file:
```bash
# This project uses system environment variables.
# Configure these in ~/.bashrc:
#   - NOTION_API_KEY
#   - NOTION_DATABASE_ID
```

### Backup and Recovery

**Backing up credentials:**
```bash
# Extract only environment variables (remove actual values before sharing!)
grep "^export" ~/.bashrc | grep -E "(NOTION|N8N|GITHUB)" > ~/env-backup.txt
```

**Restore on new machine:**
1. Edit the backup file to add real values
2. Append to `~/.bashrc`:
   ```bash
   cat ~/env-backup.txt >> ~/.bashrc
   source ~/.bashrc
   ```

### What to Do If Credentials Are Compromised

1. **Immediately revoke** the exposed credential from the service provider
2. **Generate a new** credential
3. **Update ~/.bashrc** with the new value:
   ```bash
   nano ~/.bashrc
   # Find and replace the old value
   ```
4. **Reload configuration**:
   ```bash
   source ~/.bashrc
   ```
5. **Restart services** that use the credential

### Environment Variable Naming Convention

- Use `UPPERCASE_WITH_UNDERSCORES`
- Prefix by service: `N8N_*`, `NOTION_*`, `GITHUB_*`
- Suffix for type: `*_KEY`, `*_TOKEN`, `*_SECRET`, `*_PASSWORD`

### Troubleshooting

**Variable not found:**
```bash
# Check if it exists
echo $VARIABLE_NAME

# If empty, check ~/.bashrc
grep VARIABLE_NAME ~/.bashrc

# Reload bashrc
source ~/.bashrc
```

**Variable has wrong value:**
```bash
# Edit ~/.bashrc
nano ~/.bashrc

# Save and reload
source ~/.bashrc

# Verify
echo $VARIABLE_NAME
```

## 📋 Checklist for New Projects

- [ ] Document required variables in project's `.env` file (as comments)
- [ ] Add variables to `~/.bashrc`
- [ ] Run `source ~/.bashrc`
- [ ] Test that application can read variables
- [ ] Document in project README which variables are required

## 🚨 Security Contacts

If you discover a security vulnerability:
1. **Do not** create a public GitHub issue
2. **Do not** commit any fixes that expose the vulnerability
3. Contact the repository maintainer privately
4. Use GitHub Security Advisories for sensitive reports

---

**Last Updated**: 2025-11-27
**Configuration Method**: System Environment Variables (~/. bashrc)
**Maintained By**: Avery Ubuntu
