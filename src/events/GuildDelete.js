const Event = require('../structures/Event');

class GuildDeleteEvent extends Event {
  constructor(client) {
    super(client, 'guildDelete');
  }

  async handle(guild) {
    // Deleting sub
    guild.channels.forEach(c => this.client.other.deleteSub(c.id));
  }
}

module.exports = GuildDeleteEvent;
