const Command = require('../../structures/Command');

class ChooseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'choose',
      aliases: ['select'],
      usage: '<choice A> <choice B> [etc]',
      category: 'misc',
      dm: true,
    });
  }

  async execute(context) {
    if (context.args.length < 2) return context.replyError(context.__('choose.insufficientChoices'));

    const chosen = context.args[Math.floor(context.args.length * Math.random())];
    context.reply(context.__('choose.chosen', { chosen }));
  }
}

module.exports = ChooseCommand;
