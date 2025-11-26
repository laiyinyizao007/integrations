# Security Guidelines

## 🔒 Environment Variables

This project uses environment variables to store sensitive configuration. **Never commit API keys, tokens, or passwords to git.**

### Setting Up Environment Variables

1. Copy `.env.example` to `.env` in each project directory:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env` files

3. The `.env` files are automatically ignored by git (configured in `.gitignore`)

### Projects with Environment Configuration

- **Notion API Research**: `notion/active/api-research/`
  - Required: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_PAGE_ID`
  - Get your token from: https://www.notion.so/my-integrations

- **Notion Second Brain**: `notion/active/second-brain/`
  - Required: `NOTION_API_TOKEN`
  - Optional: Database IDs for specific pages

- **n8n Local Deployment**: `n8n/deployments/local-docker/`
  - Required: `N8N_ENCRYPTION_KEY`, `N8N_USER_MANAGEMENT_JWT_SECRET`, `N8N_BASIC_AUTH_PASSWORD`
  - Generate secure keys: `openssl rand -hex 32`

- **n8n VSCode Connector**: `n8n/tools/vscode-connector/`
  - Required: `N8N_API_KEY`
  - Get from: n8n Settings → API → Generate new token

- **MCP Installers**: `mcp/installers/mcp-install/`
  - Optional: `GITHUB_TOKEN`, `NOTION_TOKEN`
  - Only needed if using GitHub or Notion MCP servers

### Security Best Practices

1. **Never commit secrets**
   - Always use `.env` files for secrets
   - Keep `.env` files local only
   - Use `.env.example` as templates

2. **Generate strong keys**
   ```bash
   # For encryption keys and JWT secrets
   openssl rand -hex 32

   # For API tokens
   Use the service's built-in token generator
   ```

3. **Rotate credentials regularly**
   - Change passwords every 90 days
   - Rotate API tokens if compromised
   - Update encryption keys during major updates

4. **Use different credentials per environment**
   - Development: Test tokens
   - Staging: Limited-permission tokens
   - Production: Full-permission tokens

### What to Do If You Accidentally Commit a Secret

1. **Immediately revoke** the exposed credential
2. **Generate a new** credential
3. **Remove from git history**:
   ```bash
   # Use git filter-branch or git filter-repo
   git filter-branch --tree-filter 'sed -i "s/OLD_SECRET/PLACEHOLDER/g" path/to/file' HEAD
   ```
4. **Force push** (⚠️ only if no one else has pulled):
   ```bash
   git push --force
   ```

### GitHub Secret Scanning

GitHub automatically scans for known secret patterns. If detected:
1. You'll receive a push protection warning
2. The push will be blocked
3. Follow the provided URL to resolve
4. Remove the secret before pushing again

### Environment Variable Naming Convention

- Use `UPPERCASE_WITH_UNDERSCORES`
- Prefix by service: `N8N_*`, `NOTION_*`, `GITHUB_*`
- Suffix for type: `*_KEY`, `*_TOKEN`, `*_SECRET`, `*_PASSWORD`

### Example .env.example Template

```env
# Service Name Configuration
# Get your token from: https://example.com/tokens

# Required
SERVICE_API_KEY=your_api_key_here
SERVICE_SECRET=your_secret_here

# Optional
SERVICE_ENDPOINT=https://api.example.com
SERVICE_TIMEOUT=30000
```

## 📋 Checklist for New Projects

- [ ] Create `.env.example` with placeholders
- [ ] Add `.env` to `.gitignore`
- [ ] Document how to get each credential
- [ ] Add instructions in README.md
- [ ] Test with example values
- [ ] Verify `.env` is not tracked: `git ls-files | grep .env`

## 🚨 Security Contacts

If you discover a security vulnerability:
1. **Do not** create a public GitHub issue
2. Email: [your-security-email]
3. Use GitHub Security Advisories (private)

---

**Last Updated**: 2025-11-27
**Maintained By**: Security Team
