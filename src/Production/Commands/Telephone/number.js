const Command = require('../../../Core/Structures/Command');

class Number extends Command {
  constructor(client) {
    super(client, {
      name: 'number',
      category: 5,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'reset') {
      const newNumber = ctx.settings.generateNumber();
      ctx.channel.send(ctx.__('number.reset.done', { number: newNumber }));
    } else {
      const number = ctx.settings.data.phone.number || ctx.settings.generateNumber();
      ctx.channel.send(ctx.__('number.is', { number }));
    }
  }
}

module.exports = Number;
