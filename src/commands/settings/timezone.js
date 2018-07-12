const { Util } = require('discord.js');
const mtz = require('moment-timezone');
const Command = require('../../structures/Command');

class TimezoneCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'timezone',
      category: 'settings',
      usage: '<timezone>',
      userPermissions: ['MANAGE_GUILD'],
      children: [new SearchSubcommand(client)],
      dm: true,
    });
  }

  async execute(context) {
    const timezone = context.args[0];
    if (!timezone) return context.replyError(context.__('timezone.noTimezone', { command: `${this.client.prefix}timezone search` }));
    const found = mtz.tz.names().find(tz => tz.toLowerCase() === timezone.toLowerCase());
    if (!found) {
      return context.replyWarning(context.__('timezone.invalidTimezone', { timezone }));
    }

    context.settings.misc.timezone = found;
    await context.saveSettings();
    context.replySuccess(context.__('timezone.setTimezone', { timezone: found }));
  }
}

class SearchSubcommand extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      category: 'settings',
      usage: '<search>',
      dm: true,
    });
  }

  async execute(context) {
    const search = context.args.join(' ');
    if (!search) return context.replyError(context.__('timezone.search.noSearch'));
    if (search.length < 4 || search.length > 64) return context.replyWarning(context.__('timezone.search.invalidSearch'));

    const found = mtz.tz.names().filter(tz => tz.toLowerCase().includes(search.toLowerCase()));
    if (found.length === 0) return context.replyWarning(context.__('timezone.search.noResult', { search }));

    const message = context.__('timezone.search.results', { search, found: found.map(tz => `\`${tz}\``).join(', ') });
    if (message.length > 1950) {
      const chunks = Util.splitMessage(message, { char: ', ' });
      for (const chunk of chunks) await context.reply(chunk);
    } else {
      context.reply(message);
    }
  }
}

module.exports = TimezoneCommand;
