const Helper = require('./Helper');
const snekfetch = require('snekfetch');
const i18n = require('i18n');

/**
 * Represents a misc helper.
 * @extends {Helper}
 */
class MiscHelper extends Helper {
  /**
   * Update the guild count on every bot list.
   * @param {String} botID ID of the bot
   * @param {Number} guildID Guild count
   */
  async updateCount(botID, guildID) {
    snekfetch
      .post(`https://ls.terminal.ink/api/v1/bots/${botID}`)
      .set({
        Authorization: this.client.config.api.lsTerminal,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guildID })
      .catch(() => {});

    snekfetch
      .post(`https://discordbots.org/api/bots/${botID}/stats`)
      .set({
        Authorization: this.client.config.api.discordBots,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guildID })
      .catch(() => {});

    snekfetch
      .post(`https://bots.discord.pw/api/bots/${botID}/stats`)
      .set({ Authorization: this.client.config.api.discordPw })
      .send({ server_count: guildID })
      .catch(() => {});
  }

  /**
   * Time since now
   * @param {Number} time Timestamp to compare
   * @param {Boolean} compact Compact mode (optional)
   * @param {String} locale Language to use (optional)
   * @returns {String} Formatted string
   */
  timeSince(time, compact = false, locale = 'en-gb') {
    i18n.setLocale(locale);

    let timeSeconds = (Date.now() - time) / 1000;
    let text = '';

    const years = Math.floor(timeSeconds / (60 * 60 * 24 * 365));
    if (years > 0) {
      text += `**${years}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.years`)} `;
      timeSeconds %= (60 * 60 * 24 * 365);
    }

    const weeks = Math.floor(timeSeconds / (60 * 60 * 24 * 7));
    if (weeks > 0) {
      text += `**${weeks}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.weeks`)} `;
      timeSeconds %= (60 * 60 * 24 * 7);
    }

    const days = Math.floor(timeSeconds / (60 * 60 * 24));
    if (days > 0) {
      text += `**${days}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.days`)} `;
      timeSeconds %= (60 * 60 * 24);
    }

    const hours = Math.floor(timeSeconds / (60 * 60));
    if (hours > 0) {
      text += `**${hours}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.hours`)} `;
      timeSeconds %= (60 * 60);
    }

    const minutes = Math.floor(timeSeconds / 60);
    if (minutes > 0) {
      text += `**${minutes}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.minutes`)} `;
      timeSeconds %= 60;
    }

    if (Math.floor(timeSeconds) > 0) {
      text += `**${timeSeconds}**${i18n.__(`dateUtil.${compact ? 'compact' : 'full'}.seconds`)}`;
    }

    return text || i18n.__('global.noTimeAgo'); // 'no time ago' assuming it's less than a second ago
  }
}

module.exports = MiscHelper;
