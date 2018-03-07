const DataBase = require('./DataBase');

/**
 * Represents a guild data structure.
 * @extends {DataBase}
 */
class DataProfile extends DataBase {
  /**
   * @param {Client} client Client that initiated the data structure
   * @param {String} id User ID associated to the data structure
   */
  constructor(client, id) {
    super(client, 'guild', id);

    /**
     * Typedef of a guild document.
     * @type {ProfileDocument}
     */
    this.data = null;
  }

  /**
   * Guild document default structure.
   * @type {ProfileDocument}
   */
  get template() {
    return ({
      id: this.key,
      fields: [],
      timezone: 'UTC',
    });
  }
}

module.exports = DataProfile;

/**
 * @typedef ProfileDocument
 * @property {String} id Guild ID associated to the data structure
 * @property {ProfileField[]} fields Array of profile fields
 * @property {String} timezone Timezone of the profile
 */

/**
 * @typedef ProfileField
 * @property {String} name Name of the field
 * @property {String} emote Emoji ID of the field
 * @property {String} content Content of the field
 */
