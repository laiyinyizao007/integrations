const chalk = require('chalk');

class Logger {
  static info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  static success(message) {
    console.log(chalk.green('✓'), message);
  }

  static error(message) {
    console.log(chalk.red('✗'), message);
  }

  static warning(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  static log(message) {
    console.log(message);
  }

  static section(title) {
    console.log('\n' + chalk.bold.cyan(`═══ ${title} ═══`) + '\n');
  }
}

module.exports = Logger;
