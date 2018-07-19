const mtz = require('moment-timezone');
const Event = require('../structures/Event');

class ResumeEvent extends Event {
  constructor(client) {
    super(client, 'resume');
  }

  async handle() {
    this.client.reconnectTimes = 0;

    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** has **RESUMED**.`);
    this.client.updateMessage(this.client.config.statusChannel, this.client.config.status[`shard_${this.client.shard.id}`], `◻ Shard ${this.client.shard.id}: **${this.client.constants.status.online} Online**`);
  }
}

module.exports = ResumeEvent;
