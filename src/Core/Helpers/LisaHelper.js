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
    const newString = this.replaceStatic(string, context, contextType);

    return this.replaceDynamic(newString, context, contextType);
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
        .replace(/{atuser}/g, context.ctx.author.toString())
        .replace(/{user}/g, context.ctx.author.username)
        .replace(/{userid}/g, context.ctx.author.id)
        .replace(/{nick}/g, context.ctx.member.nickname || context.ctx.author.username)
        .replace(/{discrim}/g, context.ctx.author.discriminator)
        .replace(/{server}/g, context.ctx.guild.name)
        .replace(/{serverid}/g, context.ctx.guild.id)
        .replace(/{servercount}/g, context.ctx.guild.memberCount)
        .replace(/{channel}/g, context.ctx.channel.name)
        .replace(/{channelid}/g, context.ctx.channel.id)
        .replace(/{args}/g, context.args.join(' '))
        .replace(/{argslen}/g, context.args.length);
    } else if (contextType === 1) {
      newString = newString
      .replace(/{atuser}/g, context.user.toString())
      .replace(/{user}/g, context.user.username)
      .replace(/{userid}/g, context.user.id)
      .replace(/{nick}/g, context.member.nickname || context.user.username)
      .replace(/{discrim}/g, context.user.discriminator)
      .replace(/{server}/g, context.guild.name)
      .replace(/{serverid}/g, context.guild.id)
      .replace(/{servercount}/g, context.guild.memberCount);
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
    const foundFunctions = string.match(this.client.constants.functionPattern);
    if (!foundFunctions) return string;

    let newString = string;

    console.log(`Length: ${foundFunctions.length}`)
    for (const fn of foundFunctions) {
      const parsedInput = this.client.constants.functionPattern.exec(fn);
      if (!parsedInput || !parsedInput[1] || !parsedInput[2]) return;

      console.log(`Debug 1:\nFN: ${fn}`);
      try {
        const customFunction = new (require(`../../Production/Tags/${parsedInput[1]}`))(this.client, context, contextType);
        if (!customFunction) return;

        console.log('Debug2: Function found, process...')
        const result = customFunction.run(parsedInput[2].split('|'));
        console.log('Debug3: Process done: ' + result);
        newString = newString.replace(fn, result);
      } catch (e) {
        newString = newString.replace(fn, e);
      }
    }

    return newString;
  }
}

module.exports = LisaHelper;
