const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');

class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      category: 'settings',
      children: [new ResetSubcommand(client)],
      userPermissions: ['MANAGE_GUILD'],
      dm: true,
    });
  }

  async execute(context) {
    const embed = new RichEmbed()
      .setDescription([
        `${this.dot} ${context.__('settings.embed.locale')}: ${context.__('lang.flag')} **${context.__('lang.name')}** (\`${context.__('lang.code')}\`)`,
        `${this.dot} ${context.__('settings.embed.timezone')}: **${context.settings.misc.timezone}**`,
        `${this.dot} ${context.__('settings.embed.dateFormat')}: **${context.settings.misc.dateFormat}**`,
        `${this.dot} ${context.__('settings.embed.timeFormat')}: **${context.settings.misc.timeFormat}**`,
      ].join('\n'))
      .setFooter(context.__('settings.embed.footer', { command: `${this.client.prefix}settings reset` }));

    context.reply(
      context.__('settings.title', { name: context.message.guild ? `**${context.message.guild.name}**` : `**${context.message.author.username}**#${context.message.author.discriminator}` }),
      { embed },
    );
  }
}

class ResetSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reset',
      category: 'settings',
      userPermissions: ['MANAGE_GUILD'],
      botPermissions: ['ADD_REACTIONS'],
      dm: true,
    });
  }

  get emotes() {
    return [
      this.client.constants.emotes.successID,
      this.client.constants.emotes.errorID,
    ];
  }

  async execute(context) {
    const message = await context.replyWarning(context.__('settings.reset.awaitReaction'));

    for (const emote of this.emotes) {
      await message.react(emote);
    }

    message.awaitReactions(
      (reaction, user) => this.emotes.includes(reaction.emoji.identifier) && (user.id === context.message.author.id),
      {
        max: 1,
      },
    )
      .then(async (reactions) => {
        if (reactions.first().emoji.identifier === this.emotes[0]) {
          await this.client.database.deleteDocument('settings', context.message.guild ? context.message.guild.id : context.message.author.id);
          message.edit(`${this.client.constants.emotes.success} ${context.__('settings.reset.deleted')}`);
          message.clearReactions();
        } else {
          message.edit(`${this.client.constants.emotes.success} ${context.__('settings.reset.cancelled')}`);
          message.clearReactions();
        }
      });
  }
}

module.exports = SettingsCommand;
