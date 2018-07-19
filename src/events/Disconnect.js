const mtz = require('moment-timezone');
const Event = require('../structures/Event');

class DisconnectEvent extends Event {
  constructor(client) {
    super(client, 'disconnect');
  }

  async handle() {
    this.client.ready = false;

    // Sending message in logChannel
    await this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **OFFLINE**.`);
    this.client.shardStatus = 'offline';
    await this.client.other.updateShardStatus();    

    // Shutdown
    await this.client.destroy();
    process.exit();
  }
}

module.exports = DisconnectEvent;
