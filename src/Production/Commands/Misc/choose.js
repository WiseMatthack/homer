const Command = require('../../../Core/Structures/Command');

class Choose extends Command {
  constructor(client) {
    super(client, {
      name: 'choose',
      aliases: ['select'],
      category: 3,
    });
  }

  async run(ctx) {
    const choices = ctx.args;

    if (choices.length < 2) return ctx.channel.send(ctx.__('choose.not_enough_choices', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const chosen = choices[Math.floor(Math.random() * choices.length)];
    ctx.channel.send(ctx.__('choose.chosen', {
      choice: chosen,
    }));
  }
}

module.exports = Choose;
