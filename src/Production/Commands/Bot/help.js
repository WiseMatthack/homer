const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      category: 1,
    });
  }

  async run(ctx) {
    const isFound = this.client.commands.getCommand(ctx.args[0]);
    let found;
    if (isFound) found = new isFound(this.client);

    console.log(ctx)
    
    if (isFound && !found.private) {
      const help = require(`../../Locales/Help/${ctx.settings.data.misc.locale}.json`)[found.name];
      
      const embed = new RichEmbed()
        .setDescription(ctx.__('help.command.embed.description', {
          description: help.description,
          usage: `${this.client.config.discord.defaultPrefixes[0]}${help.usage}`,
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

      this.client.commands.gps.forEach((commandsList, category) => {
        embed.addField(ctx.__('help.global.embed.category', {
          category,
        }), commandsList.map(cmd => `\`${cmd}\``).join(' - '));
      });

      ctx.channel.send(ctx.__('help.global.title'), { embed });
    }
  }
}

module.exports = Help;
