const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Vote extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      category: 'bot',
    });
  }

  async run(ctx) {
    const list = await this.client.database.getDocuments('votes').then(l => l
      .sort((a, b) => b.count - a.count));
    const message = (list.length === 0 ? [ctx.__('vote.noVoter')] : []);

    for (let i = 0; i < 5; i += 1) {
      const voteEntry = list[i];
      const userTag = await this.client.fetchUser(voteEntry.id).then(u => u.tag);

      let medalEmote = '🏅';
      if (i === 0) medalEmote = '🥇';
      else if (i === 1) medalEmote = '🥈';
      else if (i === 2) medalEmote = '🥉';

      message.push(ctx.__('vote.voteEntry', {
        tag: userTag,
        emote: medalEmote,
        count: voteEntry.count,
      }));
    }

    const embed = new RichEmbed()
      .setDescription(ctx.__('vote.embedDescription', {
        botID: this.client.user.id,
        topVoters: message.join('\n'),
        votersCount: list.length,
        votesCount: list.reduce((a, b) => a.count + b.count),
        userCount: list.find(v => v.id === ctx.author.id) ? list.find(v => v.id === ctx.author.id).count : 0,
      }))
      .setColor(ctx.guild.me.displayHexColor);

    ctx.channel.send(ctx.__('vote.title'), { embed });
  }
}

module.exports = Vote;
