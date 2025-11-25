const utils = require('../../src/utils');

/**
 * 工具函数单元测试
 */
describe('Utils', () => {
  describe('isValidUUID', () => {
    test('should return true for valid UUID', () => {
      const validUUID = '12345678-1234-1234-1234-123456789012';
      expect(utils.isValidUUID(validUUID)).toBe(true);
    });

    test('should return false for invalid UUID', () => {
      const invalidUUID = 'not-a-uuid';
      expect(utils.isValidUUID(invalidUUID)).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(utils.isValidUUID('')).toBe(false);
    });

    test('should return false for null', () => {
      expect(utils.isValidUUID(null)).toBe(false);
    });
  });

  describe('extractIdFromUrl', () => {
    test('should extract ID from page URL', () => {
      const url = 'https://www.notion.so/MyPage-12345678-1234-1234-1234-123456789012';
      const expectedId = '12345678-1234-1234-1234-123456789012';
      expect(utils.extractIdFromUrl(url)).toBe(expectedId);
    });

    test('should extract ID from database URL', () => {
      const url = 'https://www.notion.so/workspace/12345678-1234-1234-1234-123456789012?v=abc';
      const expectedId = 'abc';
      expect(utils.extractIdFromUrl(url)).toBe(expectedId);
    });

    test('should return null for invalid URL', () => {
      const url = 'not-a-url';
      expect(utils.extractIdFromUrl(url)).toBe(null);
    });
  });

  describe('truncateText', () => {
    test('should return original text if shorter than maxLength', () => {
      const text = 'Hello World';
      expect(utils.truncateText(text, 20)).toBe(text);
    });

    test('should truncate text and add suffix', () => {
      const text = 'This is a very long text that should be truncated';
      const result = utils.truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...' = 23
      expect(result.endsWith('...')).toBe(true);
    });

    test('should handle empty text', () => {
      expect(utils.truncateText('', 10)).toBe('');
      expect(utils.truncateText(null, 10)).toBe(null);
    });
  });

  describe('formatDateChinese', () => {
    test('should format date in Chinese locale', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const result = utils.formatDateChinese(date);
      expect(result).toContain('2023');
      expect(result).toContain('01');
      expect(result).toContain('01');
    });
  });

  describe('safeJsonParse', () => {
    test('should parse valid JSON', () => {
      const json = '{"name": "test"}';
      const result = utils.safeJsonParse(json);
      expect(result).toEqual({ name: 'test' });
    });

    test('should return default value for invalid JSON', () => {
      const invalidJson = '{invalid json}';
      const result = utils.safeJsonParse(invalidJson, 'default');
      expect(result).toBe('default');
    });
  });

  describe('createRichText', () => {
    test('should create rich text object', () => {
      const result = utils.createRichText('Hello World');
      expect(result).toEqual({
        type: 'text',
        text: {
          content: 'Hello World',
        },
      });
    });

    test('should include additional options', () => {
      const result = utils.createRichText('Hello', { link: { url: 'https://example.com' } });
      expect(result.text.link).toEqual({ url: 'https://example.com' });
    });
  });

  describe('formatFileSize', () => {
    test('should format bytes', () => {
      expect(utils.formatFileSize(0)).toBe('0 Bytes');
      expect(utils.formatFileSize(1024)).toBe('1 KB');
      expect(utils.formatFileSize(1024 * 1024)).toBe('1 MB');
    });
  });

  describe('validateEnvVar', () => {
    test('should validate environment variable', () => {
      process.env.TEST_VAR = 'value';
      expect(utils.validateEnvVar('TEST_VAR')).toBe(true);

      process.env.TEST_VAR = '';
      expect(utils.validateEnvVar('TEST_VAR')).toBe(false);

      delete process.env.TEST_VAR;
      expect(utils.validateEnvVar('TEST_VAR')).toBe(false);
    });
  });
});
