const Helper = require('./Helper');
const Client = require('../Client');

/**
 * Represents a last active helper.
 * @extends {Helper}
 */
class LastactiveHelper extends Helper {
  /**
   * @param {Client} client Client that initiated the last active helper
   */
  constructor(client) {
    super(client);
  }

  /**
   * Gets the last active timestamp of a user.
   * @param {String} id User ID
   * @returns {Promise<Number>} Timestamp
   */
  async getLastactive(id) {
    const data = await this.client.database.getDocument('lastactive', id);
    return data ? data.time : null;
  }

  /**
   * Updates the last active entry of a user.
   * @param {String} id User ID
   */
  updateLastactive(id) {
    this.client.database.insertDocument('lastactive', {
      id,
      time: Date.now(),
    }, {
      conflict: 'update',
    });
  }
}

module.exports = LastactiveHelper;
