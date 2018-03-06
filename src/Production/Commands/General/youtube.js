const Command = require('../../../Core/Structures/Command');
const snekfetch = require('snekfetch');

class YouTube extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      aliases: ['yt'],
      category: 2,
    });
  }

  async run(ctx) {
    const search = ctx.args.join(' ');
    if (!search || search.length > 120) return ctx.channel.send(ctx.__('youtube.error.invalidSearch', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const query = encodeURIComponent(search);
    snekfetch
      .get(`https://www.googleapis.com/youtube/v3/search?key=${this.client.config.api.youtube}&part=snippet&regionCode=${ctx.settings.data.misc.locale.split('-')[1]}&maxResults=1&q=${query}`)
      .then((response) => {
        const parsed = response.body;

        if (!parsed.items) return ctx.channel.send(ctx.__('youtube.error.unknown', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));

        if (parsed.pageInfo.totalResults === 0) return ctx.channel.send(ctx.__('youtube.error.noResult', {
          youtubeIcon: this.client.constants.serviceIcons.youtube,
        }));

        let result;
        if (parsed.items[0].id.kind === 'youtube#channel') result = `📺 https://www.youtube.com/channel/${parsed.items[0].id.channelId}`;
        else if (parsed.items[0].id.kind === 'youtube#playlist') result = `📁 https://www.youtube.com/playlist?list=${parsed.items[0].id.playlistId}`;
        else if (parsed.items[0].id.kind === 'youtube#video') {
          if (parsed.items[0].snippet.liveBroadcastContent === 'live') result = `🔴 https://www.youtube.com/watch?v=${parsed.items[0].id.videoId}`;
          else result = `📹 https://www.youtube.com/watch?v=${parsed.items[0].id.videoId}`;
        }

        ctx.channel.send(ctx.__('youtube.result', {
          youtubeIcon: this.client.constants.serviceIcons.youtube,
          result,
        }));
      })
      .catch(() => ctx.channel.send(ctx.__('youtube.error.unknown', {
        errorIcon: this.client.constants.statusEmotes.error,
      })));
  }
}

module.exports = YouTube;
