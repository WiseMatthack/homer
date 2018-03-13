const Command = require('../../../Core/Structures/Command');

class Moderation extends Command {
  constructor(client) {
    super(client, {
      name: 'moderation',
      aliases: ['ban', 'kick', 'warn', 'unwarn', 'unban', 'tempban', 'mod', 'clear', 'hackban'],
      category: 10,
    });
  }

  async run(ctx) {
    ctx.channel.send(ctx.__('moderation.announcement', {
      warningIcon: this.client.constants.statusEmotes.warning,
      articleLink: 'https://homer.idroid.me/articles/411095da-afab-4d1c-a078-29bd0602a8c7',
    }));
  }
}

module.exports = Moderation;
