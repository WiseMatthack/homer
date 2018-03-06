const Command = require('../../../Core/Structures/Command');
const { inspect } = require('util');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      category: 0,
      private: true,
    });
  }

  async run(ctx) {
    const code = ctx.args.join(' ');
    try {
      let evaled = eval(code);
      if (typeof evaled !== 'string') evaled = inspect(evaled);
      ctx.channel.send(evaled, { code: 'js' })
        .catch(e => ctx.channel.send(e, { code: 'js' }));
    } catch (e) {
      ctx.channel.send(e, { code: 'js' });
    }
  }
}

module.exports = Eval;
