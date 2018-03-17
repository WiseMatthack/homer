const Command = require('../../../Core/Structures/Command');

class Feed extends Command {
  constructor(client) {
    super(client, {
      name: 'feed',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'list') {
      if (ctx.settings.data.moderation.channels.length === 0) return ctx.channel.send(ctx.__('feed.list.noFeed', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const message = ctx.settings.data.moderation.channels.map(f => ctx.__('feed.list.entry', { id: f.id, type: f.type })).join('\n');
      ctx.channel.send(ctx.__('feed.list.msg', {
        name: ctx.guild.id,
        list: message,
      }));
    } else if (ctx.args[0] === 'remove') {
      let channel = ctx.channel;
      const search = ctx.args.slice(1).join(' ');
      if (search) {
        const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
        if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noFound', { errorIcon: this.client.constants.statusEmotes.error, search }));
        channel = channels.first();
      }

      const feed = ctx.settings.data.moderation.channels.find(f => f.id === channel.id);
      if (!feed) return ctx.channel.send(ctx.__('feed.remove.notFound', {
        errorIcon: this.client.constants.statusEmotes.error,
        channel: channel.id,
      }));

      ctx.settings.data.moderation.channels.splice(ctx.settings.data.moderation.channels.indexOf(feed), 1);
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('feed.remove.removed', {
        successIcon: this.client.constants.statusEmotes.success,
        channel: channel.id,
      }));
    } else {
      const type = ctx.args[1];
      if (!type) return ctx.channel.send(ctx.__('feed.noType', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      let channel = ctx.channel;
      const search = ctx.args.slice(2).join(' ');
      if (search) {
        const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
        if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noFound', { errorIcon: this.client.constants.statusEmotes.error, search }));
        channel = channels.first();
      }

      if (ctx.settings.data.moderation.channels.find(f => f.id === channel.id)) return ctx.channel.send(ctx.__('feed.tooManyFeeds', {
        errorIcon: this.client.constants.statusEmotes.error,
        channel: channel.id,
      }));

      ctx.settings.data.moderation.channels.push({
        id: channel.id,
        type,
      });
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('feed.added', {
        successIcon: this.client.constants.statusEmotes.success,
        channel: channel.id,
      }));
    }
  }
}

module.exports = Feed;
