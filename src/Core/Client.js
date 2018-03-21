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
const PhoneManager = require('./Managers/PhoneManager');

/* Helpers */
const FinderHelper = require('./Helpers/FinderHelper');
const LastactiveHelper = require('./Helpers/LastactiveHelper');
const LisaHelper = require('./Helpers/LisaHelper');
const HandlerHelper = require('./Helpers/HandlerHelper');
const MiscHelper = require('./Helpers/MiscHelper');
const ModHelper = require('./Helpers/ModHelper');

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
     * Conversation strings (base64 text).
     * @type {Object}
     */
    this.cleverbotConversations = {};

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
     * Telephone manager associated to the client.
     * @type {PhoneManager}
     */
    this.phone = new PhoneManager(this);

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

    /**
     * Lisa scripting language helper associated to the client.
     * @type {LisaHelper}
     */
    this.lisa = new LisaHelper(this);

    /**
     * Handler helper associated to the client.
     * @type {HandlerHelper}
     */
    this.stuffHandler = new HandlerHelper(this);

    /**
     * Miscallenaeous helper associated to the client.
     * @type {MiscHelper}
     */
    this.misc = new MiscHelper(this);

    /**
     * Moderation helper associated to the client.
     * @type {ModHelper}
     */
    this.moderation = new ModHelper(this);
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
   * Update the bot game.
   */
  updateGame() {
    this.user.setActivity(`Type ${this.config.discord.defaultPrefixes[0]}help! On ${this.guilds.size} servers with ${this.users.size} users.`);
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
