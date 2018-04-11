const Command = require('../../../Core/Structures/Command');
const { RichEmbed, version } = require('discord.js');

class About extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      aliases: ['info'],
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
        voteURL: `https://discordbots.org/bot/${this.client.user.id}/vote`,
      }))
      .setFooter(ctx.__('about.embed.footer', { prefix: this.client.config.discord.defaultPrefixes[0] }))
      .setTimestamp(this.client.initiated)
      .setThumbnail(this.client.user.displayAvatarURL)
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send({ embed });
  }
}

module.exports = About;
