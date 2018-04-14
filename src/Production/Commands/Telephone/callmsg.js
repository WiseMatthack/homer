const Command = require('../../../Core/Structures/Command');

class CallMessage extends Command {
  constructor(client) {
    super(client, {
      name: 'callmsg',
      userPermissions: ['MANAGE_GUILD'],
      category: 5,
    });
  }

  async run(ctx) {
    const message = ctx.args.join(' ');
    if (!message || message.length > 256) return ctx.channel.send(ctx.__('callmsg.error.invalidMessage', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (message === 'reset') {
      ctx.settings.data.phone.callMessage = null;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('callmsg.messageReset', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    } else {
      ctx.settings.data.phone.callMessage = message;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('callmsg.messageSet', {
        successIcon: this.client.constants.statusEmotes.success,
      }));
    }
  }
}

module.exports = CallMessage;
