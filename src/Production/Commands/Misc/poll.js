const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const durationParser = require('parse-duration');

class Poll extends Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      category: 3,
    });
  }

  async run(ctx) {
    const { title, options } = this.parseString(ctx.args, this.flags);
    if (!title) return ctx.channel.send(ctx.__('poll.noTitle', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    let emotes = ['👍', '👎'];
    const expiration = durationParser(options.find(o => o.flag === 't') ? options.find(o => o.flag === 't').value : '1m');
    
    const embed = new RichEmbed()
      .setTitle(title)
      .setAuthor(ctx.author.username, ctx.author.displayAvatarURL)
      .setColor(ctx.guild.me.displayHexColor)
      .setFooter(ctx.__('poll.embed.footer'))
      .setTimestamp(new Date(Date.now() + expiration));

    for (const option of options) {
      if (option.flag === 'd') {
        embed.setDescription(option.value);
      }

      if (option.flag === 'c') {
        embed.setColor(option.value.toUpperCase());
      }

      if (option.flag === 'e') {
        const customEmotes = option.value.split(' ');
        if (customEmotes.length >= 2) {
          for (let i = 0; i < customEmotes.length; i++) {
            if (customEmotes[i].length > 6) {
              const e = customEmotes[i].split(':');
              if (e.length === 3) {
                customEmotes[i] = client.emojis.get(e[2].replace('>', ''));
              }
            }
          }
          emotes = customEmotes;
        }
      }
    }

    const sentPoll = await ctx.channel.send({ embed });
    for (const emote of emotes) {
      if (typeof emote === 'object') await sentPoll.react(emote.id);
      else await sentPoll.react(emote);
    }

    const pollObject = {
      id: sentPoll.id,
      title,
      color: embed.color || null,
      authorID: ctx.author.id,
      channelID: ctx.channel.id,
      displayLocale: ctx.settings.data.misc.locale,
      endTime: (Date.now() + expiration),
    };

    await this.client.database.insertDocument('poll', pollObject);
    setTimeout(this.client.stuffHandler.handlePoll, expiration, this.client, pollObject.id);
  }

  get flags() {
    return [
      {
        flag: 't',
        name: 'time',
      },
      {
        flag: 'd',
        name: 'description',
      },
      {
        flag: 'c',
        name: 'color',
      },
      {
        flag: 'e',
        name: 'emojis',
      },
    ];
  }
}

module.exports = Poll;
