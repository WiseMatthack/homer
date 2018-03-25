const Command = require('../../../Core/Structures/Command');

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: ['BAN_MEMBERS'],
      category: 5,
    });
  }

  async run(ctx) {
    await ctx.guild.fetchMembers();

    const search = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ') || ctx.__('moderation.common.noReason');

    if (!search) return ctx.channel.send(ctx.__('ban.error.noSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const targetMember = ctx.mentions.members.first() || ctx.guild.members.get(search) || null;
    if (!targetMember) return ctx.channel.send(ctx.__('ban.error.noMember', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (!this.client.moderation.canInteract(ctx.member, targetMember, ctx.guild.me)) return ctx.channel.send(ctx.__('moderation.common.cannotInteract', {
      errorIcon: this.client.constants.statusEmotes.error,
      tag: targetMember.user.tag,
    }));

    targetMember.ban({
      days: 7,
      reason: `${ctx.author.tag}: ${reason}`,
    })
      .then(() => {
        this.client.moderation.registerCase(
          ctx.guild.id,
          1,
          ctx.author.id,
          targetMember.id,
          reason,
        );
        ctx.channel.send(ctx.__('ban.success', {
          successIcon: this.client.constants.statusEmotes.success,
          tag: targetMember.user.tag,
        }));
      })
      .catch(error => ctx.channel.send(ctx.__('ban.error', {
        error,
      })));
  }
}

module.exports = Ban;
