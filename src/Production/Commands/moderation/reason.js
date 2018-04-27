const Command = require('../../../Core/Structures/Command');

class Reason extends Command {
  constructor(client) {
    super(client, {
      name: 'reason',
      userPermissions: ['KICK_MEMBERS'],
      category: 'moderation',
    });
  }

  async run(ctx) {
    const caseID = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ');
    if (!caseID || Number.isNaN(parseInt(caseID, 10))) return ctx.channel.send(ctx.__('reason.error.invalidCase', {
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

    const channel = this.client.channels.get(foundCase.message.channel);
    if (channel) {
      const msg = await channel.fetchMessage(foundCase.message.message);
      if (msg) {
        const newContent = msg.content.replace(foundCase.reason, reason);
        await msg.edit(newContent);
      }
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
