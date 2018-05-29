const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      category: 'bot',
    });
  }

  async run(ctx) {
    const IsFound = this.client.commands.getCommand(ctx.args[0]);
    let found;
    if (IsFound) found = new IsFound(this.client);

    if (IsFound && !found.private) {
      const help = require(`../../Locales/Help/${ctx.settings.data.misc.locale}.json`)[found.name];
      delete require.cache[require.resolve(`../../Locales/Help/${ctx.settings.data.misc.locale}.json`)];

      const prefix = this.client.config.discord.defaultPrefixes[0];
      const embed = new RichEmbed()
        .setDescription(ctx.__('help.command.embed.description', {
          description: help.description,
          usage: `${prefix}${help.usage}`,
          examples: help.examples ? help.examples.map(ex => `\`${prefix}${ex}\``).join(' - ') : ctx.__('global.none'),
          requiredPermissions: found.userPermissions.map(p => `\`${p}\``).join(', ') || ctx.__('global.none'),
        }))
        .setColor(ctx.guild.me.displayHexColor)
        .setFooter(ctx.__('help.command.footer'));

      ctx.channel.send(ctx.__('help.command.title', {
        name: found.name,
      }), { embed });
    } else {
      const embed = new RichEmbed()
        .setColor(ctx.guild.me.displayHexColor)
        .setFooter(ctx.__('help.global.embed.footer', {
          defaultPrefix: this.client.config.discord.defaultPrefixes[0],
        }));

      for (const category of this.client.config.discord.commandCategories) {
        if (category !== 'owner' && category !== 'aliases') {
          const commandsList = this.client.commands.gps.get(category);

          embed.addField(
            ctx.__(`help.global.category.${category}`),
            commandsList.map(cmd => `\`${cmd}\``).join(' - '),
          );
        }
      }

      ctx.channel.send(ctx.__('help.global.title'), { embed });
    }
  }
}

module.exports = Help;
