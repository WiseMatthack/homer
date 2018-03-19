const Event = require('../../Core/Structures/Event');
const { appendFile } = require('fs');

class GuildCreate extends Event {
  constructor(client) {
    super(client, 'guildCreate');
  }

  async handle(guild) {
    appendFile(`${__dirname}/../../../logs/guilds.txt`, `[${Date.now()}] Join - ${guild.name} (ID:${guild.id}) - Owner: ${guild.ownerID}\r\n`, (err) => {
      if (err) console.error(err);
    });

    const guildChart = await this.client.database.getDocument('misc', 'guildChart');
    guildChart.list.push({
      count: this.client.guilds.size,
      time: Date.now(),
    });
    this.client.database.insertDocument('misc', guildChart, { conflict: 'update' });

    this.client.updateGame();
    this.client.misc.updateCount(this.client.guilds.size);
  }
}

module.exports = GuildCreate;
