const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

const validActions = [
  'CHANNEL_CREATE',
  'CHANNEL_DELETE',
  'CHANNEL_OVERWRITE_CREATE',
  'CHANNEL_OVERWRITE_DELETE',
  'CHANNEL_OVERWRITE_UPDATE',
  'CHANNEL_UPDATE',
  'EMOJI_CREATE',
  'EMOJI_DELETE',
  'EMOJI_UPDATE',
  'GUILD_UPDATE',
  'INVITE_CREATE',
  'INVITE_DELETE',
  'INVITE_UPDATE',
  'MEMBER_BAN_ADD',
  'MEMBER_BAN_REMOVE',
  'MEMBER_KICK',
  'MEMBER_PRUNE',
  'MEMBER_ROLE_UPDATE',
  'MEMBER_UPDATE',
  'MESSAGE_DELETE',
  'ROLE_CREATE',
  'ROLE_DELETE',
  'ROLE_UPDATE',
  'WEBHOOK_CREATE',
  'WEBHOOK_DELETE',
  'WEBHOOK_UPDATE',
];

class Audit extends Command {
  constructor(client) {
    super(client, {
      name: 'audit',
      aliases: ['auditlogs'],
      userPermissions: ['VIEW_AUDIT_LOG'],
      category: 'moderation',
    });
  }

  async run(ctx) {
    const action = ctx.args[0];
    const args = ctx.args.slice(1).join(' ');

    let auditLogs = await ctx.guild.fetchAuditLogs().then(audit => audit.entries);
    if (action === 'action') {
      if (!validActions.includes(args)) return ctx.channel.send(ctx.__('audit.error.invalidAuditAction', {
        errorIcon: this.client.constants.statusEmotes.error,
        validActions: validActions.map(action => `\`${action}\``).join(', '),
        action: args,
      }));

      auditLogs = auditLogs.filter(entry => entry.action === args);
    } else if (action === 'user') {
      let { member } = ctx;
      if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
      else if (args) {
        const members = this.client.finder.findMembers(args, ctx.guild.id);
        if (members.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
        else if (members.size > 1) return ctx.channel.send(this.client.finder.formatMembers(
          members,
          ctx.settings.data.misc.locale,
        ));
        member = members.first();
      }

      auditLogs = auditLogs.filter(entry => entry.user.id === member.id);
    }

    auditLogs = auditLogs.first(5);
    if (auditLogs.size === 0) return ctx.channel.send(ctx.__('audit.error.noEntry', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const embed = new RichEmbed()
      .setColor(ctx.guild.me.displayHexColor === '#000000' ? undefined : ctx.guild.me.displayHexColor);

    auditLogs.forEach((entry) => {
      const emoji = this.client.emojis.find('name', `AUDIT_${entry.action}`);
      embed.addField(
        `${emoji ? emoji.toString() : undefined} ${ctx.__(`audit.action.${entry.action}`)}`,
        ctx.__('audit.entry', {
          executor: `${entry.executor.tag} (ID:${entry.executor.id})`,
          target: entry.extra ? `${entry.extra.toString()} (ID:${entry.extra.id})` : ctx.__('global.none'),
          reason: entry.reason || ctx.__('global.none'),
          date: mtz(entry.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`)
        }),
      );
    });

    ctx.channel.send(ctx.__('audit.title', {
      emoji: this.client.constants.auditEmoji,
    }), { embed });
  }
}

module.exports = Audit;
