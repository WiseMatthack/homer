const Command = require('../../../Core/Structures/Command');

class Feedback extends Command {
  constructor(client) {
    super(client, {
      name: 'feedback',
      category: 1,
    });
  }

  async run(ctx) {
    const text = ctx.args.join(' ');
    if (!text || text.length > 512) return ctx.channel.send(ctx.__('feedback.invalidText', {
      errorIcon: this.client.constants.statusEmotes.error,
    }));

    await this.client.database.insertDocument('feedbacks', {
      authorID: ctx.author.id,
      authorTag: ctx.author.tag,
      message: text,
      date: Date.now(),
    });
    ctx.channel.send(ctx.__('feedback.sent', {
      successIcon: this.client.constants.statusEmotes.success,
    }));
  }
}

module.exports = Feedback;
