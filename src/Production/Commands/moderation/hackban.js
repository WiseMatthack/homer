const Command = require('../../../Core/Structures/Command');

class Hackban extends Command {
  constructor(client) {
    super(client, {
      name: 'hackban',
      botPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      category: 'moderation',
    });
  }

  async run(ctx) {
    const search = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ') || ctx.__('moderation.common.noReason');

    if (!search) return ctx.channel.send(ctx.__('hackban.error.noSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const targetUser = (await this.client.fetchUser(search)) || null;
    if (!targetUser) return ctx.channel.send(ctx.__('hackban.error.noUser', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.guild.members.has(targetUser.id)) return ctx.channel.send(ctx.__('hackban.error.forbidden', {
      errorIcon: this.client.constants.statusEmotes.error,
      tag: targetUser.tag,
    }));

    ctx.guild.ban(targetUser.id, {
      days: 7,
      reason: `${ctx.author.tag}: ${reason}`,
    })
      .then(() => {
        this.client.moderation.registerCase(ctx.guild.id, 3, ctx.author.id, targetUser.id, reason);
        ctx.channel.send(ctx.__('hackban.success', {
          successIcon: this.client.constants.statusEmotes.success,
          tag: targetUser.tag,
        }));
      })
      .catch(error => ctx.channel.send(ctx.__('hackban.error', {
        error,
      })));
  }
}

module.exports = Hackban;
