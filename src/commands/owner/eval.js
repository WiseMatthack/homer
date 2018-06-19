const Command = require('../../structures/Command');
const { inspect } = require('util');

class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      category: 'owner',
      dm: true,
      hidden: true,
      private: true,
    });
  }

  async execute(context) {
    const code = context.args.join(' ');

    try {
      let evaled = await eval(code);
      if (typeof evaled !== 'string') evaled = inspect(evaled);
      evaled = evaled.replace(new RegExp(this.client.token, 'g'), 'TOKEN_LEAK_PROTECTION');
      context.reply(evaled, { code: 'js' })
        .catch(e => context.reply(e, { code: 'js' }));
    } catch (e) {
      context.reply(e.stack, { code: 'js' });
    }
  }
}

module.exports = EvalCommand;
