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

  /**
   * Parses a content and returns title and flags.
   * @param {String} string String to parse
   * @param {Object} flags Flags to use
   * @returns {ParsedString}
   */
  parseString(string, flags) {
    let title = '';
    let finishedTitle = false;
    let options = [];

    for (let i = 0; i < string.length; i++) {
      if (string[i].startsWith('-')) {
        const filter = flags.filter(f => f.flag === string[i].substring(1).toLowerCase());
        if (filter.length > 0) {
          finishedTitle = true;
          const current = filter[0].flag;
          options.push({
            flag: current,
            value: '',
          });
        }
      } else {
        if (options.length === 0 && finishedTitle === false) { // eslint-disable-line no-lonely-if
          if (title.length === 0) title += string[i];
          else title += ` ${string[i]}`;
        } else {
          const index = options.length - 1;
          if (options[index].value.length === 0) {
            options[index].value = string[i];
          } else {
            options[index].value += ` ${string[i]}`;
          }
        }
      }
    }

    return {
      title,
      options,
    };
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

/**
 * @typedef ParsedString
 * @property {String} title Before options string (usually a title)
 * @property {Option[]} options Options
 */

/**
 * @typedef Option
 * @property {String} flag Option name
 * @property {String} value Option value
 */
