const rethinkdb = require('rethinkdbdash');
const Manager = require('../structures/Manager');

class DatabaseManager extends Manager {
  constructor(client) {
    super(client);
    this.provider = rethinkdb(this.client.config.database);
  }

  findDocuments(table, predicate) {
    return this.provider
      .table(table)
      .filter(predicate)
      .run();
  }

  getDocument(table, key) {
    return this.provider
      .table(table)
      .get(key)
      .run();
  }

  getDocuments(table) {
    return this.provider
      .table(table)
      .run();
  }

  insertDocument(table, data, options) {
    return this.provider
      .table(table)
      .insert(data, options)
      .run();
  }

  updateDocument(table, key, data) {
    return this.provider
      .table(table)
      .get(key)
      .update(data)
      .run();
  }

  deleteDocument(table, key) {
    return this.provider
      .table(table)
      .get(key)
      .delete()
      .run();
  }
}

module.exports = DatabaseManager;
