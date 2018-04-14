const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Server extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      aliases: ['guild', 'serverinfo', 'guildinfo'],
      category: 2,
    });
  }

  async run(ctx) {
    const explicit = ctx.__(`server.explicitContent.${ctx.guild.explicitContentFilter}`);
    const verification = ctx.__(`server.verificationLevel.${ctx.guild.verificationLevel}`);
    const owner = await ctx.guild.fetchMember(ctx.guild.ownerID);

    const embed = new RichEmbed()
      .addField(ctx.__('server.embed.id'), ctx.guild.id, true)
      .addField(ctx.__('server.embed.owner'), owner.user.tag, true)
      .addField(ctx.__('server.embed.region'), ctx.__(`server.regions.${ctx.guild.region}`), true)
      .addField(ctx.__('server.embed.members.title'), ctx.__('server.embed.members.value', {
        total: ctx.guild.memberCount,
        bots: ctx.guild.members.filter(m => m.user.bot).size,
      }), true)
      .addField(ctx.__('server.embed.verification'), verification, true)
      .addField(ctx.__('server.embed.explicit'), explicit, true)
      .addField(ctx.__('server.embed.creation'), mtz(ctx.guild.createdTimestamp)
        .tz(ctx.settings.data.misc.timezone)
        .format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`, true))
      .setColor(ctx.guild.me.displayHexColor)
      .setThumbnail(ctx.guild.iconURL || null);

    ctx.channel.send(ctx.__('server.title', {
      name: ctx.guild.name,
    }), { embed });
  }
}

module.exports = Server;
