/**
 * GitHub MCP Tool Usage Examples
 *
 * This file demonstrates how to use GitHub MCP tools directly in Cline.
 * These examples show the actual MCP tool calls that work in the Cline environment.
 *
 * Note: These examples are meant to be run in Cline, not as standalone Node.js scripts.
 */

// Example 1: Search Repositories
async function searchRepositoriesExample() {
  console.log('🔍 Example: Searching GitHub repositories');

  try {
    // Use the MCP search_repositories tool
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "search_repositories",
      arguments: {
        query: "cline",
        page: 1,
        perPage: 10
      }
    });

    console.log('Search results:', result);
    return result;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Example 2: Create an Issue
async function createIssueExample() {
  console.log('🐛 Example: Creating a GitHub issue');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "create_issue",
      arguments: {
        owner: "octocat", // Replace with actual owner
        repo: "hello-world", // Replace with actual repo
        title: "Test Issue from MCP",
        body: "This issue was created using GitHub MCP tools in Cline.",
        labels: ["test", "mcp"]
      }
    });

    console.log('Created issue:', result);
    return result;
  } catch (error) {
    console.error('Issue creation failed:', error);
    throw error;
  }
}

// Example 3: Get Repository Contents
async function getRepositoryContentsExample() {
  console.log('📁 Example: Getting repository file contents');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "get_file_contents",
      arguments: {
        owner: "octocat",
        repo: "hello-world",
        path: "README.md"
      }
    });

    console.log('File contents:', result);
    return result;
  } catch (error) {
    console.error('Failed to get file contents:', error);
    throw error;
  }
}

// Example 4: Create or Update File
async function createOrUpdateFileExample() {
  console.log('📝 Example: Creating/updating a file in repository');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "create_or_update_file",
      arguments: {
        owner: "your-username", // Replace with actual owner
        repo: "your-repo", // Replace with actual repo
        path: "test-mcp-file.txt",
        content: "This file was created using GitHub MCP tools!",
        message: "Add test file via MCP",
        branch: "main"
      }
    });

    console.log('File created/updated:', result);
    return result;
  } catch (error) {
    console.error('File operation failed:', error);
    throw error;
  }
}

// Example 5: Create Pull Request
async function createPullRequestExample() {
  console.log('🔀 Example: Creating a pull request');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "create_pull_request",
      arguments: {
        owner: "your-username", // Replace with actual owner
        repo: "your-repo", // Replace with actual repo
        title: "Test PR from MCP",
        body: "This PR was created using GitHub MCP tools in Cline.",
        head: "feature/test-branch", // Replace with actual branch
        base: "main",
        draft: false
      }
    });

    console.log('Created PR:', result);
    return result;
  } catch (error) {
    console.error('PR creation failed:', error);
    throw error;
  }
}

// Example 6: List Issues
async function listIssuesExample() {
  console.log('📋 Example: Listing repository issues');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "list_issues",
      arguments: {
        owner: "octocat",
        repo: "hello-world",
        state: "open",
        page: 1,
        per_page: 10
      }
    });

    console.log('Issues:', result);
    return result;
  } catch (error) {
    console.error('Failed to list issues:', error);
    throw error;
  }
}

// Example 7: Search Code
async function searchCodeExample() {
  console.log('🔍 Example: Searching code across GitHub');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "search_code",
      arguments: {
        q: "console.log",
        page: 1,
        per_page: 10
      }
    });

    console.log('Code search results:', result);
    return result;
  } catch (error) {
    console.error('Code search failed:', error);
    throw error;
  }
}

// Example 8: Fork Repository
async function forkRepositoryExample() {
  console.log('🍴 Example: Forking a repository');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "fork_repository",
      arguments: {
        owner: "octocat",
        repo: "hello-world"
      }
    });

    console.log('Forked repository:', result);
    return result;
  } catch (error) {
    console.error('Fork failed:', error);
    throw error;
  }
}

// Example 9: Create Branch
async function createBranchExample() {
  console.log('🌿 Example: Creating a new branch');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "create_branch",
      arguments: {
        owner: "your-username", // Replace with actual owner
        repo: "your-repo", // Replace with actual repo
        branch: "feature/mcp-test",
        from_branch: "main"
      }
    });

    console.log('Created branch:', result);
    return result;
  } catch (error) {
    console.error('Branch creation failed:', error);
    throw error;
  }
}

// Example 10: Get Pull Request Details
async function getPullRequestExample() {
  console.log('📖 Example: Getting pull request details');

  try {
    const result = await use_mcp_tool({
      server_name: "github",
      tool_name: "get_pull_request",
      arguments: {
        owner: "octocat",
        repo: "hello-world",
        pull_number: 1
      }
    });

    console.log('PR details:', result);
    return result;
  } catch (error) {
    console.error('Failed to get PR details:', error);
    throw error;
  }
}

/**
 * Run all examples (uncomment the ones you want to test)
 */
async function runAllExamples() {
  console.log('🚀 Running GitHub MCP Tool Examples\n');

  try {
    // Uncomment the examples you want to run
    // await searchRepositoriesExample();
    // await getRepositoryContentsExample();
    // await listIssuesExample();
    // await searchCodeExample();
    // await getPullRequestExample();

    // Be careful with these - they create/modify GitHub resources
    // await createIssueExample();
    // await createOrUpdateFileExample();
    // await createPullRequestExample();
    // await forkRepositoryExample();
    // await createBranchExample();

    console.log('\n✅ Examples completed');
  } catch (error) {
    console.error('\n❌ Examples failed:', error);
  }
}

// Export for use in other files
module.exports = {
  searchRepositoriesExample,
  createIssueExample,
  getRepositoryContentsExample,
  createOrUpdateFileExample,
  createPullRequestExample,
  listIssuesExample,
  searchCodeExample,
  forkRepositoryExample,
  createBranchExample,
  getPullRequestExample,
  runAllExamples
};

// Note: This file is for documentation purposes.
// To actually run these examples, copy the individual functions
// into your Cline environment and execute them there.
