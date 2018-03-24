const Command = require('../../../Core/Structures/Command');

class Ignore extends Command {
  constructor(client) {
    super(client, {
      name: 'ignore',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'list') {
      const list = ctx.settings.data.ignoredChannels.map(id => `<#${id}>`).join(' - ') || ctx.__('global.none');
      ctx.channel.send(ctx.__('ignore.list', {
        list,
      }));
    } else {
      let { channel } = ctx;
      const search = ctx.args.join(' ');
      if (search) {
        const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
        if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noFound', { errorIcon: this.client.constants.statusEmotes.error, search }));
        channel = channels.first();
      }

      const index = ctx.settings.data.ignoredChannels.findIndex(c => c === channel.id);
      if (index > -1) {
        ctx.settings.data.ignoredChannels.splice(index, 1);
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('ignore.unignored', {
          successIcon: this.client.constants.statusEmotes.success,
          channel: channel.id,
        }));
      } else {
        ctx.settings.data.ignoredChannels.push(channel.id);
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('ignore.ignored', {
          successIcon: this.client.constants.statusEmotes.success,
          channel: channel.id,
        }));
      }
    }
  }
}

module.exports = Ignore;
