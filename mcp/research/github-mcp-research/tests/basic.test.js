/**
 * Basic tests for GitHub MCP Research
 */

const { GitHubMCPClient } = require('../src/client/github-mcp-client');

describe('GitHubMCPClient', () => {
  let client;

  beforeEach(() => {
    client = new GitHubMCPClient();
  });

  test('should initialize correctly', async () => {
    expect(client.initialized).toBe(false);
    await client.initialize();
    expect(client.initialized).toBe(true);
  });

  test('should list available tools', () => {
    const tools = client.getAvailableTools();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);
    expect(tools).toContain('search_repositories');
    expect(tools).toContain('create_issue');
  });

  test('should check tool availability', () => {
    expect(client.isToolAvailable('search_repositories')).toBe(true);
    expect(client.isToolAvailable('nonexistent_tool')).toBe(false);
  });

  test('should search repositories (mock)', async () => {
    await client.initialize();
    const results = await client.searchRepositories('test');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('name');
    expect(results[0]).toHaveProperty('full_name');
  });

  test('should get current user (mock)', async () => {
    await client.initialize();
    const user = await client.getCurrentUser();
    expect(user).toHaveProperty('login');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
  });

  test('should create issue (mock)', async () => {
    await client.initialize();
    const issue = await client.createIssue('owner', 'repo', 'Test Issue', 'Test body');
    expect(issue).toHaveProperty('number');
    expect(issue).toHaveProperty('title');
    expect(issue.title).toBe('Test Issue');
    expect(issue).toHaveProperty('html_url');
  });

  test('should create pull request (mock)', async () => {
    await client.initialize();
    const pr = await client.createPullRequest('owner', 'repo', 'Test PR', 'feature', 'main', 'Test body');
    expect(pr).toHaveProperty('number');
    expect(pr).toHaveProperty('title');
    expect(pr.title).toBe('Test PR');
    expect(pr).toHaveProperty('html_url');
  });
});
