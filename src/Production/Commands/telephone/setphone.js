const Command = require('../../../Core/Structures/Command');

class Telephone extends Command {
  constructor(client) {
    super(client, {
      name: 'setphone',
      aliases: ['phonechannel'],
      userPermissions: ['MANAGE_GUILD'],
      category: 'telephone',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'clear') {
      if (!ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('setphone.error.noChannel', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      ctx.settings.data.phone.channel = null;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('setphone.channelCleared', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    } else {
      let { channel } = ctx;
      const search = ctx.args.join(' ');
      if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
      else if (search) {
        const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
        if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noFound', { errorIcon: this.client.constants.statusEmotes.error, search }));
        channel = channels.first();
      }

      if (!channel.permissionsFor(ctx.guild.me).has('VIEW_CHANNEL')) return ctx.channel.send(ctx.__('setphone.error.noViewPermission', {
        errorIcon: this.client.constants.statusEmotes.error,
        channel: channel.id,
      }));

      ctx.settings.data.phone.channel = channel.id;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('setphone.channelSet', {
        successIcon: this.client.constants.statusEmotes.success,
        channel: channel.id,
      }));
    }
  }
}

module.exports = Telephone;
