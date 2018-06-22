const Command = require('../../structures/Command');
const { RichEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

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

    // Auto-complete search
    const searchQuery = await snekfetch.get(`https://www.igdb.com/search_autocomplete_all?q=${encodeURIComponent(search)}`)
      .then(res => res.body)
      .catch(() => null);

    if (!searchQuery.game_suggest) {
      return context.replyWarning(context.__('game.noResult', { search }));
    }

    const query = `/games/${searchQuery.game_suggest[0].id}`;
    const response = await snekfetch
      .get(`${this.baseURL}${query}`)
      .set('Accept', 'application/json')
      .set('user-key', this.client.config.api.igdb)
      .then(res => res.body)
      .catch(() => null);

    const publishers = [];
    for (const publisher of response.publishers) {
      const r = await snekfetch
        .set('Accept', 'application/json')
        .set('user-key', this.client.config.api.igdb)
        .get(`${this.baseURL}/companies/${publisher}`)
        .then(res => res.body);

      publishers.push(`**[${r.name}](${r.url})**`);
    }

    const developers = [];
    for (const developer of response.developers) {
      const r = await snekfetch
        .set('Accept', 'application/json')
        .set('user-key', this.client.config.api.igdb)
        .get(`${this.baseURL}/companies/${developer}`)
        .then(res => res.body);

      developers.push(`**[${r.name}](${r.url})**`);
    }

    const embed = new RichEmbed()
      .setDescription([
        `${this.dot} ${context.__('game.embed.publishers')}: ${publishers.join(', ') || context.__('global.none')}`,
        `${this.dot} ${context.__('game.embed.developers')}: ${developers.join(', ') || context.__('global.none')}`,
        '',
        `**${response.summary}**`,
        '',
        `${this.dot} **[${context.__('game.embed.seeIgdb')}](${response.url})**`,
      ].join('\n'))
      .setThumbnail(`https:${response.cover.url}`);

    context.reply(
      context.__('game.title', { name: `**${response.name}**` }),
      { embed },
    );
  }
}

module.exports = GameCommand;
