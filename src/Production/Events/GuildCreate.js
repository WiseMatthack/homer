const Event = require('../../Core/Structures/Event');
const { appendFile } = require('fs');
const { Util } = require('discord.js');
const moment = require('moment-timezone');

class GuildCreate extends Event {
  constructor(client) {
    super(client, 'guildCreate');
  }

  async handle(guild) {
    if (!guild.available) return;

    appendFile(`${__dirname}/../../../logs/guilds.txt`, `[${Date.now()}] Join - ${guild.name} (ID:${guild.id}) - Owner: ${guild.ownerID}\r\n`, (err) => {
      if (err) console.error(err);
    });

    const channel = this.client.channels.get(this.client.config.logChannels.guild);
    if (!channel) return;

    const formattedTime = moment().format('HH:mm:ss');
    channel.send(`\`[${formattedTime}]\` 📥 Joined **${Util.escapeMarkdown(guild.name)}** (ID:${guild.id}) - Count: ${this.client.guilds.size}`);
  }
}

module.exports = GuildCreate;
