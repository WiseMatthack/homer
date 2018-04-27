const Command = require('../../../Core/Structures/Command');

class Support extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      category: 'bot',
    });
  }

  async run(ctx) {
    const invite = await this.client
      .guilds.get(this.client.config.support.guild)
      .channels.get(this.client.config.support.channel)
      .createInvite({
        temporary: true,
        maxAge: 30000,
        unique: true,
      });

    ctx.channel.send(ctx.__('support.support', {
      link: invite,
    }));
  }
}

module.exports = Support;
