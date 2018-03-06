const Client = require('../Client');
const Context = require('./Context');

/**
 * Represents the base of a command.
 */
class Command {
  /**
   * @param {Client} client Client that initiated the command
   * @param {CommandProperties} commandProp Properties of the command
   */
  constructor(client, commandProp) {
    /**
     * Client that initiated the command.
     * @type {Client}
     */
    this.client = client;

    /**
     * Name of the command.
     * @type {String}
     */
    this.name = commandProp.name;

    /**
     * Aliases of the command.
     * @type {String[]}
     */
    this.aliases = commandProp.aliases || [];

    /**
     * Category number of the command.
     * @type {Number}
     */
    this.category = commandProp.category || 0;

    /**
     * Required user permissions.
     * @type {String[]}
     */
    this.userPermissions = commandProp.userPermissions || [];

    /**
     * Required bot permissions.
     * @type {String[]}
     */
    this.botPermissions = commandProp.botPermissions || [];

    /**
     * Private state of the command.
     * @type {Boolean}
     */
    this.private = commandProp.private || false;
  }

  /**
   * Executes the command.
   * @param {Context} context Context of the command
   */
  async run(context) {
    console.log(`[Warn] Command ${this.name} does not have a run method!`);
    context.channel.send(context.__('error.unknown'));
  }
}

module.exports = Command;

/**
 * @typedef CommandProperties
 * @property {String} name Name of the command
 * @property {String[]} aliases Aliases of the command
 * @property {Number} category Category number of the command
 * @property {String[]} userPermissions Required user permissions
 * @property {String[]} botPermissions Required bot permissions
 * @property {Argument[]} args Arguments of the command
 * @property {Boolean} private Private state of the command
 */
