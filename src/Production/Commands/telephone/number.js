const Command = require('../../../Core/Structures/Command');

class Number extends Command {
  constructor(client) {
    super(client, {
      name: 'number',
      category: 'telephone',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'reset') {
      const newNumber = ctx.settings.generateNumber();
      ctx.channel.send(ctx.__('number.reset.done', { number: newNumber }));
    } else {
      const number = ctx.settings.data.phone.number;

      if (number) ctx.channel.send(ctx.__('number.is', { number }));
      else {
        await ctx.settings.generateNumber();
        ctx.channel.send(ctx.__('number.generated', {
          number: ctx.settings.data.phone.number,
          defaultPrefix: this.client.config.discord.defaultPrefixes[0],
        }));
      }
    }
  }
}

module.exports = Number;
