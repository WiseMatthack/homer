const Command = require('../../../Core/Structures/Command');

class PhMessage extends Command {
  constructor(client) {
    super(client, {
      name: 'phmessage',
      userPermissions: ['MANAGE_GUILD'],
      category: 'telephone',
    });
  }

  async run(ctx) {
    const type = ctx.args[0];
    const text = ctx.args.slice(1).join(' ');
    if (!type || !text || text.length > 512) return ctx.channel.send(ctx.__('phmessage.invalidParameters', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (type === 'incoming') {
      if (text === 'reset') {
        ctx.settings.data.phone.callMessage = null;
        ctx.settings.saveData();
        ctx.channel.send(ctx.__('phmessage.incoming.reset', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      } else {
        ctx.settings.data.phone.callMessage = text;
        ctx.settings.saveData();
        ctx.channel.send(ctx.__('phmessage.incoming.set', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      }
    } else if (type === 'missed') {
      if (text === 'reset') {
        ctx.settings.data.phone.missedMessage = null;
        ctx.settings.saveData();
        ctx.channel.send(ctx.__('phmessage.missed.reset', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      } else {
        ctx.settings.data.phone.missedMessage = text;
        ctx.settings.saveData();
        ctx.channel.send(ctx.__('phmessage.missed.set', {
          successIcon: this.client.constants.statusEmotes.success,
        }));
      }
    } else {
      ctx.channel.send(ctx.__('phmessage.unknownType', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));
    }
  }
}

module.exports = PhMessage;
