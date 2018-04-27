const Command = require('../../../Core/Structures/Command');
const i18n = require('i18n');

class Locale extends Command {
  constructor(client) {
    super(client, {
      name: 'locale',
      aliases: ['setlocale', 'language'],
      userPermissions: ['MANAGE_GUILD'],
      category: 'configuration',
    });
  }

  async run(ctx) {
    const locale = ctx.args[0];
    if (!locale) return ctx.channel.send(ctx.__('locale.localeSet', {
      code: ctx.__('lang.code'),
      fullName: ctx.__('lang.fullName'),
      emote: ctx.__('lang.flagEmote'),
    }));

    if (!i18n.getLocales().includes(locale)) return ctx.channel.send(ctx.__('locale.unknownLocale', {
      errorIcon: this.client.constants.statusEmotes.error,
      prefix: this.client.config.discord.defaultPrefixes[0],
      locale,
    }));

    ctx.settings.data.misc.locale = locale;
    ctx.setLocale(locale);
    await ctx.settings.saveData();

    ctx.channel.send(ctx.__('locale.set', {
      successIcon: this.client.constants.statusEmotes.success,
      code: ctx.__('lang.code'),
      fullName: ctx.__('lang.fullName'),
    }));
  }
}

module.exports = Locale;
