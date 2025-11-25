import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// n8n API 类型定义
export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  settings: any;
  staticData: any;
  createdAt: string;
  updatedAt: string;
}

export interface N8nExecution {
  id: string;
  workflowId: string;
  mode: string;
  status: 'waiting' | 'running' | 'success' | 'error';
  startedAt: string;
  stoppedAt?: string;
  data: any;
}

export interface N8nCredentials {
  id: string;
  name: string;
  type: string;
  data: any;
}

export class N8nClient {
  private client: AxiosInstance;
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey })
      }
    });

    // 添加请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[n8n-client] ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[n8n-client] Request error:', error);
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('[n8n-client] Response error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // 测试连接
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/v1/workflows');
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // 获取所有工作流
  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response: AxiosResponse<{ data: N8nWorkflow[] }> = await this.client.get('/api/v1/workflows');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get workflows:', error);
      throw new Error('Failed to fetch workflows from n8n instance');
    }
  }

  // 获取单个工作流
  async getWorkflow(id: string): Promise<N8nWorkflow> {
    try {
      const response: AxiosResponse<{ data: N8nWorkflow }> = await this.client.get(`/api/v1/workflows/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get workflow ${id}:`, error);
      throw new Error(`Failed to fetch workflow ${id}`);
    }
  }

  // 执行工作流
  async executeWorkflow(workflowId: string, data?: any): Promise<N8nExecution> {
    try {
      const payload = data ? { data } : {};
      const response: AxiosResponse<{ data: N8nExecution }> = await this.client.post(
        `/api/v1/workflows/${workflowId}/execute`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to execute workflow ${workflowId}:`, error);
      throw new Error(`Failed to execute workflow ${workflowId}`);
    }
  }

  // 获取执行历史
  async getExecutions(workflowId?: string): Promise<N8nExecution[]> {
    try {
      const url = workflowId
        ? `/api/v1/executions?workflowId=${workflowId}`
        : '/api/v1/executions';
      const response: AxiosResponse<{ data: N8nExecution[] }> = await this.client.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get executions:', error);
      throw new Error('Failed to fetch executions');
    }
  }

  // 获取执行详情
  async getExecution(executionId: string): Promise<N8nExecution> {
    try {
      const response: AxiosResponse<{ data: N8nExecution }> = await this.client.get(`/api/v1/executions/${executionId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to get execution ${executionId}:`, error);
      throw new Error(`Failed to fetch execution ${executionId}`);
    }
  }

  // 获取凭据列表
  async getCredentials(): Promise<N8nCredentials[]> {
    try {
      const response: AxiosResponse<{ data: N8nCredentials[] }> = await this.client.get('/api/v1/credentials');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get credentials:', error);
      throw new Error('Failed to fetch credentials');
    }
  }

  // 更新配置
  updateConfig(baseUrl: string, apiKey?: string): void {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;

    this.client.defaults.baseURL = this.baseUrl;
    if (this.apiKey) {
      this.client.defaults.headers['X-N8N-API-KEY'] = this.apiKey;
    } else {
      delete this.client.defaults.headers['X-N8N-API-KEY'];
    }
  }

  // 获取基础URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // 检查是否已配置API密钥
  hasApiKey(): boolean {
    return !!this.apiKey;
  }
}
