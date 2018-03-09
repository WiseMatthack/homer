const Command = require('../../../Core/Structures/Command');
const mtz = require('moment-timezone');

class TimeFormat extends Command {
  constructor(client) {
    super(client, {
      name: 'settime',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    const format = ctx.args.join(' ');
    if (!format) return ctx.channel.send(ctx.__('settime.error.noFormat', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    ctx.settings.data.misc.timeFormat = format;
    await ctx.settings.saveData();

    const newFormat = mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(newFormat);
    ctx.channel.send(ctx.__('settime.set', {
      successIcon: this.client.constants.statusEmotes.success,
      demo: newFormat,
    }));
  }
}

module.exports = TimeFormat;
