const Command = require('../../../Core/Structures/Command');
const { RichEmbed, version } = require('discord.js');

class About extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      aliases: ['homer'],
      category: 1,
    });
  }

  async run(ctx) {
    const embed = new RichEmbed()
      .setDescription(ctx.__('about.embed.description', {
        name: this.client.user.username,
        node: process.version,
        discord: version,
        defaultPrefix: this.client.config.discord.defaultPrefixes[0],
      }))
      .addField(ctx.__('about.embed.stats.title'), ctx.__('about.embed.stats.value'))
      .setFooter(ctx.__('about.embed.footer'))
      .setTimestamp(this.client.initiated)
      .setColor(ctx.guild.me.highestRole.hexColor);

    ctx.channel.send(ctx.__('about.title', {
      name: this.client.user.username,
    }), { embed });
  }
}

module.exports = About;
