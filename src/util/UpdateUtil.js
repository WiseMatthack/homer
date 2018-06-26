const snekfetch = require('snekfetch');

class UpdateUtil {
  constructor(client) {
    this.client = client;
  }

  async updateGame() {
    const customGame = await this.client.database.getDocument('bot', 'settings')
      .then(settings => settings.customGame);

    return this.client.user.setActivity(customGame ?
      customGame
        .replace(/{prefix}/g, this.client.prefix)
        .replace(/{servers}/g, this.client.guilds.size)
        .replace(/{users}/g, this.client.users.size)
        .replace(/{shard}/g, this.client.shard.id)
        .replace(/{shards}/g, this.client.config.sharder.totalShards) :
      `Type ${this.client.prefix}help! - !BETA VERSION!`,
    );
  }

  updateBotList() {
    snekfetch
      .post(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`)
      .set('Authorization', this.client.config.api.discordBotsPw)
      .set('Content-Type', 'application/json')
      .send({
        shard_id: this.client.shard.id,
        shard_count: this.client.shard.count,
        server_count: this.client.guilds.size,
      })
      .catch(r => console.error(r.body));

    snekfetch
      .post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`)
      .set('Authorization', this.client.config.api.discordBotsOrg)
      .set('Content-Type', 'application/json')
      .send({
        shard_id: this.client.shard.id,
        shard_count: this.client.shard.count,
        server_count: this.client.guilds.size,
      })
      .catch(r => console.error(r.body));
  }
}

module.exports = UpdateUtil;
