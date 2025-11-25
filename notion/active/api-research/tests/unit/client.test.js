const { NotionClient } = require('../../src/client');

/**
 * NotionClient 单元测试
 */
describe('NotionClient', () => {
  let client;

  beforeEach(() => {
    // 重置环境变量
    delete process.env.NOTION_API_KEY;

    // 创建客户端实例
    client = new NotionClient();
  });

  afterEach(() => {
    // 清理
    delete process.env.NOTION_API_KEY;
  });

  test('should throw error when NOTION_API_KEY is not set', () => {
    expect(() => {
      new NotionClient();
    }).toThrow('NOTION_API_KEY environment variable is required');
  });

  test('should initialize client when NOTION_API_KEY is set', () => {
    process.env.NOTION_API_KEY = 'test-api-key';

    const testClient = new NotionClient();
    expect(testClient).toBeDefined();
    expect(testClient.getClient()).toBeDefined();
  });

  test('should return client instance', () => {
    process.env.NOTION_API_KEY = 'test-api-key';

    const testClient = new NotionClient();
    const clientInstance = testClient.getClient();
    expect(clientInstance).toBeDefined();
  });

  test('should throw error when getting client before initialization', () => {
    expect(() => {
      client.getClient();
    }).toThrow('Notion client not initialized');
  });
});
