const Helper = require('./Helper');
const Client = require('../Client');
const i18n = require('i18n');

/**
 * Represents a mod helper.
 * @extends {Helper}
 */
class ModHelper extends Helper {
  /**
   * @param {Client} client Client that initiated the mod helper
   */
  constructor(client) {
    super(client);
  }

  /**
   * Register a moderation case.
   * @param {String} guild Guild ID
   * @param {Number} action Action identifier
   * @param {String} author Action author ID
   * @param {String} target User or channel ID
   * @param {String} reason Reason
   */
  async registerCase(guild, action, author, target, reason) {
    const settings = await this.client.database.getDocument('guild', guild);
    if (!settings) return;

    i18n.setLocale(settings.misc.locale);
    const time = Date.now();

    const msg = [i18n.__(`moderation.log.${action}`, {
      caseID: (settings.moderation.cases.length + 1),
      author: this.client.users.get(author).tag,
      target: this.client.channels.has(target) ? this.client.channels.get(target).id : (await this.client.fetchUser(target).then(u => u.tag)),
      targetID: target,
      time: mtz(time).tz(settings.data.misc.timezone).format(settings.data.misc.timeFormat),
    }), i18n.__('moderation.log.reason', { reason })];

    let messages = [];
    for (const channel of settings.moderation.channels.filter(c => c.type === 1)) {
      const textChannel = this.client.channels.get(channel.id);
      if (!textChannel) return;

      const sentMessage = await textChannel.send(msg.join('\n'));
      messages.push({
        channel: channel.id,
        message: sentMessage.id,
      });
    }

    const moderationCase = {
      action,
      author,
      target,
      reason,
      messages,
      time,
    };

    settings.moderation.cases.push(moderationCase);
    await this.client.database.insertDocument('guild', settings, { conflict: 'update' });

    return moderationCase;
  }

  /**
   * Can the author interact with the target ?
   * @param {*} author GuildMember object of author
   * @param {*} target GuildMember object of target
   * @param {*} bot GuildMember object of bot
   * @returns {Boolean}
   */
  canInteract(author, target, bot) {
    if (target.roles.highest.comparePositionTo(bot.roles.highest) >= 0) return false;
    else if (author.roles.highest.comparePositionTo(target.roles.highest) <= 0) return false;
    else return true;
  }
}

module.exports = ModHelper;
