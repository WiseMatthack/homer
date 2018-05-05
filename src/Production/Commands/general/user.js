const Command = require('../../../Core/Structures/Command');
const moment = require('moment');
const mtz = require('moment-timezone');
const { RichEmbed } = require('discord.js');

class User extends Command {
  constructor(client) {
    super(client, {
      name: 'user',
      aliases: ['info', 'member', 'userinfo', 'i'],
      category: 'general',
    });
  }

  async run(ctx) {
    await ctx.guild.fetchMembers();

    let { member } = ctx;
    const search = ctx.args.join(' ');
    if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
    else if (search) {
      const members = this.client.finder.findMembers(search, ctx.guild.id);
      if (members.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
      else if (members.size > 1) return ctx.channel.send(this.client.finder.formatMembers(
        members,
        ctx.settings.data.misc.locale,
      ));
      member = members.first();
    }

    const emote = member.user.bot ? '<:bot:420699407344730122>' : '👤';
    const premium = (member.user.avatar && member.user.avatar.startsWith('a_')) ? ctx.__('global.yes') : ctx.__('global.no');

    const sortedRoles = (member.roles
      .filter(r => r.id !== ctx.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r.toString())
      .join(', ')) || ctx.__('global.none');

    const arrayMembers = ctx.guild.members
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .array();
    const thisIndex = arrayMembers.findIndex(m => m.id === member.id);

    let joinOrder;
    switch (thisIndex) {
      case 0:
        joinOrder = `**${arrayMembers[thisIndex].user.username}** > ${arrayMembers[thisIndex + 1].user.username} > ${arrayMembers[thisIndex + 2].user.username} > ${arrayMembers[thisIndex + 3].user.username} > ${arrayMembers[thisIndex + 4].user.username}`;
        break;
      case 1:
        joinOrder = `${arrayMembers[thisIndex - 1].user.username} > **${arrayMembers[thisIndex].user.username}** > ${arrayMembers[thisIndex + 1].user.username} > ${arrayMembers[thisIndex + 2].user.username} > ${arrayMembers[thisIndex + 3].user.username}`;
        break;
      case (ctx.guild.memberCount - 1):
        joinOrder = `${arrayMembers[thisIndex - 4].user.username} > ${arrayMembers[thisIndex - 3].user.username} > ${arrayMembers[thisIndex - 2].user.username} > ${arrayMembers[thisIndex - 1].user.username} > **${arrayMembers[thisIndex].user.username}**`;
        break;
      case (ctx.guild.memberCount - 2):
        joinOrder = `${arrayMembers[thisIndex - 3].user.username} > ${arrayMembers[thisIndex - 2].user.username} > ${arrayMembers[thisIndex - 1].user.username} > **${arrayMembers[thisIndex].user.username}** > ${arrayMembers[thisIndex + 1].user.username}`;
        break;
      default:
        joinOrder = `${arrayMembers[thisIndex - 2].user.username} > ${arrayMembers[thisIndex - 1].user.username} > **${arrayMembers[thisIndex].user.username}** > ${arrayMembers[thisIndex + 1].user.username} > ${arrayMembers[thisIndex + 2].user.username}`;
        break;
    }

    const lastactiveObject = await this.client.database.getDocument('lastactive', member.id);
    const lastactiveStatus = (lastactiveObject && lastactiveObject.time) ? moment(lastactiveObject.time).locale(ctx.settings.data.misc.locale.split('-')[0]).fromNow() : ctx.__('global.unknown');
    
    let presence = `${this.client.emojis.get(this.client.constants.presenceIcons[member.user.presence.status]).toString()} ${ctx.__(`presence.${member.user.presence.status}`)}`;
    if (member.user.presence.game) {
      presence += `\n${ctx.__(`user.gameTypes.${member.user.presence.game.type}`)} ${member.user.presence.game.url ? `[${member.user.presence.game.name}](${member.user.presence.game.url})` : `**${member.user.presence.game.name}**`}`;
    }
    
    const afkObject = await this.client.absence.getAbsence(member.id);
    const afkStatus = afkObject ? ctx.__('user.afk.status', {
      reason: afkObject.reason,
      since: mtz(afkObject.time).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`),
    }) : ctx.__('global.no');

    const embed = new RichEmbed()
      .addField(ctx.__('user.embed.id'), member.id, true)
      .addField(ctx.__('user.embed.nickname'), member.nickname ? member.nickname : ctx.__('global.none'), true)
      .addField(ctx.__('user.embed.presence'), presence, true)
      .addField(ctx.__('user.embed.nitro', { nitroIcon: this.client.emojis.get(this.client.constants.nitroIcon).toString() }), premium, true)
      .addField(ctx.__('user.embed.roles'), sortedRoles)
      .addField(ctx.__('user.embed.joinorder', { index: (thisIndex + 1) }), joinOrder)
      .addField(ctx.__('user.embed.lastactive'), this.capitalizeFirstLetter(lastactiveStatus), true)
      .addField(ctx.__('user.embed.afk'), afkStatus, true)
      .addField(ctx.__('user.embed.creation'), mtz(member.user.createdTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`), true)
      .addField(ctx.__('user.embed.join'), mtz(member.joinedTimestamp).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`), true)
      .setColor(ctx.guild.me.displayHexColor)
      .setThumbnail(member.user.displayAvatarURL);

    ctx.channel.send(ctx.__('user.title', { emote, name: member.user.tag }), { embed });
  }

  /**
   * Capitalize the first letter of a string and returns it.
   * @param {String} text String to process
   * @returns {String}
   */
  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

module.exports = User;
