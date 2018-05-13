const Command = require('../../../Core/Structures/Command');
const i18n = require('i18n');

class Language extends Command {
  constructor(client) {
    super(client, {
      name: 'language',
      aliases: ['locale', 'translations'],
      userPermissions: ['MANAGE_GUILD'],
      category: 'configuration',
    });
  }

  async run(ctx) {
    const locale = ctx.args[0];

    if (locale) {
      if (!i18n.getLocales().includes(locale)) return ctx.channel.send(ctx.__('language.unknownLocale', {
        errorIcon: this.client.constants.statusEmotes.error,
        prefix: this.client.config.discord.defaultPrefixes[0],
        locale,
      }));

      ctx.settings.data.misc.locale = locale;
      ctx.setLocale(locale);
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('language.set', {
        successIcon: this.client.constants.statusEmotes.success,
        code: ctx.__('lang.code'),
        fullName: ctx.__('lang.fullName'),
      }));
    } else {
      const locales = i18n.getLocales();

      const message = [];
      for (const locale of i18n.getLocales()) {
        const catalog = i18n.getCatalog(locale);
        message.push(ctx.__('language.entry', {
          fullName: catalog['lang.fullName'],
          emote: catalog['lang.flagEmote'],
          code: catalog['lang.code'],
        }));
      }

      const embed = new RichEmbed()
        .setDescription(message.join('\n'))
        .setFooter(ctx.__('language.footer', {
          prefix: this.client.config.discord.defaultPrefixes[0],
        }))
        .setColor(ctx.guild.me.displayHexColor);

      ctx.channel.send(ctx.__('language.localeSet', {
        code: ctx.__('lang.code'),
        fullName: ctx.__('lang.fullName'),
        emote: ctx.__('lang.flagEmote'),
      }), { embed });
    }
  }
}

module.exports = Language;
