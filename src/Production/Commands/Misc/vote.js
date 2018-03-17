const Command = require('../../../Core/Structures/Command');
const snekfetch = require('snekfetch');
const { RichEmbed } = require('discord.js');

class Vote extends Command {
  constructor(client) {
    super(client, {
      name: 'vote',
      category: 3,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'top') {
      const list = await this.client.database.getDocuments('votes').then(list => list.slice(0, 5));

      let message = [];
      for (const l of list) {
        const userTag = await this.client.fetchUser(l.id).then(user => user.tag);
        message.push(ctx.__('vote.memberVote', { tag: userTag, count: l.count, }));
      }

      const embed = new RichEmbed()
        .setDescription(message.join('\n'))
        .setColor(ctx.guild.me.displayHexColor)
        .setFooter(ctx.__('vote.embed.footer', { prefix: this.client.config.discord.defaultPrefixes[0] }));
      
      ctx.channel.send(ctx.__('vote.top'), { embed });
    } else {
      const message = await ctx.channel.send(ctx.__('vote.instructions', {
        validateIcon: this.client.constants.statusEmotes.success,
        voteLink: `https://discordbots.org/bot/${this.client.user.id}/vote`,
      }));

      await message.react(this.client.constants.statusEmotes.success);

      message.awaitReactions(
        (reaction, user) => reaction.emoji.toString() === this.client.constants.statusEmotes.success & user.id === ctx.author.id,
        { time: 60000 })
        .then(() => {
          const data = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes?token=${this.client.config.api.discordBots}&onlyids=true&days=1`);
          const parsed = JSON.parse(data.text);

          if (!parsed.includes(ctx.author.id)) return ctx.channel.send(ctx.__('vote.error.noVoted', {
            errorIcon: this.client.constants.statusEmotes.error,
          }));

          const date = new Date();
          const entry = (await this.client.database.getDocument('votes', ctx.author.id)) || {
            id: ctx.author.id,
            count: 0,
            latestVote: null,
          };

          if (entry.latestVote === `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`) {
            ctx.channel.send(ctx.__('vote.error.alreadyVoted', {
              errorIcon: this.client.constants.statusEmotes.error,
            }));
          }

          entry.count += 1;
          entry.latestVote = `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()}`;
          await this.client.database.insertDocument('votes', entry, { conflict: 'update' });

          ctx.channel.send(ctx.__('vote.success', {
            successIcon: this.client.constants.statusEmotes.success,
          }));
        })
        .catch(() => {
          ctx.channel.send(ctx.__('vote.unknownError', {
            errorIcon: this.client.constants.statusEmotes.error,
          }));
        });
    }
  }
}

module.exports = Vote;
