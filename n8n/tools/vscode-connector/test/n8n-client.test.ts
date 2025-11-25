import { N8nClient } from '../src/n8n-client';

// Mock axios
jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('N8nClient', () => {
  let client: N8nClient;
  const baseUrl = 'https://test-n8n.hf.space';
  const apiKey = 'test-api-key';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create client
    client = new N8nClient(baseUrl, apiKey);
  });

  describe('constructor', () => {
    it('should initialize with correct base URL and API key', () => {
      expect(client.getBaseUrl()).toBe(baseUrl);
      expect(client.hasApiKey()).toBe(true);
    });

    it('should handle URL without trailing slash', () => {
      const clientWithSlash = new N8nClient(baseUrl + '/', apiKey);
      expect(clientWithSlash.getBaseUrl()).toBe(baseUrl);
    });

    it('should work without API key', () => {
      const clientWithoutKey = new N8nClient(baseUrl);
      expect(clientWithoutKey.hasApiKey()).toBe(false);
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ status: 200 }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      const result = await client.testConnection();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Connection failed')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      const result = await client.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('getWorkflows', () => {
    it('should fetch workflows successfully', async () => {
      const mockWorkflows = [
        { id: '1', name: 'Test Workflow', active: true },
        { id: '2', name: 'Another Workflow', active: false }
      ];

      const mockResponse = {
        data: { data: mockWorkflows },
        status: 200
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      const workflows = await client.getWorkflows();
      expect(workflows).toEqual(mockWorkflows);
    });

    it('should throw error on API failure', async () => {
      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('API Error')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      await expect(client.getWorkflows()).rejects.toThrow('Failed to fetch workflows from n8n instance');
    });
  });

  describe('executeWorkflow', () => {
    it('should execute workflow with data', async () => {
      const workflowId = 'test-workflow-id';
      const inputData = { message: 'Hello World' };
      const mockExecution = {
        id: 'exec-123',
        workflowId,
        status: 'success',
        startedAt: new Date().toISOString()
      };

      const mockResponse = {
        data: { data: mockExecution },
        status: 200
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      const execution = await client.executeWorkflow(workflowId, inputData);
      expect(execution).toEqual(mockExecution);
    });

    it('should execute workflow without data', async () => {
      const workflowId = 'test-workflow-id';
      const mockExecution = {
        id: 'exec-123',
        workflowId,
        status: 'success'
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: { data: mockExecution } }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        },
        defaults: { headers: {} }
      } as any);

      const execution = await client.executeWorkflow(workflowId);
      expect(execution).toEqual(mockExecution);
    });
  });

  describe('updateConfig', () => {
    it('should update base URL and API key', () => {
      const newUrl = 'https://new-n8n.hf.space';
      const newApiKey = 'new-api-key';

      client.updateConfig(newUrl, newApiKey);

      expect(client.getBaseUrl()).toBe(newUrl);
      expect(client.hasApiKey()).toBe(true);
    });

    it('should handle URL with trailing slash', () => {
      const newUrl = 'https://new-n8n.hf.space/';

      client.updateConfig(newUrl);

      expect(client.getBaseUrl()).toBe('https://new-n8n.hf.space');
    });
  });
});
