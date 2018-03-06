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
    this.settings = new DataGuild(client, message.guild.id);

    /**
     * Translation module for the context
     */
    i18n.init(this);
  }

  /**
   * Command arguments.
   * @type {String[]}
   */
  get args() {
    return this.content.split(/ +/g).slice(1);
  }

  get guild() {
    return this.channel.guild;
  }

  /**
   * Get the configuration associated to the guild.
   * @returns {DataGuild}
   */
  async getGuildSettings() {
    await this.settings.getData();
    return this.settings;
  }

  /**
   * Is the message a command.
   * @returns {String} Prefix or `null` if not a command
   */
  isCommand() {
    const prefixes = this.client.config.discord.defaultPrefixes.concat(this.settings.data.misc.customPrefixes);

    let prefix = null;
    for (const p of prefixes) {
      if (this.content.startsWith(p)) prefix = p;
    }

    return prefix;
  }
}

module.exports = Context;
