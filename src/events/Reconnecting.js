const mtz = require('moment-timezone');
const Event = require('../structures/Event');

class ReconnectingEvent extends Event {
  constructor(client) {
    super(client, 'reconnecting');
  }

  async handle() {
    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **RECONNECTING**.`);
    this.client.updateMessage(this.client.config.statusChannel, this.client.config.status[`shard_${this.client.shard.id}`], `◻ Shard ${this.client.shard.id}: **${this.client.constants.status.idle} Reconnecting**`);
  }
}

module.exports = ReconnectingEvent;
