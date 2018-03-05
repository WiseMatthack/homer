const Client = require('../Client');
const Manager = require('./Manager');
const rdb = require('rethinkdbdash');

/**
 * Represents a database manager (manage queries between client and database).
 * @extends {Manager}
 */
class DatabaseManager extends Manager {
  /**
   * @param {Client} client Client that initiated the database manager
   * @param {Object} databaseAuth Authentication data for the RethinkDB database
   * @param {String} databaseAuth.db Name of the database used by the bot instance
   * @param {String} databaseAuth.host Hostname of the database to use
   * @param {Number} databaseAuth.port Port of the database to use
   */
  constructor(client, databaseAuth) {
    super(client);

    /**
     * Database provider (RethinkDB here).
     */
    this.provider = rdb(databaseAuth);
  }

  /**
   * Get a document from the database.
   * @param {String} table Table where the document to get is stored
   * @param {String} key Key of the document to get
   * @returns {Promise<*>} Document or `null` if not found
   */
  async getDocument(table, key) {
    const data = await this.provider
      .table(table)
      .get(key)
      .run();

    return data || null;
  }

  /**
   * Insert a document into the database.
   * @param {String} table Table to insert the database in
   * @param {Object} data Data to insert into the document
   * @param {Object} insertOptions Options for the `insert` method (see RethinkDB documentation)
   */
  async insertDocument(table, data, insertOptions = {}) {
    await this.provider
      .table(table)
      .insert(data, insertOptions)
      .run();
  }

  /**
   * Update a document in the database.
   * @param {String} table Table where the document to update is stored
   * @param {String} key Key of the document to update
   * @param {Object} data Data to update in the document
   */
  async updateDocument(table, key, data) {
    await this.provider
      .table(table)
      .get(key)
      .update(data)
      .run();
  }

  /**
   * Delete a document from the database.
   * @param {String} table Table where the document to delete is stored
   * @param {String} key Key of the document to delete
   */
  async deleteDocument(table, key) {
    await this.provider
      .table(table)
      .get(key)
      .delete()
      .run();
  }
}

module.exports = DatabaseManager;
