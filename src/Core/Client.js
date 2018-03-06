const { Client } = require('discord.js');
const Dashboard = require('../Web/Dashboard');
const { readdir } = require('fs');
const config = require('../config.json');
const Constants = require('./Constants');

/* Managers */
const DatabaseManager = require('./Managers/DatabaseManager');
const CommandsManager = require('./Managers/CommandsManager');

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
     * Dashboard associated to the client.
     * @type {Dashboard}
     */
    this.dashboard = new Dashboard(this, config.dashboard);
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
