const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const i18n = require('i18n');

class Translations extends Command {
  constructor(client) {
    super(client, {
      name: 'translations',
      aliases: ['locales', 'languages', 'translators'],
      category: 1,
    });
  }

  async run(ctx) {
    const locales = i18n.getLocales();

    const embed = new RichEmbed()
      .setFooter(ctx.__('translations.footer', {
        prefix: this.client.config.discord.defaultPrefixes[0],
      }))
      .setColor(ctx.guild.me.displayHexColor);

    let currentLocale = null;
    let currentField = [];
    for (const locale of locales) {
      if (locale.split('-')[0] !== currentLocale) {
        embed.fields.push({
          name: '‎',
          value: '',
          inline: true,
        });
      }

      currentLocale = locale.split('-')[0];
      const message = [];
      const catalog = i18n.getCatalog(locale);

      embed.fields[embed.fields.length - 1].value += `\n${ctx.__('translations.locale', {
        fullName: catalog['lang.fullName'],
        emote: catalog['lang.flagEmote'],
        code: catalog['lang.code'],
      })}`;
    }

    ctx.channel.send(ctx.__('translations.locales'), { embed });
  }
}

module.exports = Translations;
