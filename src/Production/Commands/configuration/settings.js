const Command = require('../../../Core/Structures/Command');
const { RichEmbed, Util } = require('discord.js');
const emotes = ['420529118417780747', '420529091280633856'];

class Settings extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      userPermissions: ['MANAGE_GUILD'],
      category: 'configuration',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'reset') {
      const message = await ctx.channel.send(ctx.__('settings.reset.awaitResponse', {
        warnEmote: this.client.constants.statusEmotes.warning,
        successEmote: this.client.constants.statusEmotes.success,
        prefix: this.client.config.discord.defaultPrefixes[0],
      }));

      for (const emote of emotes) {
        await message.react(emote);
      }

      message.awaitReactions((reaction, user) => user.id === ctx.author.id && emotes.includes(reaction.emoji.id), {
        max: 1,
      })
        .then(async (reactions) => {
          if (reactions.first().emoji.id === emotes[0]) {
            await this.client.database.deleteDocument('guild', ctx.guild.id);
            message.edit(ctx.__('settings.reset.success'));
          } else {
            message.delete();
          }
        });
    } else {
      const embed = new RichEmbed()
        .addField(ctx.__('settings.embed.welcome'), 
          ctx.settings.data.welcome.channel ?
          `<#${ctx.settings.data.welcome.channel}> - ${Util.escapeMarkdown(ctx.settings.data.welcome.message, true, true)}` :
          ctx.__('global.none'),
          true,
        )
        .addField(ctx.__('settings.embed.leave'), 
          ctx.settings.data.leave.channel ?
          `<#${ctx.settings.data.leave.channel}> - ${Util.escapeMarkdown(ctx.settings.data.leave.message, true, true)}` :
          ctx.__('global.none'),
          true,
        )
        .addField(ctx.__('settings.embed.moderation'), ctx.__('settings.embed.moderation-value', {
          channel: ctx.settings.data.moderation.channel ? `<#${ctx.settings.data.moderation.channel}>` : ctx.__('global.none'),
          cases: ctx.settings.data.moderation.cases.length,
        }), false)
        .addField(ctx.__('settings.embed.phone'), ctx.__('settings.embed.phone-value', {
          channel: ctx.settings.data.phone.channel ? `<#${ctx.settings.data.phone.channel}>` : ctx.__('global.none'),
          number: ctx.settings.data.phone.number || ctx.__('global.none'),
          incomingMessage: ctx.settings.data.phone.callMessage || ctx.__('global.none'),
          missedMessage: ctx.settings.data.phone.missedMessage || ctx.__('global.none'),
          customFlag: ctx.settings.data.phone.customFlag || ctx.__('lang.flagEmote'),
        }), false)
        .addField(ctx.__('settings.embed.misc'), ctx.__('settings.embed.misc-value', {
          locale: `${ctx.__('lang.flagEmote')} ${ctx.__('lang.fullName')} (\`${ctx.__('lang.code')}\`)`,
          timezone: ctx.settings.data.misc.timezone,
          prefixes: ctx.settings.data.misc.customPrefixes.map(p => `\`${p}\``).join(', ') || ctx.__('global.none'),
        }), true)
        .addField(ctx.__('settings.embed.formats'), ctx.__('settings.embed.formats-value', {
          dateFormat: ctx.settings.data.misc.dateFormat,
          timeFormat: ctx.settings.data.misc.timeFormat,
        }), true)
        .setColor(ctx.guild.me.displayHexColor)
        .setFooter(ctx.__('settings.embed.footer', {
          prefix: this.client.config.discord.defaultPrefixes[0],
        }));

      ctx.channel.send(ctx.__('settings.title', {
        name: ctx.guild.name,
      }), { embed });
    }
  }
}

module.exports = Settings;
