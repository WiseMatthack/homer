const Command = require('../../../Core/Structures/Command');
const mtz = require('moment-timezone');

class SetTimezone extends Command {
  constructor(client) {
    super(client, {
      name: 'settimezone',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    const timezone = ctx.args.join(' ');
    if (!timezone) return ctx.channel.send(ctx.__('settimezone.error.noTimezone', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (!mtz.tz.names().includes(timezone)) return ctx.channel.send(ctx.__('settimezone.error.invalidTimezone', {
      errorIcon: this.client.constants.statusEmotes.error,
      timezone,
    }));

    ctx.settings.data.misc.timzone = timzone;
    await ctx.settings.saveData();

    const newFormat = mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(`${ctx.settings.data.misc.dateFormat} ${ctx.settings.data.misc.timeFormat}`);
    ctx.channel.send(ctx.__('settimezone.set', {
      successIcon: this.client.constants.statusEmotes.success,
      demo: newFormat,
    }));
  }
}

module.exports = SetTimezone;
