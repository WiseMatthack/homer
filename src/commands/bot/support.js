const Command = require('../../structures/Command');

class SupportCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'support',
      category: 'bot',
      dm: true,
    });
  }

  async execute(context) {
    const invite = `https://discord.gg/${this.client.config.misc.supportInvite}`;
    context.reply(context.__(
      'support.main',
      { invite },
    ));
  }
}

module.exports = SupportCommand;
