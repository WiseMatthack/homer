const Command = require('../../structures/Command');

const MENTION = /<(@|@&|@!)\d{17,20}>/g;

class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['repeat'],
      usage: '<text>',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    const text = context.args.join(' ');
    if (!text) return context.replyError(context.__('say.noText'));

    if (text.includes('@everyone') || text.includes('@here')) {
      return context.replyError(context.__('say.includesEveryone'));
    }

    if (text.match(MENTION)) {
      return context.replyError(context.__('say.includesMention'));
    }

    context.reply(text);
  }
}

module.exports = SayCommand;
