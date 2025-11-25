#!/usr/bin/env node

const NoteAggregationAI = require('../src/ai/note-aggregation-ai');
const Logger = require('../src/utils/logger');

// 处理 Inbox
if (require.main === module) {
  Logger.section('AI Inbox 处理');

  const noteAgg = new NoteAggregationAI();
  noteAgg
    .aggregate()
    .then((results) => {
      Logger.success(`处理完成，生成 ${results.length} 条笔记`);
    })
    .catch((error) => {
      Logger.error(error.message);
      process.exit(1);
    });
}
