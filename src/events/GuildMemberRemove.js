const Event = require('../structures/Event');

class GuildMemberRemoveEvent extends Event {
  constructor(client) {
    super(client, 'guildMemberRemove');
  }

  async handle(member) {
    this.client.database.getDocument('settings', member.guild.id).then((settings) => {
      if (!settings) return;

      const channel = member.guild.channels.get(settings.leave.channel);
      if (!channel) return;

      member.settings = settings;
      channel.send(this.client.lisa.parseString(member, settings.leave.message, 'memberlog'));
    });
  }
}

module.exports = GuildMemberRemoveEvent;