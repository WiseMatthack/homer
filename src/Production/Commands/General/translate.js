const Command = require('../../../Core/Structures/Command');
const translate = require('google-translate-api');
const { RichEmbed } = require('discord.js');

class Translate extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      category: 2,
    });
  }

  async run(ctx) {
    const targetLanguage = ctx.args[0];
    const textToTranslate = ctx.args.slice(1).join(' ');

    if (!targetLanguage || !textToTranslate) return ctx.channel.send(ctx.__('translate.notEnoughParameters', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (textToTranslate.length > 1024) return ctx.channel.send(ctx.__('translate.textTooLong', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    translate(textToTranslate, { to: targetLanguage })
      .then((translated) => {
        const embed = new RichEmbed()
          .addField(ctx.__('translate.embed.translatedText', { locale: targetLanguage }), translated.text)
          .setColor(ctx.guild.me.displayHexColor)
          .setFooter(ctx.__('translate.embed.footer'), `http://${this.client.config.dashboard.baseDomain}/images/services/translate.png`);

        ctx.channel.send(ctx.__('translate.translated', {
          translateIcon: this.client.constants.serviceIcons.translate,
        }), { embed });
      })
      .catch(() => ctx.channel.send(ctx.__('translate.error', {
        errorIcon: this.client.constants.statusEmotes.error,
      })));
  }
}

module.exports = Translate;
