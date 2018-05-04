const Command = require('../../../Core/Structures/Command');

class Servers extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['browser', 'serverbrowser'],
      category: 'general',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'settings') {
      if (!ctx.member.permissions.has('MANAGE_GUILD')) return ctx.channel.send(ctx.__('command.missingPerm.user', {
        errorIcon: this.client.constants.statusEmotes.error,
        missingPermissions: ['MANAGE_GUILD'].map(perm => `\`${perm}\``).join(', '),
      }));

      const action = ctx.args[1];
      if (!action) return ctx.channel.send(ctx.__('servers.settings.welcome', {
        prefix: this.client.config.discord.defaultPrefixes[0],
        name: ctx.guild.name,
      }));

      if (action === 'category') {
        const category = ctx.args[2];
        if (!category) return ctx.channel.send(ctx.__('servers.settings.category.noCategory', {
          errorIcon: this.client.constants.statusEmotes.error,
          categories: this.client.constants.serversCategories.map(c => `\`${c}\``).join(', '),
        }));

        if (!this.client.constants.serversCategories.includes(category)) return ctx.channel.send(ctx.__('servers.settings.category.unknownCategory', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));

        ctx.settings.data.serverBrowser.category = category;
        await ctx.settings.saveData();

        ctx.channel.send(ctx.__('servers.settings.category.changedCategory', {
          successIcon: this.client.constants.statusEmotes.success,
          category: ctx.__(`servers.category.${category}`),
        }));
      } else if (action === 'switch') {
        if (!ctx.settings.data.serverBrowser.category) return ctx.channel.send(ctx.__('servers.settings.switch.noCategory', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));

        if (ctx.settings.data.serverBrowser.switch) {
          ctx.settings.data.serverBrowser.switch = false;
          ctx.settings.data.serverBrowser.channel = null;
          await ctx.settings.saveData();

          ctx.channel.send(ctx.__('servers.settings.switch.disabled', {
            successIcon: this.client.constants.statusEmotes.success,
          }));
        } else {
          ctx.settings.data.serverBrowser.switch = true;
          ctx.settings.data.serverBrowser.channel = ctx.channel.id;
          await ctx.settings.saveData();

          ctx.channel.send(ctx.__('servers.settings.switch.enabled', {
            successIcon: this.client.constants.statusEmotes.success,
          }));
        }
      } else {
        ctx.channel.send(ctx.__('servers.settings.unknownOption', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));
      }
    } else {
      const category = ctx.args[0];
      if (!category) return ctx.channel.send(ctx.__('servers.welcome', {
        categories: this.client.constants.serversCategories.map(c => `\`${c}\``).join(', '),
        prefix: this.client.config.discord.defaultPrefixes[0],
      }));

      if (!this.client.constants.serversCategories.includes(category)) return ctx.channel.send(ctx.__('servers.invalidCategory', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const filtered = await this.client.database.getDocuments('guild')
        .then(settings => settings.filter(s => s.serverBrowser.switch && s.serverBrowser.category === category));

      const chosenGuild = filtered[Math.floor(Math.random() * filtered.length)];
      if (!chosenGuild) return ctx.channel.send(ctx.__('servers.noGuildFound', {
        errorIcon: this.client.constants.statusEmotes.error,
        category: ctx.__(`servers.category.${category}`),
      }));

      const guild = this.client.guilds.get(chosenGuild.id);
      const invite = await guild.channels.get(chosenGuild.serverBrowser.channel)
        .createInvite({
          maxAge: 60,
          unique: true,
        }, `ServerBrowser - ${ctx.author.tag}`);

      ctx.channel.send(ctx.__('servers.ok', {
        name: guild.name,
        featured: chosenGuild.serverBrowser.featured ? '⭐': '',
        invite,
      }));
    }
  }

  /**
   * Capitalize the first letter of a string and returns it.
   * @param {String} text String to process
   * @returns {String}
   */
  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

module.exports = Servers;
