const Event = require('../structures/Event');
const mtz = require('moment-timezone');

class GuildCreateEvent extends Event {
  constructor(client) {
    super(client, 'guildCreate');
  }

  async handle(guild) {
    if (this.client.unavailable.includes(guild.id)) {
      this.client.unavailable.splice(this.client.unavailable.indexOf(guild.id), 1);
      this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📥 **${guild.name}** (ID:${guild.id}) is back!`);
    }
  }
}

module.exports = GuildCreateEvent;
