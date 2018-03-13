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
   * Process a string (usually a tag).
   * @param {String} string String to process
   * @param {*} context Context of the process
   * @param {Number} contextType Type of the context (0: Tag - 1: Welcome/Leave)
   * @returns {String} Proceeded string
   */
  process(string, context, contextType) {
    let newString = this.replaceStatic(string, context, contextType);
    if (contextType === 0) newString = this.replaceDynamic(newString, context, contextType);
    return newString;
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

    if (contextType === 0) {
      newString = newString
        .replace(/{user.tag}/g, context.ctx.author.tag)
        .replace(/{user.id}/g, context.ctx.author.id)
        .replace(/{user.username}/g, context.ctx.author.username)
        .replace(/{user.discriminator}/g, context.ctx.author.discriminator)
        .replace(/{user.mention}/g, `<@${context.ctx.author.id}>`)
        .replace(/{channel.id}/g, context.ctx.channel.id)
        .replace(/{channel.name}/g, context.ctx.channel.name)
        .replace(/{channel.mention}/g, `<#${context.ctx.channel.id}>`)
        .replace(/{guild.name}/g, context.ctx.guild.name)
        .replace(/{guild.id}/g, context.ctx.guild.id)
        .replace(/{guild.owner.id}/g, context.ctx.guild.ownerID)
        .replace(/{guild.owner.tag}/g, context.ctx.guild.owner.user.tag)
        .replace(/{guild.memberCount}/g, context.ctx.guild.memberCount)
        .replace(/{args}/g, context.args);
    } else if (contextType === 1) {
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

  /**
   * Replaces dynamic content.
   * @param {String} string String to process
   * @param {*} context Context of the process
   * @param {Number} contextType Type of the context (0: Tag - 1: Welcome/Leave)
   * @returns {String} Proceeded string
   */
  replaceDynamic(string, context, contextType) {
    let newString = string;

    const processArray = /\[(.*)\]/g.exec(newString);

    if (processArray) {
      processArray.split(/ +/g).forEach((part) => {
        const possiblePattern = this.client.constants.dynamicTags.find(dyn => dyn.pattern.test(part));
        if (possiblePattern) {
          try {
            newString = newString.replace(part, possiblePattern.run(part));
          } catch (e) {
            newString = newString.replace(part, e);
          }
        }
      });
    }

    return newString;
  }
}

module.exports = LisaHelper;
