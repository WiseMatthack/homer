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
    const format = ctx.args.slice(1).join(' ');
    console.log(format)
    if (ctx.args[0] === 'date') {
      if (!format) return ctx.channel.send(ctx.__('format.error.noFormat', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      ctx.settings.data.misc.dateFormat = format;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('format.date.set', {
        successIcon: this.client.constants.statusEmotes.success,
        demo: mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(format),
      }));
    } else if (ctx.args[0] === 'time') {
      if (!format) return ctx.channel.send(ctx.__('format.error.noFormat', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      ctx.settings.data.misc.timeFormat = format;
      await ctx.settings.saveData();

      ctx.channel.send(ctx.__('format.time.set', {
        successIcon: this.client.constants.statusEmotes.success,
        demo: mtz().locale(ctx.settings.data.misc.locale).tz(ctx.settings.data.misc.timezone).format(format),
      }));
    } else {
      ctx.channel.send(ctx.__('format.list', {
        date: ctx.settings.data.misc.dateFormat,
        time: ctx.settings.data.misc.timeFormat,
      }));
    }
  }
}

module.exports = DateFormat;
