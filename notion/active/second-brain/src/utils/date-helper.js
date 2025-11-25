const { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');
const { zhCN } = require('date-fns/locale');

class DateHelper {
  /**
   * 获取今天的日期字符串
   */
  static getToday(formatStr = 'yyyy-MM-dd') {
    return format(new Date(), formatStr, { locale: zhCN });
  }

  /**
   * 获取星期几
   */
  static getWeekday(date = new Date()) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  }

  /**
   * 获取本周的开始和结束日期
   */
  static getThisWeek() {
    const now = new Date();
    return {
      start: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      end: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    };
  }

  /**
   * 获取本月的开始和结束日期
   */
  static getThisMonth() {
    const now = new Date();
    return {
      start: format(startOfMonth(now), 'yyyy-MM-dd'),
      end: format(endOfMonth(now), 'yyyy-MM-dd'),
    };
  }

  /**
   * 获取 N 天前/后的日期
   */
  static getDateOffset(days, formatStr = 'yyyy-MM-dd') {
    return format(addDays(new Date(), days), formatStr);
  }

  /**
   * 格式化日期为中文
   */
  static formatChinese(date = new Date()) {
    return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
  }

  /**
   * 格式化为 Notion 日期格式
   */
  static toNotionDate(date = new Date()) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  }
}

module.exports = DateHelper;
