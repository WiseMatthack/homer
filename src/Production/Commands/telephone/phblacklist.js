const Command = require('../../../Core/Structures/Command');

class PhBlacklist extends Command {
  constructor(client) {
    super(client, {
      name: 'phblacklist',
      userPermissions: ['MANAGE_GUILD'],
      category: 'telephone',
    });
  }
  
  async run(ctx) {
    const number = ctx.args[0];
    if (!number) return ctx.channel.send(ctx.__('phblacklist.error.noNumber', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const foundGuild = await this.client.database.provider
      .table('guild')
      .filter({ phone: { number } })
      .run()
      .then(res => res[0]);

    if (!foundGuild) return ctx.channel.send(ctx.__('phblacklist.error.noGuild', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.settings.data.phone.blacklist.includes(foundGuild.id)) {
      ctx.settings.data.phone.blacklist.splice(
        ctx.settings.data.phone.blacklist.indexOf(foundGuild.id),
        1,
      );
      await ctx.settings.saveData();
      ctx.channel.send(ctx.__('phblacklist.removed', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    } else {
      ctx.settings.data.phone.blacklist.push(foundGuild.id);
      await ctx.settings.saveData();
      ctx.channel.send(ctx.__('phblacklist.added', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    }
  }
}
  
module.exports = PhBlacklist;
