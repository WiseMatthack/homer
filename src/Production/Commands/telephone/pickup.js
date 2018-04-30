const Command = require('../../../Core/Structures/Command');

class Pickup extends Command {
  constructor(client) {
    super(client, {
      name: 'pickup',
      category: 'telephone',
    });
  }

  async run(ctx) {
    if (ctx.channel.id !== ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('pickup.error.noPhoneChannel', {
      errorIcon: this.client.constants.statusEmotes.error,
      channel: ctx.settings.data.phone.channel ? `<#${ctx.settings.data.phone.channel}>` : ctx.__('global.none'),
    }));

    if (this.client.phone.isCallActive(ctx.guild.id) !== 'pending') return ctx.channel.send(ctx.__('pickup.error.nobodyCalls', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    this.client.phone.pickupCall(ctx.guild.id);
  }
}

module.exports = Pickup;
