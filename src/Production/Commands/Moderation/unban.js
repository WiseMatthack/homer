const Command = require('../../../Core/Structures/Command');

class Unban extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      botPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      category: 5,
    });
  }

  async run(ctx) {
    const search = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ') || ctx.__('moderation.common.noReason');

    if (!search) return ctx.channel.send(ctx.__('unban.error.noSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const banList = await ctx.guild.fetchBans();
    const targetUser = banList.find(ban => ban.tag.toLowerCase().includes(search.toLowerCase()) || ban.id === search);
    if (!targetUser) return ctx.channel.send(ctx.__('unban.error.noUser', {
      errorIcon: this.client.constants.statusEmotes.error,
      search,
    }));

    const auditEntry = await ctx.guild.fetchAuditLogs().then(audit => audit.entries.find(entry => entry.targetType === 'USER' && entry.target.id === targetUser.id && entry.action === 'MEMBER_BAN_ADD'));
    ctx.guild.unban(targetUser.id, `${ctx.author.tag}: ${reason}`)
      .then(() => {
        this.client.moderation.registerCase(ctx.guild.id, 4, ctx.author.id, targetUser.id, reason, { originalReason: (auditEntry && auditEntry.reason) ? auditEntry.reason : ctx.__('global.unknown') });
        ctx.channel.send(ctx.__('unban.success', {
          successIcon: this.client.constants.statusEmotes.success,
          tag: targetUser.tag,
        }));
      })
      .catch(error => ctx.channel.send(ctx.__('unban.error', {
        errorIcon: this.client.constants.statusEmotes.error,
        error,
      })));
  }
}

module.exports = Unban;
