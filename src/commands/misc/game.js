const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const mtz = require('moment-timezone');

class GameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'game',
      category: 'misc',
      usage: '<game>',
      dm: true,
    });
  }

  get baseURL() {
    return 'https://api-endpoint.igdb.com';
  }

  async execute(context) {
    const search = context.args.join(' ');
    if (!search) return context.replyError(context.__('game.noSearch'));
    if (search.length > 64) return context.replyWarning(context.__('game.searchTooLong'));
    const message = await context.replyLoading(context.__('global.loading'));

    // Auto-complete search
    const searchQuery = await snekfetch.get(`https://www.igdb.com/search_autocomplete_all?q=${encodeURIComponent(search)}`)
      .then(res => res.body)
      .catch(() => null);

    if (!searchQuery.game_suggest) {
      return message.edit(`${this.client.constants.emotes.warning} ${context.__('game.noResult', { search })}`);
    }

    const query = `/games/${searchQuery.game_suggest[0].id}`;
    const response = await snekfetch
      .get(`${this.baseURL}${query}`)
      .set('Accept', 'application/json')
      .set('user-key', this.client.config.api.igdb)
      .then(res => res.body[0])
      .catch(() => null);

    const publishers = [];
    for (const publisher of response.publishers || []) {
      const r = await snekfetch
        .get(`${this.baseURL}/companies/${publisher}`)
        .set('Accept', 'application/json')
        .set('user-key', this.client.config.api.igdb)
        .then(res => res.body[0]);

      publishers.push(`**[${r.name}](${r.url})**`);
    }

    const developers = [];
    for (const developer of response.developers || []) {
      const r = await snekfetch
        .get(`${this.baseURL}/companies/${developer}`)
        .set('Accept', 'application/json')
        .set('user-key', this.client.config.api.igdb)
        .then(res => res.body[0]);

      developers.push(`**[${r.name}](${r.url})**`);
    }

    const platforms = [];
    for (const platform of response.platforms || []) {
      const r = await snekfetch
        .get(`${this.baseURL}/platforms/${platform}`)
        .set('Accept', 'application/json')
        .set('user-key', this.client.config.api.igdb)
        .then(res => res.body[0]);

      platforms.push(`**[${r.name}](${r.url})**`);
    }

    const release = mtz(response.first_release_date)
      .tz(context.settings.misc.timezone)
      .locale(context.settings.misc.locale)
      .format(context.settings.misc.dateFormat);

    const embed = new RichEmbed()
      .setDescription([
        `${this.dot} ${context.__('game.embed.publishers')}: ${publishers.join(', ') || context.__('global.none')}`,
        `${this.dot} ${context.__('game.embed.developers')}: ${developers.join(', ') || context.__('global.none')}`,
        `${this.dot} ${context.__('game.embed.platforms')}: ${platforms.join(', ') || context.__('global.none')}`,
        `${this.dot} ${context.__('game.embed.release')}: **${release}**`,
        '',
        response.summary || context.__('game.embed.noDesc'),
        '',
        `${this.dot} **[${context.__('game.embed.seeIgdb')}](${response.url})**`,
      ].join('\n'))
      .setThumbnail(response.cover ? `https:${response.cover.url}` : undefined);

    message.edit(
      context.__('game.title', { name: `**${response.name}**` }),
      { embed },
    );
  }
}

module.exports = GameCommand;
