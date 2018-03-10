const Command = require('../../../Core/Structures/Command');
const DataProfile = require('../../../Core/Structures/Data/DataProfile');
const durationParser = require('parse-duration');
const mtz = require('moment-timezone');

class Remind extends Command {
  constructor(client) {
    super(client, {
      name: 'remind',
      aliases: ['reminder', 'remindme'],
      category: 3,
    });
  }

  async run(ctx) {
    const profile = new DataProfile(this.client, ctx.author.id);
    await profile.getData();

    if (ctx.args[0] === 'list') {
      if (profile.data.reminds.length === 0) return ctx.channel.send(ctx.__('remind.error.noRemind', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const reminds = profile.data.reminds.map((remind, index) => ctx.__('remind.list.remind', {
          content: remind.content,
          set: mtz(remind.set).locale(ctx.settings.data.misc.locale).fromNow(),
          expires: mtz(remind.end).locale(ctx.settings.data.misc.locale).toNow(),
          index: (index + 1),
        })).join('\n');

      ctx.channel.send(ctx.__('remind.list', {
        reminds,
      }));
    } else if (ctx.args[0] === 'remove') {
      if (profile.data.reminds.length === 0) return ctx.channel.send(ctx.__('remind.error.noRemind', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      if (ctx.args[1]) {
        const index = ctx.args[1] - 1;
        const remind = profile.data.reminds[index];
        if (!remind) return ctx.channel.sen(ctx.__('remind.error.noRemindFound', {
          errorIcon: this.client.constants.statusEmotes.error,
          index,
        }));

        profile.data.reminds.splice(index, 1);
        await profile.saveData();

        ctx.channel.send(ctx.__('remind.removed', {
          successIcon: this.client.constants.statusEmotes.success,
          remind: remind.index,
        }));
      }
    } else {
      const duration = ctx.args[0];
      const content = ctx.args.splice(1).join(' ');

      if (!duration || !content || content.length > 256) return ctx.channel.send(ctx.__('remind.error.invalidParameters', {
        errorIcon: this.client.constants.statusEmotes.error,
      }));

      const timeout = durationParser(duration) || 60000;

      const remind = {
        index: profile.data.reminds.length,
        content,
        guild: ctx.guild.id,
        channel: ctx.channel.id,
        expires: timeout,
        end: (Date.now() + timeout),
        set: Date.now(),
      };

      profile.data.reminds.push(remind);
      await profile.saveData();

      setTimeout(this.client.stuffHandler.handleRemind, remind.expires, this.client, ctx.author.id, remind.index);

      ctx.channel.send(ctx.__('remind.set', {
        index: remind.index,
        set: mtz(remind.end).locale(ctx.settings.data.misc.locale).toNow(),
      }));
    }
  }

  /**
   * Capitalize the first letter of a string and returns it.
   * @param {String} text String to process
   * @returns {String}
   */
  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

module.exports = Remind;
