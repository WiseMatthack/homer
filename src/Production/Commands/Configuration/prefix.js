const Command = require('../../../Core/Structures/Command');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    const prefix = ctx.args[0];
    if (!prefix) return ctx.channel.send(ctx.__('prefix.invalidPrefix', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const index = ctx.settings.data.misc.customPrefixes.findIndex(p => p === prefix);
    if (index > -1) {
      ctx.settings.data.misc.customPrefixes.splice(index, 1);
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('prefix.removed', {
        succesIcon: this.client.constants.statusEmotes.success,
        prefix,
      }));
    } else {
      if (ctx.settings.data.misc.customPrefixes.length === 10) return ctx.channel.send(ctx.__('prefix.tooMany', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      ctx.settings.data.misc.customPrefixes.push(prefix);
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('prefix.added', {
        succesIcon: this.client.constants.statusEmotes.success,
        prefix,
      }));
    }
  }
}

module.exports = Prefix;
