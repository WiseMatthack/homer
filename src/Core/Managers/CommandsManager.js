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
    this.gps.set('aliases', {});
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
        files.forEach((file) => {
          delete require.cache[require.resolve(`${this.path}/${category}/${file}`)];
          const cmd = new (require(`../../Production/Commands/${category}/${file}`))(this.client);
          const aliases = this.gps.get('aliases');
          cmd.aliases.forEach(a => {
            aliases[a] = cmd.name;
          });
          
          categoryGPS.push(file.split('.')[0]);
        });
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
      if (categoryName === 'aliases') {
        if (commands[cmd]) return this.getCommand(commands[cmd]);
      } else {
        if (commands.includes(cmd)) {
          category = categoryName;
        }
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
