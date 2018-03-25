const Command = require('../../../Core/Structures/Command');
const durationParser = require('parse-duration');
const mtz = require('moment-timezone');

class Tempban extends Command {
  constructor(client) {
    super(client, {
      name: 'tempban',
      userPermissions: ['BAN_MEMBERS'],
      botPermissions: ['BAN_MEMBERS'],
      category: 5,
    });
  }

  async run(ctx) {
    await ctx.guild.fetchMembers();

    const duration = ctx.args[0];
    const search = ctx.args[1];
    const reason = ctx.args.slice(2).join(' ') || ctx.__('moderation.common.noReason');

    if (!duration) return ctx.channel.send(ctx.__('tempban.error.noDuration', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (!search) return ctx.channel.send(ctx.__('tempban.error.noSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const timeout = durationParser(duration);
    if (!timeout) return ctx.channel.send(ctx.__('tempban.error.invalidDuration', {
      errorIcon: this.client.constants.statusEmotes.error,
      duration,
    }));
    const durationMessage = mtz()
      .tz(ctx.settings.data.misc.timezone)
      .locale(ctx.settings.data.misc.locale)
      .to((Date.now() + timeout), false);

    const targetMember = ctx.mentions.members.first() || ctx.guild.members.get(search) || null;
    if (!targetMember) return ctx.channel.send(ctx.__('tempban.error.noMember', {
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
      .then(async () => {
        await this.client.moderation.registerCase(
          ctx.guild.id,
          6,
          ctx.author.id,
          targetMember.id,
          reason,
          {
            end: (Date.now() + timeout),
            finished: false,
            duration,
          },
        );

        this.client.setTimeout(
          this.client.stuffHandler.handleUnban,
          timeout,
          this.client,
          ctx.guild.id,
          targetMember.id,
        );

        ctx.channel.send(ctx.__('tempban.success', {
          successIcon: this.client.constants.statusEmotes.success,
          tag: targetMember.user.tag,
          time: durationMessage,
        }));
      })
      .catch(error => ctx.channel.send(ctx.__('tempban.error', {
        error,
      })));
  }
}

module.exports = Tempban;
