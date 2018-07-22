const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class ServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'server',
      aliases: ['guild', 'serverinfo'],
      category: 'general',
    });
  }

  async execute(context) {
    const guild = context.message.guild;
    const guildOwner = await this.client.fetchUser(guild.ownerID);
    const defaultMessageNotification = await this.client.rest.makeRequest('get', `/guilds/${context.message.guild.id}`, true).then(a => a.default_message_notifications);

    const channels = [
      `**${context.message.guild.channels.filter(c => c.type === 'text').size}** ${context.__('channel.type.text')}`,
      `**${context.message.guild.channels.filter(c => c.type === 'voice').size}** ${context.__('channel.type.voice')}`,
    ].join(', ');

    const members = [
      `${this.client.constants.status.online} **${guild.members.filter(m => m.user.presence.status === 'online').size}**`,
      `${this.client.constants.status.idle} **${guild.members.filter(m => m.user.presence.status === 'idle').size}**`,
      `${this.client.constants.status.dnd} **${guild.members.filter(m => m.user.presence.status === 'dnd').size}**`,
      `${this.client.constants.status.offline} **${guild.members.filter(m => m.user.presence.status === 'offline').size}**`,
      `${this.client.constants.emotes.botIcon} **${guild.members.filter(m => m.user.bot).size}**`,
    ];

    const serverInformation = [
      `${this.dot} ${context.__('server.embed.id')}: **${guild.id}**${guild.features.includes('VERIFIED') ? ` ${this.client.constants.emotes.verifiedServer}` : ''}`,
      `${this.dot} ${context.__('server.embed.owner')}: **${guildOwner.username}**#${guildOwner.discriminator} (ID:${guild.ownerID})`,
      `${this.dot} ${context.__('server.embed.region')}: ${this.client.constants.regionFlags[guild.region]} **${context.__(`server.region.${guild.region}`)}**`,
      `${this.dot} ${context.__('server.embed.members')}: ${members.join(' - ')}`,
      `${this.dot} ${context.__('server.embed.channels')}: ${channels}`,
      `${this.dot} ${context.__('server.embed.verificationLevel')}: **${context.__(`server.verificationLevel.${guild.verificationLevel}`)}**`,
      `${this.dot} ${context.__('server.embed.explicitContentFilter')}: **${context.__(`server.explicitContentFilter.${guild.explicitContentFilter}`)}**`,
      `${this.dot} ${context.__('server.embed.defaultMessageNotifications')}: **${context.__(`server.defaultMessageNotifications.${defaultMessageNotification}`)}**`,
      `${this.dot} ${context.__('server.embed.creation')}: **${context.formatDate(guild.createdTimestamp)}**`,
    ].join('\n');

    const embed = new RichEmbed()
      .setDescription(serverInformation)
      .setThumbnail(guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : undefined)
      .setImage(guild.splash ? `https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png?size=512` : undefined);

    context.reply(
      context.__('server.title', {
        name: guild.name,
      }),
      { embed },
    );
  }

  getDefaultAvatar(discriminator) {
    const defaultAvatarID = discriminator % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarID}.png`;
  }
}

module.exports = ServerCommand;
