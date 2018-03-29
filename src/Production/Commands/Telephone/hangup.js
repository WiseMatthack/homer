const Command = require('../../../Core/Structures/Command');

class Hangup extends Command {
  constructor(client) {
    super(client, {
      name: 'hangup',
      category: 5,
    });
  }

  async run(ctx) {
    if (ctx.channel.id !== ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('pickup.error.noPhoneChannel', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (this.client.phone.isCallActive(ctx.guild.id) !== 'active') return ctx.channel.send(ctx.__('pickup.error.nobodyCalls', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    this.client.phone.interruptCall(ctx.guild.id);
  }
}

module.exports = Hangup;
