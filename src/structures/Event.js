class Event {
  /**
   * @param {*} client Client that intantiated the event
   * @param {string} name Name of the event (discord.js)
   */
  constructor(client, name) {
    this.client = client;
    this.name = name;
  }
}

module.exports = Event;
