const Command = require('../../../Core/Structures/Command');
const mtz = require('moment-timezone');

class DateFormat extends Command {
  constructor(client) {
    super(client, {
      name: 'setdate',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    const format = ctx.args.join(' ');
    if (!format) return ctx.channel.send(ctx.__('setdate.error.noFormat', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    ctx.settings.data.misc.dateFormat = format;
    await ctx.settings.saveData();

    const newFormat = mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(newFormat);
    ctx.channel.send(ctx.__('setdate.set', {
      successIcon: this.client.constants.statusEmotes.success,
      demo: newFormat,
    }));
  }
}

module.exports = DateFormat;
