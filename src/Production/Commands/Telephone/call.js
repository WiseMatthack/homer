const Command = require('../../../Core/Structures/Command');

class Call extends Command {
  constructor(client) {
    super(client, {
      name: 'call',
      category: 5,
    });
  }

  async run(ctx) {
    const number = ctx.args[0];
    if (!number) return ctx.channel.send(ctx.__('call.error.noNumber', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.channel.id !== ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('call.error.noPhoneChannel', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (this.client.phone.isCallActive(ctx.guild.id) !== 'none') return ctx.channel.send(ctx.__('call.error.alreadyCalling', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.settings.data.phone.number === ctx.guild.id) return ctx.channel.send(ctx.__('call.error.cannotCallThis', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const settings = await this.client.database.getDocuments('guild');
    const settingsToCall = settings.find(s => s.phone.number === number);

    if (settingsToCall) {
      const guildToCall = this.client.guilds.get(settingsToCall.id);
      if (settingsToCall.phone.blacklist.includes(ctx.guild.id)) return ctx.channel.send(ctx.__('call.numberBlacklisted', {
        number,
      }));

      if (!this.client.channels.has(settingsToCall.phone.channel)) return ctx.channel.send(ctx.__('call.receiver.noChannel'));

      const areTheyInCall = this.client.phone.isCallActive(guildToCall.id) !== 'none';
      if (areTheyInCall) return ctx.channel.send(ctx.__('call.receiver.inCall'));

      this.client.phone.initiateCall(ctx.guild.id, guildToCall.id);
    } else {
      ctx.channel.send(ctx.__('call.unknownNumber', {
        number,
      }));
    }
  }
}

module.exports = Call;
