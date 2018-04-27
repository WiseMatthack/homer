const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');

class Quote extends Command {
  constructor(client) {
    super(client, {
      name: 'quote',
      aliases: ['quotemsg'],
      category: 'misc',
    });
  }

  async run(ctx) {
    const messageID = ctx.args[0];
    if (!messageID || isNaN(messageID)) return ctx.channel.send(ctx.__('quote.error.invalidMessageID', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    let { channel } = ctx;
    const search = ctx.args.slice(1).join(' ');
    if (ctx.mentions.channels.size > 0) channel = ctx.mentions.channels.first();
    else if (search) {
      const channels = this.client.finder.findTextChannels(search, ctx.guild.id);
      if (channels.size === 0) return ctx.channel.send(ctx.__('finder.channels.noFound', { errorIcon: this.client.constants.statusEmotes.error, search }));
      channel = channels.first();
    }

    channel.fetchMessage(messageID)
      .then((fetchedMessage) => {
        const embed = new RichEmbed()
          .setDescription(fetchedMessage.content)
          .setColor(fetchedMessage.member.displayHexColor)
          .setAuthor(fetchedMessage.author.tag, fetchedMessage.author.avatarURL)
          .setFooter(`#${fetchedMessage.channel.name}`)
          .setTimestamp(fetchedMessage.createdAt);

        ctx.channel.send({ embed });
      })
      .catch((error) => {
        if (error.code === 10008) return ctx.channel.send(ctx.__('quote.error.notFound', {
          errorIcon: this.client.constants.statusEmotes.error,
          id: messageID,
          channel: channel.id,
        }));

        else if (error.code === 50001) return ctx.channel.send(ctx.__('quote.error.missingAccess', {
          errorIcon: this.client.constants.statusEmotes.error,
          channel: channel.id,
        }));

        ctx.channel.send(ctx.__('quote.error.unknownError', {
          errorIcon: this.client.constants.statusEmotes.error,
        }));
      });
  }
}

module.exports = Quote;
