const Event = require('../structures/Event');

class GuildMemberAddEvent extends Event {
  constructor(client) {
    super(client, 'guildMemberAdd');
  }

  async handle(member) {
    this.client.database.getDocument('settings', member.guild.id).then((settings) => {
      if (!settings) return;

      const channel = member.guild.channels.get(settings.welcome.channel);
      if (!channel) return;

      member.settings = settings;
      channel.send(this.client.lisa.parseString(member, settings.welcome.message, 'memberlog'));
    });
  }
}

module.exports = GuildMemberAddEvent;
