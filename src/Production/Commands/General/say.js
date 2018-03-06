const Command = require('../../../Core/Structures/Command');

class Say extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['repeat'],
      category: 2,
    });
  }

  async run(ctx) {
    const text = ctx.args.join(' ');
    if (!text || text.length > 1024) return ctx.channel.send(ctx.__('say.text_invalid', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.mentions.users.size > 0
      || ctx.content.includes('@everyone')
      || ctx.content.includes('@here')) return ctx.channel.send(ctx.__('say.no_mention', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    ctx.channel.send(text);
  }
}

module.exports = Say;
