const Event = require('../../Core/Structures/Event');

class GuildUnavailable extends Event {
  constructor(client) {
    super(client, 'guildUnavailable');
  }

  async handle(guild) {
    console.error(`[Error] Guild ${guild.name} (ID:${guild.id}) became unavailable!`);
  }
}

module.exports = GuildUnavailable;
