const Command = require('../../structures/Command');
const { RichEmbed, version } = require('discord.js');

class AboutCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      category: 'bot',
      dm: true,
    });
  }

  async execute(context) {
    const owners = [];
    for (const owner of this.client.config.owners) {
      const user = await this.client.fetchUser(owner);
      owners.push(`**${user.username}**#${user.discriminator}`);
    } 

    const aboutInformation = [
      context.__('about.embed.text'),
      '',
      `${this.dot} ${context.__('about.embed.owners')}: ${owners.join(', ')}`,
      `${this.dot} ${context.__('about.embed.versions')}: **[${this.client.user.username}](https://homer.idroid.me) 1.0.0** / **[Node.js](https://nodejs.org) ${process.version}** / **[discord.js](https://discord.js.org) v${version}**`,
      `${this.dot} ${context.__('about.embed.links')}: **[GitHub](${this.client.constants.githubLink})** / **[Discord Bot List](https://discordbots.org/bot/${this.client.user.id})**`,
    ].join('\n');

    const embed = new RichEmbed()
      .setDescription(aboutInformation)
      .setThumbnail(this.client.user.avatar ?
        `https://cdn.discordapp.com/avatars/${this.client.user.id}/${this.client.user.avatar}` :
        this.getDefaultAvatar(this.client.user.discriminator));
    
    context.reply(
      context.__('about.title', { emote: this.client.constants.emotes.bot, name: `**${this.client.user.username}**` }),
      { embed },
    );
  }

  getDefaultAvatar(discriminator) {
    const defaultAvatarID = discriminator % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarID}.png`;
  }
}

module.exports = AboutCommand;
