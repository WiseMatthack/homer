const mtz = require('moment-timezone');
const Event = require('../structures/Event');

class ReconnectingEvent extends Event {
  constructor(client) {
    super(client, 'reconnecting');
  }

  async handle() {
    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **RECONNECTING**.`);
  }
}

module.exports = ReconnectingEvent;
