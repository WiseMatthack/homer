const Helper = require('./Helper');
const Client = require('../Client');
const { RichEmbed } = require('discord.js');
const DataGuild = require('../Structures/Data/DataGuild');
const DataProfile = require('../Structures/Data/DataProfile');
const mtz = require('moment-timezone');
const i18n = require('i18n');

/**
 * Represents a handler helper.
 * @extends {Helper}
 */
class HandlerHelper extends Helper {
  /**
   * @param {Client} client Client that initiated the handler helper
   */
  constructor(client) {
    super(client);
  }

  /**
   * Handles a poll.
   * @param {Client} client Client instance to use
   * @param {String} id ID of the poll (message ID)
   */
  async handlePoll(client, id) {
    const pollObject = await client.database.getDocument('poll', id);
    if (!pollObject) return;
    client.database.deleteDocument('poll', id);

    const channel = client.channels.get(pollObject.channelID);
    if (!channel) return;

    channel.fetchMessage(pollObject.id)
      .then(async (message) => {
        i18n.setLocale(pollObject.displayLocale || 'en-gb');
        const author = await client.fetchUser(pollObject.authorID);

        let reactions = [];
        message.reactions.forEach((reaction) => {
          reactions.push({
            emote: `<:${reaction.emoji.name}:${reaction.emoji.id}>`,
            count: (reaction.me ? reaction.count - 1 : reaction.count),
          });
        });

        reactions = reactions.sort((a, b) => b.count - a.count);

        if (reactions.length < 1) return channel.send(i18n.__('poll.handler.noReaction', {
          errorIcon: client.constants.statusEmotes.error,
        }));

        let description = null;
        if (reactions.length === 0 ||
          ((reactions[0] && reactions[0].count === 0) && (reactions[1] && reactions[1].count === 0))) {
          description = i18n.__('poll.handler.noReaction');
        } else if (reactions.length === 1) {
          description = i18n.__('poll.handler.description.wonAlone', {
            vote: {
              emote: reactions[0].emote,
              count: reactions[0].count,
            },
          });
        } else if (reactions[0].count !== reactions[1].count) {
          description = i18n.__('poll.handler.description.winner', {
            firstVote: {
              emote: reactions[0].emote,
              count: reactions[0].count,
            },
            otherVotes: reactions.slice(1).map(r => `${r.emote} (${r.count} ${i18n.__('poll.handler.votes')})`).join(', ') || i18n.__('global.none'),
          });
        } else {
          description = i18n.__('poll.handler.description.equality', {
            votes: reactions.map(r => `${r.emote} (${r.count} ${i18n.__('poll.handler.votes')})`).join(', ') || i18n.__('global.none'),
          });
        }

        const embed = new RichEmbed()
          .setTitle(pollObject.title)
          .setDescription(description)
          .setAuthor(author.username, author.displayAvatarURL)
          .setColor(pollObject.color || null);

        channel.send({ embed });
      })
      .catch(() => channel.send(ctx.__('poll.handler.unknownMessage', {
        errorIcon: client.constants.statusEmotes.error,
      })));
  }

  /**
   * Handles a remind.
   * @param {Client} client Client that initiated the remind
   * @param {String} user ID of the user who initiated the remind
   * @param {String} index Index of the remind object
   */
  async handleRemind(client, user, index) {
    const profile = new DataProfile(client, user);
    await profile.getData();

    const remind = profile.data.reminds.find(remind => remind.index == index);
    if (!remind) return;
    profile.data.reminds.splice(profile.data.reminds.indexOf(remind), 1);
    await profile.saveData();

    const settings = new DataGuild(client, remind.guild);
    await settings.getData();
    i18n.setLocale(settings.data.misc.locale);

    const message = i18n.__('remind.reminded', {
      user,
      set: mtz(remind.set).locale(settings.data.misc.locale).fromNow(),
      content: remind.content,
    });

    const channel = client.channels.get(remind.channel);
    if (channel) channel.send(message);
    else {
      const user = client.users.get(user);
      if (!user) return;

      user.send(message);
    }
  }
}

module.exports = HandlerHelper;
