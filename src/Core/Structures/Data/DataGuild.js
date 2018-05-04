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
     */
    this.data = null;
  }

  /**
   * Guild document default structure.
   */
  get template() {
    return ({
      id: this.key,
      welcome: {
        channel: null,
        message: null,
      },
      leave: {
        channel: null,
        message: null,
      },
      moderation: {
        cases: [],
        channel: null,
      },
      disabledCategories: [],
      ignoredChannels: [],
      autoRole: [],
      roleMe: [],
      phone: {
        number: null,
        channel: null,
        phonebook: true,
        blacklist: [],
        callMessage: null,
      },
      serverBrowser: {
        switch: false,
        channel: null,
        category: null,
      },
      misc: {
        timezone: 'UTC',
        locale: 'en-gb',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm:ss',
        customPrefixes: [],
        importedTags: [],
      },
    });
  }

  /**
   * Generate a telephone number.
   * @returns {String} Number
   */
  generateNumber() {
    const array = Math.floor(Math.random() * (10 ** 6)).toString().split('');
    array.splice(3, 0, '-');

    const number = array.join('');
    this.data.phone.number = number;
    this.saveData();
    return number;
  }
}

module.exports = DataGuild;
