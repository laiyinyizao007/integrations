/**
 * GitHub MCP Research - Repository Search Example
 *
 * This example demonstrates how to use the GitHub MCP client
 * to search for repositories and display the results.
 */

const { GitHubMCPClient } = require('../src/client/github-mcp-client');

async function searchRepositoriesExample() {
  console.log('🔍 GitHub Repository Search Example\n');

  // Initialize the client
  const client = new GitHubMCPClient();
  await client.initialize();

  try {
    // Search for repositories
    const query = 'cline'; // You can change this to any search term
    console.log(`Searching for repositories with query: "${query}"`);

    const repositories = await client.searchRepositories(query);

    console.log(`\n📊 Found ${repositories.length} repositories:\n`);

    // Display results
    repositories.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.full_name}`);
      console.log(`   Description: ${repo.description || 'No description'}`);
      console.log(`   Language: ${repo.language || 'Not specified'}`);
      console.log(`   Stars: ${repo.stargazers_count || 0}`);
      console.log(`   URL: ${repo.html_url}`);
      console.log('');
    });

    // Demonstrate tool availability check
    console.log('🔧 Available MCP Tools:');
    const tools = client.getAvailableTools();
    tools.forEach(tool => {
      console.log(`   - ${tool}`);
    });

  } catch (error) {
    console.error('❌ Error during repository search:', error.message);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  searchRepositoriesExample().catch(console.error);
}

module.exports = { searchRepositoriesExample };
