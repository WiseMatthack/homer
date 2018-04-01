const Helper = require('./Helper');
const snekfetch = require('snekfetch');

/**
 * Represents a misc helper.
 * @extends {Helper}
 */
class MiscHelper extends Helper {
  /**
   * Update the guild count on every bot list.
   * @param {Number} guild Guild count
   * @param {String} botID ID of the bot
   */
  async updateCount(guild = this.client.guilds.size, botID = this.client.user.id) {
    snekfetch
      .post(`https://ls.terminal.ink/api/v1/bots/${botID}`)
      .set({
        Authorization: this.client.config.api.lsTerminal,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guild })
      .catch(res => console.log('[Error] Unable to update guild count on ls.terminal.ink.\n', res.body));

    snekfetch
      .post(`https://discordbots.org/api/bots/${botID}/stats`)
      .set({
        Authorization: this.client.config.api.discordBots,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .send({ server_count: guild })
      .catch(res => console.log('[Error] Unable to update guild count on discordbots.org.\n', res.body));

    snekfetch
      .post(`https://bots.discord.pw/api/bots/${botID}/stats`)
      .set({ Authorization: this.client.config.api.discordPw })
      .send({ server_count: guild })
      .catch(res => console.log('[Error] Unable to update guild count on bots.discord.pw.\n', res.body));
  }
}

module.exports = MiscHelper;
