/**
 * Represents a bot event.
 */
class Event {
  /**
   * @param {Client} client Client that initiated the event
   * @param {String} name Name of the event (discord.js format)
   */
  constructor(client, name) {
    /**
     * Client that initiated the client.
     * @type {Client}
     */
    this.client = client;

    /**
     * Name of the event (discord.js format).
     * @type {String}
     */
    this.name = name;
  }

  /**
   * Handle the event.
   */
  async handle() {
    return null;
  }
}

module.exports = Event;
