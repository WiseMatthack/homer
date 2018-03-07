const Command = require('../../../Core/Structures/Command');

class Telephone extends Command {
  constructor(client) {
    super(client, {
      name: 'telephone',
      category: 5,
    });
  }

  async run(ctx) {
    ctx.settings.data.phone.channel = ctx.channel.id;
    await ctx.settings.saveData();

    ctx.channel.send(ctx.__('telephone.channelSet', { channel: ctx.channel.id }));
  }
}

module.exports = Telephone;
