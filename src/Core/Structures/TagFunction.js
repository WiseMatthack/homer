/**
 * Represents a custom function that can be used in tags.
 */
class TagFunction {
  /**
   * Builds a tag function.
   * @param {Client} client Client that initiated the tag function
   * @param {*} context Context associated to the function
   * @param {Number} contextType Type of the context (0: Tag - 1: Member feed)
   */
  constructor(client, context, contextType) {
    /**
     * Client that initiated the tag function
     * @type {Client}
     */
    this.client = client;

    /**
     * Context associated to the function
     * @type {*}
     */
    this.context = context;

    /**
     * Type of the context (0: Tag - 1: Member feed)
     * @type {Number}
     */
    this.contextType = contextType;
  }

  /**
   * Runs a tag function and returns the result.
   * @param {String[]} args Arguments to use with the function
   * @returns {String}
   */
  run() {
    throw new Error('An unknown error has occured while processing this function, please contact a bot owner.');
  }
}

module.exports = TagFunction;
