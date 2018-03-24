/**
 * Base of any data structure used by the bot.
 */
class DataBase {
  /**
   * @param {Client} client Client that initiated the data structure
   * @param {String} table Table where the document has to be stored
   * @param {String} key Key of the data document
   */
  constructor(client, table, key) {
    /**
     * Client that initiated the data structure.
     * @type {Client}
     */
    this.client = client;

    /**
     * Table where the document has to be stored.
     * @type {String}
     */
    this.table = table;

    /**
     * Key of the data document.
     * @type {String}
     */
    this.key = key;

    /**
     * Document associated to the data structure.
     * @type {?Object}
     */
    this.data = null;
  }

  /**
   * Default configuration scheme.
   */
  get template() {
    return ({
      id: this.key,
    });
  }

  /**
   * Get the document associated to the data structure.
   */
  async getData() {
    const data = await this.client.database.getDocument(this.table, this.key);
    this.data = data || this.template;
  }

  /**
   * Save the document associated to the data structure.
   */
  async saveData() {
    // We do not need to save if it is exactly the same scheme than default (saving some space)
    if (this.data === this.template) return;

    await this.client.database.insertDocument(this.table, this.data, {
      conflict: 'update',
    });
  }
}

module.exports = DataBase;
