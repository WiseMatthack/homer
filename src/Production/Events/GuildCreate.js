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

    this.client.updateGame();
  }
}

module.exports = GuildCreate;
