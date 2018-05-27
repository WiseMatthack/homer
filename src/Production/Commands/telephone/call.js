const Command = require('../../../Core/Structures/Command');

class Call extends Command {
  constructor(client) {
    super(client, {
      name: 'call',
      category: 'telephone',
    });
  }

  async run(ctx) {
    const number = ctx.args[0];
    if (!number) return ctx.channel.send(ctx.__('call.error.noNumber', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (!ctx.settings.data.phone.number) return ctx.channel.send(ctx.__('call.error.noAttributedNumber', {
      errorIcon: this.client.constants.statusEmotes.error,
      defaultPrefix: this.client.config.discord.defaultPrefixes[0],
    }));

    if (ctx.channel.id !== ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('call.error.noPhoneChannel', {
      errorIcon: this.client.constants.statusEmotes.error,
      channel: ctx.settings.data.phone.channel ? `<#${ctx.settings.data.phone.channel}>` : ctx.__('global.none'),
    }));

    if (this.client.phone.isCallActive(ctx.guild.id) !== 'none') return ctx.channel.send(ctx.__('call.error.alreadyCalling', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.settings.data.phone.number === number) return ctx.channel.send(ctx.__('call.error.cannotCallThis', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const settingsToCall = ctx.args[0] === 'random' ?
      (await this.client.database.getDocuments('guild').then((servers) => {
        const filteredServers = servers.filter(s =>
          (s.phone.number && s.phone.phonebook && this.client.channels.has(s.phone.channel)) &&
          s.phone.number !== '1-SUPPORT' &&
          this.client.phone.isCallActive(s.id) === 'none' &&
          s.phone.number !== ctx.settings.data.phone.number);

        return filteredServers[Math.round(Math.random() * filteredServers.length)];
      })) : (await this.client.database.provider.table('guild').filter({ phone: { number } }).then(s => s[0] || null));

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
