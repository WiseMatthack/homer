const Command = require('../../../Core/Structures/Command');

class Hangup extends Command {
  constructor(client) {
    super(client, {
      name: 'hangup',
      category: 'telephone',
    });
  }

  async run(ctx) {
    if (ctx.channel.id !== ctx.settings.data.phone.channel) return ctx.channel.send(ctx.__('pickup.error.noPhoneChannel', {
      errorIcon: this.client.constants.statusEmotes.error,
      channel: ctx.settings.data.phone.channel ? `<#${ctx.settings.data.phone.channel}>` : ctx.__('global.none'),
    }));

    const state = this.client.phone.isCallActive(ctx.guild.id);
    if (this.client.phone.isCallActive(ctx.guild.id) === 'none') return ctx.channel.send(ctx.__('pickup.error.nobodyCalls', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (state === 'active') this.client.phone.interruptCall(ctx.guild.id);
    else {
      const call = this.client.phone.calls.find(c => c.sender === ctx.guild.id || c.receiver === ctx.guild.id);
      const thisState = call.sender === ctx.guild.id ? 'sender' : 'receiver';

      const victimSettings = await this.client.database.getDocument('guild', call[thisState === 'sender' ? 'receiver' : 'sender'])
        .then(s => ({
          locale: s.misc.locale,
          telephone: s.phone.channel,
          number: s.phone.number,
        }));

      ctx.channel.fetchMessage(call[`${thisState}Message`])
        .then(m => m.edit(ctx.__('phone.hangup.pending.asked')))
        .catch(() => {});

      ctx.setLocale(victimSettings.locale);
      this.client
        .guilds.get(call[thisState === 'sender' ? 'receiver' : 'sender'])
        .channels.get(victimSettings.telephone)
        .fetchMessage(call[`${thisState === 'sender' ? 'receiver' : 'sender'}Message`])
          .then(m => m.edit(ctx.__('phone.hangup.pending.victim', {
            number: ctx.settings.data.phone.number,
          })))
          .catch(() => {});

      this.client.phone.calls.splice(this.client.phone.calls.indexOf(call), 1);
    }
  }
}

module.exports = Hangup;
