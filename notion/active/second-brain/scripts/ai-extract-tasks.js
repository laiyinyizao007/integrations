#!/usr/bin/env node

const TaskExtractionAI = require('../src/ai/task-extraction-ai');
const TaskAnalyzerAI = require('../src/ai/task-analyzer-ai');
const Logger = require('../src/utils/logger');

// 提取并分析任务
if (require.main === module) {
  (async () => {
    try {
      // 提取任务
      const extraction = new TaskExtractionAI();
      const tasks = await extraction.extract();

      if (tasks.length === 0) {
        Logger.info('未发现新任务');
        return;
      }

      // 分析任务
      Logger.log('\n开始分析任务...');
      const analyzer = new TaskAnalyzerAI();
      await analyzer.analyzeAll();

      Logger.success('任务提取和分析完成');
    } catch (error) {
      Logger.error(error.message);
      process.exit(1);
    }
  })();
}
