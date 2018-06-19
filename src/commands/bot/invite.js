const Command = require('../../structures/Command');

class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      category: 'bot',
      dm: true,
    });
  }

  async execute(context) {
    const invite = await this.client.generateInvite();
    context.reply(context.__(
      'invite.main',
      { invite },
    ));
  }
}

module.exports = InviteCommand;
