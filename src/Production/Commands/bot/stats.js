const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Stats extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      category: 'bot',
    });
  }

  async run(ctx) {
    const guildDatabase = await this.client.database.getDocuments('guild');
    const numbers = guildDatabase.filter(g => g.phone.number).length;

    const embed = new RichEmbed()
      .setDescription(ctx.__('stats.embed.description', {
        guilds: this.client.guilds.size,
        users: this.client.users.size,
        uptime: mtz(this.client.initiated.getTime())
          .locale(ctx.settings.data.misc.locale)
          .fromNow(true),
        ram: Math.floor(process.memoryUsage().rss / 1000000),
        activeNumbers: numbers,
      }))
      .setFooter(ctx.__('stats.embed.footer', { prefix: this.client.config.discord.defaultPrefixes[0] }))
      .setThumbnail(this.client.user.displayAvatarURL)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('stats.title'), { embed });
  }
}

module.exports = Stats;
