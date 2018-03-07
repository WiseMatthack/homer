const DataBase = require('./DataBase');

/**
 * Represents a tag data structure.
 * @extends {DataBase}
 */
class DataTag extends DataBase {
  /**
   * @param {Client} client Client that initiated the data structure
   * @param {String} id Tag name associated to the data structure
   */
  constructor(client, id) {
    super(client, 'tag', id);

    /**
     * Typedef of a guild document.
     * @type {TagDocument}
     */
    this.data = null;
  }

  /**
   * Tag document default structure.
   * @type {TagDocument}
   */
  get template() {
    return ({
      id: this.key,
      author: null,
      content: null,
      uses: 0,
      creation: Date.now(),
      edit: null,
    });
  }

  /**
   * Increment tag use count.
   */
  incrementUses() {
    this.data.uses += 1;
    this.saveData();
  }
}

module.exports = DataTag;

/**
 * @typedef TagDocument
 * @property {String} id Tag name associated to the data structure
 * @property {String} author Tag author ID
 * @property {String} content Tag content
 * @property {Number} uses Use count of the tag
 * @property {Number} creation Creation timestamp of the tag
 * @property {?Number} edit Last edit timestamp of the tag
 */
