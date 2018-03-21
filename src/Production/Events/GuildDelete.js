const Event = require('../../Core/Structures/Event');
const { appendFile } = require('fs');

class GuildDelete extends Event {
  constructor(client) {
    super(client, 'guildDelete');
  }

  async handle(guild) {
    this.client.database.deleteDocument('guild', guild.id)
      .catch(() => {});

    appendFile(`${__dirname}/../../../logs/guilds.txt`, `[${Date.now()}] Leave - ${guild.name} (ID:${guild.id}) - Owner: ${guild.ownerID}\r\n`, (err) => {
      if (err) console.error(err);
    });

    this.client.updateGame();
    this.client.misc.updateCount(this.client.guilds.size);
  }
}

module.exports = GuildDelete;
