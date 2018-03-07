const Helper = require('./Helper');
const Client = require('../Client');

/**
 * Represents a Lisa helper.
 * @extends {Helper}
 */
class LisaHelper extends Helper {
  /**
   * @param {Client} client Client that initiated the Lisa helper
   */
  constructor(client) {
    super(client);
  }

  /**
   * Replaces static content.
   * @param {String} string String to process
   * @param {*} context Context of the process
   * @param {Number} contextType Type of the context (0: Tag - 1: Welcome/Leave)
   * @returns {String} Proceeded string
   */
  replaceStatic(string, context, contextType) {
    let newString = string;

    if (contextType === 1) {
      newString = newString
        .replace(/{user.tag}/g, context.user.tag)
        .replace(/{user.id}/g, context.id)
        .replace(/{user.username}/g, context.user.username)
        .replace(/{user.discriminator}/g, context.user.discriminator)
        .replace(/{user.mention}/g, `<@${context.id}>`)
        .replace(/{guild.name}/g, context.guild.name)
        .replace(/{guild.id}/g, context.guild.id)
        .replace(/{guild.owner.id}/g, context.guild.ownerID)
        .replace(/{guild.owner.tag}/g, context.guild.owner.user.tag)
        .replace(/{guild.memberCount}/g, context.guild.memberCount);
    }

    return newString;
  }
}

module.exports = LisaHelper;
