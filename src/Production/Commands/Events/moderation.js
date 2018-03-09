const Command = require('../../../Core/Structures/Command');

class Moderation extends Command {
  constructor(client) {
    super(client, {
      name: 'moderation',
      aliases: ['ban', 'kick', 'warn', 'unwarn', 'unban', 'tempban', 'mod'],
      category: 10,
    });
  }

  async run(ctx) {
    ctx.channel.send(ctx.__('moderation.announcement', {
      warningIcon: this.client.constants.statusEmotes.warning,
      articleLink: 'https://homer.idroid.me/articles/58f56d3a-9246-4371-825a-d25274a93fd5',
    }));
  }
}

module.exports = Moderation;
