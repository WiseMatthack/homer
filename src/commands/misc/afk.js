const Command = require('../../structures/Command');

class AfkCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      category: 'misc',
      usage: '[message]',
      dm: true,
    });
  }

  async execute(context) {
    const message = context.args.join(' ');
    if (message && message.length > 256) return context.replyError(context.__('afk.messageTooLong'));

    await this.client.database.insertDocument('afk', {
      id: context.message.author.id,
      time: Date.now(),
      message,
    }, { conflict: 'update' });
    context.reply(context.__('afk.gone'));
  }
}

module.exports = AfkCommand;
