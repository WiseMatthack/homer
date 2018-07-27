const Command = require('../../structures/Command');

class ShutdownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shutdown',
      category: 'owner',
      private: true,
      dm: true,
    });
  }

  async execute(context) {
    const message = await context.replyLoading(`Shutting down **${this.client.shard.count}** shards...`);
    await this.client.shard.send({ type: 'shutdown', message: `${context.message.channel.id}|${message.id}|false` });
  }
}

module.exports = ShutdownCommand;
