#!/usr/bin/env node

const DailySummaryAI = require('../src/ai/daily-summary-ai');

// 运行每日总结
if (require.main === module) {
  const dailySummary = new DailySummaryAI();
  dailySummary.generate().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
