const Command = require('../../structures/Command');

class MaintenanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'maintenance',
      category: 'owner',
      private: true,
      dm: true,
    });
  }

  async execute(context) {
    if (context.args[0] === 'all') {
      await this.client.shard.broadcastEval('this.maintenance ? this.maintenance = false : this.maintenance = true');
      context.replySuccess('Maintenance mode changed on all shards.');
    } else {
      if (this.client.maintenance) {
        this.client.maintenance = false;
        this.client.shardStatus = 'online';
        context.replySuccess(`Maintenance mode disabled successfully on shard **${this.client.shard.id}**.`);
      } else {
        this.client.maintenance = true;
        this.client.shardStatus = 'maintenance';
        context.replySuccess(`Maintenance mode enabled successfully on shard **${this.client.shard.id}**.`);
      }
    }
  }
}

module.exports = MaintenanceCommand;
