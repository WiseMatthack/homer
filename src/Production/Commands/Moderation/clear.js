const Command = require('../../../Core/Structures/Command');

class Clear extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      botPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      category: 5,
    });
  }

  async run(ctx) {
    const type = ctx.args[0];
    const reason = ctx.args.slice(1).join(' ') || ctx.__('moderation.common.noReason');

    if (!type) return ctx.channel.send(ctx.__('clear.error.noType', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

  }
}

module.exports = Clear;
