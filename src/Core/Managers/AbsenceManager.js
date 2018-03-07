const Client = require('../Client');
const Manager = require('./Manager');

/**
 * Represents an absence manager.
 * @extends {Manager}
 */
class AbsenceManager extends Manager {
  /**
   * @param {Client} client Client that initiated the database manager
   */
  constructor(client) {
    super(client);
  }

  /**
   * Marks someone as absent.
   * @param {String} id ID of the user
   * @param {?String} reason Reason of the absence (optional)
   */
  async markAbsent(id, reason = null) {
    await this.client.database.insertDocument('afk', {
      id,
      reason,
      time: Date.now(),
    });
  }

  /**
   * Removes the absence of someone.
   * @param {String} id ID of the user
   */
  async removeAbsence(id) {
    await this.client.database.deleteDocument('afk', id);
  }

  /**
   * Get the object of an absence.
   * @param {String} id ID of the user
   * @returns {AFKObject}
   */
  async getAbsence(id) {
    return (await this.client.database.getDocument('afk', id));
  }
}

module.exports = AbsenceManager;

/**
 * @typedef AFKObject
 * @property {String} id ID of the user
 * @property {?String} reason Reason of the absence
 * @property {Number} time Time when marked absent
 */
