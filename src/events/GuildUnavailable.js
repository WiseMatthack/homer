const Event = require('../structures/Event');
const mtz = require('moment-timezone');

class GuildUnavailableEvent extends Event {
  constructor(client) {
    super(client, 'guildUnavailable');
  }

  async handle(guild) {
    this.client.unavailable.push(guild.id);
    this.client.sendMessage(this.client.config.logChannel, `\`[${mtz().format('HH:mm:ss')}]\` 📤 **${guild.name}** (ID:${guild.id}) became unavailable!`);
  }
}

module.exports = GuildUnavailableEvent;
