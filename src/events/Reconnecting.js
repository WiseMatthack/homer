const mtz = require('moment-timezone');
const Event = require('../structures/Event');

class ReconnectingEvent extends Event {
  constructor(client) {
    super(client, 'reconnecting');
  }

  async handle() {
    if (this.client.reconnectTimes >= 5) {
      return this.client.emit('disconnect');
    }

    this.client.reconnectTimes += 1;

    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **RECONNECTING**.`);
    this.client.shardStatus = 'reconnecting';
  }
}

module.exports = ReconnectingEvent;
