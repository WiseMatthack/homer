const Command = require('../../../Core/Structures/Command');
const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');

class Google extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      category: 2,
    });
  }

  async run(ctx) {
    const search = ctx.args.join(' ');
    if (!search || search.length > 120) return ctx.channel.send(ctx.__('google.error.invalidSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const query = encodeURIComponent(search);
    snekfetch
      .get(`https://www.googleapis.com/customsearch/v1?key=${this.client.config.api.googleKey}&cx=${this.client.config.api.googleCx}&lr=lang_${ctx.settings.data.misc.locale.split('-')[0]}&num=1&filter=0&fields=queries(request(totalResults)),items(link)&q=${query}`)
      .then((response) => {
        const parsed = JSON.parse(response.text);

        if (!parsed.queries) return ctx.channel.send(ctx.__('google.error.unknown', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));

        if (parsed.queries.request[0].totalResults === '0') return ctx.channel.send(ctx.__('google.error.noResult', {
          googleIcon: this.client.constants.serviceIcons.google,
        }));

        ctx.channel.send(ctx.__('google.result', {
          googleIcon: this.client.constants.serviceIcons.google,
          search,
          link: parsed.items[0].link,
        }));
      })
      .catch(() => ctx.channel.send(ctx.__('google.error.unknown', {
        errorIcon: this.client.constants.statusEmotes.error,
      })));
  }
}

module.exports = Google;
