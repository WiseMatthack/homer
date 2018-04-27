const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const i18n = require('i18n');

class Translations extends Command {
  constructor(client) {
    super(client, {
      name: 'translations',
      aliases: ['locales', 'languages', 'translators'],
      category: 'bot',
    });
  }

  async run(ctx) {
    const locales = i18n.getLocales();

    const message = [];
    for (const locale of i18n.getLocales()) {
      const catalog = i18n.getCatalog(locale);
      message.push(ctx.__('translations.locale', {
        fullName: catalog['lang.fullName'],
        emote: catalog['lang.flagEmote'],
        code: catalog['lang.code'],
      }));
    }

    const embed = new RichEmbed()
      .setDescription(message.join('\n'))
      .setFooter(ctx.__('translations.footer', {
        prefix: this.client.config.discord.defaultPrefixes[0],
      }))
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('translations.locales'), { embed });
  }
}

module.exports = Translations;
