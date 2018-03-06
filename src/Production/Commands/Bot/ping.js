const Command = require('../../../Core/Structures/Command');

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      aliases: ['pong', 'peng', 'pung'],
      category: 1,
    });
  }

  async run(ctx) {
    const time = Date.now();

    const msg = await ctx.channel.send(ctx.__('ping.ping'));
    msg.edit(ctx.__('ping.pong', {
      api: Math.round(this.client.ping),
      local: (Date.now() - time),
    }));
  }
}

module.exports = Ping;
