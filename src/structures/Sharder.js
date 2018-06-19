const { ShardingManager } = require('discord.js');
const snekfetch = require('snekfetch');

class Sharder extends ShardingManager {
  constructor(file, config) {
    super(file, config.sharder);
    this.config = config;

    // Spawn cleverbot
    this.createBot();
  }

  createBot() {
    snekfetch
      .post('https://cleverbot.io/1.0/create')
      .set({ 'Content-Type': 'application/json' })
      .send({
        user: this.config.api.cleverbotUser,
        key: this.config.api.cleverbotKey,
        nick: this.config.discord.id,
      })
      .then(() => console.log('[Cleverbot] Created instance successfully!'))
      .catch(res => console.error(`[Cleverbot] Failed to create instance! Status: ${res.body.status}`));
  }
}

module.exports = Sharder;
