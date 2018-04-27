const Command = require('../../../Core/Structures/Command');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      category: 'owner',
      private: true,
    });
  }

  async run(ctx) {
    const msg = await ctx.channel.send('🚸 Reloading commands...');

    try {
      this.client.commands.gps.clear();
      await this.client.commands._map();

      msg.edit('🚸 Reloaded commands list!');
    } catch (e) {
      msg.edit(e, { code: 'js' });
    }
  }
}

module.exports = Reload;
