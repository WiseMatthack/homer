const { Client } = require('discord.js');
const Dashboard = require('../Web/Dashboard');
const { readdir } = require('fs');
const config = require('../config.json');
const Constants = require('./Constants');
const snekfetch = require('snekfetch');

/* Managers */
const DatabaseManager = require('./Managers/DatabaseManager');
const CommandsManager = require('./Managers/CommandsManager');
const AbsenceManager = require('./Managers/AbsenceManager');

/* Helpers */
const FinderHelper = require('./Helpers/FinderHelper');
const LastactiveHelper = require('./Helpers/LastactiveHelper');

/**
 * The main hub for interacting with the Discord API.
 * @extends {Client}
 */
class ExtendedClient extends Client {
  /**
   * @param {ClientOptions} options Options for the client
   */
  constructor(options) {
    super(options || config.clientOptions || {});

    /**
     * Date when the instance was created.
     * @type {Date}
     */
    this.initiated = new Date();

    /**
     * Configuration object associated to the client.
     * @type {Object}
     */
    this.config = config;

    /**
     * Constants for the client.
     * @type {Constants}
     */
    this.constants = Constants;

    /**
     * Cleverbot feature status (enabled or disabled).
     * @type {Boolean}
     */
    this.cleverbot = true;

    /**
     * Disabled commands.
     * @type {Object}
     */
    this.disabledCommands = {};

    /**
     * Database manager associated to the client.
     * @type {DatabaseManager}
     */
    this.database = new DatabaseManager(this, config.database);

    /**
     * Commands manager associated to the client.
     * @type {CommandsManager}
     */
    this.commands = new CommandsManager(this);

    /**
     * Absence manager associated to the client.
     * @type {AbsenceManager}
     */
    this.absence = new AbsenceManager(this);

    /**
     * Dashboard associated to the client.
     * @type {Dashboard}
     */
    this.dashboard = new Dashboard(this, config.dashboard);

    /**
     * Finder helper associated to the client.
     * @type {FinderHelper}
     */
    this.finder = new FinderHelper(this);

    /**
     * Lastactive helper associated to the client.
     * @type {LastactiveHelper}
     */
    this.lastactive = new LastactiveHelper(this);
  }

  /**
   * Load all the events in the Events folder.
   */
  loadEvents() {
    readdir(`${__dirname}/../Production/Events`, (err, files) => {
      if (err) throw err;

      for (const event of files) {
        const eventFile = new (require(`${__dirname}/../Production/Events/${event}`))(this);
        this.on(eventFile.name, (...args) => eventFile.handle(...args));
        delete require.cache[require.resolve(`${__dirname}/../Production/Events/${event}`)];
      }
    });
  }

  /**
   * Initiate cleverbot.
   */
  initiateCleverbot() {
    snekfetch.post('http://cleverbot.io/1.0/create')
      .send({
        user: this.config.api.cleverbotUser,
        key: this.config.api.cleverbotKey,
        nick: this.user.username,
      });
  }
}

module.exports = ExtendedClient;

/**
 * @typedef ClientOptions
 * @property {String} apiRequestMethod
 * @property {Number} shardId
 * @property {Number} shardCount
 * @property {Number} messageCacheMaxSize
 * @property {Number} messageCacheLifetime
 * @property {Number} messageSweepInterval
 * @property {Boolean} fetchAllMembers
 * @property {Boolean} disableEveryone
 * @property {Boolean} sync
 * @property {Number} restWsBridgeTimeout
 * @property {Number} restTimeOffset
 * @property {WSEventType[]} disabledEvents
 * @property {WebSocketOptions} ws
 * @property {HTTPOptions} http
 */

/**
 * @typedef WebSocketOptions
 * @property {Number} large_threshold
 * @property {Boolean} compress 
 */

/**
 * @typedef HTTPOptions
 * @property {Number} version
 * @property {String} host
 * @property {String}
 */
