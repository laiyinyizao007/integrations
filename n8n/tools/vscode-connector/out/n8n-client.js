"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nClient = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
class N8nClient {
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
        this.apiKey = apiKey;
        this.client = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey })
            }
        });
        // 添加请求拦截器
        this.client.interceptors.request.use((config) => {
            console.log(`[n8n-client] ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`);
            return config;
        }, (error) => {
            console.error('[n8n-client] Request error:', error);
            return Promise.reject(error);
        });
        // 添加响应拦截器
        this.client.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            console.error('[n8n-client] Response error:', error.response?.status, error.response?.data);
            return Promise.reject(error);
        });
    }
    // 测试连接
    async testConnection() {
        try {
            const response = await this.client.get('/api/v1/workflows');
            return response.status === 200;
        }
        catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
    // 获取所有工作流
    async getWorkflows() {
        try {
            const response = await this.client.get('/api/v1/workflows');
            return response.data.data;
        }
        catch (error) {
            console.error('Failed to get workflows:', error);
            throw new Error('Failed to fetch workflows from n8n instance');
        }
    }
    // 获取单个工作流
    async getWorkflow(id) {
        try {
            const response = await this.client.get(`/api/v1/workflows/${id}`);
            return response.data.data;
        }
        catch (error) {
            console.error(`Failed to get workflow ${id}:`, error);
            throw new Error(`Failed to fetch workflow ${id}`);
        }
    }
    // 执行工作流
    async executeWorkflow(workflowId, data) {
        try {
            const payload = data ? { data } : {};
            const response = await this.client.post(`/api/v1/workflows/${workflowId}/execute`, payload);
            return response.data.data;
        }
        catch (error) {
            console.error(`Failed to execute workflow ${workflowId}:`, error);
            throw new Error(`Failed to execute workflow ${workflowId}`);
        }
    }
    // 获取执行历史
    async getExecutions(workflowId) {
        try {
            const url = workflowId
                ? `/api/v1/executions?workflowId=${workflowId}`
                : '/api/v1/executions';
            const response = await this.client.get(url);
            return response.data.data;
        }
        catch (error) {
            console.error('Failed to get executions:', error);
            throw new Error('Failed to fetch executions');
        }
    }
    // 获取执行详情
    async getExecution(executionId) {
        try {
            const response = await this.client.get(`/api/v1/executions/${executionId}`);
            return response.data.data;
        }
        catch (error) {
            console.error(`Failed to get execution ${executionId}:`, error);
            throw new Error(`Failed to fetch execution ${executionId}`);
        }
    }
    // 获取凭据列表
    async getCredentials() {
        try {
            const response = await this.client.get('/api/v1/credentials');
            return response.data.data;
        }
        catch (error) {
            console.error('Failed to get credentials:', error);
            throw new Error('Failed to fetch credentials');
        }
    }
    // 更新配置
    updateConfig(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiKey = apiKey;
        this.client.defaults.baseURL = this.baseUrl;
        if (this.apiKey) {
            this.client.defaults.headers['X-N8N-API-KEY'] = this.apiKey;
        }
        else {
            delete this.client.defaults.headers['X-N8N-API-KEY'];
        }
    }
    // 获取基础URL
    getBaseUrl() {
        return this.baseUrl;
    }
    // 检查是否已配置API密钥
    hasApiKey() {
        return !!this.apiKey;
    }
}
exports.N8nClient = N8nClient;
//# sourceMappingURL=n8n-client.js.map