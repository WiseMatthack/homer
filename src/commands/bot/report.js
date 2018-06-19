const Command = require('../../structures/Command');

class ReportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'report',
      aliases: ['feedback'],
      usage: '<message>',
      category: 'bot',
      dm: true,
    });
  }

  async execute(context) {
    const message = context.args.join(' ');
    if (!message) return context.replyError(context.__('report.noMessage'));

    await this.client.database.insertDocument(
      'reports',
      {
        author: context.message.author.id,
        time: Date.now(),
        message,
      },
    );

    context.replySuccess(context.__('report.success'));
  }
}

module.exports = ReportCommand;
