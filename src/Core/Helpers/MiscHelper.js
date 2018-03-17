const Helper = require('./Helper');
const Client = require('../Client');
const snekfetch = require('snekfetch');

/**
 * Represents a misc helper.
 * @extends {Helper}
 */
class MiscHelper extends Helper {
  /**
   * @param {Client} client Client that initiated the misc helper
   */
  constructor(client) {
    super(client);
  }

  /**
   * Update the guild count on every bot list.
   * @param {Number} guild Guild count
   */
  async updateCount(guild) {
    snekfetch
      .post(`https://ls.terminal.ink/api/v1/bots/${this.client.user.id}`)
      .set({ Authorization: this.client.config.api.lsTerminal })
      .send({ server_count: guild })
      .catch(() => console.log('[Error] Unable to update guild count on ls.terminal.ink.'));

    snekfetch
      .post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
      .set({ Authorization: this.client.config.api.discordBots })
      .send({ server_count: guild })
      .catch(() => console.log('[Error] Unable to update guild count on discordbots.org.'));
  }
}

module.exports = MiscHelper;
