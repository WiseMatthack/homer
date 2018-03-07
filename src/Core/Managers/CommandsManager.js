const Manager = require('./Manager');
const Client = require('../Client');
const Command = require('../Structures/Command');
const { readdir } = require('fs');

/**
 * Represents a command manager.
 * @extends {Manager}
 */
class CommandsManager extends Manager {
  /**
   * @param {Client} client Client that initiated the database manager
   */
  constructor(client) {
    super(client);

    /**
     * Path to commands
     * @type {String}
     */
    this.path = `${__dirname}/../../Production/Commands`;

    /**
     * Commands GPS
     * @type {Map<String, String[]>}
     */
    this.gps = new Map();
    this._map();
  }

  /**
   * Cache commands and categories.
   */
  _map() {
    for (const category of this.client.config.discord.commandCategories) {
      let categoryGPS = [];

      readdir(`${this.path}/${category}`, (err, files) => {
        if (err) throw err;
        files.forEach(file => categoryGPS.push(file.split('.')[0]));
      });

      this.gps.set(category, categoryGPS);
    }
  }

  /**
   * Finds a command and returns it if found.
   * @param {String} cmd Command to find
   * @returns {?Command} Command or `null` if not found
   */
  getCommand(cmd) {
    let category = null;

    this.gps.forEach((commands, categoryName) => {
      if (commands.includes(cmd)) {
        category = categoryName;
      }
    });

    if (category) {
      return require(`${this.path}/${category}/${cmd}.js`);
    } else {
      return null;
    }
  }
}

module.exports = CommandsManager;