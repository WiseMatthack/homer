const Event = require('../structures/Event');
const mtz = require('moment-timezone');

class DisconnectEvent extends Event {
  constructor(client) {
    super(client, 'disconnect');
  }

  async handle() {
    this.client.ready = false;

    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **OFFLINE**.`);
  }
}

module.exports = DisconnectEvent;
