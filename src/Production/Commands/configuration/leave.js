const Command = require('../../../Core/Structures/Command');

class Leave extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      userPermissions: ['MANAGE_GUILD'],
      category: 'configuration',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'clear') {
      ctx.settings.data.leave = {
        channel: null,
        message: null,
      };
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('leave.cleared', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    } else {
      const message = ctx.args.join(' ');
      if (!message || message.length > 256) return ctx.channel.send(ctx.__('leave.invalidMessage', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      ctx.settings.data.leave = {
        channel: ctx.channel.id,
        message,
      };
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('leave.set', {
        successIcon: this.client.constants.statusEmotes.success,
        channel: ctx.channel.id,
      }));
    }
  }
}

module.exports = Leave;
