const Command = require('../../../Core/Structures/Command');

class Disable extends Command {
  constructor(client) {
    super(client, {
      name: 'disable',
      category: 0,
      private: true,
    });
  }

  async run(ctx) {
    const cmdName = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ');

    if (!cmdName) return ctx.channel.send(`${this.client.constants.statusEmotes.error} You must provide the **command name** to disable or re-enable (with an optional **reason**).`);
    if (reason && reason.length > 256) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The reason length must not exceed 256 characters.`);

    if (!this.client.commands.getCommand(cmdName)) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The command \`${cmdName}\` does not exist.`);
    
    if (this.client.disabledCommands[cmdName]) {
      delete this.client.disabledCommands[cmdName];
      ctx.channel.send(`${this.client.constants.statusEmotes.success} Command \`${cmdName}\` re-enabled!`);
    } else {
      this.client.disabledCommands[cmdName] = {
        reason: reason || null,
      };
      ctx.channel.send(`${this.client.constants.statusEmotes.success} Command \`${cmdName}\` disabled!`);
    }
  }
}

module.exports = Disable;
