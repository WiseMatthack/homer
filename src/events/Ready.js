const Event = require('../structures/Event');
const mtz = require('moment-timezone');

class ReadyEvent extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    this.client.ready = true;

    // Notifying sharder
    this.client.shard.send({
      type: 'log',
      message: `This shard is READY - ${this.client.guilds.size} servers - ${this.client.users.size} users`,
    });

    // Sending message in logChannel
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📡 Shard ID **${this.client.shard.id}** is now **READY**.`);

    // Update game
    this.client.update.updateGame();
    this.client.setInterval(() => {
      this.client.update.updateGame();
    }, 10000);
  }
}

module.exports = ReadyEvent;
