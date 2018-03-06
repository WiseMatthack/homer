const DataBase = require('./DataBase');

/**
 * Represents a guild data structure.
 * @extends {DataBase}
 */
class DataGuild extends DataBase {
  /**
   * @param {Client} client Client that initiated the data structure
   * @param {String} id Guild ID associated to the data structure
   */
  constructor(client, id) {
    super(client, 'guild', id);

    /**
     * Typedef of a guild document.
     * @type {GuildDocument}
     */
    this.data = null;
  }

  /**
   * Guild document default structure.
   * @type {GuildDocument}
   */
  get template() {
    return ({
      id: this.key,
      memberLogs: [],
      disabledCategories: [],
      ignoredChannels: [],
      autoRole: [],
      roleMe: [],
      phone: {
        number: null,
        channel: null,
        phonebook: false,
        blacklist: [],
      },
      misc: {
        timezone: 'UTC',
        locale: 'en-gb',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm:ss',
        customPrefixes: [],
        importedTags: [],
      }
    });
  }
}

module.exports = DataGuild;

/**
 * @typedef GuildDocument
 * @property {String} id Guild ID associated to the data structure
 * @property {GuildMemberLog[]} memberLogs Array of MemberLog instances
 * @property {String[]} disabledCategories Array of disabled command categories
 * @property {String[]} ignoredChannels Array of channels to ignore
 * @property {String[]} autoRole Array of roles ID given when a member joins
 * @property {String[]} roleMe Array of roles ID available for the roleme command
 * @property {Object} phone Telephone settings
 * @property {?String} phone.number Telephone number
 * @property {?String} phone.channel Telephone channel
 * @property {Boolean} phone.phonebook Phonebook status
 * @property {String[]} phone.blacklist Array of blacklisted telephone numbers
 * @property {Object} misc Miscallenous settings
 * @property {String} misc.timezone Timezone of the guild
 * @property {String} misc.locale Language of the guild
 * @property {String} misc.dateFormat Format for the dates (`moment-timezone`)
 * @property {String} misc.timeFormat Format for the times (`moment-timezone`)
 * @property {String[]} misc.customPrefixes Array of custom prefixes
 * @property {String[]} misc.importedTags Array of imported tags
 */

/**
 * @typedef GuildMemberLog
 * @property {String} channel Channel of the member log
 * @property {String} message Message of the member log
 * @property {String[]} flags Array of member log flags
 */
