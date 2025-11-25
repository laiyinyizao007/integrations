#!/usr/bin/env node

const DailySummaryAI = require('../src/ai/daily-summary-ai');
const NoteAggregationAI = require('../src/ai/note-aggregation-ai');
const TaskExtractionAI = require('../src/ai/task-extraction-ai');
const TaskAnalyzerAI = require('../src/ai/task-analyzer-ai');
const Logger = require('../src/utils/logger');

/**
 * AI 增强工作流主控制器
 */
class AIWorkflowRunner {
  constructor() {
    this.dailySummaryAI = new DailySummaryAI();
    this.noteAggregationAI = new NoteAggregationAI();
    this.taskExtractionAI = new TaskExtractionAI();
    this.taskAnalyzerAI = new TaskAnalyzerAI();
  }

  /**
   * 运行完整的 AI 工作流
   */
  async run() {
    Logger.section('🤖 AI 增强工作流启动');

    try {
      // 阶段 1: 生成每日总结
      Logger.log('\n📊 阶段 1/4：生成每日总结');
      const dailySummary = await this.dailySummaryAI.generate();

      if (!dailySummary) {
        Logger.warning('今日暂无笔记，跳过后续处理');
        return;
      }

      Logger.success('每日总结已生成');

      // 延迟避免 API 速率限制
      await this.delay(2000);

      // 阶段 2: 笔记聚合
      Logger.log('\n🔗 阶段 2/4：智能笔记聚合');
      const aggregatedNotes = await this.noteAggregationAI.aggregate(
        dailySummary.summary
      );

      Logger.success(`笔记聚合完成，生成 ${aggregatedNotes.length} 条结构化笔记`);

      // 延迟避免 API 速率限制
      await this.delay(2000);

      // 阶段 3: 任务提取
      Logger.log('\n✅ 阶段 3/4：自动任务提取');
      const extractedTasks = await this.taskExtractionAI.extract();

      Logger.success(`任务提取完成，发现 ${extractedTasks.length} 个任务`);

      if (extractedTasks.length === 0) {
        Logger.info('今日无新任务，工作流完成');
        return;
      }

      // 延迟避免 API 速率限制
      await this.delay(2000);

      // 阶段 4: 任务分析
      Logger.log('\n🎯 阶段 4/4：任务优先级分析');
      const analyzedTasks = await this.taskAnalyzerAI.analyzeAll();

      Logger.success(`任务分析完成，已分析 ${analyzedTasks.length} 个任务`);

      // 工作流总结
      this.printSummary({
        dailySummary,
        aggregatedNotes,
        extractedTasks,
        analyzedTasks,
      });

      Logger.success('\n🎉 AI 增强工作流执行完成！');
    } catch (error) {
      Logger.error(`\n❌ 工作流执行失败: ${error.message}`);
      if (process.env.DEBUG === 'true') {
        console.error(error);
      }
      process.exit(1);
    }
  }

  /**
   * 打印工作流总结
   */
  printSummary(results) {
    Logger.section('📈 工作流执行总结');

    Logger.log(`📅 每日总结: ${results.dailySummary.pageId}`);
    Logger.log(`📝 聚合笔记: ${results.aggregatedNotes.length} 条`);
    Logger.log(`✅ 提取任务: ${results.extractedTasks.length} 个`);
    Logger.log(`🎯 分析任务: ${results.analyzedTasks.length} 个`);

    if (results.dailySummary.summary) {
      Logger.log(`\n✨ 今日总结: ${results.dailySummary.summary.daily_summary}`);

      if (results.dailySummary.summary.daily_mantra) {
        Logger.log(`\n💭 今日金句: ${results.dailySummary.summary.daily_mantra}`);
      }
    }
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// 运行工作流
if (require.main === module) {
  const runner = new AIWorkflowRunner();
  runner.run();
}

module.exports = AIWorkflowRunner;
