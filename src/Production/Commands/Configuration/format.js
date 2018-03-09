const Command = require('../../../Core/Structures/Command');
const mtz = require('moment-timezone');

class DateFormat extends Command {
  constructor(client) {
    super(client, {
      name: 'format',
      userPermissions: ['MANAGE_GUILD'],
      category: 4,
    });
  }

  async run(ctx) {
    const format = ctx.args[1];
    if (!format) return ctx.channel.send(ctx.__('format.error.noFormat', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (ctx.args[0] === 'date') {
      ctx.settings.data.misc.dateFormat = format;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('format.date.set', {
        successIcon: this.client.constants.statusEmotes.success,
        demo: mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(newFormat),
      }));
    } else if (ctx.args[0] === 'time') {
      ctx.settings.data.misc.timeFormat = format;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('format.time.set', {
        successIcon: this.client.constants.statusEmotes.success,
        demo: mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(newFormat),
      }));
    }
  }
}

module.exports = DateFormat;
