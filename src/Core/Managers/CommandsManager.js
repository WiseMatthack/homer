const Manager = require('./Manager');
const Client = require('../Client');
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
    _map();
  }

  /**
   * Cache commands and categories.
   */
  _map() {
    for (const category of this.client.config.discord.commandCategories) {
      let categoryGPS = [];

      readdir(`${path}/${category}`, (err, files) => {
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
  async getCommand(cmd) {
    let category = null;

    this.gps.forEach((commands, gpsCategory) => {
      if (commands.includes(cmd)) {
        category = gpsCategory;
      }
    });

    if (category) {
      return require(`${path}/${gpsCategory}/${cmd}.js`);
    } else {
      return null;
    }
  }
}

module.exports = CommandsManager;
