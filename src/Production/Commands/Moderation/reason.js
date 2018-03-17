const Command = require('../../../Core/Structures/Command');
const { RichEmbed } = require('discord.js');
const mtz = require('moment-timezone');

class Reason extends Command {
  constructor(client) {
    super(client, {
      name: 'reason',
      userPermissions: ['KICK_MEMBERS'],
      category: 5,
    });
  }

  async run(ctx) {
    const caseID = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ');
    if (!caseID || isNaN(caseID)) return ctx.channel.send(ctx.__('reason.error.invalidCase', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    if (!reason || reason.length > 1024) return ctx.channel.send(ctx.__('reason.error.invalidReason', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    const caseIndex = (ctx.args[0] - 1);
    const foundCase = ctx.settings.data.moderation.cases[caseIndex];
    if (!foundCase) return ctx.channel.send(ctx.__('reason.error.notFound', {
      errorIcon: this.client.constants.statusEmotes.error,
      caseID,
    }));

    for (const log of foundCase.messages) {
      const channel = this.client.channels.get(log.channel);
      if (!channel) return;

      const msg = await channel.fetchMessage(log.message);
      if (!msg) return;

      const newContent = msg.content.replace(foundCase.reason, reason);
      await msg.edit(newContent);
    }

    foundCase.reason = reason;
    ctx.settings.data.moderation.cases[caseIndex] = foundCase;
    await ctx.settings.saveData();

    ctx.channel.send(ctx.__('reason.edited', {
      successIcon: this.client.constants.statusEmotes.success,
      caseID,
    }));
  }
}

module.exports = Reason;
