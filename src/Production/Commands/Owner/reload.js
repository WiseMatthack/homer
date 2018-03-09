const Command = require('../../../Core/Structures/Command');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      category: 0,
      private: true,
    });
  }

  async run(ctx) {
    const msg = await ctx.channel.send('🚸 Reloading commands...');

    try {
      this.client.commands.gps.clear();
      await this.client.commands._map();

      ctx.channel.send('🚸 Reloaded commands list!');
    } catch (e) {
      ctx.channel.send(e, { code: 'js' });
    }
  }
}

module.exports = Reload;
