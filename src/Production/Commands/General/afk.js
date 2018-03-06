const Command = require('../../../Core/Structures/Command');

class Afk extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      aliases: ['absent', 'absence'],
      category: 2,
    });
  }

  async run(ctx) {
    const reason = ctx.args.join(' ') || null;
    
    this.client.absence.markAbsent(ctx.author.id, reason)
      .then(() => ctx.channel.send(ctx.__('afk.marked')));
  }
}

module.exports = Afk;
