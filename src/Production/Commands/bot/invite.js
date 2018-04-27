const Command = require('../../../Core/Structures/Command');

class Invite extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      category: 'bot',
    });
  }

  async run(ctx) {
    ctx.channel.send(ctx.__('invite.invite', {
      link: await this.client.generateInvite(),
    }));
  }
}

module.exports = Invite;
