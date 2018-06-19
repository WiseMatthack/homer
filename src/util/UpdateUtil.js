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
}

module.exports = UpdateUtil;
