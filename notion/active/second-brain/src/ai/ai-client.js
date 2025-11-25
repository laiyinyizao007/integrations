const { GoogleGenerativeAI } = require('@google/generative-ai');
const Logger = require('../utils/logger');
require('dotenv').config();

/**
 * AI 客户端封装 - 支持 Google Gemini
 */
class AIClient {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.defaultModel = process.env.AI_MODEL || 'gemini-2.0-flash-exp';
  }

  /**
   * 生成内容
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userContent - 用户内容
   * @param {string} modelName - 可选的模型名称
   * @returns {Promise<string>} AI 生成的文本
   */
  async generateContent(systemPrompt, userContent, modelName = null) {
    try {
      const model = this.client.getGenerativeModel({
        model: modelName || this.defaultModel,
      });

      const fullPrompt = `${systemPrompt}\n\n用户内容：\n${userContent}`;

      Logger.info(`调用 AI 模型: ${modelName || this.defaultModel}`);

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      Logger.error(`AI 调用失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 解析 JSON 响应
   * @param {string} text - AI 返回的文本
   * @returns {Object} 解析后的 JSON 对象
   */
  parseJSON(text) {
    try {
      // 移除可能的 Markdown 代码块标记
      let cleaned = text.trim();

      // 移除开头的 ```json 或 ```
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.substring(3);
      }

      // 移除结尾的 ```
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }

      cleaned = cleaned.trim();

      return JSON.parse(cleaned);
    } catch (error) {
      Logger.error('JSON 解析失败');
      Logger.error(`原始文本（前500字符）: ${text.substring(0, 500)}`);
      throw new Error(`JSON 解析失败: ${error.message}`);
    }
  }

  /**
   * 生成并解析 JSON
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userContent - 用户内容
   * @param {string} modelName - 可选的模型名称
   * @returns {Promise<Object>} 解析后的 JSON 对象
   */
  async generateJSON(systemPrompt, userContent, modelName = null) {
    const text = await this.generateContent(systemPrompt, userContent, modelName);
    return this.parseJSON(text);
  }

  /**
   * 带重试的生成
   * @param {string} systemPrompt - 系统提示词
   * @param {string} userContent - 用户内容
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<Object>} 解析后的 JSON 对象
   */
  async generateJSONWithRetry(systemPrompt, userContent, maxRetries = 3) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.generateJSON(systemPrompt, userContent);
      } catch (error) {
        lastError = error;
        Logger.warning(`第 ${i + 1} 次尝试失败，${i < maxRetries - 1 ? '重试中...' : '已达最大重试次数'}`);

        if (i < maxRetries - 1) {
          // 指数退避
          await this.delay(Math.pow(2, i) * 1000);
        }
      }
    }

    throw lastError;
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = AIClient;
