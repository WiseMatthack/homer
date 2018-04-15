const Command = require('../../../Core/Structures/Command');

class BotManagement extends Command {
  constructor(client) {
    super(client, {
      name: 'bot',
      category: 0,
      private: true,
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'commands') {
      if (ctx.args[1] === 'reload') {
        const msg = await ctx.channel.send('🚸 Reloading commands...');
        try {
          this.client.commands.gps.clear();
          await this.client.commands._map();

          msg.edit('🚸 Reloaded commands list!');
        } catch (e) {
          msg.edit(e, { code: 'js' });
        }
      } else if (ctx.args[1] === 'enable') {
        const commandName = ctx.args[2];
        if (!commandName) return ctx.channel.send(`${this.client.constants.statusEmotes.error} You must provide the name of a command to enable.`);

        if (!this.client.commands.getCommand(commandName)) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The command \`${commandName}\` was not found.`);
        if (!this.client.disabledCommands[commandName]) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The command \`${commandName}\` is not disabled.`);

        this.client.disabledCommands[commandName] = undefined;
        ctx.channel.send(`🚸 The command \`${commandName}\` has been enabled.`);
      } else if (ctx.args[1] === 'disable') {
        const commandName = ctx.args[2];
        const reason = ctx.args.slice(3).join(' ') || null;
        if (!commandName) return ctx.channel.send(`${this.client.constants.statusEmotes.error} You must provide the name of a command to disable.`);

        if (!this.client.commands.getCommand(commandName)) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The command \`${commandName}\` was not found.`);
        if (this.client.disabledCommands[commandName]) return ctx.channel.send(`${this.client.constants.statusEmotes.error} The command \`${commandName}\` is already disabled.`);

        this.client.disabledCommands[commandName] = {
          reason,
        };
        ctx.channel.send(`🚸 The command \`${commandName}\` has been disabled.`);
      } else {
        ctx.channel.send(`${this.client.constants.statusEmotes.error} Invalid option provided! Valid options are: \`enable\`, \`disable\` and \`reload\`.`);
      }
    } else if (ctx.args[0] === 'blacklist') {
      if (ctx.args[1] === 'add') {
        const userID = ctx.args[2];
        const reason = ctx.args.slice(3).join(' ') || null;

        const fetchedUser = await this.client.fetchUser(userID, false)
          .then(u => u.tag)
          .catch(() => null);
        if (!fetchedUser) return ctx.channel.send(`${this.client.constants.statusEmotes.error} No user found matching ID \`${userID}\`.`);

        
      }
    }
  }
}

module.exports = BotManagement;
