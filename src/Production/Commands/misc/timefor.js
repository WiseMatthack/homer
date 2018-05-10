const Command = require('../../../Core/Structures/Command');
const DataProfile = require('../../../Core/Structures/Data/DataProfile');
const mtz = require('moment-timezone');

class TimeFor extends Command {
  constructor(client) {
    super(client, {
      name: 'timefor',
      aliases: ['tf'],
      category: 'misc',
    });
  }

  async run(ctx) {
    if (ctx.args[0] === 'set') {
      const profile = new DataProfile(this.client, ctx.author.id);
      await profile.getData();

      const newTimezone = ctx.args[1];
      if (!newTimezone) return ctx.channel.send(ctx.__('timefor.set.noTimezone', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (!mtz.tz.names().includes(ctx.args[1])) return ctx.channel.send(ctx.__('timefor.set.invalidTimezone', {
        errorIcon: this.client.constants.statusEmotes.error,
        timezone: newTimezone,
      }));

      profile.data.timezone = newTimezone;
      await profile.saveData();

      ctx.channel.send(ctx.__('timefor.set.done', {
        successIcon: this.client.constants.statusEmotes.success,
        timezone: newTimezone,
      }));
    } else {
      await ctx.guild.fetchMembers();

      let { member } = ctx;
      const search = ctx.args.join(' ');
      if (ctx.mentions.members.size > 0) member = ctx.mentions.members.first();
      else if (search) {
        const members = this.client.finder.findMembers(search, ctx.guild.id);
        if (members.size === 0) return ctx.channel.send(ctx.__('finder.members.noResult', { errorIcon: this.client.constants.statusEmotes.error, search }));
        else if (members.size > 1) return ctx.channel.send(this.client.finder.formatMembers(
          members,
          ctx.settings.data.misc.locale,
        ));
        member = members.first();
      }

      const profile = new DataProfile(this.client, member.id);
      await profile.getData();

      if (!profile.data.timezone) return ctx.channel.send(ctx.__('timefor.noProfile', {
        errorIcon: this.client.constants.statusEmotes.error,
        name: member.user.tag,
      }));

      const timeFor = mtz().tz(profile.data.timezone);
      ctx.channel.send(ctx.__('timefor.for', {
        name: member.user.tag,
        hour24: timeFor.format('HH:mm'),
        hour12: timeFor.format('hh:mm A'),
      }));
    }
  }
}

module.exports = TimeFor;
