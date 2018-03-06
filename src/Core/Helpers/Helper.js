const Client = require('../Client');

/**
 * Represents the base of any helper class.
 */
class Helper {
  /**
   * @param {Client} client Client that initiated the manager
   */
  constructor(client) {
    /**
     * Client that initiated the manager.
     * @type {Client}
     */
    this.client = client;
  }
}

module.exports = Helper;
