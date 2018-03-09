const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Stats extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      category: 1,
    });
  }

  async run(ctx) {
    const embed = new RichEmbed()
      .setDescription(ctx.__('stats.embed.description', {
        guilds: this.client.guilds.size,
        users: this.client.users.size,
        uptime: mtz(this.client.initiated.getTime()).locale(ctx.settings.data.misc.locale).fromNow(),
        ram: Math.floor(process.memoryUsage().rss / 100000),
      }))
      .setFooter(ctx.__('stats.embed.footer', { prefix: this.client.config.discord.defaultPrefixes[0] }))
      .setThumbnail(this.client.user.displayAvatarURL)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('stats.title'), { embed });
  }
}

module.exports = Stats;
