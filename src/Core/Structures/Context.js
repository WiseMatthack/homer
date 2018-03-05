const Client = require('../Client');
const { Message } = require('discord.js');
const DataGuild = require('./Data/DataGuild');
const i18n = require('i18n');

/**
 * Represents a context (enhanced message).
 * @extends {Message}
 */
class Context {
  /**
   * @param {Client} client Client that initiated the context
   * @param {Message} message Message object associated to the context
   */
  constructor(client, message) {
    // We assign the message object to this, we cannot extend the class directly.
    Object.assign(this, message);

    /**
     * Client that initiated the context.
     * @type {Client}
     */
    this.client = client;

    /**
     * Guild configuration object.
     * @type {?DataGuild}
     */
    this.settings = new DataGuild(this.client, this.guild.id);

    /**
     * Translation module for the context
     */
    i18n.init(this);
  }

  /**
   * Get the configuration associated to the guild.
   * @returns {DataGuild}
   */
  async getGuildSettings() {
    await this.settings.getData();
    return this.settings;
  }
}

module.exports = Context;
