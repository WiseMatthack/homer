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

    const channel = this.client.channels.get(this.client.config.logChannels.guild);
    if (!channel) return;

    const formattedTime = moment().format('DD/MM/YYYY @ HH:mm:ss');
    channel.send(`\`[${formattedTime}]\` 📤 Left **${guild.name}** (ID:${guild.id}) - Count: ${this.client.guilds.size}`);
  }
}

module.exports = GuildDelete;
