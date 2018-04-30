const Command = require('../../../Core/Structures/Command');

const possibleReactions = ['☎'];

class Guide extends Command {
  constructor(client) {
    super(client, {
      name: 'guide',
      category: 'bot',
      botPermissions: ['ADD_REACTIONS'],
    });
  }

  async run(ctx) {
    const sentMessage = await ctx.channel.send(ctx.__('guide.welcome'));

    for (const reaction of possibleReactions) {
      await sentMessage.react(reaction);
    }

    sentMessage.awaitReactions(
      (reaction, user) => user.id === ctx.author.id &&
        possibleReactions.includes(reaction.emoji.name),
      { max: 1 },
    )
      .then(async (reactions) => {
        await sentMessage.clearReactions();
        sentMessage.edit(ctx.__(`guide.${reactions.first().emoji.name}`, {
          prefix: this.client.config.discord.defaultPrefixes[0],
        }));
      });
  }
}

module.exports = Guide;
