/**
 * 工具函数库
 * 提供通用的辅助函数
 */

/**
 * 格式化日期为中文格式
 * @param {Date|string} date - 日期对象或字符串
 * @returns {string} 格式化的日期字符串
 */
function formatDateChinese(date) {
  const d = new Date(date);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 验证UUID格式
 * @param {string} uuid - UUID字符串
 * @returns {boolean} 是否为有效UUID
 */
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 从Notion URL中提取ID
 * @param {string} url - Notion URL
 * @returns {string|null} 提取的ID或null
 */
function extractIdFromUrl(url) {
  try {
    // 处理数据库URL: https://www.notion.so/workspace/DATABASE_ID?v=...
    // 处理页面URL: https://www.notion.so/PAGE_TITLE-PAGE_ID
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    // 处理页面URL格式
    if (lastPart.includes('-')) {
      const parts = lastPart.split('-');
      const potentialId = parts[parts.length - 1];

      if (isValidUUID(potentialId)) {
        return potentialId;
      }
    }

    // 处理直接的ID
    if (isValidUUID(lastPart)) {
      return lastPart;
    }

    // 处理查询参数中的ID
    const urlObj = new URL(url);
    const vParam = urlObj.searchParams.get('v');
    if (vParam && isValidUUID(vParam)) {
      return vParam;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 截断文本到指定长度
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的文本
 */
function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 安全的JSON解析
 * @param {string} jsonString - JSON字符串
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析结果或默认值
 */
function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse failed:', error.message);
    return defaultValue;
  }
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param {Function} fn - 要重试的函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delayMs - 重试间隔
 * @returns {Promise} 执行结果
 */
async function retry(fn, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        console.warn(`Attempt ${i + 1} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}

/**
 * 创建富文本对象
 * @param {string} content - 文本内容
 * @param {Object} options - 选项
 * @returns {Object} 富文本对象
 */
function createRichText(content, options = {}) {
  return {
    type: 'text',
    text: {
      content: content,
      ...options,
    },
  };
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化的文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 验证环境变量
 * @param {string} varName - 环境变量名
 * @returns {boolean} 是否存在且不为空
 */
function validateEnvVar(varName) {
  const value = process.env[varName];
  return value && value.trim().length > 0;
}

module.exports = {
  formatDateChinese,
  isValidUUID,
  extractIdFromUrl,
  truncateText,
  safeJsonParse,
  delay,
  retry,
  createRichText,
  formatFileSize,
  validateEnvVar,
};
