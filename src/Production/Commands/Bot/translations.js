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

    let translations = [];
    for (const locale of locales) {
      const catalog = i18n.getCatalog(locale);

      let authorTags = [];
      for (const author of catalog['lang.authors']) {
        authorTags.push(await this.client.fetchUser(author).then(u => u.tag));
      }

      translations.push(ctx.__('translations.locale', {
        fullName: catalog['lang.fullName'],
        emote: catalog['lang.flagEmote'],
        code: catalog['lang.code'],
        authors: authorTags.join(', '),
      }));
    }

    const embed = new RichEmbed()
      .setDescription(translations.join('\n'))
      .setFooter(ctx.__('translations.footer', {
        prefix: this.client.config.discord.defaultPrefixes[0],
      }))
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('translations.locales', {
      locales: translations.join('\n'),
    }), { embed });
  }
}

module.exports = Translations;
